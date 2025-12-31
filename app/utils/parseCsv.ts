import Papa from "papaparse";

export function parseCsv(
  fileUri: string,
  options: {
    type: "district" | "simple";
  }
): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileUri, {
      download: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows: ParsedRow[] = [];
          const seen = new Set<string>();

          results.data.forEach((row: any) => {
            let code: string | undefined;
            let name: string;

            // District CSV: GNT-Guntur
            if (options.type === "district") {
              const parts = String(row[0]).split("-");
              if (parts.length < 2) return;

              code = parts[0].trim().toUpperCase();
              name = parts.slice(1).join("-").trim();
            } else {
              // Constituency / City / Village CSV
              name = String(row[0]).trim();
            }

            if (!name) return;

            const key = `${code ?? ""}-${name.toLowerCase()}`;
            const duplicate = seen.has(key);
            seen.add(key);

            rows.push({ code, name, duplicate });
          });

          resolve(rows);
        } catch (e) {
          reject(e);
        }
      },
      error: reject,
    });
  });
}
