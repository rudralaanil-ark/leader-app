import * as FileSystem from "expo-file-system/legacy";
import * as XLSX from "xlsx";

export type ParsedRow = {
  code?: string;
  name: string;
  duplicate?: boolean;
};

export async function parseExcel(
  fileUri: string,
  options: { type: "district" | "simple" }
): Promise<ParsedRow[]> {
  // 1️⃣ Copy picked file into cache (Android safe)
  const cacheUri = FileSystem.cacheDirectory + `upload-${Date.now()}.xlsx`;

  await FileSystem.copyAsync({
    from: fileUri,
    to: cacheUri,
  });

  // 2️⃣ Read as Base64 (legacy API supports this)
  const base64 = await FileSystem.readAsStringAsync(cacheUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // 3️⃣ Parse Excel
  const workbook = XLSX.read(base64, { type: "base64" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<any>(sheet, {
    defval: "",
  });

  const rows: ParsedRow[] = [];
  const seen = new Set<string>();

  json.forEach((row) => {
    let code: string | undefined;
    let name: string;

    if (options.type === "district") {
      code = String(row["district_code"] || "")
        .trim()
        .toUpperCase();
      name = String(row["district_name"] || "").trim();
    } else {
      name =
        row["name"] ||
        row["constituency_name"] ||
        row["city_name"] ||
        row["village_name"];
    }

    if (!name) return;

    const key = `${code ?? ""}-${name.toLowerCase()}`;
    const duplicate = seen.has(key);
    seen.add(key);

    rows.push({ code, name, duplicate });
  });

  return rows;
}
