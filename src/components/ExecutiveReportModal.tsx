import React from 'react';
import { WhoWisnCadreModel, TaskShiftingImpact } from '../types';
import { HO2Indicator } from '../data/ho2WorkloadData';
import { 
  Printer, 
  X, 
  Building2, 
  FileCheck2, 
  AlertTriangle, 
  Sparkles,
  Download
} from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cadreModels: WhoWisnCadreModel[];
  taskShiftingResults: TaskShiftingImpact[];
  indicators: HO2Indicator[];
  totalRespondents: number;
  hospitalNameKm?: string;
  onExportExcel?: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  cadreModels,
  taskShiftingResults,
  indicators,
  totalRespondents,
  hospitalNameKm = 'មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់',
  onExportExcel,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalActual = cadreModels.reduce((sum, m) => sum + m.actualStaff, 0);
  const totalRequired = cadreModels.reduce((sum, m) => sum + m.requiredStaff, 0);
  const totalDifference = Number((totalActual - totalRequired).toFixed(1));
  const overallRatio = Number((totalActual / (totalRequired || 1)).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-2 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm sm:text-base">
              របាយការណ៍បច្ចេកទេស និងអនុសាសន៍គោលនយោបាយ WISN (Policy Brief)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព / សន្សំជា PDF (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 text-slate-800 space-y-8 bg-white print:p-6 print:space-y-6">
          
          {/* Official Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-teal-800 font-extrabold text-xs uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              <span>ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</span>
            </div>
            <div className="text-xs font-bold text-slate-500">
              ក្រសួងសុខាភិបាល • វិទ្យាស្ថានជាតិសុខភាពសាធារណៈ (NIPH) សហការជាមួយ {hospitalNameKm}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 pt-2">
              របាយការណ៍បច្ចេកទេស និងអនុសាសន៍គោលនយោបាយ WISN
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-teal-800">
              Workload Indicators of Staffing Need (WISN) Scientific Workforce Assessment & Allocation Model
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              កាលបរិច្ឆេទវិភាគ៖ {new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })} | ទិន្នន័យគំរូអ្នកឆ្លើយ៖ N = {totalRespondents} នាក់
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
              ១. សេចក្តីសង្ខេបប្រតិបត្តិ (Executive Summary)
            </h2>
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 border border-slate-200">
              <p>
                ការសិក្សានេះត្រូវបានរៀបចំឡើងដោយប្រើប្រាស់វិធីសាស្ត្រស្តង់ដារ <strong>WISN របស់អង្គការសុខភាពពិភពលោក (WHO)</strong> ដើម្បីវាយតម្លៃបន្ទុកការងារជាក់ស្តែង កំណត់ពេលវេលាបំពេញការងារដែលមាន (AWT) និងគណនាតម្រូវការបុគ្គលិកសុខាភិបាលនៅ <strong>{hospitalNameKm}</strong> ផ្អែកលើស្ថិតិសេវាប្រចាំឆ្នាំ (HO2 Statistics)។
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">បុគ្គលិកជាក់ស្តែង</div>
                  <div className="text-lg font-black text-slate-900">{totalActual} នាក់</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">តម្រូវការ WISN</div>
                  <div className="text-lg font-black text-amber-600">{totalRequired.toFixed(1)} នាក់</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">គម្លាតខ្វះ/លើស</div>
                  <div className={`text-lg font-black ${totalDifference < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {totalDifference > 0 ? `+${totalDifference}` : totalDifference} នាក់
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">WISN Ratio សរុប</div>
                  <div className="text-lg font-black text-teal-700">{overallRatio}</div>
                </div>
              </div>

              {/* Key Service Workload Indicators from HO2 */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-600 mb-1.5">ស្ថិតិសេវាសំខាន់ៗប្រចាំឆ្នាំ (HO2 Statistics Baseline):</div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {indicators.slice(0, 6).map((ind) => (
                    <span key={ind.id} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                      {ind.nameKm.split('(')[0].trim()}: <strong className="text-teal-800">{ind.currentCases.toLocaleString()}</strong> {ind.unitKm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: WHO WISN Cadre Staffing Gap Table */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
              ២. លទ្ធផលគណនាតម្រូវការបុគ្គលិកតាមមុខតំណែង (WHO WISN Cadre Staffing Model)
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">មុខតំណែង (Cadre)</th>
                    <th className="py-2.5 px-2 text-center">AWT (ម៉ោង/ឆ្នាំ)</th>
                    <th className="py-2.5 px-2 text-center">Wc (Core)</th>
                    <th className="py-2.5 px-2 text-center">CAF</th>
                    <th className="py-2.5 px-2 text-center">IAF</th>
                    <th className="py-2.5 px-2 text-center">បុគ្គលិកជាក់ស្តែង</th>
                    <th className="py-2.5 px-2 text-center">តម្រូវការ WISN</th>
                    <th className="py-2.5 px-2 text-center">គម្លាត</th>
                    <th className="py-2.5 px-2 text-center">WISN Ratio</th>
                    <th className="py-2.5 px-3 text-right">ស្ថានភាពបន្ទុក</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cadreModels.map((m, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {m.cadre}
                        <div className="text-[10px] text-slate-500 font-normal">{m.primaryDepartment}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-medium">{m.sampleAwtHours}</td>
                      <td className="py-2.5 px-2 text-center">{m.coreStaffReq}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px]">{m.caf}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px]">{m.iaf}</td>
                      <td className="py-2.5 px-2 text-center font-black text-slate-900">{m.actualStaff}</td>
                      <td className="py-2.5 px-2 text-center font-black text-amber-700">{m.requiredStaff}</td>
                      <td className={`py-2.5 px-2 text-center font-extrabold ${m.difference < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {m.difference > 0 ? `+${m.difference}` : m.difference}
                      </td>
                      <td className="py-2.5 px-2 text-center font-black">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          m.wisnRatio < 0.85
                            ? 'bg-rose-100 text-rose-800'
                            : m.wisnRatio > 1.15
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {m.wisnRatio}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[11px]">
                        {m.status === 'shortage_severe' && <span className="text-rose-700">ខ្វះខាតធ្ងន់ធ្ងរ</span>}
                        {m.status === 'shortage_moderate' && <span className="text-amber-700">ខ្វះខាតមធ្យម</span>}
                        {m.status === 'balanced' && <span className="text-emerald-700">មានតុល្យភាព</span>}
                        {m.status === 'surplus' && <span className="text-blue-700">លើសកម្លាំង</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              * កំណត់សម្គាល់ WHO៖ Wc = តម្រូវការការងារស្នូល, CAF = កត្តាគុណការងារគាំទ្រ Category Allowance Factor, IAF = កត្តាបន្ថែមការងាររដ្ឋបាល Individual Allowance Factor។
            </p>
          </div>

          {/* Section 3: Task Shifting Simulation */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
              ៣. ការវិភាគលទ្ធភាពផ្ទេរភារកិច្ចរដ្ឋបាល (Task Shifting / Delegation Feasibility)
            </h2>
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <p className="text-xs text-teal-950 leading-relaxed">
                ផ្អែកលើការស្ទង់មតិ បុគ្គលិកគ្លីនិក (វេជ្ជបណ្ឌិត គិលានុបដ្ឋាក ឆ្មប) ចំណាយពេលពី <strong>១៥% ទៅ ២៥% នៃម៉ោងការងារប្រចាំថ្ងៃ</strong> លើកិច្ចការរដ្ឋបាល (IAS) ដូចជា ការសរសេរសៀវភៅបញ្ជី Logbook ការបញ្ចូលទិន្នន័យ HCIS/CamLIS និងការធ្វើបុងថ្នាំ។
                បើសិនជាមន្ទីរពេទ្យជ្រើសរើស <strong>ស្មៀនបញ្ចូលទិន្នន័យ (Data Clerk) ចំនួន ២ នាក់</strong> ដើម្បីជួយសម្រាលការងាររដ្ឋបាលទាំងនេះ ៧០%៖
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {taskShiftingResults.filter(r => r.shiftStatus === 'improved').map((r, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-teal-100 shadow-xs space-y-1">
                    <div className="text-xs font-bold text-slate-900">{r.cadre}</div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>WISN Ratio:</span>
                      <span className="font-bold text-teal-700">{r.currentRatio} ➔ {r.newRatio}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-700 font-bold">
                      <span>ម៉ោងព្យាបាលទទួលបានមកវិញ៖</span>
                      <span>+{r.reclaimedHoursPerStaff} ម៉ោង/នាក់/ឆ្នាំ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Key Policy Recommendations */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
              ៤. អនុសាសន៍គោលនយោបាយសម្រាប់ថ្នាក់ដឹកនាំ (Strategic Policy Recommendations)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>១. ការដោះស្រាយបញ្ហាកង្វះខាតបន្ទាន់ (Urgent Staff Shortage)</span>
                </div>
                <p>
                  ស្នើសុំក្របខ័ណ្ឌបន្ថែមសម្រាប់ <strong>គ្រូពេទ្យ/ជំនួយការវេជ្ជបណ្ឌិត (OPD/ER)</strong> និង <strong>អ្នកបើកបររថយន្តសង្គ្រោះ (Ambulance Driver)</strong> ដើម្បីធានាបាននូវការបញ្ជូនអ្នកជំងឺសង្គ្រោះបន្ទាន់ទៅមន្ទីរពេទ្យខេត្តកំពង់ចាម (៨៩៤ ករណី/ឆ្នាំ) ដោយមិនធ្វើឱ្យប៉ះពាល់ដល់ការថែទាំអ្នកជំងឺក្នុងមន្ទីរពេទ្យ។
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>២. ការកែសម្រួលបន្ទុកការងារ (Workload Rebalancing)</span>
                </div>
                <p>
                  ជ្រើសរើសមន្ត្រីកិច្ចសន្យាផ្នែករដ្ឋបាល/ព័ត៌មានវិទ្យា (Data Clerks) ចំនួន ២ នាក់ មកជួយសម្រាលការងារឯកសារ HCIS/HO2 ដើម្បីទាញម៉ោងធ្វើការរបស់គិលានុបដ្ឋាយិកា និងឆ្មបឱ្យផ្តោតលើការថែទាំអ្នកជំងឺផ្ទាល់ (Patient Bedside Care)។
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Signature & Validation */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-700">
            <div className="space-y-16">
              <div>
                <div className="font-bold">ប្រធានក្រុមស្រាវជ្រាវ WISN</div>
                <div className="text-slate-500 text-[11px]">វិទ្យាស្ថានជាតិសុខភាពសាធារណៈ (NIPH)</div>
              </div>
              <div className="text-slate-400 font-serif italic">[ ហត្ថលេខា និងត្រា ]</div>
            </div>
            <div className="space-y-16">
              <div>
                <div className="font-bold">ប្រធានមន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់</div>
                <div className="text-slate-500 text-[11px]">មន្ទីរសុខាភិបាលខេត្តកំពង់ចាម</div>
              </div>
              <div className="text-slate-400 font-serif italic">[ ហត្ថលេខា និងត្រា ]</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
