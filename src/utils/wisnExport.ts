// Builds a study file (.wat) for the WHO WISN Automated Tool (v2.2) from the
// survey's WISN results, so it opens in WISN with "Open an existing study".
//
// A .wat file is XML: WISN's lists ("dictionaries": countries, staff types,
// activities, units…) followed by <environment>, which holds every value typed
// into the study as <controlinfo id="…" value="…">. We start from a blank study
// saved by WISN (src/data/wisnTemplate.wat), add our staff types and activities
// to the lists, and add the values. Value ids, as WISN names them:
//   SpGr{staff} / Sal{staff}    staff type ticked / annual salary
//   IndF0..F6Sp{staff}          working days/week, hours/day, annual leave,
//                               public holidays, sick leave, special leave, training days
//   Act{activity} / AS{activity} number per year / service standard (minutes per unit)
//   ES{staff} / TSR{staff}      existing staff / total staff requirement
// CAS and IAS rows go in the "customActivities" list.

import { ResearchSurvey, SurveyResponse } from '../types';
import { HO2Indicator } from '../data/ho2WorkloadData';
import { AwtInputs, WISN_CADRE_CONFIGS, calculateWhoWisnModels, readAwtInputs } from './wisnCalculations';

export interface WisnExportActivity {
  name: string;
  /** Shown in WISN as "min/<unit>". */
  unit: string;
  perYear: number;
  /** Minutes per unit. */
  standardMins: number;
}

export interface WisnExportCadre {
  name: string;
  /** WISN staff category, e.g. "NURSES". Created if WISN doesn't have it. */
  category: string;
  salary: number;
  awt: AwtInputs;
  activities: WisnExportActivity[];
  casPercent: number;
  iasHoursYear: number;
  existingStaff: number;
  requiredStaff: number;
}

export interface WisnExportStudy {
  institutionName: string;
  country: string;
  institutionType: string;
  institutionDescription: string;
  propertyType: string;
  cadres: WisnExportCadre[];
}

// WISN codes for CAS/IAS units, as WISN saved them.
const UNIT_MINS_PER_DAY = '480';
const UNIT_HOURS_PER_YEAR = '1920';

const CADRE_CATEGORIES: Record<string, string> = {
  'Medical Assistant / Doctor': 'MEDICAL PRACTITIONERS',
  'Secondary Nurse': 'NURSES',
  'Secondary Midwife': 'MIDWIVES',
  'Lab Technician': 'LABORATORY STAFF',
  'Secondary Pharmacist': 'PHARMACY STAFF',
  'Ambulance Driver': 'SUPPORT STAFF',
  'Cleaner': 'SUPPORT STAFF',
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Collects what the WISN calculator shows into the shape of a WISN study. */
export function prepareWisnStudy(
  responses: SurveyResponse[],
  survey: ResearchSurvey,
  indicators: HO2Indicator[],
  staffOverrides: Record<string, number>
): WisnExportStudy {
  const models = calculateWhoWisnModels(responses, survey, indicators, staffOverrides);

  const cadres = WISN_CADRE_CONFIGS.map((cfg): WisnExportCadre => {
    const model = models.find((m) => m.cadre === cfg.cadre)!;

    // Average each working-time answer over this cadre's respondents.
    const own = responses.filter((r) => (r.cadre || 'Other') === cfg.cadre).map(readAwtInputs);
    const fallback = readAwtInputs({ answers: {} } as SurveyResponse);
    const avg = (key: keyof AwtInputs) =>
      own.length ? round2(own.reduce((sum, a) => sum + a[key], 0) / own.length) : fallback[key];
    const awt: AwtInputs = {
      daysPerWeek: avg('daysPerWeek'),
      hoursPerDay: avg('hoursPerDay'),
      annualLeave: avg('annualLeave'),
      holidays: avg('holidays'),
      sickLeave: avg('sickLeave'),
      specialLeave: avg('specialLeave'),
      trainingDays: avg('trainingDays'),
    };

    const activities = cfg.indicatorIds
      .map((id) => indicators.find((i) => i.id === id))
      .filter((i): i is HO2Indicator => !!i)
      .map((i) => ({
        name: i.nameEn,
        unit: i.unitEn.replace(/\/\s*year$/i, '').trim() || 'case',
        perYear: i.currentCases,
        standardMins: i.defaultAstMins,
      }));

    return {
      name: cfg.cadre,
      category: CADRE_CATEGORIES[cfg.cadre] || 'SUPPORT STAFF',
      salary: 0,
      awt,
      activities,
      // The calculator caps CAS at 50% when working out CAF.
      casPercent: Math.min(50, model.casPercentage),
      iasHoursYear: model.iasHoursYear,
      existingStaff: model.actualStaff,
      requiredStaff: model.requiredStaff,
    };
  });

  return {
    institutionName: survey.hospitalNameEn || survey.hospitalNameKm || '',
    country: 'Cambodia',
    institutionType: 'Hospital/Bedded Institution',
    institutionDescription: 'Provincial (general) hospital',
    propertyType: 'Public',
    cadres,
  };
}

// ---------- XML text helpers ----------

const esc = (s: string | number) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function dictRange(xml: string, dictId: string): [number, number] {
  const start = xml.indexOf(`<dictionary id="${dictId}"`);
  if (start < 0) throw new Error(`WISN template has no "${dictId}" list`);
  const end = xml.indexOf('</dictionary>', start);
  return [start, end];
}

interface DictElement {
  id: string;
  name: string;
  values: Record<string, string>;
}

function readElements(xml: string, dictId: string): DictElement[] {
  const [start, end] = dictRange(xml, dictId);
  const block = xml.slice(start, end);
  const out: DictElement[] = [];
  const re = /<element id="([^"]*)" name="([^"]*)"\s*(\/>|>([\s\S]*?)<\/element>)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) {
    const values: Record<string, string> = {};
    const vre = /<value key="([^"]*)" value="([^"]*)"/g;
    let v: RegExpExecArray | null;
    while ((v = vre.exec(m[4] || ''))) values[v[1]] = v[2];
    out.push({ id: m[1], name: m[2], values });
  }
  return out;
}

