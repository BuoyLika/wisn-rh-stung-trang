import * as XLSX from 'xlsx';
import { ResearchSurvey, SurveyResponse } from '../types';
import { calculateResponseTierBreakdown, calculateCadreBreakdowns, calculateWhoWisnModels, calculateTaskShiftingImpact } from './wisnCalculations';
import { defaultHO2Indicators } from '../data/ho2WorkloadData';

/**
 * Exports data to Microsoft Excel (.xlsx) with multiple organized sheets:
 * 1. WISN_Staff_Data (Raw Data with AWT, Workload, and 3-Tier Activity Breakdown %)
 * 2. WISN_Cadre_Proportions (Summary of Core, CAS, IAS % by Cadre)
 * 3. Unlisted_Custom_Tasks (All repeat items added by staff)
 * 4. WISN_Codebook (Activity standards & HO2 baseline indicators)
 * 5. Study_Metadata
 */
export const exportToExcel = (survey: ResearchSurvey, responses: SurveyResponse[], filename = 'WISN_RH_Stung_Trang_Data.xlsx'): void => {
  const wb = XLSX.utils.book_new();

  // 1. Prepare Main Responses Sheet with Activity Breakdown %
  const rows = responses.map((r, index) => {
    const breakdown = calculateResponseTierBreakdown(r, survey);

    const rowObj: Record<string, any> = {
      'No.': index + 1,
      'Respondent_ID': r.id,
      'Staff_Code': r.staffCode,
      'Staff_Name': r.staffName || '',
      'Phone': r.staffPhone || '',
      'Cadre': r.cadre || r.answers['cadre'] || '',
      'Primary_Department': r.primaryDepartment || r.answers['primary_department'] || '',
      'Core_Activity_Percent': `${breakdown.corePercent}%`,
      'CAS_Support_Percent': `${breakdown.casPercent}%`,
      'IAS_Admin_Percent': `${breakdown.iasPercent}%`,
      'Total_Core_Mins': breakdown.coreMins,
      'Total_CAS_Mins': breakdown.casMins,
      'Total_IAS_Mins': breakdown.iasMins,
      'Total_Reported_Mins': breakdown.totalMins,
      'Submitted_At': r.submittedAt,
      'Duration_Seconds': r.completionTimeSeconds,
    };

    survey.questions.forEach((q) => {
      const val = r.answers[q.id];
      if (Array.isArray(val)) {
        rowObj[q.id] = val.join('; ');
      } else if (val !== undefined && val !== null) {
        rowObj[q.id] = val;
      } else {
        rowObj[q.id] = '';
      }
    });

    return rowObj;
  });

  const wsData = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, wsData, 'WISN_Staff_Data');

  // 2. Prepare Cadre Proportions Sheet
  const cadreStats = calculateCadreBreakdowns(responses, survey);
  if (cadreStats.length > 0) {
    const cadreRows = cadreStats.map((c, idx) => ({
      'No.': idx + 1,
      'Cadre': c.cadre,
      'Sample_Size_N': c.respondentCount,
      'Core_Activity_Percent': `${c.corePercent}%`,
      'CAS_Support_Percent': `${c.casPercent}%`,
      'IAS_Admin_Percent': `${c.iasPercent}%`,
      'Avg_Core_Minutes': c.avgCoreMins,
      'Avg_CAS_Minutes': c.avgCasMins,
      'Avg_IAS_Minutes': c.avgIasMins,
      'Total_Avg_Minutes': c.totalMins,
      'WISN_Status': c.corePercent >= 65 ? 'Clinical Focus' : c.iasPercent >= 20 ? 'High Admin Burden' : 'Balanced'
    }));
    const wsCadre = XLSX.utils.json_to_sheet(cadreRows);
    XLSX.utils.book_append_sheet(wb, wsCadre, 'WISN_Cadre_Proportions');
  }

  // 3. Prepare Unlisted Custom Tasks Sheet (Repeat group from staff interviews)
  const taskRows: any[] = [];
  responses.forEach((r) => {
    if (r.customTasks && r.customTasks.length > 0) {
      r.customTasks.forEach((t, idx) => {
        taskRows.push({
          'Staff_ID': r.staffCode,
          'Staff_Name': r.staffName || '',
          'Task_No': idx + 1,
          'Task_Name': t.name,
          'Category': t.category.toUpperCase(),
          'Estimated_Cases': t.cases,
          'Period': t.period,
          'Time_Per_Case': t.mins,
          'Notes': t.notes || ''
        });
      });
    }
  });

  if (taskRows.length > 0) {
    const wsTasks = XLSX.utils.json_to_sheet(taskRows);
    XLSX.utils.book_append_sheet(wb, wsTasks, 'Unlisted_Custom_Tasks');
  }

  // 4. Prepare WHO WISN Staffing Gap Model Sheet
  const wisnModels = calculateWhoWisnModels(responses, survey);
  const wisnRows = wisnModels.map((m, idx) => ({
    'No.': idx + 1,
    'Cadre': m.cadre,
    'Department': m.primaryDepartment,
    'Actual_Staff_Current': m.actualStaff,
    'Required_Staff_WISN': m.requiredStaff,
    'Staff_Gap_Difference': m.difference,
    'WISN_Ratio': m.wisnRatio,
    'Workload_Status': m.status.toUpperCase(),
    'AWT_Hours_Year': m.sampleAwtHours,
    'Core_Workload_Wc': m.coreStaffReq,
    'CAS_Percent': `${m.casPercentage}%`,
    'CAF_Factor': m.caf,
    'IAS_Hours_Year': m.iasHoursYear,
    'IAF_Factor': m.iaf
  }));
  const wsWisn = XLSX.utils.json_to_sheet(wisnRows);
  XLSX.utils.book_append_sheet(wb, wsWisn, 'WHO_WISN_Staffing_Model');

  // 5. Prepare Task Shifting Simulation Sheet
  const taskShift = calculateTaskShiftingImpact(wisnModels);
  const taskShiftRows = taskShift.map((t, idx) => ({
    'No.': idx + 1,
    'Cadre': t.cadre,
    'Baseline_WISN_Ratio': t.currentRatio,
    'Post_Task_Shifting_Ratio': t.newRatio,
    'Reclaimed_Clinical_Hours_Staff_Year': t.reclaimedHoursPerStaff,
    'Reclaimed_Clinical_Days_Staff_Year': t.reclaimedDaysPerStaff,
    'Impact_Summary': t.shiftStatus === 'improved' ? 'Significant Burden Reduction' : 'No Impact'
  }));
  const wsShift = XLSX.utils.json_to_sheet(taskShiftRows);
  XLSX.utils.book_append_sheet(wb, wsShift, 'Task_Shifting_Impact');

  // 6. Prepare HO2 Annual Workload Statistics Sheet
  const ho2Rows = defaultHO2Indicators.map((ind, idx) => ({
    'No.': idx + 1,
    'Indicator_Code': ind.code,
    'Indicator_Name_Khmer': ind.nameKm,
    'Indicator_Name_English': ind.nameEn,
    'Responsible_Cadre': ind.cadre,
    'Department': ind.department,
    'Category': ind.category,
    'Annual_Volume_2025': ind.currentCases,
    'Unit': ind.unitKm,
    'Activity_Standard_Mins': ind.defaultAstMins,
    'Data_Source': ind.source
  }));
  const wsHO2 = XLSX.utils.json_to_sheet(ho2Rows);
  XLSX.utils.book_append_sheet(wb, wsHO2, 'HO2_Annual_Workload');

  // 7. Prepare Codebook Sheet

  const codebookRows = survey.questions.map((q, idx) => {
    let optionsStr = '';
    if (q.options && q.options.length > 0) {
      optionsStr = q.options.map((o) => `${o.value}=${o.labelKm}`).join(' | ');
    }

    return {
      'Item_No': idx + 1,
      'Variable_Name': q.id,
      'Activity_Tier': q.activityType ? q.activityType.toUpperCase() : 'General',
      'Category': q.category || 'General',
      'HO2_Annual_Statistic': q.ho2Stats || '-',
      'Question_Title_Khmer': q.titleKm,
      'Question_Title_English': q.titleEn,
      'Coding_Options': optionsStr
    };
  });

  const wsCodebook = XLSX.utils.json_to_sheet(codebookRows);
  XLSX.utils.book_append_sheet(wb, wsCodebook, 'WISN_Codebook');

  // 5. Prepare Metadata Sheet
  const metadataRows = [
    { 'Attribute': 'Research Title (Khmer)', 'Value': survey.titleKm },
    { 'Attribute': 'Research Title (English)', 'Value': survey.titleEn },
    { 'Attribute': 'Target Health Facility', 'Value': survey.hospitalNameKm || 'មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់' },
    { 'Attribute': 'Research Institution', 'Value': survey.institutionKm },
    { 'Attribute': 'Methodology', 'Value': 'WHO Workload Indicators of Staffing Need (WISN)' },
    { 'Attribute': 'Total Staff Interviewed (N)', 'Value': responses.length },
    { 'Attribute': 'Export Date & Time', 'Value': new Date().toISOString() },
  ];
  const wsMeta = XLSX.utils.json_to_sheet(metadataRows);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Study_Metadata');

  XLSX.writeFile(wb, filename);
};

