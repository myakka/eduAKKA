/**
 * ============================================================================
 * AKKA - Google Apps Script
 * Menerima hasil asesmen dari website AKKA (via fetch POST) dan menyimpannya
 * ke Google Sheets. (BAB 6.10, 7.8, 8.4)
 *
 * CARA PAKAI (ringkas, detail lengkap ada di docs/CONFIGURATION.md):
 * 1. Buka Google Sheets yang akan dipakai sebagai penyimpanan hasil asesmen.
 * 2. Menu Extensions > Apps Script.
 * 3. Hapus isi default, tempel seluruh isi file ini.
 * 4. Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Salin URL Web App, tempel ke data/config.json pada key "appsScriptUrl".
 * ============================================================================
 */

const SHEET_NAME = 'HasilAsesmen';

const HEADER = [
  'Timestamp Server', 'Nama', 'Kelas', 'Nomor Absen', 'Nama Asesmen',
  'Paket Soal', 'Token', 'Waktu Mulai', 'Waktu Selesai', 'Karena Waktu Habis',
  'Jumlah Pindah Tab', 'Nilai Otomatis', 'Nilai Maksimal Otomatis',
  'Ada Penilaian Manual', 'Nilai Uraian/Isian (Manual)', 'Nilai Akhir', 'Detail Jawaban (JSON)'
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.nama || '',
      data.kelas || '',
      data.absen || '',
      data.assessmentNama || '',
      data.paket || '',
      data.token || '',
      data.startAt ? new Date(data.startAt) : '',
      data.submittedAt ? new Date(data.submittedAt) : '',
      data.karenaWaktuHabis ? 'Ya' : 'Tidak',
      data.tabSwitchCount || 0,
      data.nilaiOtomatis || 0,
      data.nilaiMaksimalOtomatis || 0,
      data.adaPenilaianManual ? 'Ya' : 'Belum Dinilai',
      '',                      // Kolom nilai manual diisi guru langsung di Sheet
      data.nilaiOtomatis || 0, // Nilai akhir awal = nilai otomatis; guru menambahkan manual di Sheet
      JSON.stringify(data.jawaban || {})
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'AKKA Apps Script aktif.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
