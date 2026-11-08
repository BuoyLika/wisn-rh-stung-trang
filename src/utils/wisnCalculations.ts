import { ResearchSurvey, SurveyResponse, WhoWisnCadreModel, TaskShiftingImpact } from '../types';
import { HO2Indicator, defaultHO2Indicators } from '../data/ho2WorkloadData';

/**
 * Robustly parses time string or number into minutes
 * Examples:
 * - "30min", "30 min", "30" -> 30
 * - "2h", "2 hours", "2h00" -> 120
 * - "1:30min", "1h30" -> 90
 * - "15 នាទី" -> 15
 * - "2 ម៉ោង" -> 120
 */
export function parseTimeToMinutes(val: any): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;

  const str = String(val).trim().toLowerCase();
  if (!str) return 0;

  // Pattern: 1:30 or 1h30
  const colonMatch = str.match(/(\d+)\s*[:h]\s*(\d+)/i);
  if (colonMatch) {
    const hours = parseInt(colonMatch[1], 10) || 0;
    const mins = parseInt(colonMatch[2], 10) || 0;
    return hours * 60 + mins;
  }

  // Pattern: 2h or 2 hours or 2 ម៉ោង
  const hoursMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hour|hours|ម៉ោង)/i);
  if (hoursMatch) {
    return Math.round(parseFloat(hoursMatch[1]) * 60);
  }

  // Pattern: 30min or 30 នាទី or simple digits
  const minMatch = str.match(/(\d+(?:\.\d+)?)/);
  if (minMatch) {
    return Math.round(parseFloat(minMatch[1]));
  }

  return 0;
}

export interface ActivityBreakdown {
  coreMins: number;
  casMins: number;
  iasMins: number;
  totalMins: number;
  corePercent: number;
  casPercent: number;
  iasPercent: number;
}

/**
 * Calculates Core, CAS, and IAS proportions for a single response
 */
export function calculateResponseTierBreakdown(
  response: SurveyResponse,
  survey: ResearchSurvey
): ActivityBreakdown {
  let coreMins = 0;
  let casMins = 0;
  let iasMins = 0;

  const questionMap = new Map(survey.questions.map((q) => [q.id, q]));

  // Process standard questions
  Object.entries(response.answers || {}).forEach(([qid, ans]) => {
    const q = questionMap.get(qid);
    if (!q || !q.activityType) return;

    // Skip non-activity fields (like demographic / AWT)
    if (qid.startsWith('awt_') || qid === 'interview_date' || qid === 'cadre' || qid === 'staff_code') return;

    const mins = parseTimeToMinutes(ans);
    if (mins <= 0) return;

    if (q.activityType === 'core') {
      coreMins += mins;
    } else if (q.activityType === 'cas') {
      casMins += mins;
    } else if (q.activityType === 'ias') {
      iasMins += mins;
    }
  });

  // Process custom unlisted tasks
  (response.customTasks || []).forEach((task) => {
    const mins = parseTimeToMinutes(task.mins);
    if (mins <= 0) return;

    if (task.category === 'core') {
      coreMins += mins;
    } else if (task.category === 'cas') {
      casMins += mins;
    } else if (task.category === 'ias') {
      iasMins += mins;
    } else {
      coreMins += mins; // default fallback
    }
  });

  const totalMins = coreMins + casMins + iasMins;
  if (totalMins === 0) {
    return {
      coreMins: 0,
      casMins: 0,
      iasMins: 0,
      totalMins: 0,
      corePercent: 0,
      casPercent: 0,
      iasPercent: 0
    };
  }

  const corePercent = Math.round((coreMins / totalMins) * 100);
  const casPercent = Math.round((casMins / totalMins) * 100);
  const iasPercent = Math.max(0, 100 - (corePercent + casPercent)); // ensure exactly 100%

  return {
    coreMins,
    casMins,
    iasMins,
    totalMins,
    corePercent,
    casPercent,
    iasPercent
  };
}