export const exportToCSV = (survey: ResearchSurvey, responses: SurveyResponse[], filename = 'WISN_RH_Stung_Trang_Responses.csv'): void => {
  const headers = [
    'Respondent_ID',
    'Staff_Code',
    'Staff_Name',
    'Cadre',
    'Primary_Department',
    'Core_Percent',
    'CAS_Percent',
    'IAS_Percent',
    'Total_Core_Mins',
    'Total_CAS_Mins',
    'Total_IAS_Mins',
    'Submitted_At',
    ...survey.questions.map((q) => q.id)
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvLines = [headers.map(escapeCsv).join(',')];

  responses.forEach((r) => {
    const breakdown = calculateResponseTierBreakdown(r, survey);

    const row = [
      escapeCsv(r.id),
      escapeCsv(r.staffCode),
      escapeCsv(r.staffName || ''),
      escapeCsv(r.cadre || r.answers['cadre'] || ''),
      escapeCsv(r.primaryDepartment || r.answers['primary_department'] || ''),
      escapeCsv(`${breakdown.corePercent}%`),
      escapeCsv(`${breakdown.casPercent}%`),
      escapeCsv(`${breakdown.iasPercent}%`),
      escapeCsv(breakdown.coreMins),
      escapeCsv(breakdown.casMins),
      escapeCsv(breakdown.iasMins),
      escapeCsv(r.submittedAt),
      ...survey.questions.map((q) => {
        const val = r.answers[q.id];
        if (Array.isArray(val)) {
          return escapeCsv(val.join('; '));
        }
        return escapeCsv(val ?? '');
      })
    ];
    csvLines.push(row.join(','));
  });

  const bom = '\uFEFF';
  const csvContent = bom + csvLines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (survey: ResearchSurvey, responses: SurveyResponse[], filename = 'WISN_RH_Stung_Trang_Dataset.json'): void => {
  const data = {
    facility: 'Hun Sen Stung Trang Referral Hospital',
    institution: 'National Institute of Public Health (NIPH)',
    methodology: 'WHO WISN',
    exportedAt: new Date().toISOString(),
    sampleSize: responses.length,
    survey,
    responses
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