const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function nextId(xml: string, dictId: string): number {
  const ids = readElements(xml, dictId).map((e) => Number(e.id)).filter((n) => !isNaN(n));
  return ids.length ? Math.max(...ids) + 1 : 0;
}

function addElements(xml: string, dictId: string, elements: string[]): string {
  if (!elements.length) return xml;
  const [start, end] = dictRange(xml, dictId);
  let block = xml.slice(start, end);
  const body = elements.map((e) => `        ${e}\r\n`).join('');
  if (block.includes('<elements />')) {
    block = block.replace('<elements />', `<elements>\r\n${body}      </elements>`);
  } else {
    // Insert as new lines just above the "</elements>" line.
    const close = block.lastIndexOf('</elements>');
    const lineStart = block.lastIndexOf('\n', close) + 1;
    block = block.slice(0, lineStart) + body + block.slice(lineStart);
  }
  return xml.slice(0, start) + block + xml.slice(end);
}

function element(id: number | string, name: string, values: Record<string, string | number>): string {
  const inner = Object.entries(values)
    .map(([k, v]) => `<value key="${esc(k)}" value="${esc(v)}" />`)
    .join('');
  return `<element id="${esc(id)}" name="${esc(name)}">${inner}</element>`;
}

function setCombo(xml: string, controlId: string, value: string, title: string): string {
  const re = new RegExp(`(<controlinfo [^>]*?)value="[^"]*" title="[^"]*"( id="${controlId}")`);
  if (!re.test(xml)) throw new Error(`WISN template has no "${controlId}" field`);
  return xml.replace(re, `$1value="${esc(value)}" title="${esc(title)}"$2`);
}

function control(id: string, value: string | number, expression = ''): string {
  return (
    `    <controlinfo datasource="" valueexpression="" titleexpression="" filterexpression="" ` +
    `selctedelemid="" value="${esc(value)}" title="" id="${id}" getvalueexpression="${esc(expression)}">\r\n` +
    `      <dependences />\r\n    </controlinfo>\r\n`
  );
}

function findId(xml: string, dictId: string, name: string, where?: [string, string]): string | undefined {
  return readElements(xml, dictId).find(
    (e) =>
      decode(e.name).trim().toLowerCase() === name.trim().toLowerCase() &&
      (!where || e.values[where[0]] === where[1])
  )?.id;
}

