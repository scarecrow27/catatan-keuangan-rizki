/**
 * ==========================================================================
 * FinSmart - Google Apps Script Backend (Database Google Spreadsheet)
 * ==========================================================================
 * 
 * PANDUAN CARA PASANG:
 * 1. Buka Google Drive (https://drive.google.com) dan buat Google Spreadsheet baru.
 * 2. Beri nama spreadsheet Anda, contoh: "Data Keuangan FinSmart".
 * 3. Di menu atas Google Sheets, klik "Extensions" (Ekstensi) > "Apps Script".
 * 4. Hapus semua kode yang ada di Apps Script, lalu SALIN & TEMPEL (PASTE) semua kode di bawah ini.
 * 5. Klik ikon Simpan (Disk / Ctrl+S).
 * 6. Klik tombol biru "Deploy" (Terapkan) di pojok kanan atas > "New deployment" (Penerapan baru).
 * 7. Pilih tipe "Web app" (ikon roda gigi di samping kiri).
 * 8. Atur pengaturan berikut:
 *    - Description: "FinSmart API"
 *    - Execute as: "Me (email Anda)"
 *    - Who has access: "Anyone" (Siapa saja - agar web Anda bisa menyimpan data).
 * 9. Klik "Deploy", lalu klik "Authorize access" (Izinkan akses dengan akun Google Anda).
 * 10. Salin "Web app URL" (yang berakhiran /exec) dan tempelkan ke aplikasi web FinSmart Anda!
 */

// Handle HTTP GET: Mengambil seluruh data dari Google Spreadsheet ke Web FinSmart
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Cek sheet "Backup_JSON"
    let jsonSheet = ss.getSheetByName("Backup_JSON");
    let payload = null;
    
    if (jsonSheet && jsonSheet.getLastRow() >= 1) {
      const rawJson = jsonSheet.getRange(1, 1).getValue();
      if (rawJson && typeof rawJson === 'string' && rawJson.trim().startsWith('{')) {
        payload = JSON.parse(rawJson);
      }
    }
    
    if (!payload) {
      payload = { status: "empty", message: "Spreadsheet terhubung, belum ada data tersimpan." };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle HTTP POST: Menerima data dari Web FinSmart dan menyusunnya ke Spreadsheet
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Tidak ada data yang diterima" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const contents = e.postData.contents;
    const data = JSON.parse(contents);

    // 1. Simpan Snapshot JSON Lengkap di Sheet "Backup_JSON"
    let jsonSheet = ss.getSheetByName("Backup_JSON");
    if (!jsonSheet) {
      jsonSheet = ss.insertSheet("Backup_JSON");
    }
    jsonSheet.clear();
    jsonSheet.getRange(1, 1).setValue(JSON.stringify(data));

    // 2. Tulis Tabel Cantik di Sheet "Transaksi"
    if (Array.isArray(data.transactions)) {
      let txSheet = ss.getSheetByName("Transaksi");
      if (!txSheet) {
        txSheet = ss.insertSheet("Transaksi");
      }
      txSheet.clear();
      
      const headers = ["ID", "Tanggal", "Tipe", "Kategori", "Nominal (Rp)", "Akun / Dari", "Ke Akun", "Biaya Admin", "Keterangan", "Catatan"];
      txSheet.appendRow(headers);
      
      // Styling Header
      const headerRange = txSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#E0E7FF");
      headerRange.setFontColor("#1E1B4B");
      
      const rows = data.transactions.map(tx => {
        let typeStr = 'Pengeluaran';
        if (tx.type === 'income') typeStr = 'Pemasukan';
        if (tx.type === 'transfer') typeStr = 'Transfer / Mutasi';

        return [
          tx.id || '',
          tx.date || '',
          typeStr,
          tx.category || '',
          Number(tx.amount) || 0,
          tx.type === 'transfer' ? (tx.fromAccount || '') : (tx.account || ''),
          tx.type === 'transfer' ? (tx.toAccount || '') : '-',
          Number(tx.fee) || 0,
          tx.desc || '',
          tx.note || ''
        ];
      });

      if (rows.length > 0) {
        txSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
        txSheet.getRange(2, 5, rows.length, 1).setNumberFormat("Rp #,##0");
        txSheet.getRange(2, 8, rows.length, 1).setNumberFormat("Rp #,##0");
      }
      txSheet.autoResizeColumns(1, headers.length);
    }

    // 3. Tulis Tabel di Sheet "Akun_Rekening"
    if (Array.isArray(data.accounts)) {
      let accSheet = ss.getSheetByName("Akun_Rekening");
      if (!accSheet) {
        accSheet = ss.insertSheet("Akun_Rekening");
      }
      accSheet.clear();
      
      const accHeaders = ["ID Akun", "Nama Akun / Bank", "Icon Emoji", "Saldo Awal (Rp)"];
      accSheet.appendRow(accHeaders);
      
      const accHeaderRange = accSheet.getRange(1, 1, 1, accHeaders.length);
      accHeaderRange.setFontWeight("bold");
      accHeaderRange.setBackground("#D1FAE5");
      accHeaderRange.setFontColor("#064E3B");
      
      const accRows = data.accounts.map(acc => [
        acc.id || '',
        acc.name || '',
        acc.icon || '',
        Number(acc.initialBalance) || 0
      ]);

      if (accRows.length > 0) {
        accSheet.getRange(2, 1, accRows.length, accHeaders.length).setValues(accRows);
        accSheet.getRange(2, 4, accRows.length, 1).setNumberFormat("Rp #,##0");
      }
      accSheet.autoResizeColumns(1, accHeaders.length);
    }

    // 4. Tulis Tabel di Sheet "Target_Tabungan"
    if (Array.isArray(data.goals)) {
      let goalSheet = ss.getSheetByName("Target_Tabungan");
      if (!goalSheet) {
        goalSheet = ss.insertSheet("Target_Tabungan");
      }
      goalSheet.clear();
      
      const goalHeaders = ["ID Target", "Nama Target / Impian", "Icon", "Target Nominal (Rp)", "Saldo Terkumpul (Rp)", "Tenggat Waktu"];
      goalSheet.appendRow(goalHeaders);
      
      const goalHeaderRange = goalSheet.getRange(1, 1, 1, goalHeaders.length);
      goalHeaderRange.setFontWeight("bold");
      goalHeaderRange.setBackground("#FEF3C7");
      goalHeaderRange.setFontColor("#78350F");
      
      const goalRows = data.goals.map(g => [
        g.id || '',
        g.title || '',
        g.icon || '',
        Number(g.targetAmount) || 0,
        Number(g.currentAmount) || 0,
        g.deadline || '-'
      ]);

      if (goalRows.length > 0) {
        goalSheet.getRange(2, 1, goalRows.length, goalHeaders.length).setValues(goalRows);
        goalSheet.getRange(2, 4, goalRows.length, 2).setNumberFormat("Rp #,##0");
      }
      goalSheet.autoResizeColumns(1, goalHeaders.length);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan ke Google Spreadsheet!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
