import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import { adminSurveyService } from "./adminSurveyService";

/* =====================================================
   EXPORT SURVEYS AS EXCEL (.xlsx)
   ✅ SDK 54+ SAFE
   ✅ LEGACY FS EXPLICIT
   ===================================================== */

export async function exportSurveysAsExcel() {
  try {
    // ✅ Explicitly use legacy filesystem API (SDK 54 fix)
    const FileSystem = require("expo-file-system/legacy");

    const surveys = await adminSurveyService.getAllSurveys();

    if (!surveys || surveys.length === 0) {
      alert("No surveys to export");
      return;
    }

    // 1️⃣ Prepare rows
    const rows = surveys.map((s: any) => ({
      Survey_ID: s.id ?? "",
      Name: s.person?.name ?? "",
      Phone: s.person?.phone ?? "",
      District: s.location?.districtCode ?? "",
      Constituency: s.location?.constituency ?? "",
      Mandal: s.location?.mandal ?? "",
      Village: s.location?.village ?? "",
      Submitted_By: s.submittedBy ?? "",
      Created_At: s.createdAt?.toDate?.().toLocaleString() ?? "",
    }));

    // 2️⃣ Worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // 3️⃣ Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Surveys");

    // 4️⃣ Convert to base64
    const base64Excel = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "base64",
    });

    // 5️⃣ Write REAL file (file://)
    const fileUri = FileSystem.cacheDirectory + `surveys_${Date.now()}.xlsx`;

    await FileSystem.writeAsStringAsync(fileUri, base64Excel, {
      encoding: "base64", // ✅ no EncodingType
    });

    // 6️⃣ Share Excel
    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Download Surveys (Excel)",
    });
  } catch (error) {
    console.error("Excel export failed:", error);
    alert("Failed to export surveys");
  }
}