/** Returns the .wat file text for `study`, built on WISN's blank study `template`. */
export function buildWisnStudyXml(template: string, study: WisnExportStudy): string {
  let xml = template.replace(/^﻿/, '');
  const controls: string[] = [];

  // Facility properties
  const countryId = findId(xml, 'country', study.country);
  if (countryId) xml = setCombo(xml, 'countryCombo', countryId, study.country);
  const typeId = findId(xml, 'institution_type', study.institutionType) ?? '0';
  xml = setCombo(xml, 'institutionTypeCombo', typeId, study.institutionType);
  const descId = findId(xml, 'institution_description', study.institutionDescription, ['type', typeId]);
  if (descId) xml = setCombo(xml, 'institutionDescriptionCombo', descId, study.institutionDescription);
  const propId = findId(xml, 'property_type', study.propertyType);
  if (propId) xml = setCombo(xml, 'propertyTypeCombo', propId, study.propertyType);
  xml = xml.replace(
    /(<controlinfo [^>]*?)value="[^"]*"( title="[^"]*" id="institutionName")/,
    `$1value="${esc(study.institutionName)}"$2`
  );

  // Staff categories and staff types
  const newCategories: string[] = [];
  let categoryNext = nextId(xml, 'specialists_category');
  const categoryIds: Record<string, string> = {};
  for (const c of study.cadres) {
    if (categoryIds[c.category]) continue;
    const existing = findId(xml, 'specialists_category', c.category, ['institution_type', typeId]);
    if (existing) {
      categoryIds[c.category] = existing;
    } else {
      categoryIds[c.category] = String(categoryNext);
      newCategories.push(element(categoryNext++, c.category, { institution_type: typeId }));
    }
  }
  xml = addElements(xml, 'specialists_category', newCategories);

  let staffNext = nextId(xml, 'specialists_group');
  const staffIds = study.cadres.map(() => staffNext++);
  xml = addElements(
    xml,
    'specialists_group',
    study.cadres.map((c, i) => element(staffIds[i], c.name, { specialists_category: categoryIds[c.category] }))
  );

  // Units for workload activities ("min/<unit>")
  const unitIds: Record<string, string> = {};
  let unitNext = nextId(xml, 'units');
  const newUnits: string[] = [];
  for (const a of study.cadres.flatMap((c) => c.activities)) {
    const name = `min/${a.unit}`;
    if (unitIds[name]) continue;
    const existing = findId(xml, 'units', name);
    if (existing) {
      unitIds[name] = existing;
    } else {
      unitIds[name] = String(unitNext);
      newUnits.push(element(unitNext++, name, { name }));
    }
  }
  xml = addElements(xml, 'units', newUnits);

  // Workload activities
  let activityNext = nextId(xml, 'activities');
  const newActivities: string[] = [];
  const customRows: string[] = [];
  let customNext = Math.max(1, nextId(xml, 'customActivities'));

  study.cadres.forEach((c, i) => {
    const staff = staffIds[i];
    controls.push(control(`SpGr${staff}`, 'true'), control(`Sal${staff}`, c.salary));

    const a = c.awt;
    [a.daysPerWeek, a.hoursPerDay, a.annualLeave, a.holidays, a.sickLeave, a.specialLeave, a.trainingDays].forEach(
      (v, k) => controls.push(control(`IndF${k}Sp${staff}`, v))
    );
    const f = (k: string) => `@IndF${k}Sp${staff}.Value`;
    controls.push(
      control(`IndF7Sp${staff}`, '', `${f('2')} + ${f('3')} + ${f('4')} + ${f('5')} + ${f('6')}`),
      control(`IndF8Sp${staff}`, '', `${f('7')} / ${f('0')}`),
      control(`IndF9Sp${staff}`, '', `52 - ${f('8')}`),
      control(`IndFASp${staff}`, '', `${f('9')} * ${f('0')}`),
      control(`IndFBSp${staff}`, '', `${f('A')} * ${f('1')}`)
    );

    for (const act of c.activities) {
      const id = activityNext++;
      newActivities.push(
        element(id, act.name, {
          spec_group: staff,
          unit: unitIds[`min/${act.unit}`],
          function: '',
          isSystem: 'True',
        })
      );
      controls.push(control(`Act${id}`, act.perYear), control(`AS${id}`, act.standardMins));
    }

    // CAS as minutes per working day, so WISN shows the same % of work time.
    if (c.casPercent > 0) {
      customRows.push(
        element(customNext++, 'Support activities (CAS from survey)', {
          staff,
          isRelated: 'true',
          unit: UNIT_MINS_PER_DAY,
          name: 'Support activities (CAS from survey)',
          value: round2((c.casPercent / 100) * c.awt.hoursPerDay * 60),
        })
      );
    }
    if (c.iasHoursYear > 0) {
      customRows.push(
        element(customNext++, 'Individual activities (IAS from survey)', {
          staff,
          isRelated: 'false',
          unit: UNIT_HOURS_PER_YEAR,
          name: 'Individual activities (IAS from survey)',
          noOfStaffAllocated: 1,
          value: c.iasHoursYear,
        })
      );
    }

    controls.push(control(`TSR${staff}`, c.requiredStaff), control(`ES${staff}`, c.existingStaff));
  });

  xml = addElements(xml, 'activities', newActivities);
  xml = addElements(xml, 'customActivities', customRows);

  const envEnd = xml.lastIndexOf('</environment>');
  if (envEnd < 0) throw new Error('WISN template has no <environment>');
  const lineStart = xml.lastIndexOf('\n', envEnd) + 1;
  xml = xml.slice(0, lineStart) + controls.join('') + xml.slice(lineStart);

  return '﻿' + xml;
}

/** Builds the study and downloads it as a .wat file. */
export async function downloadWisnStudy(
  responses: SurveyResponse[],
  survey: ResearchSurvey,
  indicators: HO2Indicator[],
  staffOverrides: Record<string, number>
): Promise<void> {
  const { default: template } = await import('../data/wisnTemplate.wat?raw');
  const study = prepareWisnStudy(responses, survey, indicators, staffOverrides);
  const xml = buildWisnStudyXml(template, study);

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `WISN-Study-${date}.wat`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