export interface CadreBreakdownItem {
  cadre: string;
  respondentCount: number;
  avgCoreMins: number;
  avgCasMins: number;
  avgIasMins: number;
  totalMins: number;
  corePercent: number;
  casPercent: number;
  iasPercent: number;
}

/**
 * Calculates aggregated Core, CAS, and IAS proportions grouped by Cadre
 */
export function calculateCadreBreakdowns(
  responses: SurveyResponse[],
  survey: ResearchSurvey
): CadreBreakdownItem[] {
  const groups: Record<string, ActivityBreakdown[]> = {};

  responses.forEach((r) => {
    const cadre = r.cadre || 'Other Staff';
    if (!groups[cadre]) groups[cadre] = [];
    const breakdown = calculateResponseTierBreakdown(r, survey);
    if (breakdown.totalMins > 0) {
      groups[cadre].push(breakdown);
    }
  });

  const results: CadreBreakdownItem[] = [];

  Object.entries(groups).forEach(([cadre, items]) => {
    if (items.length === 0) return;

    const count = items.length;
    const sumCore = items.reduce((acc, curr) => acc + curr.coreMins, 0);
    const sumCas = items.reduce((acc, curr) => acc + curr.casMins, 0);
    const sumIas = items.reduce((acc, curr) => acc + curr.iasMins, 0);

    const avgCoreMins = Math.round(sumCore / count);
    const avgCasMins = Math.round(sumCas / count);
    const avgIasMins = Math.round(sumIas / count);
    const totalMins = avgCoreMins + avgCasMins + avgIasMins;

    let corePercent = 0;
    let casPercent = 0;
    let iasPercent = 0;

    if (totalMins > 0) {
      corePercent = Math.round((avgCoreMins / totalMins) * 100);
      casPercent = Math.round((avgCasMins / totalMins) * 100);
      iasPercent = Math.max(0, 100 - (corePercent + casPercent));
    }

    results.push({
      cadre,
      respondentCount: count,
      avgCoreMins,
      avgCasMins,
      avgIasMins,
      totalMins,
      corePercent,
      casPercent,
      iasPercent
    });
  });

  // Sort by respondent count descending
  return results.sort((a, b) => b.respondentCount - a.respondentCount);
}

/**
 * Calculates overall hospital-wide Core, CAS, and IAS percentage
 */
export function calculateHospitalBreakdown(
  responses: SurveyResponse[],
  survey: ResearchSurvey
): ActivityBreakdown {
  let totalCore = 0;
  let totalCas = 0;
  let totalIas = 0;

  responses.forEach((r) => {
    const b = calculateResponseTierBreakdown(r, survey);
    totalCore += b.coreMins;
    totalCas += b.casMins;
    totalIas += b.iasMins;
  });

  const totalMins = totalCore + totalCas + totalIas;
  if (totalMins === 0) {
    return {
      coreMins: 0,
      casMins: 0,
      iasMins: 0,
      totalMins: 0,
      corePercent: 70, // WHO standard baseline default
      casPercent: 20,
      iasPercent: 10
    };
  }

  const corePercent = Math.round((totalCore / totalMins) * 100);
  const casPercent = Math.round((totalCas / totalMins) * 100);
  const iasPercent = Math.max(0, 100 - (corePercent + casPercent));

  return {
    coreMins: totalCore,
    casMins: totalCas,
    iasMins: totalIas,
    totalMins,
    corePercent,
    casPercent,
    iasPercent
  };
}

/**
 * Calculates Full WHO WISN Staffing Requirements for RH Stung Trang
 * Formulates:
 * 1. AWT (Available Working Time)
 * 2. Wc (Core clinical requirement = Annual Workload * AST / AWT)
 * 3. CAF = 1 / (1 - CAS%)
 * 4. IAF = Total IAS Hours / AWT Hours
 * 5. Required Staff = (Wc * CAF) + IAF
 * 6. Difference = Actual Staff - Required Staff
 * 7. WISN Ratio = Actual Staff / Required Staff
 */
