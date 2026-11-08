import React, { useState, useMemo, useEffect } from 'react';
import { ResearchSurvey, SurveyResponse, WhoWisnCadreModel, TaskShiftingImpact } from '../types';
import { HO2Indicator } from '../data/ho2WorkloadData';
import { 
  calculateWhoWisnModels, 
  calculateTaskShiftingImpact 
} from '../utils/wisnCalculations';
import { 
  getSavedHO2Indicators, 
  saveHO2Indicators, 
  resetHO2Indicators 
} from '../utils/storage';
import { exportToExcel } from '../utils/exportUtils';
import { ExecutiveReportModal } from './ExecutiveReportModal';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Clock, 
  Stethoscope,
  FileCheck2,
  Download,
  RotateCcw,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface WisnCalculatorProps {
  survey: ResearchSurvey;
  responses: SurveyResponse[];
}

export const WisnCalculator: React.FC<WisnCalculatorProps> = ({
  survey,
  responses,
}) => {
  // Navigation sub-tab inside WISN Calculator
  const [activeTab, setActiveTab] = useState<'model' | 'ho2' | 'task_shift' | 'awt'>('model');

  // Indicators State (stored in LocalStorage)
  const [indicators, setIndicators] = useState<HO2Indicator[]>(getSavedHO2Indicators);
  const [workloadMultiplier, setWorkloadMultiplier] = useState<number>(1.0); // 1.0 = baseline, 1.1 = +10%, 1.2 = +20%
  const [dataClerkCount, setDataClerkCount] = useState<number>(2);
  const [iasShiftPercent, setIasShiftPercent] = useState<number>(70);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Sync indicators with storage
  useEffect(() => {
    saveHO2Indicators(indicators);
  }, [indicators]);

  // Adjust indicators based on scenario multiplier
  const effectiveIndicators = useMemo(() => {
    return indicators.map((ind) => ({
      ...ind,
      currentCases: Math.round(ind.currentCases * workloadMultiplier)
    }));
  }, [indicators, workloadMultiplier]);

  // Cadre Staffing Overrides
  const [staffOverrides, setStaffOverrides] = useState<Record<string, number>>({
    'Medical Assistant / Doctor': 4,
    'Secondary Nurse': 12,
    'Secondary Midwife': 8,
    'Lab Technician': 3,
    'Secondary Pharmacist': 3,
    'Ambulance Driver': 2,
    'Cleaner': 4
  });

  // Calculate True WHO WISN Models
  const cadreWisnModels: WhoWisnCadreModel[] = useMemo(() => {
    return calculateWhoWisnModels(responses, survey, effectiveIndicators, staffOverrides);
  }, [responses, survey, effectiveIndicators, staffOverrides]);

  // Task Shifting Impact
  const taskShiftingImpact: TaskShiftingImpact[] = useMemo(() => {
    return calculateTaskShiftingImpact(cadreWisnModels, iasShiftPercent);
  }, [cadreWisnModels, iasShiftPercent]);

  // Calculate Individual AWT for Respondent Cards
  const respondentAwtList = useMemo(() => {
    return responses.map((r) => {
      const daysPerWeek = Number(r.answers['awt_days_week']) || 5;
      const hoursPerDay = Number(r.answers['awt_hours_day']) || 8;
      const annualLeave = Number(r.answers['awt_annual_leave']) || 0;
      const holidays = Number(r.answers['awt_holidays']) || 22;
      const sickLeave = Number(r.answers['awt_sick_leave']) || 0;
      const specialLeave = Number(r.answers['awt_special_leave']) || 0;
      
      let trainingDays = 3;
      const rawTraining = String(r.answers['awt_training_days'] || '');
      if (rawTraining.includes('48h')) trainingDays = 6;
      else if (!isNaN(Number(rawTraining)) && Number(rawTraining) > 0) trainingDays = Number(rawTraining);

      const totalWorkDaysYear = Math.round(52 * daysPerWeek);
      const nonWorkingDays = annualLeave + holidays + sickLeave + specialLeave + trainingDays;
      const actualWorkingDays = Math.max(1, totalWorkDaysYear - nonWorkingDays);
      const awtHoursYear = actualWorkingDays * hoursPerDay;

      return {
        staffCode: r.staffCode,
        staffName: r.staffName || r.staffCode,
        cadre: r.cadre || 'Staff',
        primaryDept: r.primaryDepartment || 'General',
        daysPerWeek,
        hoursPerDay,
        nonWorkingDays,
        actualWorkingDays,
        awtHoursYear
      };
    });
  }, [responses]);

  // Handler for updating indicator cases
  const handleUpdateIndicatorCases = (id: string, newCases: number) => {
    setIndicators((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, currentCases: Math.max(0, newCases) } : ind))
    );
  };

  // Reset to HO2 2025 Baseline
  const handleResetHO2 = () => {
    const defaultData = resetHO2Indicators();
    setIndicators(defaultData);
    setWorkloadMultiplier(1.0);
  };

  const chartData = cadreWisnModels.map((item) => ({
    name: item.cadre.split('/')[0].trim(),
    Actual: item.actualStaff,
    Required: item.requiredStaff,
    Ratio: item.wisnRatio
  }));

  const totalActual = cadreWisnModels.reduce((acc, m) => acc + m.actualStaff, 0);
  const totalRequired = cadreWisnModels.reduce((acc, m) => acc + m.requiredStaff, 0);
  const totalDifference = Number((totalActual - totalRequired).toFixed(1));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-teal-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 backdrop-blur text-xs font-bold mb-3 text-teal-200 border border-teal-700/50">
              <Calculator className="w-3.5 h-3.5 text-teal-400" />
              <span>WHO WISN Scientific Staffing Platform • NIPH & RH Stung Trang</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              ប្រព័ន្ធគណនាបន្ទុកការងារ និងតម្រូវការបុគ្គលិក WISN ({survey.hospitalNameKm || 'មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់'})
            </h1>
            <p className="text-teal-200/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              ការវិភាគផ្អែកលើរូបមន្តស្តង់ដារអង្គការសុខភាពពិភពលោក (WHO User's Manual) ដោយរួមបញ្ចូល AWT, Core Standard (Wc), Category Allowance (CAF), និង Individual Allowance (IAF)។
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-black text-xs shadow-md transition transform active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>របាយការណ៍បច្ចេកទេស (Policy Brief)</span>
            </button>
            <button
              onClick={() => exportToExcel(survey, responses)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur border border-white/20 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>ទាញយក Excel (Full WISN)</span>
            </button>
          </div>
        </div>

        {/* Quick Summary KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-teal-800/60 text-xs">
          <div>
            <span className="text-teal-300/80 font-medium">បុគ្គលិកជាក់ស្តែងសរុប៖</span>
            <div className="text-lg font-black text-white">{totalActual} នាក់</div>
          </div>
          <div>
            <span className="text-teal-300/80 font-medium">តម្រូវការ WISN សរុប៖</span>
            <div className="text-lg font-black text-amber-300">{totalRequired.toFixed(1)} នាក់</div>
          </div>
          <div>
            <span className="text-teal-300/80 font-medium">គម្លាតខ្វះ/លើស (Gap)៖</span>
            <div className={`text-lg font-black ${totalDifference < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
              {totalDifference > 0 ? `+${totalDifference}` : totalDifference} នាក់
            </div>
          </div>
          <div>
            <span className="text-teal-300/80 font-medium">សេណារីយ៉ូបន្ទុកការងារ៖</span>
            <div className="text-lg font-black text-teal-200">
              {workloadMultiplier === 1.0 ? 'ស្ថិតិមូលដ្ឋាន ២០២៥' : `កើនឡើង +${Math.round((workloadMultiplier - 1) * 100)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('model')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'model'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>គំរូគណនា WISN (Staffing Gap & Ratios)</span>
        </button>
        <button
          onClick={() => setActiveTab('ho2')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'ho2'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>គ្រប់គ្រងស្ថិតិ HO2 & សេណារីយ៉ូ ({indicators.length} សូចនាករ)</span>
        </button>
        <button
          onClick={() => setActiveTab('task_shift')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'task_shift'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ការផ្ទេរភារកិច្ច (Task Shifting Simulation)</span>
        </button>
        <button
          onClick={() => setActiveTab('awt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'awt'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>កម្រង AWT ជាក់ស្តែង ({respondentAwtList.length} បុគ្គលិក)</span>
        </button>
      </div>

      {/* TAB 1: WHO WISN MODEL */}
      {activeTab === 'model' && (
        <div className="space-y-8">
          {/* Workload Scenario Quick Switcher */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900">សាកល្បងសេណារីយ៉ូបន្ទុកការងារ (Workload Scenarios):</span>
              <span className="text-slate-500">មើលការប្រែប្រួលនៃតម្រូវការបុគ្គលិក</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: 'មូលដ្ឋាន (Baseline 2025)', mult: 1.0 },
                { label: 'កំណើន +10% (2026)', mult: 1.1 },
                { label: 'កំណើន +20% (Expansion)', mult: 1.2 },
                { label: 'កំណើន +30% (High Surge)', mult: 1.3 },
              ].map((sc, i) => (
                <button
                  key={i}
                  onClick={() => setWorkloadMultiplier(sc.mult)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    workloadMultiplier === sc.mult
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Bar Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span>គំនូសតាងប្រៀបធៀប៖ បុគ្គលិកជាក់ស្តែង និងតម្រូវការតាម WHO WISN</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  រូបមន្ត WHO: Required Staff = (Core Workload Wc × Category Allowance Factor CAF) + Individual Allowance Factor IAF
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} នាក់`,
                      name === 'Actual' ? 'បុគ្គលិកជាក់ស្តែង' : 'តម្រូវការ WISN'
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Actual" fill="#0d9488" name="បុគ្គលិកជាក់ស្តែង (Actual Staff)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Required" fill="#f59e0b" name="តម្រូវការតាម WISN (Required Staff)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed WHO WISN Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  តារាងគណនាតម្រូវការបុគ្គលិក និង WISN Ratio តាមរូបមន្តអង្គការសុខភាពពិភពលោក
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  កម្រិត WISN Ratio: &lt; 0.70 (ខ្វះខាតធ្ងន់ធ្ងរខ្លាំង) | 0.70 - 0.84 (ខ្វះខាតមធ្យម) | 0.85 - 1.15 (សមរម្យ) | &gt; 1.15 (លើសកម្លាំង)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">មុខតំណែង (Cadre)</th>
                    <th className="py-3 px-2 text-center">AWT (ម៉ោង/ឆ្នាំ)</th>
                    <th className="py-3 px-2 text-center">Wc (Core)</th>
                    <th className="py-3 px-2 text-center">CAS %</th>
                    <th className="py-3 px-2 text-center">CAF</th>
                    <th className="py-3 px-2 text-center">IAF</th>
                    <th className="py-3 px-3 text-center">បុគ្គលិកជាក់ស្តែង</th>
                    <th className="py-3 px-3 text-center">តម្រូវការ WISN</th>
                    <th className="py-3 px-3 text-center">គម្លាត</th>
                    <th className="py-3 px-3 text-center">WISN Ratio</th>
                    <th className="py-3 px-4 text-right">ស្ថានភាពបន្ទុក</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cadreWisnModels.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.cadre}
                        <div className="text-xs text-slate-400 font-normal">{item.primaryDepartment}</div>
                      </td>
                      <td className="py-3.5 px-2 text-center font-medium text-slate-700">
                        {item.sampleAwtHours}
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-teal-800">
                        {item.coreStaffReq}
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-600">
                        {item.casPercentage}%
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono text-xs font-semibold text-slate-800">
                        {item.caf}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono text-xs font-semibold text-slate-800">
                        {item.iaf}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.actualStaff}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setStaffOverrides((prev) => ({ ...prev, [item.cadre]: val }));
                          }}
                          className="w-16 px-1.5 py-1 text-center font-extrabold text-teal-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          title="កែប្រែចំនួនបុគ្គលិកជាក់ស្តែងបច្ចុប្បន្ន"
                        />
                      </td>
                      <td className="py-3.5 px-3 text-center font-black text-amber-600">
                        {item.requiredStaff} នាក់
                      </td>
                      <td className={`py-3.5 px-3 text-center font-extrabold ${
                        item.difference < 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {item.difference > 0 ? `+${item.difference}` : item.difference} នាក់
                      </td>
                      <td className="py-3.5 px-3 text-center font-black">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.wisnRatio < 0.70
                            ? 'bg-rose-100 text-rose-800'
                            : item.wisnRatio < 0.85
                            ? 'bg-amber-100 text-amber-800'
                            : item.wisnRatio > 1.15
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.wisnRatio}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.status === 'shortage_severe' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>ខ្វះខាតធ្ងន់ធ្ងរ</span>
                          </span>
                        )}
                        {item.status === 'shortage_moderate' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>ខ្វះខាតមធ្យម</span>
                          </span>
                        )}
                        {item.status === 'balanced' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>សមរម្យ</span>
                          </span>
                        )}
                        {item.status === 'surplus' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            <Users className="w-3.5 h-3.5" />
                            <span>លើសកម្លាំង</span>
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
      )}

      {/* TAB 2: HO2 WORKLOAD MANAGER */}
      {activeTab === 'ho2' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600" />
                <span>គ្រប់គ្រងស្ថិតិសេវាប្រចាំឆ្នាំ (HO2 Annual Service Statistics)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                លោកអ្នកអាចកែប្រែទិន្នន័យជាក់ស្តែងតាមឆ្នាំនីមួយៗ (ស្ថិតិអ្នកជំងឺ) និងស្តង់ដារពេលវេលា (AST) ដោយផ្ទាល់។
              </p>
            </div>
            <button
              onClick={handleResetHO2}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>កំណត់ឡើងវិញដូចដើម (2025 Baseline)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">លេខកូដ & សេវា (Indicator)</th>
                  <th className="py-2.5 px-3">ផ្នែក & មុខតំណែង</th>
                  <th className="py-2.5 px-3 text-center">ស្ថិតិដើម (2025)</th>
                  <th className="py-2.5 px-3 text-center">ស្ថិតិជាក់ស្តែង (Annual Cases)</th>
                  <th className="py-2.5 px-3 text-center">ស្តង់ដារពេល (AST)</th>
                  <th className="py-2.5 px-3">ប្រភពទិន្នន័យ (Source)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {indicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                        {ind.code}
                      </span>
                      <div className="font-bold text-slate-900 mt-1">{ind.nameKm}</div>
                      <div className="text-[10px] text-slate-400">{ind.nameEn}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{ind.cadre}</div>
                      <div className="text-[10px] text-teal-700">{ind.department}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-medium">
                      {ind.baselineCases2025.toLocaleString()} {ind.unitKm}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={ind.currentCases}
                        onChange={(e) => handleUpdateIndicatorCases(ind.id, parseInt(e.target.value, 10) || 0)}
                        className="w-28 px-2 py-1 text-center font-black text-teal-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {ind.defaultAstMins} នាទី
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {ind.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TASK SHIFTING SIMULATION */}
      {activeTab === 'task_shift' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-teal-950 font-black text-base">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>ការវិភាគលទ្ធភាពផ្ទេរភារកិច្ចរដ្ឋបាល (Task Shifting / Administrative Delegation)</span>
            </div>
            <p className="text-xs sm:text-sm text-teal-900 leading-relaxed max-w-4xl">
              ការស្ទង់មតិបានបង្ហាញថា វេជ្ជបណ្ឌិត គិលានុបដ្ឋាក និងឆ្មបត្រូវចំណាយពេលច្រើនលើការងាររដ្ឋបាល (IAS) ដូចជា ការសរសេរសៀវភៅបញ្ជី Logbook, បញ្ចូលទិន្នន័យ HCIS/CamLIS, បិទបញ្ជីបុងថ្នាំ។
              ម៉ូឌុលនេះបង្ហាញពីលទ្ធផលនៃការជ្រើសរើស <strong>ស្មៀនបញ្ចូលទិន្នន័យ (Data Clerks)</strong> មកជួយសម្រាលការងារឯកសារ ដើម្បីទាញម៉ោងថែទាំអ្នកជំងឺត្រឡប់មកវិញ។
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-950">ចំនួនស្មៀនទិន្នន័យ (Data Clerks)៖</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDataClerkCount(num)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        dataClerkCount === num
                          ? 'bg-teal-700 text-white'
                          : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100'
                      }`}
                    >
                      +{num} នាក់
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-950">អត្រាផ្ទេរការងាររដ្ឋបាល (IAS Shift %):</span>
                <div className="flex gap-1.5">
                  {[50, 70, 85].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setIasShiftPercent(pct)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        iasShiftPercent === pct
                          ? 'bg-teal-700 text-white'
                          : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {taskShiftingImpact.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition"
              >
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{item.cadre}</h3>
                  <span className="text-[10px] text-slate-500">ផលជះនៃការផ្ទេរការងាររដ្ឋបាល {iasShiftPercent}%</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">WISN Ratio បច្ចុប្បន្ន៖</span>
                    <span className="font-extrabold text-slate-800">{item.currentRatio}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-teal-700 font-bold">WISN Ratio ក្រោយផ្ទេរភារកិច្ច៖</span>
                    <span className="font-black text-teal-700 text-sm">{item.newRatio}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 text-emerald-700 font-bold">
                    <span>ម៉ោងព្យាបាលទទួលបានមកវិញ៖</span>
                    <span>+{item.reclaimedHoursPerStaff} ម៉ោង/នាក់/ឆ្នាំ</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>ស្មើនឹងថ្ងៃធ្វើការពេញលេញ៖</span>
                    <span className="font-semibold text-slate-700">+{item.reclaimedDaysPerStaff} ថ្ងៃ/ឆ្នាំ</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  item.shiftStatus === 'improved'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    : 'bg-slate-50 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {item.shiftStatus === 'improved' ? 'កាត់បន្ថយសម្ពាធការងាររដ្ឋបាលបានជោគជ័យ' : 'មិនមានការងាររដ្ឋបាលច្រើន'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AWT PROFILES */}
      {activeTab === 'awt' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>ពេលវេលាបំពេញការងារដែលមានប្រចាំឆ្នាំ (Individual AWT Profiles)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              ទិន្នន័យពីបុគ្គលិកដែលបានសម្ភាសន៍ជាក់ស្តែង
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {respondentAwtList.map((staff, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-teal-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                      ID: {staff.staffCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {staff.staffName}
                    </h3>
                    <div className="text-xs text-slate-500">{staff.cadre}</div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                    {staff.primaryDept}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>ថ្ងៃធ្វើការក្នុងមួយសប្តាហ៍៖</span>
                    <span className="font-bold text-slate-800">{staff.daysPerWeek} ថ្ងៃ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ម៉ោងធ្វើការក្នុងមួយថ្ងៃ៖</span>
                    <span className="font-bold text-slate-800">{staff.hoursPerDay} ម៉ោង</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ថ្ងៃឈប់សម្រាកសរុប (Leave/Holiday)៖</span>
                    <span className="font-bold text-rose-600">{staff.nonWorkingDays} ថ្ងៃ/ឆ្នាំ</span>
                  </div>
                  <div className="flex justify-between text-teal-900 font-black pt-1 border-t border-dashed border-slate-200">
                    <span>AWT ជាក់ស្តែង៖</span>
                    <span>{staff.awtHoursYear.toLocaleString()} ម៉ោង/ឆ្នាំ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Policy Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        cadreModels={cadreWisnModels}
        taskShiftingResults={taskShiftingImpact}
        indicators={effectiveIndicators}
        totalRespondents={responses.length}
        hospitalNameKm={survey.hospitalNameKm}
        onExportExcel={() => exportToExcel(survey, responses)}
      />
    </div>
  );
};
