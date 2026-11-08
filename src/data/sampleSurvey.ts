import { ResearchSurvey, SurveyResponse } from '../types';

export const initialSampleSurvey: ResearchSurvey = {
  id: 'wisn-rh-stung-trang-2026',
  titleKm: 'ការសិក្សាអំពីតម្រូវការធនធានមនុស្សនៅមន្ទីរពេទ្យបង្អែក ហ៊ុនសែនស្ទឹងត្រង់ ដោយប្រើឧបករណ៍ (WISN)',
  titleEn: 'Workload Indicators of Staffing Need (WISN) Assessment at Hun Sen Stung Trang Referral Hospital',
  objectiveKm: 'ដើម្បីកំណត់បន្ទុកការងារជាក់ស្តែង គណនាពេលវេលាបំពេញការងារដែលមាន (AWT) និងកំណត់ស្តង់ដារពេលវេលា (Activity Standards) ក្នុងការប៉ាន់ប្រមាណតម្រូវការបុគ្គលិកសុខាភិបាលតាមផ្នែកនីមួយៗ ស្របតាមវិធីសាស្ត្រ WISN របស់អង្គការសុខភាពពិភពលោក (WHO)។',
  objectiveEn: 'To assess the actual workload, determine Available Working Time (AWT), define service standards, and estimate required health cadres at Hun Sen Stung Trang Referral Hospital using the WHO WISN methodology.',
  leadResearcherKm: 'ក្រុមការងារស្រាវជ្រាវ WISN - វិទ្យាស្ថានជាតិសុខភាពសាធារណៈ (NIPH)',
  leadResearcherEn: 'WISN Research Team - National Institute of Public Health (NIPH)',
  institutionKm: 'វិទ្យាស្ថានជាតិសុខភាពសាធារណៈ (NIPH) សហការជាមួយ មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់',
  institutionEn: 'National Institute of Public Health (NIPH) in collaboration with Hun Sen Stung Trang Referral Hospital',
  hospitalNameKm: 'មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់ ខេត្តកំពង់ចាម',
  hospitalNameEn: 'Hun Sen Stung Trang Referral Hospital, Kampong Cham Province',
  consentNoticeKm: 'ការស្ទង់មតិនេះធ្វើឡើងក្នុងគោលបំណងវាយតម្លៃបន្ទុកការងារជាក់ស្តែង និងស្វែងរកតម្រូវការបុគ្គលិកបន្ថែមនៅមន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់។ រាល់ចម្លើយ និងទិន្នន័យផ្ទាល់ខ្លួនរបស់លោក/លោកស្រីនឹងត្រូវបានរក្សាការសម្ងាត់កម្រិតខ្ពស់ និងប្រើប្រាស់តែក្នុងក្របខ័ណ្ឌសិក្សាស្រាវជ្រាវ WISN ប៉ុណ្ណោះ។',
  consentNoticeEn: 'This assessment is conducted to determine the real workload and staffing requirements at Hun Sen Stung Trang Referral Hospital. All individual staff data will remain strictly confidential and solely utilized for scientific WISN workforce planning.',
  createdAt: '2026-09-21T08:00:00.000Z',
  updatedAt: '2026-11-07T16:00:00.000Z',
  sections: [
    {
      id: 'sec-staff-info',
      titleKm: 'ផ្នែកទី ១៖ ព័ត៌មានទូទៅ និងពេលវេលាបំពេញការងារ (AWT Parameters)',
      titleEn: 'Section 1: Staff Profile & Available Working Time (AWT)',
      descriptionKm: 'ព័ត៌មានសម្គាល់បុគ្គលិក មុខតំណែង ផ្នែកបម្រើការងារ និងទិន្នន័យគណនា AWT (ថ្ងៃធ្វើការ ថ្ងៃសម្រាក ច្បាប់ឈឺ)',
      descriptionEn: 'Staff identification, cadre, primary department, dual roles, and annual working time metrics',
      questionIds: [
        'interview_date',
        'interviewer_id',
        'staff_code',
        'staff_name',
        'staff_phone',
        'gender',
        'employment_status',
        'cadre',
        'primary_department',
        'has_second_dept',
        'second_department',
        'dept_time_split',
        'work_experience',
        'awt_days_week',
        'awt_hours_day',
        'awt_annual_leave',
        'awt_holidays',
        'awt_sick_leave',
        'awt_special_leave',
        'awt_training_days'
      ]
    },
    // New Department 1: ផ្នែកពិនិត្យជំងឺក្រៅសម្ភព និងរោគស្ត្រី (OPD OB/GYN)
    {
      id: 'sec-g-opd-obgyn',
      titleKm: 'ក្រុម៖ ផ្នែកពិគ្រោះជំងឺក្រៅសម្ភព និងរោគស្ត្រី (OPD OB/GYN Clinic)',
      titleEn: 'Group: Outpatient Obstetrics & Gynecology Clinic',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Antenatal care, family planning, cervical cancer screening, and gynecological consultations',
      deptCode: 'opd_obgyn',
      questionIds: [
        'opd_gyn_anc_time',
        'opd_gyn_anc_follow_time',
        'opd_gyn_echo_time',
        'opd_gyn_via_time',
        'opd_gyn_cryo_time',
        'opd_gyn_fp_inject_time',
        'opd_gyn_fp_implant_time',
        'opd_gyn_fp_iud_time',
        'opd_gyn_fp_oral_time',
        'opd_gyn_consult_time',
        'opd_gyn_pnc_time',
        'opd_gyn_cac_pac_time',
        'opd_gyn_morning_meet',
        'opd_gyn_ipc_time',
        'opd_gyn_room_prep',
        'opd_gyn_daily_stock',
        'opd_gyn_handover_time',
        'opd_gyn_logbook_time',
        'opd_gyn_hcis_entry',
        'opd_gyn_monthly_rep_time',
        'opd_gyn_drug_order',
        'opd_gyn_maternal_committee'
      ]
    },
    // New Department 2: ផ្នែកភ្នែក (Eye Clinic / Ophthalmology)
    {
      id: 'sec-g-eye',
      titleKm: 'ក្រុម៖ ផ្នែកភ្នែក (Eye Clinic / Ophthalmology)',
      titleEn: 'Group: Eye Clinic / Ophthalmology',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'General eye examination, visual acuity, slit-lamp tonometry, foreign body removal, and cataract screening',
      deptCode: 'eye',
      questionIds: [
        'eye_consult_time',
        'eye_visual_acuity_time',
        'eye_slitlamp_time',
        'eye_tonometry_time',
        'eye_funduscopy_time',
        'eye_foreign_body_time',
        'eye_irrigation_time',
        'eye_cataract_screen_time',
        'eye_minor_surgery_time',
        'eye_refraction_time',
        'eye_morning_meet_time',
        'eye_equipment_clean_time',
        'eye_sterilization_time',
        'eye_daily_stock_time',
        'eye_logbook_time',
        'eye_hcis_entry_time',
        'eye_monthly_rep_time',
        'eye_drug_inventory_time',
        'eye_outreach_coordination'
      ]
    },
    // Group 1: OPD / ER
    {
      id: 'sec-g1-opd-er',
      titleKm: 'ក្រុមទី ១៖ ផ្នែកពិគ្រោះជំងឺក្រៅ (OPD) & សង្គ្រោះបន្ទាន់ (ER)',
      titleEn: 'Group 1: Outpatient Department (OPD) & Emergency Room (ER)',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for OPD/ER doctors, medical assistants, and nurses',
      deptCode: 'opd',
      questionIds: [
        'opd_consult_time',
        'opd_ncd_time',
        'er_resus_time',
        'er_poison_time',
        'er_traffic_suture_time',
        'opd_sti_time',
        'referral_escort_time',
        'nur_vital_cases',
        'nur_vital_time',
        'nur_inject_cases',
        'nur_inject_time',
        'nur_wound_cases',
        'nur_wound_time',
        'opd_morning_meet',
        'opd_ipc_clean',
        'opd_monthly_meet',
        'opd_attendance',
        'er_standby_night',
        'opd_logbook_time',
        'opd_referral_form',
        'opd_hef_nssf',
        'opd_drug_order',
        'opd_autoclave',
        'opd_ho2_rep',
        'opd_duty_roster'
      ]
    },
    // Group 2: Inpatient Wards
    {
      id: 'sec-g2-inpatient',
      titleKm: 'ក្រុមទី ២៖ ផ្នែកជំងឺទូទៅ & ជំងឺកុមារ & របេង (Inpatient Wards)',
      titleEn: 'Group 2: Inpatient Wards (General Medicine, Pediatrics & TB)',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for General Medicine, Pediatrics, and TB wards',
      deptCode: 'ipd',
      questionIds: [
        'ipd_ward_round',
        'tb_inpatient_dots',
        'ipd_admission_cases',
        'ipd_admission_time',
        'ped_diarrhea_cases',
        'ped_diarrhea_time',
        'ped_pneumonia_cases',
        'ped_pneumonia_time',
        'ipd_dengue_cases',
        'ipd_dengue_time',
        'ped_sam_cases',
        'ped_sam_time',
        'ipd_inject_cases',
        'ipd_inject_time',
        'ipd_health_edu_cases',
        'ipd_health_edu_time',
        'ipd_discharge_sum',
        'ipd_handover',
        'ipd_ward_ipc',
        'ipd_attendance',
        'ipd_monthly_meet',
        'ipd_standby_night',
        'ipd_register_book',
        'ipd_drug_indent',
        'ipd_daily_census',
        'ipd_pmrs_archiving',
        'ipd_monthly_ho2',
        'tb_monthly_rep'
      ]
    },
    // Group 3: Maternity & GYN Ward
    {
      id: 'sec-g3-maternity',
      titleKm: 'ក្រុមទី ៣៖ ផ្នែកសម្ភព និងរោគស្ត្រីសម្រាកពេទ្យ (Maternity Ward & Delivery Room)',
      titleEn: 'Group 3: Maternity Inpatient Ward & Labor Room',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for midwives and obstetric staff',
      deptCode: 'maternity',
      questionIds: [
        'mat_normal_deliv_time',
        'mat_vacuum_deliv_time',
        'mat_skin_to_skin_time',
        'mat_neo_resus_time',
        'mat_pph_time',
        'mat_pnc_time',
        'mat_mva_time',
        'mat_fp_time',
        'mat_via_time',
        'mat_anc_cases',
        'mat_anc_time',
        'mat_partograph_cases',
        'mat_partograph_time',
        'mat_episiotomy_cases',
        'mat_episiotomy_time',
        'mat_handover',
        'mat_ipc_clean',
        'mat_attendance',
        'mat_monthly_meet',
        'mat_standby_night',
        'mat_birth_log',
        'mat_sterilize_packs',
        'mat_supply_order',
        'mat_ho2_entry',
        'mat_mmr_audit'
      ]
    },
    // Group 4: Laboratory
    {
      id: 'sec-g4-lab',
      titleKm: 'ក្រុមទី ៤៖ ផ្នែកមន្ទីរពិសោធន៍ (Laboratory)',
      titleEn: 'Group 4: Laboratory Department',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for lab technicians',
      deptCode: 'lab',
      questionIds: [
        'lab_cbc_run_time',
        'lab_malaria_smear_time',
        'lab_malaria_rdt_time',
        'lab_afb_smear_time',
        'lab_blood_draw_cases',
        'lab_blood_draw_time',
        'lab_serology_cases',
        'lab_serology_time',
        'lab_urinalysis_cases',
        'lab_urinalysis_time',
        'lab_release_cases',
        'lab_result_release_time',
        'lab_daily_qc_time',
        'lab_biosafety_time',
        'lab_handover_time',
        'lab_attendance_time',
        'lab_standby_night',
        'lab_camlis_entry_time',
        'lab_register_book_time',
        'lab_hep_rep_time',
        'lab_tb_rep_time',
        'lab_hiv_rep_time',
        'lab_stock_bincard_time'
      ]
    },
    // Group 5: Imaging, Physio, Dental
    {
      id: 'sec-g5-imaging-physio-dental',
      titleKm: 'ក្រុមទី ៥៖ ផ្នែករូបភាពវេជ្ជសាស្ត្រ & ព្យាបាលដោយចលនា & មាត់ធ្មេញ',
      titleEn: 'Group 5: Imaging, Physiotherapy & Dental Clinic',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for radiology, physio, and dental staff',
      deptCode: 'imaging',
      questionIds: [
        'img_xray_time',
        'img_echo_time',
        'phy_exercise_time',
        'den_extract_time',
        'img_ecg_cases',
        'img_ecg_time',
        'den_consult_cases',
        'den_consult_time',
        'den_filling_cases',
        'den_filling_time',
        'img_den_clean_time',
        'img_den_attendance',
        'img_standby_night',
        'den_sterilize_time',
        'img_den_ho2_rep',
        'img_den_consumables'
      ]
    },
    // Group 6: Pharmacy
    {
      id: 'sec-g6-pharmacy',
      titleKm: 'ក្រុមទី ៦៖ ផ្នែកឱសថស្ថាន និងឃ្លាំងឱសថ (Pharmacy & Warehouse)',
      titleEn: 'Group 6: Pharmacy & Warehouse',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for pharmacists and assistants',
      deptCode: 'pharmacy',
      questionIds: [
        'pha_rx_check_cases',
        'pha_rx_check_time',
        'pha_dispense_cases',
        'pha_dispense_time',
        'pha_counsel_cases',
        'pha_counsel_time',
        'pha_ward_dist_time',
        'pha_clean_shelf_time',
        'pha_temp_check_time',
        'pha_attendance_time',
        'pha_prepack_time',
        'pha_daily_drug_sum',
        'pha_bincard_time',
        'pha_stocking_time',
        'pha_financial_rep',
        'pha_expiry_rep'
      ]
    },
    // Group 7: Admin & Finance
    {
      id: 'sec-g7-admin',
      titleKm: 'ក្រុមទី ៧៖ ផ្នែករដ្ឋបាល-គណនេយ្យ-បុគ្គលិក-ព័ត៌មានវិទ្យា (Admin/Finance/IT)',
      titleEn: 'Group 7: Admin, Finance, Accounting & IT',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for administrative and finance officers',
      deptCode: 'admin',
      questionIds: [
        'acc_cashier_time',
        'hef_verify_time',
        'acc_receipt_cases',
        'acc_receipt_time',
        'hef_pre_id_cases',
        'hef_pre_id_time',
        'adm_meeting_time',
        'adm_attendance_time',
        'acc_daily_cash_close',
        'acc_fm20_entry_time',
        'acc_bank_recon_time',
        'hef_pmrs_entry_time',
        'it_troubleshoot_time',
        'acc_mission_claim_time',
        'adm_grievance_comm_time'
      ]
    },
    // Group 8: General Support
    {
      id: 'sec-g8-support',
      titleKm: 'ក្រុមទី ៨៖ ផ្នែកគាំទ្រទូទៅ (អ្នកបើកបរ, ដាំស្ល, អនាម័យ, សន្តិសុខ)',
      titleEn: 'Group 8: General Support (Driver, Cook, Cleaner, Security)',
      descriptionKm: 'បែងចែកជា៖ ១.ការងារស្នូល (Core) | ២.ការងារគាំទ្រ (CAS) | ៣.ការងាររដ្ឋបាល (IAS)',
      descriptionEn: 'Workload standards for operational support personnel',
      deptCode: 'support',
      questionIds: [
        'drv_kampong_cham_trips',
        'drv_kampong_cham_time',
        'drv_hc_pickup_trips',
        'drv_hc_pickup_time',
        'drv_corpse_trips',
        'drv_corpse_time',
        'cok_market_time',
        'cok_cooking_time',
        'cok_distribute_time',
        'cln_ward_mop_time',
        'cln_toilet_time',
        'cln_waste_time',
        'sec_guarding_mins',
        'drv_maint_time',
        'cok_dishwash_time',
        'cln_campus_sweep_time',
        'sup_attendance_time',
        'drv_standby_mins',
        'drv_logbook_time',
        'drv_fuel_req_time',
        'cln_incinerator_time',
        'cok_food_exp_time',
        'cln_laundry_time'
      ]
    }
  ],
  questions: [
    // Staff & AWT Profile
    {
      id: 'interview_date',
      type: 'text',
      titleKm: 'កាលបរិច្ឆេទសម្ភាសន៍',
      titleEn: 'Interview Date',
      descriptionKm: 'ថ្ងៃខែឆ្នាំសម្ភាសន៍',
      required: true,
      category: 'Profile'
    },
    {
      id: 'interviewer_id',
      type: 'text',
      titleKm: 'កូដអ្នកសម្ភាសន៍ (Interviewer ID)',
      titleEn: 'Interviewer ID',
      placeholderKm: 'ឧទាហរណ៍៖ INT-01 ឬ K001',
      required: true,
      category: 'Profile'
    },
    {
      id: 'staff_code',
      type: 'text',
      titleKm: 'កូដសម្គាល់បុគ្គលិក (Staff ID)',
      titleEn: 'Staff ID',
      placeholderKm: 'ឧទាហរណ៍៖ ST-01 ដល់ ST-50',
      required: true,
      category: 'Profile'
    },
    {
      id: 'staff_name',
      type: 'text',
      titleKm: 'ឈ្មោះបុគ្គលិក (ជាជម្រើស/Optional)',
      titleEn: 'Staff Name (Optional)',
      placeholderKm: 'អាចបំពេញ ឬមិនបំពេញដើម្បីរក្សាការសម្ងាត់',
      required: false,
      category: 'Profile'
    },
    {
      id: 'staff_phone',
      type: 'text',
      titleKm: 'លេខទូរស័ព្ទបុគ្គលិក (Phone Number)',
      titleEn: 'Staff Phone Number',
      placeholderKm: 'ឧ. 012 345 678',
      required: false,
      category: 'Profile'
    },
    {
      id: 'gender',
      type: 'single_choice',
      titleKm: '១. ភេទរបស់បុគ្គលិក',
      titleEn: 'Staff Gender',
      required: true,
      category: 'Profile',
      options: [
        { id: 'opt-gen-m', labelKm: 'ប្រុស (Male)', labelEn: 'Male', value: 'Male' },
        { id: 'opt-gen-f', labelKm: 'ស្រី (Female)', labelEn: 'Female', value: 'Female' }
      ]
    },
    {
      id: 'employment_status',
      type: 'single_choice',
      titleKm: '២. ស្ថានភាពការងារ',
      titleEn: 'Employment Status',
      required: true,
      category: 'Profile',
      options: [
        { id: 'opt-st1', labelKm: 'មន្ត្រីរាជការពេញសិទ្ធិ (Civil Servant)', labelEn: 'Civil Servant', value: 'Civil Servant' },
        { id: 'opt-st2', labelKm: 'បុគ្គលិកកិច្ចសន្យា (Contract Staff)', labelEn: 'Contract Staff', value: 'Contract' },
        { id: 'opt-st3', labelKm: 'បុគ្គលិកជួល (Hired Staff)', labelEn: 'Hired Staff', value: 'Hired' },
        { id: 'opt-st4', labelKm: 'បុគ្គលិកស្ម័គ្រចិត្ត (Volunteer Staff)', labelEn: 'Volunteer Staff', value: 'Volunteer' }
      ]
    },
    {
      id: 'cadre',
      type: 'single_choice',
      titleKm: '៣. មុខតំណែង/ជំនាញវិជ្ជាជីវៈ (Cadre)',
      titleEn: 'Professional Cadre',
      required: true,
      category: 'Profile',
      options: [
        { id: 'opt-c-doc', labelKm: 'វេជ្ជបណ្ឌិត (Medical Doctor)', labelEn: 'Medical Doctor', value: 'Medical Doctor' },
        { id: 'opt-c-mda', labelKm: 'គ្រូពេទ្យមធ្យម (Medical Assistant)', labelEn: 'Medical Assistant', value: 'Medical Assistant' },
        { id: 'opt-c-nur', labelKm: 'គិលានុបដ្ឋាយិកាមធ្យម (Secondary Nurse)', labelEn: 'Secondary Nurse', value: 'Secondary Nurse' },
        { id: 'opt-c-mid', labelKm: 'ឆ្មបមធ្យម (Secondary Midwife)', labelEn: 'Secondary Midwife', value: 'Secondary Midwife' },
        { id: 'opt-c-den', labelKm: 'ទន្តគិលានុបដ្ឋាយិកាមធ្យម (Dental Nurse)', labelEn: 'Dental Nurse', value: 'Dental Nurse' },
        { id: 'opt-c-pha', labelKm: 'ឱសថមធ្យម (Secondary Pharmacist)', labelEn: 'Secondary Pharmacist', value: 'Secondary Pharmacist' },
        { id: 'opt-c-pas', labelKm: 'ជំនួយការបើកថ្នាំ (Pharmacy Assistant)', labelEn: 'Pharmacy Assistant', value: 'Pharmacy Assistant' },
        { id: 'opt-c-lab', labelKm: 'មន្ទីរពិសោធន៍មធ្យម (Lab Technician)', labelEn: 'Lab Technician', value: 'Lab Technician' },
        { id: 'opt-c-phy', labelKm: 'ព្យាបាលដោយចលនា (Physiotherapist)', labelEn: 'Physiotherapist', value: 'Physiotherapist' },
        { id: 'opt-c-img', labelKm: 'វិទ្យាសាស្ត្រ/រូបភាពវេជ្ជសាស្ត្រ (Imaging Tech)', labelEn: 'Imaging Technician', value: 'Imaging Tech' },
        { id: 'opt-c-acc', labelKm: 'គណនេយ្យ (Accountant)', labelEn: 'Accountant', value: 'Accountant' },
        { id: 'opt-c-hef', labelKm: 'មូលនិធិសមធម៌ (HEF Officer)', labelEn: 'HEF Officer', value: 'HEF Officer' },
        { id: 'opt-c-drv', labelKm: 'អ្នកបើកបររថយន្តសង្គ្រោះ (Ambulance Driver)', labelEn: 'Ambulance Driver', value: 'Ambulance Driver' },
        { id: 'opt-c-cok', labelKm: 'អ្នកដាំស្ល (Hospital Cook)', labelEn: 'Hospital Cook', value: 'Hospital Cook' },
        { id: 'opt-c-sec', labelKm: 'សន្តិសុខ (Security Guard)', labelEn: 'Security Guard', value: 'Security Guard' },
        { id: 'opt-c-cln', labelKm: 'អ្នកអនាម័យ (Cleaner)', labelEn: 'Cleaner', value: 'Cleaner' }
      ]
    },
    {
      id: 'primary_department',
      type: 'single_choice',
      titleKm: '៤. ផ្នែកដែលកំពុងបម្រើការងារចម្បង (Primary Department)',
      titleEn: 'Primary Department',
      descriptionKm: 'ផ្នែកដែលលោក/លោកស្រីចំណាយពេលធ្វើការច្រើនជាងគេ',
      required: true,
      category: 'Profile',
      options: [
        { id: 'opt-d-opd', labelKm: 'ផ្នែកពិគ្រោះជំងឺក្រៅ (OPD)', labelEn: 'Outpatient (OPD)', value: 'OPD' },
        { id: 'opt-d-er', labelKm: 'ផ្នែកសង្គ្រោះបន្ទាន់ (Emergency Room)', labelEn: 'Emergency Room (ER)', value: 'Emergency Room' },
        { id: 'opt-d-opd-obgyn', labelKm: 'ផ្នែកពិនិត្យជំងឺក្រៅសម្ភព និងរោគស្ត្រី (OPD OB/GYN)', labelEn: 'OPD OB/GYN Clinic', value: 'OPD OB/GYN' },
        { id: 'opt-d-eye', labelKm: 'ផ្នែកភ្នែក (Eye Clinic / Ophthalmology)', labelEn: 'Eye Clinic', value: 'Eye Clinic' },
        { id: 'opt-d-ipd-gm', labelKm: 'ផ្នែកជំងឺទូទៅមនុស្សចាស់ (General Medicine Ward)', labelEn: 'General Medicine Ward', value: 'General Medicine Ward' },
        { id: 'opt-d-ipd-ped', labelKm: 'ផ្នែកជំងឺកុមារ (Pediatrics Ward)', labelEn: 'Pediatrics Ward', value: 'Pediatrics Ward' },
        { id: 'opt-d-ipd-obgyn', labelKm: 'ផ្នែកសម្ភព និងរោគស្ត្រីសម្រាកពេទ្យ (Maternity Ward)', labelEn: 'Maternity Ward', value: 'Maternity Ward' },
        { id: 'opt-d-tb', labelKm: 'ផ្នែកជំងឺរបេង (TB Ward)', labelEn: 'TB Ward', value: 'TB Ward' },
        { id: 'opt-d-lab', labelKm: 'ផ្នែកមន្ទីរពិសោធន៍ (Laboratory)', labelEn: 'Laboratory', value: 'Laboratory' },
        { id: 'opt-d-pha', labelKm: 'ផ្នែកឱសថស្ថាន និងឃ្លាំងឱសថ (Pharmacy)', labelEn: 'Pharmacy', value: 'Pharmacy' },
        { id: 'opt-d-img', labelKm: 'ផ្នែករូបភាពវេជ្ជសាស្ត្រ (Imaging: X-Ray & Ultrasound)', labelEn: 'Imaging (X-Ray & Ultrasound)', value: 'Imaging' },
        { id: 'opt-d-den', labelKm: 'ផ្នែកសុខភាពមាត់ធ្មេញ (Dental Clinic)', labelEn: 'Dental Clinic', value: 'Dental Clinic' },
        { id: 'opt-d-phy', labelKm: 'ផ្នែកព្យាបាលដោយចលនា (Physiotherapy)', labelEn: 'Physiotherapy', value: 'Physiotherapy' },
        { id: 'opt-d-adm', labelKm: 'ផ្នែករដ្ឋបាល-គណនេយ្យ-បុគ្គលិក-ព័ត៌មាន (Admin & Finance)', labelEn: 'Admin & Finance', value: 'Admin & Finance' },
        { id: 'opt-d-sup', labelKm: 'ផ្នែកគាំទ្រទូទៅ (អ្នកបើកបរ/ដាំស្ល/អនាម័យ/សន្តិសុខ)', labelEn: 'General Support', value: 'General Support' }
      ]
    },
    {
      id: 'has_second_dept',
      type: 'single_choice',
      titleKm: '៥. តើលោក/លោកស្រីបម្រើការងារនៅផ្នែកបន្ទាប់បន្សំផ្សេងទៀតដែរឬទេ? (Dual Role)',
      titleEn: 'Do you serve in secondary departments? (Dual Role)',
      required: true,
      category: 'Profile',
      options: [
        { id: 'opt-yn-y', labelKm: 'បាទ / ចាស (Yes)', labelEn: 'Yes', value: 'Yes' },
        { id: 'opt-yn-n', labelKm: 'ទេ (No)', labelEn: 'No', value: 'No' }
      ]
    },
    {
      id: 'second_department',
      type: 'multiple_choice',
      titleKm: 'ផ្នែកបន្ទាប់បន្សំ (Secondary Departments - អាចជ្រើសរើសបានច្រើនផ្នែក)',
      titleEn: 'Secondary Departments',
      descriptionKm: 'សូមធីកជ្រើសរើសផ្នែកទាំងអស់ដែលលោក/លោកស្រីជួយបំពេញការងារបន្ថែម',
      required: false,
      category: 'Profile',
      options: [
        { id: 'opt-sd-opd', labelKm: 'ផ្នែកពិគ្រោះជំងឺក្រៅ (OPD)', labelEn: 'OPD', value: 'OPD' },
        { id: 'opt-sd-er', labelKm: 'ផ្នែកសង្គ្រោះបន្ទាន់ (Emergency Room)', labelEn: 'ER', value: 'Emergency Room' },
        { id: 'opt-sd-opd-obgyn', labelKm: 'ផ្នែកពិនិត្យជំងឺក្រៅសម្ភព និងរោគស្ត្រី (OPD OB/GYN)', labelEn: 'OPD OB/GYN', value: 'OPD OB/GYN' },
        { id: 'opt-sd-eye', labelKm: 'ផ្នែកភ្នែក (Eye Clinic)', labelEn: 'Eye Clinic', value: 'Eye Clinic' },
        { id: 'opt-sd-gm', labelKm: 'ផ្នែកជំងឺទូទៅមនុស្សចាស់ (General Medicine Ward)', labelEn: 'General Medicine', value: 'General Medicine Ward' },
        { id: 'opt-sd-ped', labelKm: 'ផ្នែកជំងឺកុមារ (Pediatrics Ward)', labelEn: 'Pediatrics', value: 'Pediatrics Ward' },
        { id: 'opt-sd-obgyn', labelKm: 'ផ្នែកសម្ភព និងរោគស្ត្រីសម្រាកពេទ្យ (Maternity Ward)', labelEn: 'Maternity Ward', value: 'Maternity Ward' },
        { id: 'opt-sd-tb', labelKm: 'ផ្នែកជំងឺរបេង (TB Ward)', labelEn: 'TB Ward', value: 'TB Ward' },
        { id: 'opt-sd-lab', labelKm: 'ផ្នែកមន្ទីរពិសោធន៍ (Laboratory)', labelEn: 'Laboratory', value: 'Laboratory' },
        { id: 'opt-sd-pha', labelKm: 'ផ្នែកឱសថស្ថាន និងឃ្លាំងឱសថ (Pharmacy)', labelEn: 'Pharmacy', value: 'Pharmacy' },
        { id: 'opt-sd-adm', labelKm: 'ផ្នែករដ្ឋបាល-គណនេយ្យ-បុគ្គលិក-ព័ត៌មាន (Admin & Finance)', labelEn: 'Admin & Finance', value: 'Admin & Finance' }
      ]
    },
    {
      id: 'dept_time_split',
      type: 'text',
      titleKm: '៦. តើលោក/លោកស្រីបែងចែកពេលវេលាធ្វើការរវាងផ្នែកទាំងនោះយ៉ាងដូចម្តេច?',
      titleEn: 'How do you split your working time between departments?',
      placeholderKm: 'ឧ. ព្រឹកនៅ OPD រសៀលនៅ IPD ឬ ៧០% នៅសង្គ្រោះបន្ទាន់ ៣០% នៅកុមារ',
      required: false,
      category: 'Profile'
    },
    {
      id: 'work_experience',
      type: 'single_choice',
      titleKm: '៧. បទពិសោធន៍ការងារនៅមន្ទីរពេទ្យបង្អែកស្ទឹងត្រង់',
      titleEn: 'Work Experience at RH Stung Trang',
      required: true,
      category: 'Profile',
      options: [
        { id: 'opt-exp1', labelKm: 'តិចជាង ១ ឆ្នាំ (< 1 year)', labelEn: '< 1 year', value: '< 1 year' },
        { id: 'opt-exp2', labelKm: 'ចន្លោះពី ១ ទៅ ៥ ឆ្នាំ (1 - 5 years)', labelEn: '1 - 5 years', value: '1-5 years' },
        { id: 'opt-exp3', labelKm: 'ច្រើនជាង ៥ ឆ្នាំ (> 5 years)', labelEn: '> 5 years', value: '> 5 years' }
      ]
    },
    {
      id: 'awt_days_week',
      type: 'number',
      titleKm: '៨. តើលោក/លោកស្រីធ្វើការប៉ុន្មានថ្ងៃក្នុងមួយសប្តាហ៍?',
      titleEn: 'Working days per week',
      placeholderKm: 'ឧ. ៥ ឬ ៦ ថ្ងៃ',
      required: true,
      category: 'AWT'
    },
    {
      id: 'awt_hours_day',
      type: 'number',
      titleKm: '៩. តើលោក/លោកស្រីធ្វើការប៉ុន្មានម៉ោងក្នុងមួយថ្ងៃ?',
      titleEn: 'Working hours per day',
      placeholderKm: 'ឧ. ៨ ម៉ោង (ឬវេនយាម ២៤ម៉ោង)',
      required: true,
      category: 'AWT'
    },
    {
      id: 'awt_annual_leave',
      type: 'number',
      titleKm: '១០. ក្នុងមួយឆ្នាំ តើលោក/លោកស្រីឈប់សម្រាកប្រចាំឆ្នាំ (Annual Leave) ប៉ុន្មានថ្ងៃ?',
      titleEn: 'Annual Leave days per year',
      descriptionKm: 'ច្បាប់អនុញ្ញាត = ១៥ ថ្ងៃ',
      required: true,
      category: 'AWT'
    },
    {
      id: 'awt_holidays',
      type: 'number',
      titleKm: '១១. ចំនួនថ្ងៃឈប់សម្រាកបុណ្យជាតិប្រចាំឆ្នាំ (Public Holidays)',
      titleEn: 'Public Holidays days per year',
      descriptionKm: 'ស្តង់ដាររាជរដ្ឋាភិបាល = ២២ ថ្ងៃ',
      required: true,
      category: 'AWT'
    },
    {
      id: 'awt_sick_leave',
      type: 'number',
      titleKm: '១២. ក្នុងមួយឆ្នាំ តើលោក/លោកស្រីសុំច្បាប់ឈឺ (Sick Leave) ជាមធ្យមប៉ុន្មានថ្ងៃ?',
      titleEn: 'Sick Leave days per year',
      placeholderKm: 'ឧ. ០ ដល់ ៥ ថ្ងៃ',
      required: true,
      category: 'AWT'
    },
    {
      id: 'awt_special_leave',
      type: 'number',
      titleKm: '១៣. ក្នុងមួយឆ្នាំ តើមានការសុំច្បាប់ធុរៈផ្ទាល់ខ្លួន (Special Leave) ប៉ុន្មានថ្ងៃ?',
      titleEn: 'Special Leave days per year',
      placeholderKm: 'ឧ. ០ ដល់ ៣ ថ្ងៃ',
      required: true,
      category: 'AWT'
    },
    {
      id: 'awt_training_days',
      type: 'text',
      titleKm: '១៤. ក្នុងមួយឆ្នាំ តើលោក/លោកស្រីបានចូលរួមវគ្គបណ្តុះបណ្តាល (Training) ប៉ុន្មានថ្ងៃ?',
      titleEn: 'Training days per year',
      placeholderKm: 'ឧ. ៧ ថ្ងៃ ឬ ប្រជុំ RRT 48h',
      required: true,
      category: 'AWT'
    },

    // ==========================================
    // ផ្នែកពិនិត្យជំងឺក្រៅសម្ភព និងរោគស្ត្រី (OPD OB/GYN)
    // ==========================================
    {
      id: 'opd_gyn_anc_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យផ្ទៃពោះលើកដំបូង ANC 1st Visit [HO2: 1,240 ស្រ្តី/ឆ្នាំ] (នាទី/ស្រ្តី)',
      titleEn: 'Core: Antenatal Care (ANC) 1st Visit Consultation (mins/woman)',
      descriptionKm: 'កត់ប្រវត្តិលម្អិត វាស់កម្ពស់ស្បូន ស្តាប់ចង្វាក់បេះដូងកូន ពិនិត្យសញ្ញាគ្រោះថ្នាក់ ធ្វើតេស្តទឹកនោមរហ័ស និងផ្តល់ជាតិដែក',
      activityType: 'core',
      ho2Stats: '1,240 ស្រ្តី/ឆ្នាំ',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_anc_follow_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យផ្ទៃពោះតាមដាន ANC Follow-up (លើកទី ២, ៣, ៤...) [HO2: 2,860 ករណី/ឆ្នាំ] (នាទី/ស្រ្តី)',
      titleEn: 'Core: Antenatal Care (ANC) Follow-up Visits (mins/woman)',
      descriptionKm: 'តាមដានការលូតលាស់ទារក សម្ពាធឈាម ទម្ងន់ ពិនិត្យភាពស្លេកស្លាំង និងណែនាំកន្លែងសម្រាល',
      activityType: 'core',
      ho2Stats: '2,860 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_echo_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យអេកូសាស្ត្រសម្ភព និងរោគស្ត្រី (Ultrasound OB/GYN) [HO2: 1,840 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Obstetric & Gynecological Ultrasound (mins/case)',
      descriptionKm: 'ពិនិត្យទីតាំងទារក អាយុគភ៌ ទឹកភ្លោះ ទីតាំងសុក និងស្បូន/អូវែ',
      activityType: 'core',
      ho2Stats: '1,840 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_via_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យស្រាវជ្រាវមហារីកមាត់ស្បូនដោយទឹកខ្មេះ (VIA Test) [HO2: 450 ស្រ្តី/ឆ្នាំ] (នាទី/ស្រ្តី)',
      titleEn: 'Core: Visual Inspection with Acetic Acid (VIA) cervical screening (mins/woman)',
      descriptionKm: 'ដាក់ Speculum លាបទឹកខ្មេះ 3-5% ពិនិត្យរក Acetowhite lesion និងផ្តល់ការប្រឹក្សា',
      activityType: 'core',
      ho2Stats: '450 ស្រ្តី/ឆ្នាំ',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_cryo_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការព្យាបាលដំបៅមាត់ស្បូនដោយកម្តៅត្រជាក់ (Cryotherapy / Thermal Ablation) លើស្ត្រី VIA វិជ្ជមាន (នាទី/ករណី)',
      titleEn: 'Core: Cryotherapy / Thermal Ablation for precancerous cervical lesions (mins/case)',
      descriptionKm: 'ការរៀបចំឧបករណ៍ ការប្រើប្រាស់ Cryo-probe និងការពន្យល់ថែទាំក្រោយព្យាបាល',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_fp_inject_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សេវាពន្យារកំណើត៖ ចាក់ថ្នាំពន្យារកំណើត (Depo-Provera) (នាទី/ករណី)',
      titleEn: 'Core: Family Planning Injectable Contraceptive (Depo-Provera) (mins/case)',
      descriptionKm: 'ការប្រឹក្សា ពិនិត្យសម្ពាធឈាម និងចាក់ថ្នាំ intramuscular',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_fp_implant_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សេវាពន្យារកំណើត៖ កប់កង ឬដោះកងក្រោមស្បែក (Implanon / Norplant) (នាទី/ករណី)',
      titleEn: 'Core: Contraceptive Implant (Implanon/Jadelle) Insertion & Removal (mins/case)',
      descriptionKm: 'ការចាក់ថ្នាំស្ពឹក local anesthesia, ការប្រើ trocar កប់កង និងការរុំបង់ aseptic',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_fp_iud_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សេវាពន្យារកំណើត៖ ដាក់កង ឬដោះកងក្នុងស្បូន (IUD Insertion & Removal) (នាទី/ករណី)',
      titleEn: 'Core: Intrauterine Device (IUD) Insertion & Removal (mins/case)',
      descriptionKm: 'ការវាស់ប្រវែងស្បូន Uterine Sounding, ការដាក់ IUD និងកាត់ខ្សែ',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_fp_oral_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សេវាពន្យារកំណើត៖ ផ្តល់ថ្នាំគ្រាប់ពន្យារកំណើត និងការប្រឹក្សាសុខភាពបន្តពូជ (នាទី/ករណី)',
      titleEn: 'Core: Oral Contraceptive Pills Distribution & Reproductive Counseling (mins/case)',
      descriptionKm: 'ការពន្យល់ពីរបៀបលេបថ្នាំ COC/POP និងការដោះស្រាយផលរំខាន',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_consult_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិគ្រោះ និងព្យាបាលជំងឺរោគស្ត្រីទូទៅ (ធ្លាក់ស, រលាកទ្វារមាស, រលាកអាងត្រគាក PID) [HO2: 980 ករណី/ឆ្នាំ] (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Gynecological Consultation & Treatment (mins/patient)',
      descriptionKm: 'សាកសួរប្រវត្តិ ពិនិត្យ Speculum, bimanual exam និងចេញវេជ្ជបញ្ជា',
      activityType: 'core',
      ho2Stats: '980 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_pnc_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យ និងថែទាំស្ត្រី និងទារកក្រោយសម្រាល (OPD Postnatal Care - PNC) (នាទី/គូ)',
      titleEn: 'Core: Outpatient Postnatal Care (PNC) for mother and newborn (mins/pair)',
      descriptionKm: 'ពិនិត្យការស្រកស្បូន ឈាមកង្វក់ របួសថ្នេរ ដោះ និងទារក',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_cac_pac_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការផ្តល់ប្រឹក្សា និងការថែទាំសុវត្ថិភាពរំលូត/ក្រោយរំលូត (CAC / PAC Care) (នាទី/ករណី)',
      titleEn: 'Core: Comprehensive Abortion Care & Post-Abortion Care (CAC/PAC) (mins/case)',
      descriptionKm: 'ការប្រឹក្សាយោបល់ ការព្យាបាលដោយឱសថ Medical Abortion ឬ MVA និងការពន្យារកំណើតក្រោយរំលូត',
      activityType: 'core',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_morning_meet',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំប្រគល់-ទទួលវេនពេលព្រឹក និងចុះវត្តមានការងារផ្នែកជំងឺក្រៅសម្ភព (នាទី/ព្រឹក)',
      titleEn: 'CAS: Morning Handover & Attendance in OPD OB/GYN (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_ipc_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) អនាម័យ សម្អាត និងសម្លាប់មេរោគឧបករណ៍ពិនិត្យរោគស្ត្រី (Speculum, Tenaculum, Sound) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: GYN Speculum & Instrument Decontamination / Autoclave Prep (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_room_prep',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) សម្អាត និង khửមេរោគគ្រែពិនិត្យរោគស្ត្រី និងបន្ទប់ពិគ្រោះជំងឺ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Disinfection of GYN Examination Bed & Consultation Room (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_daily_stock',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ត្រួតពិនិត្យ និងរៀបចំស្តុកថ្នាំពន្យារកំណើត វ៉ាក់សាំង តេស្តទឹកនោមរហ័សរៀងរាល់ព្រឹក (នាទី/ព្រឹក)',
      titleEn: 'CAS: Daily Morning Supply & Rapid Test Inventory Check (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_handover_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រគល់វេនចុងម៉ោងការងារ និងបូកសរុបទិន្នន័យបឋម (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: End of Shift Handover & Daily Register Reconciliation (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_logbook_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបញ្ជីពិនិត្យផ្ទៃពោះ ANC, សៀវភៅពន្យារកំណើត និងបំពេញសំបុត្រផ្ទេរ (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: ANC/FP Register Logbook & Referral Slips (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_hcis_entry',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បញ្ចូលទិន្នន័យពិនិត្យផ្ទៃពោះ និងផែនការគ្រួសារទៅក្នុងប្រព័ន្ធ HCIS / CamLIS / HO2 (នាទី/ថ្ងៃ ឬ ម៉ោង/សប្តាហ៍)',
      titleEn: 'IAS: Electronic Data Entry into HCIS / CamLIS / HO2 (mins/day or hrs/week)',
      activityType: 'ias',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_monthly_rep_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍បូកសរុបស្ថិតិសុខភាពមាតា និងពន្យារកំណើតប្រចាំខែ (ម៉ោង/ខែ)',
      titleEn: 'IAS: Monthly Maternal Health & FP Report Compilation (hrs/month)',
      activityType: 'ias',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_drug_order',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើតម្រូវការស្នើសុំឱសថ និងសម្ភារបរិក្ខារសម្ភពពីរដ្ឋបាលឃ្លាំងមន្ទីរពេទ្យ (ម៉ោង/ខែ)',
      titleEn: 'IAS: Monthly Contraceptive & Drug Requisition from Hospital Store (hrs/month)',
      activityType: 'ias',
      required: false,
      category: 'OPD OB/GYN'
    },
    {
      id: 'opd_gyn_maternal_committee',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ចូលរួមប្រជុំគណៈកម្មការសុខភាពមាតា និងទារកប្រចាំខែ ឬប្រជុំ OD/PHD (ម៉ោង/ខែ)',
      titleEn: 'IAS: Maternal & Child Health Committee / OD Monthly Meeting (hrs/month)',
      activityType: 'ias',
      required: false,
      category: 'OPD OB/GYN'
    },

    // ==========================================
    // ផ្នែកភ្នែក (Eye Clinic / Ophthalmology)
    // ==========================================
    {
      id: 'eye_consult_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ពិគ្រោះ និងចេញវេជ្ជបញ្ជាជំងឺភ្នែកទូទៅ (ឈឺភ្នែកក្រហម, រលាកត្របកភ្នែក, ភ្នែកស្ងួត) [HO2: 720 ករណី/ឆ្នាំ] (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: General Eye Consultation & Prescription (mins/patient)',
      descriptionKm: 'សាកសួរប្រវត្តិ ពិនិត្យគំហើញបឋម ចេញវេជ្ជបញ្ជាថ្នាំបន្តក់ និងណែនាំអនាម័យភ្នែក',
      activityType: 'core',
      ho2Stats: '720 ករណី/ឆ្នាំ',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_visual_acuity_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវាស់គំហើញភ្នែកដោយតារាង Snellen Chart (Visual Acuity Testing) (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Visual Acuity Measurement using Snellen Chart (mins/patient)',
      descriptionKm: 'វាស់គំហើញភ្នែកឆ្វេង-ស្តាំ ចម្ងាយ ៦ ម៉ែត្រ និងកត់ត្រាកម្រិតគំហើញ',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_slitlamp_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យភ្នែកដោយម៉ាស៊ីន Slit-Lamp Biomicroscopy (កញ្ចក់ភ្នែក កែវភ្នែក និងបន្ទប់មុខ) (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Slit-lamp Biomicroscopic Examination of Anterior Segment (mins/patient)',
      descriptionKm: 'ពិនិត្យ Corneal clarity, Anterior chamber depth, Iris, Lens opacity',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_tonometry_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវាស់សម្ពាធទឹកក្នុងគ្រាប់ភ្នែក (Tonometry - Intraocular Pressure) រកជំងឺទឹកដក់ក្នុងភ្នែក Glaucoma (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Intraocular Pressure Measurement via Tonometry (mins/patient)',
      descriptionKm: 'បន្តក់ថ្នាំស្ពឹក Tetracaine / Fluorescein និងវាស់សម្ពាធគ្រាប់ភ្នែក',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_funduscopy_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យបាតភ្នែក (Funduscopy / Ophthalmoscopy) លើអ្នកជំងឺទឹកនោមផ្អែម និងលើសឈាម (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Direct/Indirect Ophthalmoscopy & Diabetic Retinopathy Screening (mins/patient)',
      descriptionKm: 'ពិនិត្យសរសៃឈាមបាតភ្នែក Optic Disc, Macula និង Retina',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_foreign_body_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការលាងសម្អាតភ្នែក និងឆ្កឹះកម្ទេចកំទី ដែក ធូលីចេញពីភ្នែក (Foreign Body Removal) (នាទី/ករណី)',
      titleEn: 'Core: Corneal & Conjunctival Foreign Body Removal under Topical Anesthesia (mins/case)',
      descriptionKm: 'បន្តក់ថ្នាំស្ពឹក ប្រើកែវពង្រីក/Slit-lamp ឆ្កឹះយកកម្ទេចកំទី ពិនិត្យស្នាមដំបៅ និងបិទបង់ការពារ',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_irrigation_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការលាងសម្អាតភ្នែកក្នុងករណីគ្រោះថ្នាក់ជាតិគីមី ឬរលាកភ្នែកបន្ទាន់ (Eye Irrigation) (នាទី/ករណី)',
      titleEn: 'Core: Emergency Ocular Irrigation for Chemical / Acid-Alkali Burns (mins/case)',
      descriptionKm: 'លាងសម្អាតដោយសេរ៉ូមប្រៃ 500-1000ml បន្តក់ថ្នាំបំបាត់ការឈឺចាប់ និងវាស់កម្រិត pH ភ្នែក',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_cataract_screen_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យស្រាវជ្រាវរកជំងឺភ្នែកឡើងបាយ (Cataract Screening) និងរៀបចំបញ្ជូនវះកាត់ (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Cataract Screening, Biometry Counseling & Surgical Referral (mins/patient)',
      descriptionKm: 'ពិនិត្យកម្រិតឡើងបាយ ប្រឹក្សាយោបល់ និងបំពេញឯកសារបញ្ជូនទៅមន្ទីរពេទ្យខេត្ត ឬយុទ្ធនាការវះកាត់',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_minor_surgery_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវះកាត់តូចលើភ្នែក (Minor Eye Surgery: ដោះពងបែក Chalazion, ចោះបូសត្របកភ្នែក, កាត់សាច់ដុះ Pterygium) (នាទី/ករណី)',
      titleEn: 'Core: Minor Ophthalmic Procedures (Chalazion Incision, Lid Abscess, Pterygium) (mins/case)',
      descriptionKm: 'ការរៀបចំឧបករណ៍ sterile, ចាក់ថ្នាំស្ពឹក local, វះកាត់ដោះពងបែក និងរុំបង់ការពារ',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_refraction_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវាស់កែវភ្នែក និងផ្តល់វេជ្ជបញ្ជាវ៉ែនតា (Refraction & Spectacle Prescription) (នាទី/អ្នកជំងឺ)',
      titleEn: 'Core: Subjective Refraction & Spectacle Prescription (mins/patient)',
      descriptionKm: 'សាកកែវភ្នែក Trial Lens Set, កំណត់ដឺក្រេភ្នែកម៉្ញូប/ភ្នែកចាស់ និងចេញវេជ្ជបញ្ជា',
      activityType: 'core',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_morning_meet_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំពេលព្រឹក និងចុះវត្តមានការងារប្រចាំថ្ងៃផ្នែកភ្នែក (នាទី/ព្រឹក)',
      titleEn: 'CAS: Morning Meeting & Daily Attendance in Eye Unit (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_equipment_clean_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ថែទាំ ជូតសម្អាត និងសម្លាប់មេរោគលើឧបករណ៍ Slit-lamp, Tonometer, កែវសាក និងកៅអីពិនិត្យ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Ophthalmic Equipment Maintenance & Disinfection (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_sterilization_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) សម្លាប់មេរោគឧបករណ៍វះកាត់ភ្នែកតូច (Autoclave) និងរៀបចំសម្លៀកបំពាក់វះកាត់ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Autoclave Sterilization of Minor Eye Surgery Sets (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_daily_stock_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ត្រួតពិនិត្យ និងរៀបចំស្តុកថ្នាំបន្តក់ភ្នែក ថ្នាំស្ពឹក ហ្គាស និងសម្ភាររុំភ្នែកប្រចាំថ្ងៃ (នាទី/ព្រឹក)',
      titleEn: 'CAS: Daily Morning Check of Eye Drops, Anesthetics & Eye Dressings (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_logbook_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបញ្ជីពិនិត្យជំងឺភ្នែកប្រចាំថ្ងៃ (Daily Eye Register Book) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Eye Clinic Register Book & Patient Cards (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_hcis_entry_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បញ្ចូលទិន្នន័យជំងឺភ្នែកទៅក្នុងប្រព័ន្ធកុំព្យូទ័រ និងកម្មវិធីជាតិសុខភាពភ្នែក (HO2 / National Eye Care Program) (នាទី/ថ្ងៃ ឬ ម៉ោង/សប្តាហ៍)',
      titleEn: 'IAS: Electronic Data Entry into Hospital Database / National Eye Care Program (mins/day or hrs/week)',
      activityType: 'ias',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_monthly_rep_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍ស្ថិតិជំងឺភ្នែកប្រចាំខែ (Monthly Eye Health Report) (ម៉ោង/ខែ)',
      titleEn: 'IAS: Monthly Eye Health Activity Report Compilation (hrs/month)',
      activityType: 'ias',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_drug_inventory_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) គ្រប់គ្រងស្តុកឱសថភ្នែក និងធ្វើបញ្ជីស្នើសុំថ្នាំបន្តក់ភ្នែកពីឃ្លាំងកណ្តាល (ម៉ោង/ខែ)',
      titleEn: 'IAS: Ophthalmic Drug Inventory Management & Central Requisition (hrs/month)',
      activityType: 'ias',
      required: false,
      category: 'Eye Clinic'
    },
    {
      id: 'eye_outreach_coordination',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) សម្របសម្រួលយុទ្ធនាការវះកាត់ភ្នែកឡើងបាយជាមួយអង្គការដៃគូ ឬក្រុមគ្រូពេទ្យជំនាញ (ម៉ោង/ខែ)',
      titleEn: 'IAS: Cataract Surgical Outreach & Partner NGO Mission Coordination (hrs/month)',
      activityType: 'ias',
      required: false,
      category: 'Eye Clinic'
    },

    // Group 1: OPD / ER
    {
      id: 'opd_consult_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ពិគ្រោះ និងចេញវេជ្ជបញ្ជាជំងឺក្រៅទូទៅ [ស្ថិតិ HO2: 7,879 ករណី/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: General Outpatient Consult & Rx [HO2: 7,879 cases/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងអ្នកជំងឺម្នាក់)',
      activityType: 'core',
      ho2Stats: '7,879 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_ncd_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ពិគ្រោះ និងតាមដានជំងឺមិនឆ្លង NCD [ស្ថិតិ HO2: ទឹកនោមផ្អែម 725, លើសឈាម 279] (នាទី/ម្នាក់)',
      titleEn: 'Core: NCD Consult & Follow-up [HO2: DM 725, HTN 279]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងអ្នកជំងឺម្នាក់)',
      activityType: 'core',
      ho2Stats: 'ទឹកនោមផ្អែម 725, លើសឈាម 279',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'er_resus_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សង្គ្រោះបន្ទាន់អ្នកជំងឺធ្ងន់ធ្ងរ [ស្ថិតិ HO2: 835 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Severe Emergency Resuscitation [HO2: 835 cases/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងមួយករណី)',
      activityType: 'core',
      ho2Stats: '835 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'er_poison_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ព្យាបាលករណីពុល និងពស់ចឹក [ស្ថិតិ HO2: ពស់ចឹក 82, ពុលចំណី 125 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Poisoning & Snakebite Treatment [HO2: Snakebite 82, Food poison 125]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងមួយករណី)',
      activityType: 'core',
      ho2Stats: 'ពស់ចឹក 82, ពុលចំណី 125',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'er_traffic_suture_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការសង្គ្រោះ និងដេររបួសគ្រោះថ្នាក់ចរាចរណ៍ [ស្ថិតិ HO2: 291 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Traffic Accident Trauma & Suture [HO2: 291 cases/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងមួយករណី)',
      activityType: 'core',
      ho2Stats: '291 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_sti_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការធ្វើរោគវិនិច្ឆ័យ និងព្យាបាលជំងឺកាមរោគ [ស្ថិតិ HO2: 91 ករណី/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: STI Diagnosis & Management [HO2: 91 cases/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងអ្នកជំងឺម្នាក់)',
      activityType: 'core',
      ho2Stats: '91 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'referral_escort_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការរៀបចំ និងអមដំណើរបញ្ជូនអ្នកជំងឺទៅខេត្ត [ស្ថិតិ HO2: 894 ករណី/ឆ្នាំ] (នាទី/ជើង)',
      titleEn: 'Core: Provincial Referral Escort [HO2: 894 cases/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលជិះអមដំណើរជាមធ្យម (នាទី ក្នុងមួយជើង)',
      activityType: 'core',
      ho2Stats: '894 ករណី/ឆ្នាំ',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'nur_vital_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវាស់សញ្ញាជីវិត៖ ចំនួនអ្នកជំងឺដែលបានវាស់សញ្ញាជីវិតជាមធ្យម (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: Vital Signs: Average patients measured (patients/day)',
      activityType: 'core',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'nur_vital_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យមក្នុងការវាស់សញ្ញាជីវិត (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Vital Signs: Average time per patient (mins)',
      activityType: 'core',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'nur_inject_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការចាក់ថ្នាំ និងព្យួរសេរ៉ូម៖ ចំនួនអ្នកជំងឺដែលបានចាក់ថ្នាំ/ដាក់សេរ៉ូមជាមធ្យម (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: Injections & IV: Average patients (patients/day)',
      activityType: 'core',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'nur_inject_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យមក្នុងការចាក់ថ្នាំ ឬព្យួរសេរ៉ូម (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Injections & IV: Average time per patient (mins)',
      activityType: 'core',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'nur_wound_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការលាង និងស្អំរបួស៖ ចំនួនអ្នកជំងឺដែលបានលាងរបួសជាមធ្យម (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: Wound Dressing: Average patients (patients/day)',
      activityType: 'core',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'nur_wound_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យមក្នុងការលាង និងស្អំរបួស (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Wound Dressing: Average time per patient (mins)',
      activityType: 'core',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_morning_meet',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ចូលរួមប្រជុំប្រគល់-ទទួលវេនការងារពេលព្រឹក (Morning Handover) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Morning Handover Meeting (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_ipc_clean',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) អនុវត្តវិធានការបង្ការការចម្លងរោគ និងអនាម័យតុ/គ្រែពិនិត្យ (IPC) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: IPC Disinfection & Cleaning (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_monthly_meet',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំបូកសរុបការងារផ្នែក OPD/ER ប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'CAS: OPD/ER Monthly Meeting (mins/month)',
      activityType: 'cas',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_attendance',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការចុះហត្ថលេខាវត្តមានការងារប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Attendance Signing (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'er_standby_night',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការប្រចាំការយាមត្រៀមសង្គ្រោះបន្ទាន់ពេលយប់ (ER Standby Readiness) (នាទី/វេន)',
      titleEn: 'CAS: ER Night Standby Readiness (mins/shift)',
      activityType: 'cas',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_logbook_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបញ្ជីពិគ្រោះជំងឺក្រៅ (OPD Register Book) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: OPD Register Logbook (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_referral_form',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បំពេញសំបុត្រផ្ទេរអ្នកជំងឺ និងលិខិតវេជ្ជសាស្ត្រ (Referral Forms) (នាទី/អ្នកជំងឺ)',
      titleEn: 'IAS: Referral & Medical Forms (mins/case)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_hef_nssf',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ផ្ទៀងផ្ទាត់ និងបំពេញឯកសារមូលនិធិសមធម៌ PMRS និង ប.ស.ស (NSSF) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: HEF/PMRS & NSSF Documentation (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_drug_order',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើបុង និងបើកឱសថ/បរិក្ខារពេទ្យប្រើប្រាស់ប្រចាំថ្ងៃពីឱសថស្ថាន (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Drug & Supply Requisition (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_autoclave',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) លាងសម្អាត និងយកឧបករណ៍ដេររបួសទៅស្ទ័ររីល (Autoclave Sterilization) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Surgical Instrument Autoclave (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_ho2_rep',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បូកសរុបទិន្នន័យ និងបញ្ចូលរបាយការណ៍ស្ថិតិប្រចាំថ្ងៃ/ខែ (Daily/Monthly HO2) (នាទី/ខែ)',
      titleEn: 'IAS: Daily/Monthly HO2 Entry (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },
    {
      id: 'opd_duty_roster',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) រៀបចំតារាងវេនយាមប្រចាំខែ (Duty Roster) (នាទី/ខែ)',
      titleEn: 'IAS: Monthly Duty Roster Preparation (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'OPD/ER'
    },

    // Group 2: Inpatient Wards
    {
      id: 'ipd_ward_round',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យតាមដានអ្នកជំងឺសម្រាកពេទ្យប្រចាំថ្ងៃ (Ward Round) [ស្ថិតិ HO2: GM 755 នាក់, កុមារ 1,099 នាក់/ឆ្នាំ]',
      titleEn: 'Core: Daily Inpatient Ward Round [HO2: GM 755, Ped 1,099/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលពិនិត្យ កែសម្រួលថ្នាំ សរសេរ Kardex (នាទី ក្នុងអ្នកជំងឺម្នាក់)',
      activityType: 'core',
      ho2Stats: 'GM 755, កុមារ 1,099/ឆ្នាំ',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'tb_inpatient_dots',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការថែទាំ និងព្យាបាលអ្នកជំងឺរបេងសម្រាកពេទ្យ [ស្ថិតិ HO2: 22 ករណី/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: Inpatient TB DOTS Care [HO2: 22 cases/yr]',
      activityType: 'core',
      ho2Stats: '22 ករណី/ឆ្នាំ',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_admission_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការទទួលអ្នកជំងឺថ្មី៖ ចំនួនអ្នកជំងឺថ្មីទទួលចូលសម្រាកពេទ្យជាមធ្យម (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: Inpatient Admission: Average cases (patients/day)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_admission_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការទទួល សួរប្រវត្តិ និងបើកសំណុំឯកសារ (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Inpatient Admission: Average time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ped_diarrhea_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) កុមាររាកស្រួចស្រាវ៖ ចំនួនកុមាររាកស្រួចស្រាវដែលបានថែទាំជាមធ្យម (កុមារ/ខែ)',
      titleEn: 'Core: Pediatric Acute Diarrhea cases (cases/month)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ped_diarrhea_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការថែទាំ ផ្តល់ ORS និងតាមដានជាតិទឹក (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Pediatric Diarrhea: Average care time (mins)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ped_pneumonia_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) កុមាររលាកសួត៖ ចំនួនកុមាររលាកសួតដែលបានថែទាំ និងដាក់អុកស៊ីសែន (កុមារ/ខែ)',
      titleEn: 'Core: Pediatric Pneumonia & O2 cases (cases/month)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ped_pneumonia_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការថែទាំ ដាក់អុកស៊ីសែន និងចាក់ថ្នាំ (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Pediatric Pneumonia: Average care time (mins)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_dengue_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ជំងឺគ្រុនឈាម៖ ចំនួនអ្នកជំងឺគ្រុនឈាមដែលបានថែទាំជាមធ្យម (នាក់/ខែ)',
      titleEn: 'Core: Dengue Inpatient Cases (cases/month)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_dengue_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការតាមដាន Hematocrit និងថែទាំ (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Dengue: Monitoring time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ped_sam_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) កុមារកង្វះអាហារូបត្ថម្ភធ្ងន់ធ្ងរ (SAM)៖ ចំនួនកុមារ SAM ដែលបានថែទាំ (កុមារ/ខែ)',
      titleEn: 'Core: SAM Pediatric Cases (cases/month)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ped_sam_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការវាស់វែង និងផ្តល់ទឹកដោះ F-75/F-100 (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: SAM: F-75/F-100 feeding time (mins)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_inject_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការចាក់ថ្នាំ និងប្តូរសេរ៉ូមតាមវេន៖ ចំនួនអ្នកជំងឺដែលបានចាក់ថ្នាំ/ប្តូរសេរ៉ូម (នាក់/ថ្ងៃ)',
      titleEn: 'Core: Inpatient Routine Injections/IV: Patients (patients/day)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_inject_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការចាក់ថ្នាំ និងប្តូរប្លោកសេរ៉ូម (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Inpatient Injections/IV: Time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_health_edu_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការអប់រំសុខភាព៖ ចំនួនដងនៃការអប់រំសុខភាព និងអាហារូបត្ថម្ភ (ដង/សប្តាហ៍)',
      titleEn: 'Core: Health Education: Times per week',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_health_edu_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការអប់រំសុខភាពម្តងៗ (នាទី ក្នុងមួយដង)',
      titleEn: 'Core: Health Education: Time per session (mins)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_discharge_sum',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការសរសេរសេចក្តីសង្ខេបអ្នកជំងឺចេញពីពេទ្យ (Discharge Summary) (នាទី/ម្នាក់)',
      titleEn: 'Core: Inpatient Discharge Summary Writing (mins/case)',
      activityType: 'core',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_handover',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំប្រគល់-ទទួលវេនថែទាំអ្នកជំងឺពេលព្រឹក (Ward Handover) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Ward Morning Handover (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_ward_ipc',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) អនាម័យបន្ទប់សម្រាកអ្នកជំងឺ និងការប្តូរកម្រាលពូក (Ward IPC) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Ward IPC & Bed Linen Change (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_attendance',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការចុះហត្ថលេខាវត្តមានការងារប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Attendance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_monthly_meet',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំការងារផ្ទៃក្នុងផ្នែកប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'CAS: Ward Monthly Meeting (mins/month)',
      activityType: 'cas',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_standby_night',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការប្រចាំការយាមយប់ត្រៀមថែទាំអ្នកជំងឺសម្រាកពេទ្យ (Inpatient Standby) (នាទី/វេន)',
      titleEn: 'CAS: Inpatient Night Standby (mins/shift)',
      activityType: 'cas',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_register_book',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបញ្ជីអ្នកជំងឺសម្រាកពេទ្យ (Inpatient Register) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Inpatient Register Book (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_drug_indent',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើបុង និងរៀបចំបើកថ្នាំប្រចាំថ្ងៃសម្រាប់អ្នកជំងឺសម្រាកពេទ្យ (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Inpatient Drug Requisition (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_daily_census',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បូកសរុបចំនួនអ្នកជំងឺចេញ ចូល និងនៅសល់ប្រចាំថ្ងៃ (Daily Census) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Bed Census (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_pmrs_archiving',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) រៀបចំ និងទុកដាក់សំណុំឯកសារជំងឺ PMRS ទៅតាមទូរក្សាទុក (File Archiving) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: PMRS Inpatient Medical Record Archiving (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'ipd_monthly_ho2',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍បច្ចេកទេស និងស្ថិតិជំងឺ HO2 ប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'IAS: Monthly Inpatient HO2 Report (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Inpatient'
    },
    {
      id: 'tb_monthly_rep',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍តាមដានជំងឺរបេង និងជំងឺឆ្លង (នាទី/ខែ)',
      titleEn: 'IAS: Monthly TB & Infectious Disease Report (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Inpatient'
    },

    // Group 3: Maternity & GYN
    {
      id: 'mat_normal_deliv_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការជួយសម្រាលកូនធម្មតា និងចាក់អុកស៊ីតូស៊ីន [ស្ថិតិ HO2: 154 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Normal Delivery & Oxytocin [HO2: 154 cases/yr]',
      descriptionKm: 'វាយបញ្ចូលរយៈពេលចំណាយជាមធ្យម (នាទី ក្នុងមួយករណី)',
      activityType: 'core',
      ho2Stats: '154 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_vacuum_deliv_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការជួយសម្រាលកូនដោយបូម (Vacuum Extraction) [ស្ថិតិ HO2: 5 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Vacuum Extraction Delivery [HO2: 5 cases/yr]',
      activityType: 'core',
      ho2Stats: '5 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_skin_to_skin_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការថែទាំទារកទើបកើត និងស្បែកប៉ះស្បែក ៩០នាទី [ស្ថិតិ HO2: 155 ករណី/ឆ្នាំ] (នាទី/ទារក)',
      titleEn: 'Core: Newborn Immediate Care & Skin-to-Skin 90min [HO2: 155/yr]',
      activityType: 'core',
      ho2Stats: '155 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_neo_resus_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការជួយសង្គ្រោះទារកមិនដកដង្ហើមពេលកើត [ស្ថិតិ HO2: 162 ករណី/ឆ្នាំ] (នាទី/ទារក)',
      titleEn: 'Core: Neonatal Resuscitation [HO2: 162 cases/yr]',
      activityType: 'core',
      ho2Stats: '162 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_pph_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការសង្គ្រោះករណីធ្លាក់ឈាមក្រោយសម្រាល (PPH) [ស្ថិតិ HO2: 40 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Postpartum Hemorrhage (PPH) Emergency [HO2: 40/yr]',
      activityType: 'core',
      ho2Stats: '40 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_pnc_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការថែទាំមាតា និងទារកក្រោយសម្រាល (PNC) [ស្ថិតិ HO2: 459 ដង/ឆ្នាំ] (នាទី/ដង)',
      titleEn: 'Core: Postnatal Care (PNC) [HO2: 459 visits/yr]',
      activityType: 'core',
      ho2Stats: '459 ដង/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_mva_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការថែទាំ និងបូមសម្អាតស្បូនរលូតកូន (MVA) [ស្ថិតិ HO2: 19 ករណី/ឆ្នាំ] (នាទី/ករណី)',
      titleEn: 'Core: Post-abortion MVA Care [HO2: 19 cases/yr]',
      activityType: 'core',
      ho2Stats: '19 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_fp_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សេវាពន្យារកំណើត (Family Planning) [ស្ថិតិ HO2: 7 ករណី/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: Family Planning Services [HO2: 7 cases/yr]',
      activityType: 'core',
      ho2Stats: '7 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_via_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យស្រាវជ្រាវរកមហារីកមាត់ស្បូន (VIA Test) [ស្ថិតិ HO2: 1 ករណី/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: Cervical Cancer Screening (VIA) [HO2: 1 case/yr]',
      activityType: 'core',
      ho2Stats: '1 ករណី/ឆ្នាំ',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_anc_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យផ្ទៃពោះ (ANC)៖ ចំនួនស្ត្រីមកពិនិត្យផ្ទៃពោះជាមធ្យម (ស្ត្រី/ខែ)',
      titleEn: 'Core: ANC Visits (women/month)',
      activityType: 'core',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_anc_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការពិនិត្យផ្ទៃពោះ (នាទី ក្នុងស្ត្រីម្នាក់)',
      titleEn: 'Core: ANC Checkup time (mins/woman)',
      activityType: 'core',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_partograph_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ក្រាហ្វិកសម្រាល (Partograph)៖ ចំនួនស្ត្រីដែលបានតាមដាន Partograph (ស្ត្រី/ខែ)',
      titleEn: 'Core: Partograph monitored deliveries (women/month)',
      activityType: 'core',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_partograph_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយសរុបក្នុងការតាមដាន និងកត់ត្រា Partograph (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Partograph time (mins/woman)',
      activityType: 'core',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_episiotomy_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការដេរជួសជុលរបួសរហែកទ្វារមាស៖ ចំនួនករណីដេររបួសជាមធ្យម (ករណី/ខែ)',
      titleEn: 'Core: Episiotomy/Perineal repair cases (cases/month)',
      activityType: 'core',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_episiotomy_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការដេររបួស (នាទី ក្នុងមួយករណី)',
      titleEn: 'Core: Episiotomy repair time (mins/case)',
      activityType: 'core',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_handover',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំប្រគល់-ទទួលវេនយាមបន្ទប់សម្រាលពេលព្រឹក (Maternity Handover) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Maternity Morning Handover (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_ipc_clean',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការសម្អាត និងសម្លាប់មេរោគលើគ្រែសម្រាល និងបន្ទប់សម្រាល (IPC) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Delivery Bed & Room Disinfection (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_attendance',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការចុះហត្ថលេខាវត្តមានការងារប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Attendance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_monthly_meet',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំការងារផ្នែកសម្ភពប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'CAS: Maternity Monthly Meeting (mins/month)',
      activityType: 'cas',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_standby_night',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការប្រចាំការយាមយប់ត្រៀមជួយសម្រាលកូនបន្ទាន់ ២៤/២៤ ម៉ោង (Labor Standby) (នាទី/វេន)',
      titleEn: 'CAS: Labor Standby 24/7 (mins/shift)',
      activityType: 'cas',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_birth_log',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបញ្ជីកំណើត និងចេញសំបុត្របញ្ជាក់កំណើត (Birth Log & Certificate) (នាទី/ករណី)',
      titleEn: 'IAS: Birth Logbook & Certificate (mins/case)',
      activityType: 'ias',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_sterilize_packs',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បត់ក្រណាត់ សម្លៀកបំពាក់ និងស្ទ័ររីលកញ្ចប់ឧបករណ៍សម្រាល (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Delivery Linen & Instrument Sterilization (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_supply_order',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើសំណើស្នើសុំ និងបើកសម្ភារៈ បរិក្ខារ ឱសថសម្រាប់បន្ទប់សម្រាល (នាទី/ខែ)',
      titleEn: 'IAS: Maternity Drugs & Supply Order (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_ho2_entry',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បញ្ចូលរបាយការណ៍ស្ថិតិសម្ភពប្រចាំខែក្នុងប្រព័ន្ធ HO2 (នាទី/ខែ)',
      titleEn: 'IAS: Monthly Maternity HO2 Entry (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Maternity'
    },
    {
      id: 'mat_mmr_audit',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ចូលរួមការប្រជុំសវនកម្មមរណភាពមាតា និងទារក (MMR/Perinatal Audit) (នាទី/ឆ្នាំ)',
      titleEn: 'IAS: Maternal/Perinatal Mortality Audit (mins/year)',
      activityType: 'ias',
      required: false,
      category: 'Maternity'
    },

    // Group 4: Laboratory
    {
      id: 'lab_cbc_run_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវិភាគរូបមន្តគ្រាប់ឈាមតាមម៉ាស៊ីន (CBC Run) [ស្ថិតិ HO2: 7,985 តេស្ត/ឆ្នាំ] (នាទី/តេស្ត)',
      titleEn: 'Core: Automated CBC Blood Count [HO2: 7,985 tests/yr]',
      activityType: 'core',
      ho2Stats: '7,985 តេស្ត/ឆ្នាំ',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_malaria_smear_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការរៀបចំ ជ្រលក់ពណ៌ និងអានកញ្ចក់ឈាមគ្រុនចាញ់ [ស្ថិតិ HO2: 32 កញ្ចក់/ឆ្នាំ] (នាទី/ស្លាយ)',
      titleEn: 'Core: Malaria Microscopy Smear [HO2: 32 slides/yr]',
      activityType: 'core',
      ho2Stats: '32 កញ្ចក់/ឆ្នាំ',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_malaria_rdt_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការធ្វើតេស្តរហ័សរកមេរោគគ្រុនចាញ់ (Malaria RDT) [ស្ថិតិ HO2: 29 តេស្ត/ឆ្នាំ] (នាទី/តេស្ត)',
      titleEn: 'Core: Malaria Rapid Diagnostic Test (RDT) [HO2: 29 tests/yr]',
      activityType: 'core',
      ho2Stats: '29 តេស្ត/ឆ្នាំ',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_afb_smear_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការរៀបចំ ជ្រលក់ពណ៌ និងអានស្លាយស្លេស្មរបេង (AFB) [ស្ថិតិ HO2: 1,026 តេស្ត/ឆ្នាំ] (នាទី/ស្លាយ)',
      titleEn: 'Core: TB Sputum AFB Smear Reading [HO2: 1,026 tests/yr]',
      activityType: 'core',
      ho2Stats: '1,026 តេស្ត/ឆ្នាំ',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_blood_draw_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការបូមឈាម៖ ចំនួនអ្នកជំងឺដែលបានបូមឈាមជាមធ្យម (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: Phlebotomy / Blood draw patients (patients/day)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_blood_draw_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការបូមឈាមម្នាក់ៗ (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Blood draw time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_serology_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) តេស្តរហ័សសេរ៉ូមវិទ្យា (HIV, Syphilis, Hep B/C)៖ ចំនួនតេស្តជាមធ្យម (តេស្ត/ខែ)',
      titleEn: 'Core: Rapid Serology Tests (HIV, Syphilis, Hep B/C) (tests/month)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_serology_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការរៀបចំ និងធ្វើតេស្ត (នាទី ក្នុងមួយតេស្ត)',
      titleEn: 'Core: Rapid Serology time (mins/test)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_urinalysis_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យទឹកនោម និងជីវគីមី៖ ចំនួនតេស្តជាមធ្យម (តេស្ត/ខែ)',
      titleEn: 'Core: Urinalysis & Biochemistry (tests/month)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_urinalysis_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលចំណាយក្នុងការធ្វើតេស្ត (នាទី ក្នុងមួយតេស្ត)',
      titleEn: 'Core: Urinalysis & Biochemistry time (mins/test)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_release_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការចេញលទ្ធផលតេស្ត៖ ចំនួនប័ណ្ណលទ្ធផលដែលបានចេញជាមធ្យម (ប័ណ្ណ/ថ្ងៃ)',
      titleEn: 'Core: Lab Result Verification & Release (slips/day)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_result_release_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលផ្ទៀងផ្ទាត់ និងចេញប័ណ្ណលទ្ធផលតេស្ត (នាទី ក្នុងមួយប័ណ្ណ)',
      titleEn: 'Core: Lab Result Release time (mins/slip)',
      activityType: 'core',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_daily_qc_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ដំណើរការតេស្តត្រួតពិនិត្យគុណភាពម៉ាស៊ីនប្រចាំថ្ងៃ (Daily Machine Calibration & QC) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Machine Calibration & QC (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_biosafety_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) សម្អាត ជូតសម្លាប់មេរោគលើតុ និងបរិក្ខារពិសោធន៍ (Biosafety Cleaning) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Lab Biosafety Cleaning & Disinfection (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_handover_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំប្រគល់-ទទួលវេនពេលព្រឹក (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Lab Morning Handover (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_attendance_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ចុះហត្ថលេខាវត្តមានការងារប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Attendance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_standby_night',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការប្រចាំការយាមត្រៀមតេស្តឈាមសង្គ្រោះបន្ទាន់ពេលយប់ (Lab Standby Readiness) (នាទី/វេន)',
      titleEn: 'CAS: Lab Emergency Standby (mins/shift)',
      activityType: 'cas',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_camlis_entry_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បញ្ចូលទិន្នន័យលទ្ធផលតេស្តទៅក្នុងប្រព័ន្ធកុំព្យូទ័រ CamLIS (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: CamLIS Lab Information System Entry (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_register_book_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបញ្ជីមន្ទីរពិសោធន៍ប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Lab Logbook Entry (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_hep_rep_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍តេស្តជំងឺរលាកថ្លើម (Hepatitis Report) ប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'IAS: Hepatitis Report Preparation (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_tb_rep_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍តេស្តមេរោគរបេង (TB Lab Report) ប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'IAS: TB Lab Monthly Report (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_hiv_rep_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍តេស្តមេរោគអេដស៍ HIV ប្រចាំត្រីមាស (នាទី/ត្រីមាស)',
      titleEn: 'IAS: Quarterly HIV Testing Report (mins/quarter)',
      activityType: 'ias',
      required: false,
      category: 'Lab'
    },
    {
      id: 'lab_stock_bincard_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) គ្រប់គ្រងស្តុក សាលកបត្រឃ្លាំង និងស្នើសុំសារធាតុគីមីតេស្ត (នាទី/ខែ)',
      titleEn: 'IAS: Lab Chemical Stock & Bin Card (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Lab'
    },

    // Group 5: Imaging, Dental, Physio
    {
      id: 'img_xray_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការថតកាំរស្មីអ៊ិច (X-Ray Radiography) [ស្ថិតិ HO2: 785 ដង/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: X-Ray Radiography [HO2: 785/yr]',
      activityType: 'core',
      ho2Stats: '785 ដង/ឆ្នាំ',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_echo_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការសម្របសម្រួល និងពិនិត្យអេកូសាស្ត្រ [ស្ថិតិ HO2: 817 ដង/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: Ultrasound Examination [HO2: 817/yr]',
      activityType: 'core',
      ho2Stats: '817 ដង/ឆ្នាំ',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'phy_exercise_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យ និងធ្វើលំហាត់ប្រាណចលនា [ស្ថិតិ HO2: 60 ដង, 45 នាក់/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: Physiotherapy Exercise [HO2: 60 sessions]',
      activityType: 'core',
      ho2Stats: '60 ដង, 45 នាក់',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'den_extract_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការដកធ្មេញព្រៃ និងធ្មេញស្រុក [ស្ថិតិ HO2: 9 ធ្មេញ/ឆ្នាំ] (នាទី/ធ្មេញ)',
      titleEn: 'Core: Tooth Extraction [HO2: 9 teeth/yr]',
      activityType: 'core',
      ho2Stats: '9 ធ្មេញ/ឆ្នាំ',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_ecg_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការវាស់ចង្វាក់បេះដូងអគ្គិសនីលេខ (ECG)៖ ចំនួនអ្នកជំងឺដែលបានវាស់ ECG (អ្នកជំងឺ/ខែ)',
      titleEn: 'Core: ECG Patients (patients/month)',
      activityType: 'core',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_ecg_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលបិតប៉ះ និងវាស់ ECG (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: ECG time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'den_consult_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យសុខភាពមាត់ធ្មេញ៖ ចំនួនអ្នកជំងឺមកពិគ្រោះធ្មេញជាមធ្យម (អ្នកជំងឺ/ខែ)',
      titleEn: 'Core: Dental Consultation (patients/month)',
      activityType: 'core',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'den_consult_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលពិនិត្យ និងផ្តល់ការប្រឹក្សា (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Dental Consultation time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'den_filling_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការប៉ះធ្មេញ និងកោសកំបោរធ្មេញ៖ ចំនួនករណីប៉ះធ្មេញ/កោសកំបោរ (ករណី/ខែ)',
      titleEn: 'Core: Dental Filling & Scaling cases (cases/month)',
      activityType: 'core',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'den_filling_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលប៉ះធ្មេញ និងកោសសម្អាតកំបោរ (នាទី ក្នុងមួយករណី)',
      titleEn: 'Core: Dental Filling time (mins/case)',
      activityType: 'core',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_den_clean_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ពិនិត្យសុវត្ថិភាព ថែទាំ និងសម្អាតម៉ាស៊ីនថតកាំរស្មីអ៊ិច/អេកូ/កៅអីធ្មេញ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Equipment Maintenance & Cleaning (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_den_attendance',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំពេលព្រឹក និងចុះវត្តមានប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Morning Meeting & Attendance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_standby_night',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការប្រចាំការយាមត្រៀមថតកាំរស្មីអ៊ិចសង្គ្រោះបន្ទាន់ពេលយប់ (X-ray Standby) (នាទី/វេន)',
      titleEn: 'CAS: X-ray Emergency Standby (mins/shift)',
      activityType: 'cas',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'den_sterilize_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) លាងសម្អាត រៀបចំ និងស្ទ័ររីលឧបករណ៍ធ្មេញ (Autoclave) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Dental Instrument Sterilization (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_den_ho2_rep',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅ និងធ្វើរបាយការណ៍សកម្មភាពរូបភាពវេជ្ជសាស្ត្រ/ធ្មេញ HO2 (នាទី/ខែ)',
      titleEn: 'IAS: Imaging/Dental Monthly Report (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Imaging'
    },
    {
      id: 'img_den_consumables',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) គ្រប់គ្រងស្តុក និងស្នើសុំហ្វីល ជែល សារធាតុប៉ះធ្មេញ និងបរិក្ខារប្រើប្រាស់ (នាទី/ខែ)',
      titleEn: 'IAS: Film, Gel & Dental Consumables Stock (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Imaging'
    },

    // Group 6: Pharmacy
    {
      id: 'pha_rx_check_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពិនិត្យវេជ្ជបញ្ជា៖ ចំនួនវេជ្ជបញ្ជាដែលបានពិនិត្យផ្ទៀងផ្ទាត់ (វេជ្ជបញ្ជា/ថ្ងៃ)',
      titleEn: 'Core: Rx Verification: Prescriptions checked (Rx/day)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_rx_check_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលពិនិត្យផ្ទៀងផ្ទាត់វេជ្ជបញ្ជា និងកម្រិតថ្នាំ (នាទី ក្នុងមួយវេជ្ជបញ្ជា)',
      titleEn: 'Core: Rx Check time (mins/Rx)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_dispense_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការចែកឱសថអ្នកជំងឺក្រៅ៖ ចំនួនអ្នកជំងឺក្រៅដែលបានចែកឱសថ (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: OPD Dispensing: Patients served (patients/day)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_dispense_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលរៀបចំ ច្រកថ្នាំ និងចែកជូនអ្នកជំងឺក្រៅ (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: OPD Dispense time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_counsel_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការពន្យល់ការប្រើប្រាស់ថ្នាំ៖ ចំនួនអ្នកជំងឺដែលបានពន្យល់ណែនាំ (អ្នកជំងឺ/ថ្ងៃ)',
      titleEn: 'Core: Patient Medication Counseling (patients/day)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_counsel_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលពន្យល់ណែនាំរបៀបប្រើប្រាស់ថ្នាំ និងការប្រុងប្រយ័ត្ន (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Counseling time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_ward_dist_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការបើកផ្តល់ឱសថ និងសេរ៉ូមតាមផ្នែកសម្រាកពេទ្យទាំង ៥ (Ward Distribution) (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Inpatient Ward Distribution (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_clean_shelf_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) បោសជូតសម្អាតធ្នើរថ្នាំ និងរៀបចំកន្លែងមុនចូលធ្វើការ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Shelf Cleaning & Workplace Prep (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_temp_check_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ត្រួតពិនិត្យសីតុណ្ហភាពទូរទឹកកក និងឃ្លាំងឱសថប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Fridge & Warehouse Temperature Monitoring (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_attendance_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំពេលព្រឹក និងចុះវត្តមានប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Morning Meeting & Attendance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_prepack_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) រៀបចំឱសថទុកជាមុនសម្រាប់ចែកអ្នកជំងឺនៅថ្ងៃបន្ទាប់ (Pre-packaging) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Medication Pre-packaging (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_daily_drug_sum',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើសម្រង់ឱសថប្រចាំថ្ងៃ និងសម្រង់ឱសថ ART (Daily Drug Summary) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Drug Consumption Summary (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_bincard_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសាលកបត្រឃ្លាំង (Bin Card - ១ខែ ២ដង) (នាទី/ខែ)',
      titleEn: 'IAS: Bin Card Entry (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_stocking_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) លើកដាក់ និងរៀបចំឱសថចូលឃ្លាំងប្រចាំខែ (Unpacking & Stocking) (នាទី/ខែ)',
      titleEn: 'IAS: Monthly Medication Unpacking & Stocking (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_financial_rep',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍ចរន្តឱសថ និងថវិកាឱសថប្រចាំខែ (នាទី/ខែ)',
      titleEn: 'IAS: Monthly Pharmaceutical Financial Report (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Pharmacy'
    },
    {
      id: 'pha_expiry_rep',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើរបាយការណ៍ត្រួតពិនិត្យឱសថជិតផុតសុពលភាព (Expiry Date Report) (នាទី/ឆមាស)',
      titleEn: 'IAS: Drug Expiry Date Auditing Report (mins/semester)',
      activityType: 'ias',
      required: false,
      category: 'Pharmacy'
    },

    // Group 7: Admin & Finance
    {
      id: 'acc_cashier_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការប្រមូល និងកត់ត្រាប្រាក់ថ្លៃសេវាសុខាភិបាល [ស្ថិតិ HO2: 314 ករណីបង់ប្រាក់/ឆ្នាំ] (នាទី/ម្នាក់)',
      titleEn: 'Core: User Fee Cashier & Receipt Collection (mins/patient)',
      activityType: 'core',
      ho2Stats: '314 ករណីបង់ប្រាក់',
      required: false,
      category: 'Admin'
    },
    {
      id: 'hef_verify_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការផ្ទៀងផ្ទាត់ប័ណ្ណសមធម៌ IDPoor និង ប.ស.ស [ស្ថិតិ HO2: សមធម៌ 3,687, ប.ស.ស 157] (នាទី/ម្នាក់)',
      titleEn: 'Core: IDPoor & NSSF Verification [HO2: IDPoor 3,687, NSSF 157]',
      activityType: 'core',
      ho2Stats: 'សមធម៌ 3,687, ប.ស.ស 157',
      required: false,
      category: 'Admin'
    },
    {
      id: 'acc_receipt_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) ការចេញវិក្កយបត្រ៖ ចំនួនវិក្កយបត្របង់ប្រាក់ដែលបានចេញជាមធ្យម (បង្កាន់ដៃ/ថ្ងៃ)',
      titleEn: 'Core: Receipts issued (receipts/day)',
      activityType: 'core',
      required: false,
      category: 'Admin'
    },
    {
      id: 'acc_receipt_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលសរសេរ និងចេញបង្កាន់ដៃបង់ប្រាក់ផ្លូវការ (នាទី ក្នុងមួយបង្កាន់ដៃ)',
      titleEn: 'Core: Receipt writing time (mins/receipt)',
      activityType: 'core',
      required: false,
      category: 'Admin'
    },
    {
      id: 'hef_pre_id_cases',
      type: 'text',
      titleKm: '• (ការងារស្នូល) សម្ភាសន៍អ្នកជំងឺក្រីក្រគ្មានប័ណ្ណ៖ ចំនួនអ្នកជំងឺដែលបានសម្ភាសន៍ (នាក់/ខែ)',
      titleEn: 'Core: Pre-identification interview (patients/month)',
      activityType: 'core',
      required: false,
      category: 'Admin'
    },
    {
      id: 'hef_pre_id_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលសម្ភាសន៍ និងវាយតម្លៃ (Pre-identification) (នាទី ក្នុងម្នាក់)',
      titleEn: 'Core: Pre-ID interview time (mins/patient)',
      activityType: 'core',
      required: false,
      category: 'Admin'
    },
    {
      id: 'adm_meeting_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ប្រជុំពេលព្រឹក និងប្រជុំគណៈកម្មការរដ្ឋបាលមន្ទីរពេទ្យ (នាទី/ខែ)',
      titleEn: 'CAS: Hospital Admin Committee Meeting (mins/month)',
      activityType: 'cas',
      required: false,
      category: 'Admin'
    },
    {
      id: 'adm_attendance_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ចុះហត្ថលេខាវត្តមានការងារប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Attendance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Admin'
    },
    {
      id: 'acc_daily_cash_close',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បិទបញ្ជីចំណូល និងផ្ទៀងផ្ទាត់សាច់ប្រាក់ប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Cash Register Closing (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },
    {
      id: 'acc_fm20_entry_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បញ្ចូលរបាយការណ៍ចំណូលចំណាយ FM20 តាម Google Account ទៅក្រសួងសុខាភិបាល (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: MoH FM20 Financial Entry (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },
    {
      id: 'acc_bank_recon_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) រៀបចំបញ្ជីតាមដានប្រាក់ផ្ញើធនាគារ និងរបាយការណ៍សាលាខេត្ត (នាទី/សប្តាហ៍)',
      titleEn: 'IAS: Bank Reconciliation (mins/week)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },
    {
      id: 'hef_pmrs_entry_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បញ្ចូលទិន្នន័យអ្នកជំងឺសមធម៌ក្នុងប្រព័ន្ធកុំព្យូទ័រ PMRS (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: PMRS Data Entry (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },
    {
      id: 'it_troubleshoot_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ដោះស្រាយបញ្ហាបច្ចេកវិទ្យា និងប្រព័ន្ធកុំព្យូទ័រក្នុងមន្ទីរពេទ្យ (នាទី/សប្តាហ៍)',
      titleEn: 'IAS: IT & Hardware Troubleshooting (mins/week)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },
    {
      id: 'acc_mission_claim_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើតារាងទូទាត់សោហ៊ុយបេសកកម្មបុគ្គលិក (នាទី/ឆ្នាំ)',
      titleEn: 'IAS: Staff Mission Claim Settlement (mins/year)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },
    {
      id: 'adm_grievance_comm_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ប្រជុំគណៈកម្មការប្រមូលទិន្នន័យត្អូញត្អែល និងសំណូមពរអ្នកជំងឺ (នាទី/ខែ)',
      titleEn: 'IAS: Patient Grievance & Feedback Committee (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Admin'
    },

    // Group 8: Support
    {
      id: 'drv_kampong_cham_trips',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកបើកបរ) ចំនួនជើងបើករថយន្តសង្គ្រោះបញ្ជូនអ្នកជំងឺទៅខេត្តកំពង់ចាម (ជើង/ខែ)',
      titleEn: 'Core: Ambulance Trips to Kampong Cham (trips/month)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_kampong_cham_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលធ្វើដំណើរទៅមកជាមធ្យមទៅខេត្តកំពង់ចាម (នាទី ក្នុងមួយជើង)',
      titleEn: 'Core: Ambulance Travel time to province (mins/trip)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_hc_pickup_trips',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកបើកបរ) ចំនួនជើងបើករថយន្តទៅទទួលអ្នកជំងឺពីមណ្ឌលសុខភាព (ជើង/ខែ)',
      titleEn: 'Core: Ambulance HC patient pickup trips (trips/month)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_hc_pickup_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលធ្វើដំណើរទៅមកជាមធ្យមទៅមណ្ឌលសុខភាព (នាទី ក្នុងមួយជើង)',
      titleEn: 'Core: HC pickup travel time (mins/trip)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_corpse_trips',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកបើកបរ) ចំនួនជើងដឹកសពអ្នកជំងឺត្រឡប់ទៅគេហដ្ឋាន (ជើង/ឆ្នាំ)',
      titleEn: 'Core: Deceased transport trips (trips/year)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_corpse_time',
      type: 'text',
      titleKm: '➔ វាយបញ្ចូលរយៈពេលធ្វើដំណើរជាមធ្យមក្នុងការដឹកសព (នាទី ក្នុងមួយជើង)',
      titleEn: 'Core: Deceased transport travel time (mins/trip)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'cok_market_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកដាំស្ល) ទៅផ្សារទិញបន្លែ ត្រី សាច់ និងគ្រឿងទេស (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Hospital Cook: Grocery Shopping (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'cok_cooking_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកដាំស្ល) រៀបចំដាំស្ល និងស្លជូនអ្នកជំងឺសម្រាកពេទ្យ (១ថ្ងៃ ២ដង) (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Meal Cooking for Inpatients 2x/day (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'cok_distribute_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកដាំស្ល) រៀបចំ និងចែកបាយម្ហូបដល់បន្ទប់អ្នកជំងឺ (១ថ្ងៃ ២ដង) (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Meal Distribution to Wards 2x/day (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'cln_ward_mop_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកអនាម័យ) បោស និងជូតសម្អាតបន្ទប់អ្នកជំងឺ និងច្រករបៀង (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Ward & Corridor Cleaning (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'cln_toilet_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកអនាម័យ) លាងសម្អាត និងសម្លាប់មេរោគតាមបន្ទប់ទឹក/បង្គន់អនាម័យ (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Toilet Disinfection & Cleaning (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'cln_waste_time',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (អ្នកអនាម័យ) ប្រមូលថង់សំរាមវេជ្ជសាស្ត្រ និងសំរាមទូទៅតាមផ្នែក (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Medical & General Waste Collection (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'sec_guarding_mins',
      type: 'text',
      titleKm: '• (ការងារស្នូល) (សន្តិសុខ) យាមល្បាតច្រកទ្វារចេញចូល និងសម្របសម្រួលយានយន្ត (នាទី/ថ្ងៃ)',
      titleEn: 'Core: Security Gate Patrol & Traffic (mins/day)',
      activityType: 'core',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_maint_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ពិនិត្យប្រេង ទឹក កង់ និងលាងសម្អាតរថយន្តសង្គ្រោះប្រចាំថ្ងៃ (អ្នកបើកបរ) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Ambulance Maintenance & Wash (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Support'
    },
    {
      id: 'cok_dishwash_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) លាងសម្អាតចានឆ្នាំង និងបន្ទប់ផ្ទះបាយ (អ្នកដាំស្ល) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Dishwashing & Kitchen Sanitization (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Support'
    },
    {
      id: 'cln_campus_sweep_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) បោសសម្អាតទីធ្លា និងកាប់ស្មៅជុំវិញបរិវេណមន្ទីរពេទ្យ (អ្នកអនាម័យ) (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Hospital Yard Sweeping & Maintenance (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Support'
    },
    {
      id: 'sup_attendance_time',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការចុះហត្ថលេខាវត្តមានការងារប្រចាំថ្ងៃ (នាទី/ថ្ងៃ)',
      titleEn: 'CAS: Daily Attendance Signing (mins/day)',
      activityType: 'cas',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_standby_mins',
      type: 'text',
      titleKm: '• (ការងារគាំទ្រ) ការប្រចាំការយាមត្រៀមចេញរថយន្តសង្គ្រោះបន្ទាន់ ២៤ម៉ោង (Ambulance Standby) (នាទី/វេន)',
      titleEn: 'CAS: Ambulance 24h Standby Readiness (mins/shift)',
      activityType: 'cas',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_logbook_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាសៀវភៅបេសកកម្មរថយន្ត និងគីឡូម៉ែត្ររត់ប្រចាំថ្ងៃ (Logbook) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Ambulance Logbook Entry (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Support'
    },
    {
      id: 'drv_fuel_req_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ធ្វើសំណើស្នើសុំ និងទូទាត់ប្រេងឥន្ធនៈរថយន្តសង្គ្រោះ (នាទី/ខែ)',
      titleEn: 'IAS: Fuel Claim & Requisition (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Support'
    },
    {
      id: 'cln_incinerator_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) ដឹកជញ្ជូនសំរាមឆ្លងរោគទៅដុតកម្ទេចក្នុងឡដុត (Incinerator) (នាទី/សប្តាហ៍)',
      titleEn: 'IAS: Medical Waste Incineration (mins/week)',
      activityType: 'ias',
      required: false,
      category: 'Support'
    },
    {
      id: 'cok_food_exp_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) កត់ត្រាបញ្ជីចំណាយទិញម្ហូបអាហារប្រចាំថ្ងៃជូនរដ្ឋបាល (អ្នកដាំស្ល) (នាទី/ថ្ងៃ)',
      titleEn: 'IAS: Daily Food Expense Recording (mins/day)',
      activityType: 'ias',
      required: false,
      category: 'Support'
    },
    {
      id: 'cln_laundry_time',
      type: 'text',
      titleKm: '• (ការងាររដ្ឋបាល) បោកគក់កម្រាលពូក ស្រោមខ្នើយ និងវាំងនន (Laundry) (នាទី/ខែ)',
      titleEn: 'IAS: Hospital Linen & Laundry Washing (mins/month)',
      activityType: 'ias',
      required: false,
      category: 'Support'
    }
  ]
};

// Seeded empirical data from Hun Sen Stung Trang Referral Hospital
export const sampleMockResponses: SurveyResponse[] = [
  {
    id: 'RESP-ST-001',
    surveyId: 'wisn-rh-stung-trang-2026',
    submittedAt: '2026-11-05T08:30:00.000Z',
    completionTimeSeconds: 180,
    interviewerId: 'K001',
    staffCode: '001',
    staffName: 'ជា ចិន្តាម្នី',
    staffPhone: '099381926',
    primaryDepartment: 'TB Ward',
    cadre: 'Secondary Nurse',
    answers: {
      'interview_date': '2026-09-21',
      'interviewer_id': 'K001',
      'staff_code': '001',
      'staff_name': 'ជា ចិន្តាម្នី',
      'staff_phone': '099381926',
      'gender': 'Male',
      'employment_status': 'Civil Servant',
      'cadre': 'Secondary Nurse',
      'primary_department': 'TB Ward',
      'has_second_dept': 'Yes',
      'second_department': ['OPD', 'Emergency Room', 'General Medicine Ward', 'Pediatrics Ward', 'Laboratory', 'Admin & Finance'],
      'dept_time_split': '៩៥%នៅផ្នែកជំងឺទូទៅ',
      'work_experience': '> 5 years',
      'awt_days_week': 6,
      'awt_hours_day': 24,
      'awt_annual_leave': 0,
      'awt_holidays': 22,
      'awt_sick_leave': 0,
      'awt_special_leave': 0,
      'awt_training_days': 'ប្រជុំRRT 48h',
      'er_resus_time': '30min',
      'er_poison_time': 'ពស់ចឹក៣០នាទី, ពុលចំណី១ម៉ោង',
      'er_traffic_suture_time': '30min',
      'referral_escort_time': '2h',
      'nur_vital_cases': '90នាក់',
      'nur_vital_time': '3min',
      'nur_inject_cases': '90នាក់',
      'nur_inject_time': '5min',
      'nur_wound_cases': '5min',
      'nur_wound_time': '20min',
      'opd_morning_meet': '15min',
      'opd_ipc_clean': '5min',
      'opd_monthly_meet': '1:30min',
      'opd_attendance': '2min',
      'opd_logbook_time': '5min',
      'opd_referral_form': '5min',
      'opd_hef_nssf': '3min',
      'opd_drug_order': '5min',
      'opd_autoclave': '10min',
      'ipd_ward_round': '30min',
      'ipd_admission_cases': '20នាក់',
      'ipd_admission_time': '10min',
      'ped_diarrhea_cases': '250',
      'ped_diarrhea_time': '10min',
      'ped_pneumonia_time': '10min',
      'ped_sam_time': '5min',
      'ipd_inject_cases': 'បញ្ជូនទៅពេទ្យខេត្ត',
      'ipd_inject_time': '5min',
      'ipd_handover': '15min',
      'ipd_standby_night': '20min'
    },
    customTasks: [
      { id: 'ct-1', name: 'រៀបចំឯកសារជំងឺចេញ', category: 'cas', cases: '1', period: 'Per Day', mins: '5min' },
      { id: 'ct-2', name: 'ដឹកជញ្ជូនឈាមទៅកាន់មន្ទីរពិសោធន៍', category: 'cas', cases: '5', period: 'Per Day', mins: '3min' },
      { id: 'ct-3', name: 'តេស្ត Gly ជួសចុងដៃ', category: 'cas', cases: '10', period: 'Per Day', mins: '2min' },
      { id: 'ct-4', name: 'តេស្ត Gly semiauto', category: 'cas', cases: '10', period: 'Per Day', mins: '15min' },
      { id: 'ct-5', name: 'Test Chol Total', category: 'cas', cases: '10', period: 'Per Day', mins: '15min' },
      { id: 'ct-6', name: 'Test Urea', category: 'cas', cases: '10', period: 'Per Day', mins: '15' },
      { id: 'ct-7', name: 'Test Crea', category: 'cas', cases: '10', period: 'Per Day', mins: '15min' },
      { id: 'ct-8', name: 'Test Acid', category: 'cas', cases: '10', period: 'Per Day', mins: '15min' },
      { id: 'ct-9', name: 'Test GPT', category: 'cas', cases: '10', period: 'Per Day', mins: '15min' },
      { id: 'ct-10', name: 'ABO Group', category: 'cas', cases: '1', period: 'Per Day', mins: '3min' }
    ]
  },
  {
    id: 'RESP-ST-002',
    surveyId: 'wisn-rh-stung-trang-2026',
    submittedAt: '2026-11-05T09:10:00.000Z',
    completionTimeSeconds: 210,
    interviewerId: 'K001',
    staffCode: '003',
    staffName: 'ជា ដាលី',
    staffPhone: '069997570',
    primaryDepartment: 'Emergency Room',
    cadre: 'Medical Assistant',
    answers: {
      'interview_date': '2026-11-04',
      'interviewer_id': 'K001',
      'staff_code': '003',
      'staff_name': 'ជា ដាលី',
      'staff_phone': '069997570',
      'gender': 'Male',
      'employment_status': 'Civil Servant',
      'cadre': 'Medical Assistant',
      'primary_department': 'Emergency Room',
      'has_second_dept': 'Yes',
      'second_department': ['OPD', 'Emergency Room', 'General Medicine Ward', 'Pediatrics Ward', 'Eye Clinic'],
      'work_experience': '> 5 years',
      'awt_days_week': 6,
      'awt_hours_day': 24,
      'awt_annual_leave': 0,
      'awt_holidays': 22,
      'awt_sick_leave': 0,
      'awt_special_leave': 0,
      'awt_training_days': 'ភាពជាអ្នកដឹកនាំ 48h',
      'eye_consult_time': '15min',
      'opd_consult_time': '10min',
      'opd_ncd_time': '30min',
      'er_resus_time': '10min',
      'er_poison_time': '30min',
      'referral_escort_time': '2h',
      'opd_morning_meet': '15min',
      'opd_ipc_clean': '5min',
      'opd_monthly_meet': '2min',
      'opd_logbook_time': '3min',
      'opd_referral_form': '2min',
      'opd_hef_nssf': '1min',
      'opd_drug_order': '35min',
      'opd_autoclave': '1min',
      'ipd_ward_round': '10min',
      'ipd_admission_time': '5min',
      'ped_diarrhea_time': '10min',
      'ped_pneumonia_time': '5min',
      'ipd_discharge_sum': '10min',
      'ipd_handover': '5min'
    },
    customTasks: [
      { id: 'ct-11', name: 'ពិគ្រោះ និងចេញវេជ្ជបញ្ជាជំងឺក្រៅទូទៅផ្នែកភ្នែក', category: 'core', cases: '60', period: 'Per Year', mins: '15min' },
      { id: 'ct-12', name: 'រៀនភាពជាអ្នកដឹកនាំ 3h/week', category: 'ias', cases: '4', period: 'Per Week', mins: '3h' }
    ]
  },
  {
    id: 'RESP-ST-003',
    surveyId: 'wisn-rh-stung-trang-2026',
    submittedAt: '2026-11-05T09:45:00.000Z',
    completionTimeSeconds: 240,
    interviewerId: 'K001',
    staffCode: '004',
    staffName: 'បុិច ស៊ីណាត',
    staffPhone: '092239635',
    primaryDepartment: 'Maternity Ward',
    cadre: 'Secondary Midwife',
    answers: {
      'interview_date': '2026-11-04',
      'interviewer_id': 'K001',
      'staff_code': '004',
      'staff_name': 'បុិច ស៊ីណាត',
      'staff_phone': '092239635',
      'gender': 'Female',
      'employment_status': 'Civil Servant',
      'cadre': 'Secondary Midwife',
      'primary_department': 'Maternity Ward',
      'has_second_dept': 'Yes',
      'second_department': ['General Medicine Ward', 'OPD OB/GYN'],
      'dept_time_split': '៣០% នៅផ្នែកជំងឺទូទៅ',
      'work_experience': '> 5 years',
      'awt_days_week': 2,
      'awt_hours_day': 26,
      'awt_annual_leave': 0,
      'awt_holidays': 22,
      'awt_sick_leave': 0,
      'awt_special_leave': 0,
      'awt_training_days': 'ការពន្យារកំណើត 3day',
      'mat_normal_deliv_time': '1h',
      'mat_vacuum_deliv_time': '30min',
      'mat_skin_to_skin_time': '1:30h',
      'mat_neo_resus_time': '15min',
      'mat_pph_time': '1h',
      'mat_pnc_time': '20min',
      'mat_fp_time': '40min',
      'mat_via_time': '30min',
      'mat_anc_cases': '15',
      'mat_anc_time': '30min',
      'mat_partograph_time': '30min',
      'mat_episiotomy_time': '10min',
      'mat_handover': '30min',
      'mat_ipc_clean': '15min',
      'mat_birth_log': '30min',
      'mat_sterilize_packs': '10min',
      'mat_supply_order': '30min'
    },
    customTasks: [
      { id: 'ct-13', name: 'PMCTC', category: 'cas', cases: '1', period: 'Per Month', mins: '20min' },
      { id: 'ct-14', name: 'ពិនិត្យជំងឺក្រៅសម្ភព និងរោគស្រ្តី', category: 'core', cases: '10', period: 'Per Day', mins: '4:30min' }
    ]
  }
];
