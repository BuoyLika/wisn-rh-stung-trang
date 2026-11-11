// ====================================================================
// GOOGLE APPS SCRIPT សម្រាប់ទទួលទិន្នន័យពីទម្រង់ WISN SURVEY
// មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់ (RH Stung Trang)
// ====================================================================
//
// របៀបតម្លើងក្នុង GOOGLE SHEETS (ត្រឹមតែ ២ នាទី)៖
// 1. បើក Google Sheets ថ្មីមួយ (https://sheets.new)
// 2. ដាក់ឈ្មោះ Sheet ខាងលើ៖ "WISN_Survey_RH_Stung_Trang_2026"
// 3. ចុចម៉ឺនុយ Extensions (ផ្នែកបន្ថែម) -> ជ្រើសរើស Apps Script
// 4. លុបកូដចាស់ក្នុងនោះចេញទាំងអស់ ហើយ Copy កូដខាងក្រោមនេះយកទៅ Paste ចូល
// 5. ចុចប៊ូតុង Save (រូបថាស Icon 💾)
// 6. ចុចប៊ូតុង Deploy (ពណ៌ខៀវខាងលើស្តាំ) -> ជ្រើសរើស "New deployment"
// 7. ចុចរូបកង់ប៉ូលីស (Select type) -> រើសយក "Web app"
// 8. កំណត់ដូចខាងក្រោម៖
//    - Description: "WISN Survey Collector"
//    - Execute as: "Me" (គណនី Gmail របស់អ្នក)
//    - Who has access: "Anyone" (សំខាន់បំផុត៖ ត្រូវរើស Anyone ដើម្បីឱ្យ Tablet អាចរុញទិន្នន័យចូលបាន)
// 9. ចុចប៊ូតុង "Deploy" -> ចុច "Authorize access" (ជ្រើស Gmail របស់អ្នក -> ចុច Advanced -> ចុច Go to ... (unsafe) -> Allow)
// 10. Copy យក "Web App URL" (ដែលមានទម្រង់ https://script.google.com/macros/s/.../exec)
// 11. យក URL នោះមក Paste ចូលក្នុងប្រអប់កំណត់ Google Sheets លើទម្រង់ HTML របស់អ្នក! រួចរាល់!
// ====================================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  // រង់ចាំរហូតដល់ ១៥ វិនាទីដើម្បីការពារការជាន់គ្នាក្នុងពេលតែមួយ
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("WISN_Responses") || ss.getActiveSheet();
    
    // បង្កើតក្បាលតារាង (Headers) ប្រសិនបើទើបតែចាប់ផ្តើម
    if (sheet.getLastRow() === 0) {
      sheet.setName("WISN_Responses");
      var headers = [
        "កាលបរិច្ឆេទបញ្ជូន (Timestamp)",
        "លេខកូដចម្លើយ (Response ID)",
        "កូដអ្នកសម្ភាសន៍ (Interviewer ID)",
        "កាលបរិច្ឆេទសម្ភាសន៍ (Interview Date)",
        "កូដបុគ្គលិក (Staff Code)",
        "ឈ្មោះបុគ្គលិក (Staff Name)",
        "លេខទូរស័ព្ទ (Phone)",
        "ភេទ (Gender)",
        "មុខតំណែង (Cadre)",
        "ផ្នែកធ្វើការ (Department)",
        "ផ្នែកទីពីរ (Second Dept)",
        "ស្ថានភាពការងារ (Employment)",
        "បទពិសោធន៍ (Experience)",
        "AWT ថ្ងៃ/សប្តាហ៍",
        "AWT ម៉ោង/ថ្ងៃ",
        "AWT សម្រាកប្រចាំឆ្នាំ (ថ្ងៃ)",
        "AWT បុណ្យជាតិ (ថ្ងៃ)",
        "AWT ច្បាប់ឈឺ (ថ្ងៃ)",
        "AWT ច្បាប់ផ្សេងៗ (ថ្ងៃ)",
        "AWT បណ្តុះបណ្តាល (ថ្ងៃ)",
        "AWT ម៉ោងការងារប្រចាំឆ្នាំ (ម៉ោង)",
        "សេចក្តីសង្ខេបការងារស្នូល Core (នាទី/ករណី)",
        "សេចក្តីសង្ខេបការងារគាំទ្រ CAS (%)",
        "សេចក្តីសង្ខេបការងាររដ្ឋបាល IAS (ម៉ោង/សប្តាហ៍)",
        "សកម្មភាពបន្ថែម (Custom Tasks)",
        "ទិន្នន័យចម្លើយទាំងអស់ (Full JSON Data)"
      ];
      sheet.appendRow(headers);
      
      // រៀបចំស្ទីលក្បាលតារាងឱ្យស្អាត
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0d9488"); // Teal color
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // អានទិន្នន័យដែល Tablet ឬទម្រង់បានផ្ញើមក
    var requestData;
    if (e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      requestData = e.parameter;
    } else {
      throw new Error("No data received");
    }

    // បញ្ចូលជួរទិន្នន័យថ្មី
    sheet.appendRow([
      new Date().toLocaleString("km-KH", { timeZone: "Asia/Phnom_Penh" }),
      requestData.id || "",
      requestData.interviewerId || "",
      requestData.interviewDate || "",
      requestData.staffCode || "",
      requestData.staffName || "",
      requestData.staffPhone || "",
      requestData.gender || "",
      requestData.cadre || "",
      requestData.department || "",
      requestData.hasSecondDept || "No",
      requestData.employmentStatus || "",
      requestData.experience || "",
      requestData.awtDaysWeek || 5,
      requestData.awtHoursDay || 8,
      requestData.awtAnnualLeave || 15,
      requestData.awtHolidays || 22,
      requestData.awtSickLeave || 0,
      requestData.awtSpecialLeave || 0,
      requestData.awtTrainingDays || 0,
      requestData.awtTotalHours || "",
      requestData.coreSummary || "",
      requestData.casSummary || "",
      requestData.iasSummary || "",
      requestData.customTasksSummary || "",
      JSON.stringify(requestData)
    ]);

    // កំណត់ទំហំ Column ឱ្យសមរម្យ
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data saved successfully to Google Sheet",
      id: requestData.id 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "online", 
    message: "WISN Google Sheet Webhook is active and ready to receive data." 
  })).setMimeType(ContentService.MimeType.JSON);
}