export function calculateWhoWisnModels(
  responses: SurveyResponse[],
  survey: ResearchSurvey,
  indicators: HO2Indicator[] = defaultHO2Indicators,
  staffOverrides: Record<string, number> = {}
): WhoWisnCadreModel[] {
  // 1. Calculate average AWT by cadre from survey responses
  const awtByCadre: Record<string, { totalHours: number; count: number }> = {};
  
  responses.forEach((r) => {
    const cadre = r.cadre || 'Other';
    if (!awtByCadre[cadre]) {
      awtByCadre[cadre] = { totalHours: 0, count: 0 };
    }
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

    awtByCadre[cadre].totalHours += awtHoursYear;
    awtByCadre[cadre].count += 1;
  });

  // Calculate Cadre Breakdowns for CAS% and IAS hours
  const cadreBreakdowns = calculateCadreBreakdowns(responses, survey);
  const breakdownMap = new Map(cadreBreakdowns.map((b) => [b.cadre, b]));

  // Cadres mapped to their relevant clinical indicators
  const cadreConfigs = [
    {
      cadre: 'Medical Assistant / Doctor',
      dept: 'OPD / Emergency / NCD',
      defaultActual: 4,
      defaultAwtHours: 1832,
      defaultCasPercent: 18,
      defaultIasHours: 160,
      indicatorIds: ['ind-opd-consult', 'ind-opd-ncd', 'ind-er-resus', 'ind-eye-consult']
    },
    {
      cadre: 'Secondary Nurse',
      dept: 'Inpatient Wards & ER',
      defaultActual: 12,
      defaultAwtHours: 1760,
      defaultCasPercent: 22,
      defaultIasHours: 210,
      indicatorIds: ['ind-ipd-admissions', 'ind-ipd-daily-care', 'ind-er-resus']
    },
    {
      cadre: 'Secondary Midwife',
      dept: 'Maternity & OPD OB/GYN',
      defaultActual: 8,
      defaultAwtHours: 1680,
      defaultCasPercent: 25,
      defaultIasHours: 240,
      indicatorIds: ['ind-mat-deliv', 'ind-mat-skin', 'ind-mat-pnc', 'ind-mat-anc', 'ind-mat-via']
    },
    {
      cadre: 'Lab Technician',
      dept: 'Laboratory',
      defaultActual: 3,
      defaultAwtHours: 1800,
      defaultCasPercent: 20,
      defaultIasHours: 150,
      indicatorIds: ['ind-lab-cbc', 'ind-lab-afb']
    },
    {
      cadre: 'Secondary Pharmacist',
      dept: 'Pharmacy',
      defaultActual: 3,
      defaultAwtHours: 1800,
      defaultCasPercent: 18,
      defaultIasHours: 180,
      indicatorIds: ['ind-pharm-dispense']
    },
    {
      cadre: 'Ambulance Driver',
      dept: 'Emergency Referral & Logistics',
      defaultActual: 2,
      defaultAwtHours: 1920,
      defaultCasPercent: 15,
      defaultIasHours: 100,
      indicatorIds: ['ind-referral-ambulance']
    },
    {
      cadre: 'Cleaner',
      dept: 'Hygiene, CSSD & Waste',
      defaultActual: 4,
      defaultAwtHours: 1920,
      defaultCasPercent: 20,
      defaultIasHours: 80,
      indicatorIds: ['ind-cssd-sterilize', 'ind-waste-incinerator']
    }
  ];

  return cadreConfigs.map((cfg) => {
    const actualStaff = staffOverrides[cfg.cadre] !== undefined ? staffOverrides[cfg.cadre] : cfg.defaultActual;
    
    // AWT calculation
    let avgAwtHours = cfg.defaultAwtHours;
    if (awtByCadre[cfg.cadre] && awtByCadre[cfg.cadre].count > 0) {
      avgAwtHours = Math.round(awtByCadre[cfg.cadre].totalHours / awtByCadre[cfg.cadre].count);
    }
    const sampleAwtMins = avgAwtHours * 60;

    // Core Workload Calculation from Indicators
    let annualCoreDemandMins = 0;
    cfg.indicatorIds.forEach((indId) => {
      const ind = indicators.find((i) => i.id === indId);
      if (ind) {
        annualCoreDemandMins += ind.currentCases * ind.defaultAstMins;
      }
    });

    // Core Staff Requirement (Wc)
    const coreStaffReq = Number((annualCoreDemandMins / (sampleAwtMins || 1)).toFixed(2));

    // Category Allowance Standard (CAS) & Factor (CAF)
    const cadreBreakdown = breakdownMap.get(cfg.cadre);
    const casPercentage = cadreBreakdown ? cadreBreakdown.casPercent : cfg.defaultCasPercent;
    // WHO formula: CAF = 1 / (1 - (CAS% / 100))
    const casDecimal = Math.min(0.5, casPercentage / 100);
    const caf = Number((1 / (1 - casDecimal)).toFixed(2));

    // Individual Allowance Standard (IAS) & Factor (IAF)
    const iasHoursYear = cfg.defaultIasHours;
    const iaf = Number((iasHoursYear / (avgAwtHours || 1)).toFixed(2));

    // Total WHO Required Staff = (Wc * CAF) + IAF
    const rawRequired = (coreStaffReq * caf) + iaf;
    const requiredStaff = Number(Math.max(1, rawRequired).toFixed(1));

    // Difference and WISN Ratio
    const difference = Number((actualStaff - requiredStaff).toFixed(1));
    const wisnRatio = Number((actualStaff / (requiredStaff || 1)).toFixed(2));

    // Status Determination
    let status: 'shortage_severe' | 'shortage_moderate' | 'balanced' | 'surplus' = 'balanced';
    if (wisnRatio < 0.70) status = 'shortage_severe';
    else if (wisnRatio < 0.85) status = 'shortage_moderate';
    else if (wisnRatio > 1.15) status = 'surplus';

    return {
      cadre: cfg.cadre,
      primaryDepartment: cfg.dept,
      actualStaff,
      sampleAwtHours: avgAwtHours,
      sampleAwtMins,
      annualCoreDemandMins,
      coreStaffReq,
      casPercentage,
      caf,
      iasHoursYear,
      iaf,
      requiredStaff,
      difference,
      wisnRatio,
      status
    };
  });
}

