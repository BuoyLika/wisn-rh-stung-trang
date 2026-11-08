import React, { useMemo } from 'react';
import { ResearchSurvey, SurveyResponse, Language } from '../types';
import { useTranslation } from '../i18n/translations';
import { 
  Users, 
  Clock, 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckCircle,
  FileSpreadsheet,
  Stethoscope,
  Users2,
  FileCheck,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  calculateHospitalBreakdown, 
  calculateCadreBreakdowns 
} from '../utils/wisnCalculations';

interface AnalyticsDashboardProps {
  survey: ResearchSurvey;
  responses: SurveyResponse[];
  language: Language;
  onLoadMockData: () => void;
  onClearResponses: () => void;
  onOpenExport: () => void;
}

const CHART_COLORS = ['#0d9488', '#0284c7', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  survey,
  responses,
  language,
  onLoadMockData,
  onClearResponses,
  onOpenExport,
}) => {
  const t = useTranslation(language);

  // Overall Metrics Calculation
  const metrics = useMemo(() => {
    const totalN = responses.length;
    if (totalN === 0) {
      return { totalN: 0, avgDurationMin: 0, completionRate: 0 };
    }

    const totalSeconds = responses.reduce((acc, r) => acc + (r.completionTimeSeconds || 0), 0);
    const avgDurationMin = (totalSeconds / totalN / 60).toFixed(1);

    return {
      totalN,
      avgDurationMin,
      completionRate: 100, // Validated submitted responses
    };
  }, [responses]);

  // Statistical calculations for Likert Scale questions (Mean, SD, Distribution)
  // WISN 3-Tier Activity Breakdown
  const hospitalBreakdown = useMemo(() => {
    return calculateHospitalBreakdown(responses, survey);
  }, [responses, survey]);

  const cadreBreakdowns = useMemo(() => {
    return calculateCadreBreakdowns(responses, survey);
  }, [responses, survey]);

  const tierPieData = useMemo(() => [
    { name: '១. ការងារស្នូល (Core)', value: hospitalBreakdown.corePercent, mins: hospitalBreakdown.coreMins, color: '#0d9488' },
    { name: '២. ការងារគាំទ្រ (CAS)', value: hospitalBreakdown.casPercent, mins: hospitalBreakdown.casMins, color: '#0284c7' },
    { name: '៣. ការងាររដ្ឋបាល (IAS)', value: hospitalBreakdown.iasPercent, mins: hospitalBreakdown.iasMins, color: '#9333ea' }
  ], [hospitalBreakdown]);

  const cadreStackedData = useMemo(() => {
    return cadreBreakdowns.map((c) => ({
      name: c.cadre.length > 20 ? c.cadre.substring(0, 18) + '...' : c.cadre,
      fullCadre: c.cadre,
      'Core (%)': c.corePercent,
      'CAS (%)': c.casPercent,
      'IAS (%)': c.iasPercent,
      respondents: c.respondentCount
    }));
  }, [cadreBreakdowns]);

  const getLikertStats = (questionId: string) => {
    const scores: number[] = [];
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    responses.forEach((r) => {
      const val = Number(r.answers[questionId]);
      if (val >= 1 && val <= 5) {
        scores.push(val);
        distribution[val] = (distribution[val] || 0) + 1;
      }
    });

    if (scores.length === 0) {
      return { mean: 0, stdDev: 0, chartData: [], totalCount: 0 };
    }

    const sum = scores.reduce((a, b) => a + b, 0);
    const mean = Number((sum / scores.length).toFixed(2));

    const variance =
      scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / (scores.length || 1);
    const stdDev = Number(Math.sqrt(variance).toFixed(2));

    const chartData = [1, 2, 3, 4, 5].map((score) => ({
      score: `Scale ${score}`,
      count: distribution[score] || 0,
      percentage: Number((((distribution[score] || 0) / scores.length) * 100).toFixed(1)),
    }));

    return { mean, stdDev, chartData, totalCount: scores.length };
  };

  // Frequency and Percentage calculations for Categorical questions
  const getCategoricalStats = (questionId: string, options?: { value: string; labelKm: string; labelEn: string }[]) => {
    const counts: Record<string, number> = {};
    let total = 0;

    responses.forEach((r) => {
      const val = r.answers[questionId];
      if (Array.isArray(val)) {
        val.forEach((item) => {
          counts[item] = (counts[item] || 0) + 1;
          total += 1;
        });
      } else if (val) {
        counts[val] = (counts[val] || 0) + 1;
        total += 1;
      }
    });

    const chartData = (options || []).map((opt) => {
      const count = counts[opt.value] || 0;
      const label = language === 'km' ? opt.labelKm : opt.labelEn;
      const percentage = total > 0 ? Number(((count / responses.length) * 100).toFixed(1)) : 0;
      return {
        name: label,
        value: count,
        percentage,
      };
    }).filter(d => d.value > 0);

    return { total, chartData };
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.analyticsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'km' ? survey.titleKm : survey.titleEn}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {responses.length === 0 ? (
            <button
              onClick={onLoadMockData}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition border border-teal-200"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              {t.loadMockData}
            </button>
          ) : (
            <>
              <button
                onClick={onLoadMockData}
                className="inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                title="Add more sample data"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                <span>+25 Mock Data</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(t.confirmClearResponses)) {
                    onClearResponses();
                  }
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title={t.clearResponses}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={onOpenExport}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-teal-600/30"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>{t.exportBtn}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">{t.totalResponses}</div>
            <div className="text-2xl font-black text-slate-900">{metrics.totalN}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">{t.completionRate}</div>
            <div className="text-2xl font-black text-emerald-600">{metrics.completionRate}%</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">{t.avgTime}</div>
            <div className="text-2xl font-black text-slate-900">{metrics.avgDurationMin} min</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Items / Variables</div>
            <div className="text-2xl font-black text-purple-700">{survey.questions.length}</div>
          </div>
        </div>
      </div>

      {/* Main Charts & Item Breakdown */}
      {responses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-2">{t.noResponsesYet}</h3>
          <button
            onClick={onLoadMockData}
            className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700 transition"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.loadMockData}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ============================================================== */}
          {/* 🌟 HIGHLIGHT SECTION: WISN 3-TIER ACTIVITY PROPORTION BREAKDOWN */}
          {/* ============================================================== */}
          <div className="bg-gradient-to-br from-white via-teal-50/20 to-sky-50/20 rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black mb-2">
                  <Layers className="w-3.5 h-3.5 text-teal-700" />
                  <span>WHO WISN Core Deliverable</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  ការវិភាគសមាមាត្របន្ទុកការងារទាំង ៣ ប្រភេទ (WISN 3-Tier Activity Breakdown %)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  ភាគរយនៃពេលវេលាដែលបុគ្គលិកចំណាយលើសកម្មភាពស្នូល (Core) សកម្មភាពគាំទ្រ (CAS) និងសកម្មភាពរដ្ឋបាល (IAS)
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>គំរូទិន្នន័យ៖ {metrics.totalN} នាក់</span>
              </div>
            </div>

            {/* 2-Column Chart Grid: Hospital Donut Chart & Cadre Stacked Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Overall Hospital Donut (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      <span>មន្ទីរពេទ្យទាំងមូល (Overall Hospital Distribution)</span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    មធ្យមភាគពេលវេលានៃបុគ្គលិកគ្រប់ផ្នែកក្នុងមន្ទីរពេទ្យ
                  </p>
                </div>

                <div className="h-56 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tierPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tierPieData.map((entry, index) => (
                          <Cell key={`tier-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(val: any, _name: any, item: any) => [
                          `${val}% (សរុប ${item.payload.mins} នាទី)`,
                          item.payload.name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Stat */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">{hospitalBreakdown.corePercent}%</span>
                    <span className="text-[10px] font-bold text-teal-700 uppercase">Core Work</span>
                  </div>
                </div>

                {/* Legend & Stat Boxes */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-teal-50/70 p-2.5 rounded-xl border border-teal-200/80 text-center">
                    <div className="text-[10px] font-bold text-teal-800 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
                      <span>ការងារស្នូល</span>
                    </div>
                    <div className="text-lg font-black text-teal-950 mt-0.5">{hospitalBreakdown.corePercent}%</div>
                    <div className="text-[9px] text-teal-700 font-semibold">{hospitalBreakdown.coreMins} នាទី</div>
                  </div>

                  <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-200/80 text-center">
                    <div className="text-[10px] font-bold text-sky-800 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-600 inline-block"></span>
                      <span>ការងារគាំទ្រ</span>
                    </div>
                    <div className="text-lg font-black text-sky-950 mt-0.5">{hospitalBreakdown.casPercent}%</div>
                    <div className="text-[9px] text-sky-700 font-semibold">{hospitalBreakdown.casMins} នាទី</div>
                  </div>

                  <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-200/80 text-center">
                    <div className="text-[10px] font-bold text-purple-800 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                      <span>ការងាររដ្ឋបាល</span>
                    </div>
                    <div className="text-lg font-black text-purple-950 mt-0.5">{hospitalBreakdown.iasPercent}%</div>
                    <div className="text-[9px] text-purple-700 font-semibold">{hospitalBreakdown.iasMins} នាទី</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Stacked Bar Comparison by Cadre (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Users2 className="w-4 h-4 text-sky-600" />
                      <span>ការប្រៀបធៀបភាគរយតាមមុខរបរបុគ្គលិក (Activity Proportion by Cadre)</span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ភាគរយបែងចែកតាមមុខតំណែង (Core vs CAS vs IAS)
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cadreStackedData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                      <Tooltip 
                        formatter={(val: any, name: any) => [`${val}%`, name]}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            return `${payload[0].payload.fullCadre} (N=${payload[0].payload.respondents})`;
                          }
                          return label;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="Core (%)" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="CAS (%)" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="IAS (%)" stackId="a" fill="#9333ea" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>ក្បួន WISN៖</strong> សេវាស្នូល (Core) គប្បីមានសមាមាត្រចាប់ពី <strong>60% - 80%</strong>។ ប្រសិនបើសកម្មភាពរដ្ឋបាល (IAS) លើសពី <strong>25%</strong> បញ្ជាក់ថាបុគ្គលិកនោះកំពុងរ៉ាប់រងកិច្ចការក្រៅជំនាញច្រើនពេក។
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Table Breakdown by Cadre */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>តារាងសង្ខេបសមាមាត្រការងារតាមមុខរបរជាក់ស្តែង (Cadre Activity Metrics Table)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">
                  ឯកតាគិតជា ភាគរយ (%) & រយៈពេលមធ្យម (នាទី)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 font-bold">
                      <th className="py-2.5 px-4">មុខតំណែង (Cadre)</th>
                      <th className="py-2.5 px-3 text-center">ចំនួន (N)</th>
                      <th className="py-2.5 px-3 text-teal-800 text-center">១. ការងារស្នូល (%)</th>
                      <th className="py-2.5 px-3 text-sky-800 text-center">២. ការងារគាំទ្រ (%)</th>
                      <th className="py-2.5 px-3 text-purple-800 text-center">៣. ការងាររដ្ឋបាល (%)</th>
                      <th className="py-2.5 px-4">របារសមាមាត្រការងារ (Proportion Bar)</th>
                      <th className="py-2.5 px-3 text-center">ការបកស្រាយ WISN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cadreBreakdowns.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {row.cadre}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-600">
                          {row.respondentCount}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-teal-700 bg-teal-50/30">
                          {row.corePercent}%
                          <span className="block text-[9px] text-slate-400 font-normal">({row.avgCoreMins}m)</span>
                        </td>
                        <td className="py-3 px-3 text-center font-black text-sky-700 bg-sky-50/30">
                          {row.casPercent}%
                          <span className="block text-[9px] text-slate-400 font-normal">({row.avgCasMins}m)</span>
                        </td>
                        <td className="py-3 px-3 text-center font-black text-purple-700 bg-purple-50/30">
                          {row.iasPercent}%
                          <span className="block text-[9px] text-slate-400 font-normal">({row.avgIasMins}m)</span>
                        </td>
                        <td className="py-3 px-4 min-w-[180px]">
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                            <div 
                              className="bg-teal-500 h-full" 
                              style={{ width: `${row.corePercent}%` }} 
                              title={`Core: ${row.corePercent}%`}
                            />
                            <div 
                              className="bg-sky-500 h-full" 
                              style={{ width: `${row.casPercent}%` }} 
                              title={`CAS: ${row.casPercent}%`}
                            />
                            <div 
                              className="bg-purple-500 h-full" 
                              style={{ width: `${row.iasPercent}%` }} 
                              title={`IAS: ${row.iasPercent}%`}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.corePercent >= 65 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Clinical Focus
                            </span>
                          ) : row.iasPercent >= 20 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              High Admin Burden
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                              Balanced
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <h2 className="text-lg font-black text-slate-900">
              {t.summaryByType}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Scientific Measurement Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {survey.questions.map((q, qIndex) => {
              // 1. Likert Scale Item
              if (q.type === 'likert_5' || q.type === 'rating_stars') {
                const stats = getLikertStats(q.id);
                const isPositive = stats.mean >= 3.8;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-200 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full uppercase">
                          {q.type === 'likert_5' ? 'Likert Scale (1-5)' : 'Star Rating'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                          {qIndex + 1}. {language === 'km' ? q.titleKm : q.titleEn}
                        </h3>
                      </div>
                    </div>

                    {/* Statistical Mean & SD Pill */}
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex-1 text-center border-r border-slate-200">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{t.mean}</div>
                        <div className="text-xl font-black text-slate-900">{stats.mean}</div>
                      </div>
                      <div className="flex-1 text-center border-r border-slate-200">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{t.stdDev}</div>
                        <div className="text-xl font-black text-slate-900">{stats.stdDev}</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Assessment</div>
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                          isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isPositive ? 'High / Positive' : 'Moderate'}
                        </span>
                      </div>
                    </div>

                    {/* Bar Chart Distribution */}
                    <div className="h-48 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="score" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(val: any, _name: any, item: any) => [
                              `${val} respondents (${item.payload.percentage}%)`,
                              'Frequency'
                            ]}
                          />
                          <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              }

              // 2. Categorical (Single choice or Multiple choice)
              if (q.type === 'single_choice' || q.type === 'multiple_choice') {
                const stats = getCategoricalStats(q.id, q.options);

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-200 transition"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full uppercase">
                        {q.type === 'single_choice' ? 'Single Choice' : 'Multiple Select'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {qIndex + 1}. {language === 'km' ? q.titleKm : q.titleEn}
                      </h3>
                    </div>

                    <div className="h-48 w-full">
                      {stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {stats.chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: any, name: any) => [`${value} votes`, name]} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400">
                          No responses recorded
                        </div>
                      )}
                    </div>

                    {/* Table breakdown */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {stats.chartData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                          <span className="truncate pr-2 font-medium">{item.name}</span>
                          <span className="font-bold text-slate-900 shrink-0">
                            {item.value} ({item.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 3. Qualitative / Open Text
              if (q.type === 'textarea' || q.type === 'text') {
                const sampleTexts = responses
                  .map((r) => r.answers[q.id])
                  .filter((v) => typeof v === 'string' && v.trim().length > 0)
                  .slice(0, 4);

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-200 transition lg:col-span-2"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                        Qualitative / Open Text Feedback
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {qIndex + 1}. {language === 'km' ? q.titleKm : q.titleEn}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {sampleTexts.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 text-slate-400 text-xs italic">
                          មិនទាន់មានមតិយោបល់នៅឡើយទេ
                        </div>
                      ) : (
                        sampleTexts.map((text, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed italic"
                          >
                            "{String(text)}"
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
