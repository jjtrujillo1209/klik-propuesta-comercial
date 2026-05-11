// ─────────────────────────────────────────────
// Google Apps Script — Log de confidencialidad
// Propuesta Comercial KLIK Energy
// ─────────────────────────────────────────────
// INSTRUCCIONES:
// 1. Ve a https://script.google.com → Nuevo proyecto
// 2. Pega este código completo
// 3. Clic en "Implementar" → "Nueva implementación"
// 4. Tipo: Aplicación web
//    - Ejecutar como: Yo (tu cuenta)
//    - Quién tiene acceso: Cualquier usuario
// 5. Copia la URL generada
// 6. Reemplaza REEMPLAZAR_CON_TU_URL en index.html con esa URL
// 7. Haz push de index.html actualizado a GitHub
// ─────────────────────────────────────────────

const SHEET_NAME = "Logs Confidencialidad";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Crear hoja si no existe, con encabezados
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "N°", "Fecha (Bogotá)", "Nombre", "Email",
        "Navegador", "Pantalla", "Referrer", "URL"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#E8474A").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);
    const lastRow = sheet.getLastRow();
    const num = lastRow; // N° de aceptación

    const browser = parseBrowser(data.userAgent || "");

    sheet.appendRow([
      num,
      data.fecha || new Date().toLocaleString(),
      data.nombre   || "—",
      data.email    || "—",
      browser,
      data.pantalla || "",
      data.referrer || "",
      data.url || ""
    ]);

    // Auto-ajustar columnas
    sheet.autoResizeColumns(1, 8);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: lastRow + 1 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parseBrowser(ua) {
  if (ua.includes("Chrome") && !ua.includes("Edg"))  return "Chrome";
  if (ua.includes("Firefox"))  return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg"))      return "Edge";
  if (ua.includes("OPR"))      return "Opera";
  return "Desconocido";
}

// Test manual desde el editor (Ejecutar → doGet)
function doGet() {
  return ContentService.createTextOutput("✅ Script activo — endpoint listo para recibir logs.");
}