/**
 * Simulates the impact of Task Shifting (reallocating administrative tasks to Data Clerks)
 */
export function calculateTaskShiftingImpact(
  cadreModels: WhoWisnCadreModel[],
  iasShiftPercentage: number = 70 // default 70% IAS delegated to clerks
): TaskShiftingImpact[] {
  return cadreModels.map((m) => {
    // Only clinical/diagnostic cadres benefit significantly from administrative task shifting
    const isClinical = ['Medical Assistant / Doctor', 'Secondary Nurse', 'Secondary Midwife'].includes(m.cadre);
    
    if (!isClinical) {
      return {
        cadre: m.cadre,
        currentRatio: m.wisnRatio,
        newRatio: m.wisnRatio,
        reclaimedHoursPerStaff: 0,
        reclaimedDaysPerStaff: 0,
        shiftStatus: 'unchanged'
      };
    }

    const shiftedIasHours = m.iasHoursYear * (iasShiftPercentage / 100);
    const newIaf = Number(((m.iasHoursYear - shiftedIasHours) / (m.sampleAwtHours || 1)).toFixed(2));
    const newRequired = Number(((m.coreStaffReq * m.caf) + newIaf).toFixed(1));
    const newRatio = Number((m.actualStaff / (newRequired || 1)).toFixed(2));

    const reclaimedHoursPerStaff = Math.round(shiftedIasHours / (m.actualStaff || 1));
    const reclaimedDaysPerStaff = Number((reclaimedHoursPerStaff / 8).toFixed(1));

    return {
      cadre: m.cadre,
      currentRatio: m.wisnRatio,
      newRatio,
      reclaimedHoursPerStaff,
      reclaimedDaysPerStaff,
      shiftStatus: newRatio > m.wisnRatio ? 'improved' : 'unchanged'
    };
  });
}

