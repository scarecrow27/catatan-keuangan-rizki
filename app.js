/**
 * FinSmart - Aplikasi Catatan Keuangan Pribadi Modern
 * Multi-Account, Saldo Awal, Transfer Antar Rekening, Custom Categories,
 * Analisis Detail Bulanan, Target Tabungan Bulanan, dan Cloud Sync Multi-Perangkat
 */

// --- Default Initial Categories (Pengeluaran, Pemasukan, dan Transfer) ---
const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'makanan', name: 'Makanan & Minuman', icon: '🍔', color: '#F97316' },
    { id: 'transport', name: 'Transportasi & Bensin', icon: '🚗', color: '#3B82F6' },
    { id: 'belanja', name: 'Belanja & Kebutuhan', icon: '🛍️', color: '#EC4899' },
    { id: 'tagihan', name: 'Tagihan & Utilitas', icon: '💡', color: '#EAB308' },
    { id: 'hiburan', name: 'Hiburan & Hobi', icon: '🎮', color: '#8B5CF6' },
    { id: 'kesehatan', name: 'Kesehatan & Medis', icon: '💊', color: '#10B981' },
    { id: 'pendidikan', name: 'Pendidikan & Kursus', icon: '📚', color: '#06B6D4' },
    { id: 'lainnya', name: 'Pengeluaran Lain', icon: '📦', color: '#64748B' }
  ],
  income: [
    { id: 'gaji', name: 'Gaji Pokok / Upah', icon: '💼', color: '#10B981' },
    { id: 'bonus', name: 'Bonus & THR', icon: '🎁', color: '#6366F1' },
    { id: 'usaha', name: 'Bisnis & Freelance', icon: '💻', color: '#0EA5E9' },
    { id: 'investasi', name: 'Dividen & Investasi', icon: '📈', color: '#14B8A6' },
    { id: 'lainnya', name: 'Pemasukan Lain', icon: '🧧', color: '#F59E0B' }
  ],
  transfer: [
    { id: 'topup', name: 'Top Up E-Wallet', icon: '📱', color: '#6366F1' },
    { id: 'tarik_tunai', name: 'Tarik Tunai ATM', icon: '💵', color: '#10B981' },
    { id: 'antar_bank', name: 'Pindah Antar Bank', icon: '🏦', color: '#0EA5E9' },
    { id: 'investasi_trf', name: 'Setor Tabungan / Investasi', icon: '📈', color: '#14B8A6' },
    { id: 'keluarga', name: 'Kirim ke Keluarga / Teman', icon: '👨‍👩‍👧', color: '#EC4899' },
    { id: 'lainnya_trf', name: 'Transfer Lainnya', icon: '📦', color: '#64748B' }
  ]
};

// --- Default Initial 4 Accounts ---
const DEFAULT_ACCOUNTS = [
  { id: 'cash', name: 'Cash', icon: '💵', initialBalance: 500000 },
  { id: 'mandiri', name: 'Bank Mandiri', icon: '🏦', initialBalance: 3500000 },
  { id: 'kaltimtara', name: 'Bank Kaltimtara', icon: '🏛️', initialBalance: 2000000 },
  { id: 'gopay', name: 'Gopay', icon: '📱', initialBalance: 250000 }
];

// --- Default Monthly Savings Target ---
const DEFAULT_MONTHLY_TARGETS = {
  default: 2000000
};

// ==========================================================================
// 🔗 DEFAULT DATABASE URL (Opsional: Masukkan Web App URL Google Sheets Anda di sini)
// Jika diisi, semua HP & Laptop yang membuka link website akan OTOMATIS terhubung!
// ==========================================================================
const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxBauqf37U7jHit6jeqfHCwaxc8Enb61zXWCJwqU_45uiBZ7QHBQqRHYwwFVGyPxSRv/exec";

// Helper untuk membaca konfigurasi dari URL Parameter atau LocalStorage
function getInitialGoogleSheetUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('sheet') || params.get('gsheet');
    if (urlParam && urlParam.startsWith('http')) {
      localStorage.setItem('finsmart_gsheet_url', urlParam);
      return urlParam;
    }
  } catch (e) { }
  const saved = localStorage.getItem('finsmart_gsheet_url');
  if (saved && saved.startsWith('http')) return saved;
  return DEFAULT_GOOGLE_SHEET_URL;
}

function getInitialSyncKey() {
  try {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('key') || params.get('sync');
    if (keyParam) {
      localStorage.setItem('finsmart_sync_key', keyParam);
      return keyParam;
    }
  } catch (e) { }
  return localStorage.getItem('finsmart_sync_key') || '';
}

// --- Initial Demo Transactions ---
function getInitialDemoData() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return [
    {
      id: 'tx_demo_1',
      desc: 'Gaji Bulanan',
      amount: 6500000,
      type: 'income',
      category: 'gaji',
      account: 'mandiri',
      date: `${year}-${month}-01`,
      note: 'Gaji pokok bulanan'
    },
    {
      id: 'tx_demo_2',
      desc: 'Tarik Tunai untuk Dompet',
      amount: 400000,
      type: 'transfer',
      category: 'tarik_tunai',
      fromAccount: 'mandiri',
      toAccount: 'cash',
      fee: 0,
      date: `${year}-${month}-02`,
      note: 'Tarik tunai di ATM Mandiri'
    },
    {
      id: 'tx_demo_3',
      desc: 'Top Up Saldo Gopay',
      amount: 200000,
      type: 'transfer',
      category: 'topup',
      fromAccount: 'kaltimtara',
      toAccount: 'gopay',
      fee: 1000,
      date: `${year}-${month}-03`,
      note: 'Top up lewat mobile banking'
    },
    {
      id: 'tx_demo_4',
      desc: 'Makan Siang & Kopi',
      amount: 45000,
      type: 'expense',
      category: 'makanan',
      account: 'cash',
      date: `${year}-${month}-04`,
      note: 'Nasi padang + es teh'
    }
  ];
}

// Target Tabungan Jangka Panjang / Wishlist yang sudah ada
function getInitialGoals() {
  return [
    {
      id: 'goal_1',
      title: 'Dana Darurat 6 Bulan',
      targetAmount: 25000000,
      currentAmount: 14500000,
      deadline: '2026-12-31',
      icon: '🛡️'
    },
    {
      id: 'goal_2',
      title: 'Liburan Akhir Tahun ke Bali',
      targetAmount: 6000000,
      currentAmount: 3800000,
      deadline: '2026-11-30',
      icon: '✈️'
    }
  ];
}

// Current Year-Month string (e.g. "2026-08")
function getCurrentYearMonthStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// Ensure transfer categories exist in state categories
function ensureCategoriesStructure(cats) {
  if (!cats || typeof cats !== 'object') cats = DEFAULT_CATEGORIES;
  if (!cats.expense) cats.expense = DEFAULT_CATEGORIES.expense;
  if (!cats.income) cats.income = DEFAULT_CATEGORIES.income;
  if (!cats.transfer) cats.transfer = DEFAULT_CATEGORIES.transfer;
  return cats;
}

// --- App State Management ---
const state = {
  accounts: JSON.parse(localStorage.getItem('finsmart_accounts')) || DEFAULT_ACCOUNTS,
  categories: ensureCategoriesStructure(JSON.parse(localStorage.getItem('finsmart_categories'))),
  transactions: JSON.parse(localStorage.getItem('finsmart_tx')) || getInitialDemoData(),
  goals: JSON.parse(localStorage.getItem('finsmart_goals')) || getInitialGoals(),
  monthlyTargets: JSON.parse(localStorage.getItem('finsmart_monthly_targets')) || DEFAULT_MONTHLY_TARGETS,
  syncKey: getInitialSyncKey(),
  googleSheetUrl: getInitialGoogleSheetUrl(),
  isSyncing: false,
  filter: {
    search: '',
    type: 'all',
    category: 'all',
    account: 'all',
    month: ''
  },
  analyticsMonth: getCurrentYearMonthStr(),
  analyticsViewMode: 'single', // 'single' | 'matrix'
  editingTxId: null,
  currentTab: 'dashboard',
  expenseDonutInstance: null,
  incomeDonutInstance: null,
  transferDonutInstance: null,
  dailyTrendInstance: null
};

// --- Storage & Cloud / Google Sheets Sync Helper ---
function saveToStorage() {
  localStorage.setItem('finsmart_accounts', JSON.stringify(state.accounts));
  localStorage.setItem('finsmart_categories', JSON.stringify(state.categories));
  localStorage.setItem('finsmart_tx', JSON.stringify(state.transactions));
  localStorage.setItem('finsmart_goals', JSON.stringify(state.goals));
  localStorage.setItem('finsmart_monthly_targets', JSON.stringify(state.monthlyTargets));

  // Trigger Cloud Auto-Sync if sync key is configured
  if (state.syncKey) {
    debounceCloudPush();
  }

  // Trigger Google Sheet Auto-Sync if Google Sheets Web App URL is configured
  if (state.googleSheetUrl) {
    debounceGoogleSheetPush();
  }
}

// Helper Get & Set Monthly Savings Target
function getMonthlySavingsTarget(yearMonthStr) {
  if (state.monthlyTargets[yearMonthStr] !== undefined) {
    return Number(state.monthlyTargets[yearMonthStr]);
  }
  return Number(state.monthlyTargets.default) || 2000000;
}

function setMonthlySavingsTarget(yearMonthStr, amount) {
  state.monthlyTargets[yearMonthStr] = Number(amount);
  saveToStorage();
}

// --- Formatters ---
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatMonthTitleIndo(yearMonthStr) {
  if (!yearMonthStr) return 'Semua Periode';
  const parts = yearMonthStr.split('-');
  if (parts.length !== 2) return yearMonthStr;
  const date = new Date(parts[0], parts[1] - 1, 1);
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });
}

// --- Toast System ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '✅';
  if (type === 'danger') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ==========================================================================
// ☁️ CLOUD SYNC ENGINE (Sinkronisasi Multi-Perangkat HP & Laptop)
// ==========================================================================

// Free & persistent Cloud Key-Value API endpoint (KVDB / Public Store)
const CLOUD_SYNC_ENDPOINT = 'https://kvdb.io/F8zZ5tN8a44bVbT5jM6E1K/';

let syncDebounceTimer = null;
function debounceCloudPush() {
  clearTimeout(syncDebounceTimer);
  updateSyncUI('syncing');
  syncDebounceTimer = setTimeout(() => {
    pushDataToCloud(false);
  }, 1200);
}

function getSanitizedSyncKey(key) {
  return encodeURIComponent(key.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
}

async function pushDataToCloud(showNotification = true) {
  if (!state.syncKey) return;
  const cleanKey = getSanitizedSyncKey(state.syncKey);

  const payload = {
    updatedAt: new Date().toISOString(),
    accounts: state.accounts,
    categories: state.categories,
    transactions: state.transactions,
    goals: state.goals,
    monthlyTargets: state.monthlyTargets
  };

  try {
    updateSyncUI('syncing');
    const response = await fetch(`${CLOUD_SYNC_ENDPOINT}${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      updateSyncUI('synced');
      if (showNotification) {
        showToast('Data berhasil diunggah ke Cloud! ☁️');
      }
    } else {
      updateSyncUI('offline');
    }
  } catch (err) {
    console.warn('Cloud Sync Push Error:', err);
    updateSyncUI('offline');
  }
}

async function pullDataFromCloud(showNotification = true) {
  if (!state.syncKey) return;
  const cleanKey = getSanitizedSyncKey(state.syncKey);

  try {
    updateSyncUI('syncing');
    const response = await fetch(`${CLOUD_SYNC_ENDPOINT}${cleanKey}`);

    if (response.status === 404) {
      // Key is brand new in cloud: push current local data to initialize it
      await pushDataToCloud(false);
      updateSyncUI('synced');
      if (showNotification) {
        showToast('Kunci cloud baru dibuat & data awal berhasil disinkronkan! 🚀');
      }
      return;
    }

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.transactions)) {
        state.transactions = data.transactions;
        if (Array.isArray(data.accounts)) state.accounts = data.accounts;
        if (data.categories) state.categories = ensureCategoriesStructure(data.categories);
        if (Array.isArray(data.goals)) state.goals = data.goals;
        if (data.monthlyTargets) state.monthlyTargets = data.monthlyTargets;

        localStorage.setItem('finsmart_accounts', JSON.stringify(state.accounts));
        localStorage.setItem('finsmart_categories', JSON.stringify(state.categories));
        localStorage.setItem('finsmart_tx', JSON.stringify(state.transactions));
        localStorage.setItem('finsmart_goals', JSON.stringify(state.goals));
        localStorage.setItem('finsmart_monthly_targets', JSON.stringify(state.monthlyTargets));

        refreshAll();
        updateSyncUI('synced');
        if (showNotification) {
          showToast('Data terbaru berhasil disinkronkan dari Cloud! 🔄');
        }
      }
    } else {
      updateSyncUI('offline');
    }
  } catch (err) {
    console.warn('Cloud Sync Pull Error:', err);
    updateSyncUI('offline');
  }
}

function updateSyncUI(status) {
  const dot = document.getElementById('syncStatusDot');
  const text = document.getElementById('syncStatusText');
  const modalText = document.getElementById('syncModalStatusText');
  const disconnectBtn = document.getElementById('btnDisconnectSync');
  const settingsBadge = document.getElementById('settingsSyncBadge');
  const settingsSub = document.getElementById('settingsSyncSubText');

  if (state.syncKey) {
    if (disconnectBtn) disconnectBtn.style.display = 'block';
    if (modalText) modalText.innerHTML = `🟢 Terhubung: <strong style="color: var(--accent-indigo); font-family: var(--font-mono);">${state.syncKey}</strong>`;
    if (settingsBadge) {
      settingsBadge.innerText = 'Tersinkron Cloud ☁️';
      settingsBadge.className = 'metric-badge badge-positive';
    }
    if (settingsSub) settingsSub.innerText = `Terhubung dengan kunci: ${state.syncKey}`;
  } else {
    if (disconnectBtn) disconnectBtn.style.display = 'none';
    if (modalText) modalText.innerHTML = '⚪ Mode Offline (Data hanya tersimpan di perangkat ini)';
    if (settingsBadge) {
      settingsBadge.innerText = 'Atur Cloud';
      settingsBadge.className = 'metric-badge';
    }
    if (settingsSub) settingsSub.innerText = 'Hubungkan data agar sama persis di HP & Laptop secara otomatis';
  }

  if (dot && text) {
    dot.className = 'sync-dot';
    if (status === 'synced') {
      dot.classList.add('synced');
      text.innerText = 'Cloud Sync';
    } else if (status === 'syncing') {
      dot.classList.add('syncing');
      text.innerText = 'Syncing...';
    } else {
      text.innerText = state.syncKey ? 'Tersambung' : 'Offline';
    }
  }
}

function openCloudSyncModal() {
  const input = document.getElementById('inputSyncKey');
  if (input) input.value = state.syncKey || '';
  updateSyncUI(state.syncKey ? 'synced' : 'offline');
  openModal('cloudSyncModal');
}

async function handleConnectCloudSync(e) {
  e.preventDefault();
  const input = document.getElementById('inputSyncKey');
  const key = input ? input.value.trim() : '';

  if (!key) {
    showToast('Harap masukkan kode kunci sinkronisasi!', 'danger');
    return;
  }

  state.syncKey = key;
  localStorage.setItem('finsmart_sync_key', key);
  closeModal('cloudSyncModal');
  showToast(`Menghubungkan ke Cloud dengan kunci "${key}"... ☁️`, 'info');

  await pullDataFromCloud(true);
}

function disconnectCloudSync() {
  if (confirm('Putuskan sinkronisasi Cloud? Data lokal di perangkat ini tetap aman.')) {
    state.syncKey = '';
    localStorage.removeItem('finsmart_sync_key');
    updateSyncUI('offline');
    closeModal('cloudSyncModal');
    showToast('Sinkronisasi Cloud dinonaktifkan. Mode offline aktif.', 'info');
  }
}

function forcePushToCloud() {
  if (!state.syncKey) {
    showToast('Harap hubungkan kode kunci sinkronisasi terlebih dahulu!', 'danger');
    return;
  }
  pushDataToCloud(true);
}

function forcePullFromCloud() {
  if (!state.syncKey) {
    showToast('Harap hubungkan kode kunci sinkronisasi terlebih dahulu!', 'danger');
    return;
  }
  pullDataFromCloud(true);
}

// ==========================================================================
// 📊 GOOGLE SPREADSHEET DATABASE SYNC ENGINE
// ==========================================================================

const GOOGLE_APPS_SCRIPT_TEMPLATE = `// FinSmart - Google Apps Script Backend (Database Google Sheets)
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
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
    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Tidak ada data yang diterima" })).setMimeType(ContentService.MimeType.JSON);
    }
    const data = JSON.parse(e.postData.contents);

    // 1. Simpan Snapshot Backup JSON
    let jsonSheet = ss.getSheetByName("Backup_JSON");
    if (!jsonSheet) jsonSheet = ss.insertSheet("Backup_JSON");
    jsonSheet.clear();
    jsonSheet.getRange(1, 1).setValue(JSON.stringify(data));

    // 2. Tulis Tabel Sheet Transaksi
    if (Array.isArray(data.transactions)) {
      let txSheet = ss.getSheetByName("Transaksi");
      if (!txSheet) txSheet = ss.insertSheet("Transaksi");
      txSheet.clear();
      const headers = ["ID", "Tanggal", "Tipe", "Kategori", "Nominal (Rp)", "Akun / Dari", "Ke Akun", "Biaya Admin", "Keterangan", "Catatan"];
      txSheet.appendRow(headers);
      txSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#E0E7FF").setFontColor("#1E1B4B");
      
      const rows = data.transactions.map(tx => [
        tx.id || '',
        tx.date || '',
        tx.type === 'expense' ? 'Pengeluaran' : (tx.type === 'income' ? 'Pemasukan' : 'Transfer / Mutasi'),
        tx.category || '',
        Number(tx.amount) || 0,
        tx.type === 'transfer' ? (tx.fromAccount || '') : (tx.account || ''),
        tx.type === 'transfer' ? (tx.toAccount || '') : '-',
        Number(tx.fee) || 0,
        tx.desc || '',
        tx.note || ''
      ]);
      if (rows.length > 0) {
        txSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
        txSheet.getRange(2, 5, rows.length, 1).setNumberFormat("Rp #,##0");
        txSheet.getRange(2, 8, rows.length, 1).setNumberFormat("Rp #,##0");
      }
      txSheet.autoResizeColumns(1, headers.length);
    }

    // 3. Tulis Tabel Sheet Akun_Rekening
    if (Array.isArray(data.accounts)) {
      let accSheet = ss.getSheetByName("Akun_Rekening");
      if (!accSheet) accSheet = ss.insertSheet("Akun_Rekening");
      accSheet.clear();
      const accHeaders = ["ID Akun", "Nama Akun / Bank", "Icon Emoji", "Saldo Awal (Rp)"];
      accSheet.appendRow(accHeaders);
      accSheet.getRange(1, 1, 1, accHeaders.length).setFontWeight("bold").setBackground("#D1FAE5").setFontColor("#064E3B");
      
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

    // 4. Tulis Tabel Sheet Target_Tabungan
    if (Array.isArray(data.goals)) {
      let goalSheet = ss.getSheetByName("Target_Tabungan");
      if (!goalSheet) goalSheet = ss.insertSheet("Target_Tabungan");
      goalSheet.clear();
      const goalHeaders = ["ID Target", "Nama Target / Impian", "Icon", "Target Nominal (Rp)", "Saldo Terkumpul (Rp)", "Tenggat Waktu"];
      goalSheet.appendRow(goalHeaders);
      goalSheet.getRange(1, 1, 1, goalHeaders.length).setFontWeight("bold").setBackground("#FEF3C7").setFontColor("#78350F");
      
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

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan ke Google Spreadsheet!" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

let gsheetDebounceTimer = null;
function debounceGoogleSheetPush() {
  clearTimeout(gsheetDebounceTimer);
  updateGoogleSheetUI('syncing');
  gsheetDebounceTimer = setTimeout(() => {
    pushDataToGoogleSheet(false);
  }, 1500);
}

async function pushDataToGoogleSheet(showNotification = true) {
  if (!state.googleSheetUrl) return;

  const payload = {
    updatedAt: new Date().toISOString(),
    accounts: state.accounts,
    categories: state.categories,
    transactions: state.transactions,
    goals: state.goals,
    monthlyTargets: state.monthlyTargets
  };

  try {
    updateGoogleSheetUI('syncing');
    await fetch(state.googleSheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    updateGoogleSheetUI('synced');
    if (showNotification) {
      showToast('Data berhasil disimpan ke Google Spreadsheet! 📊');
    }
  } catch (err) {
    try {
      await fetch(state.googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      updateGoogleSheetUI('synced');
      if (showNotification) {
        showToast('Data berhasil disimpan ke Google Spreadsheet! 📊');
      }
    } catch (err2) {
      console.warn('Google Sheet Push Error:', err2);
      updateGoogleSheetUI('offline');
      if (showNotification) {
        showToast('Gagal mengirim data ke Google Spreadsheet.', 'danger');
      }
    }
  }
}

async function pullDataFromGoogleSheet(showNotification = true) {
  if (!state.googleSheetUrl) return;

  try {
    updateGoogleSheetUI('syncing');
    const response = await fetch(state.googleSheetUrl);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.transactions)) {
        state.transactions = data.transactions;
        if (Array.isArray(data.accounts)) state.accounts = data.accounts;
        if (data.categories) state.categories = ensureCategoriesStructure(data.categories);
        if (Array.isArray(data.goals)) state.goals = data.goals;
        if (data.monthlyTargets) state.monthlyTargets = data.monthlyTargets;

        localStorage.setItem('finsmart_accounts', JSON.stringify(state.accounts));
        localStorage.setItem('finsmart_categories', JSON.stringify(state.categories));
        localStorage.setItem('finsmart_tx', JSON.stringify(state.transactions));
        localStorage.setItem('finsmart_goals', JSON.stringify(state.goals));
        localStorage.setItem('finsmart_monthly_targets', JSON.stringify(state.monthlyTargets));

        refreshAll();
        updateGoogleSheetUI('synced');
        if (showNotification) {
          showToast('Data terbaru berhasil dimuat dari Google Spreadsheet! 📊');
        }
      } else if (data && data.status === 'empty') {
        // First time initialization
        await pushDataToGoogleSheet(false);
        updateGoogleSheetUI('synced');
        if (showNotification) {
          showToast('Google Spreadsheet terhubung & data awal berhasil diunggah! 🚀');
        }
      }
    } else {
      updateGoogleSheetUI('offline');
    }
  } catch (err) {
    console.warn('Google Sheet Pull Error:', err);
    updateGoogleSheetUI('offline');
    if (showNotification) {
      showToast('Gagal memuat data dari Google Spreadsheet. Periksa URL Anda!', 'danger');
    }
  }
}

function updateGoogleSheetUI(status) {
  const dot = document.getElementById('gsheetStatusDot');
  const text = document.getElementById('gsheetStatusText');
  const modalText = document.getElementById('gsheetModalStatusText');
  const disconnectBtn = document.getElementById('btnDisconnectGSheet');
  const settingsBadge = document.getElementById('settingsGSheetBadge');
  const settingsSub = document.getElementById('settingsGSheetSubText');

  if (state.googleSheetUrl) {
    if (disconnectBtn) disconnectBtn.style.display = 'block';
    if (modalText) modalText.innerHTML = `🟢 Terhubung ke Google Spreadsheet!`;
    if (settingsBadge) {
      settingsBadge.innerText = 'Tersinkron Sheets 📊';
      settingsBadge.className = 'metric-badge badge-positive';
    }
    if (settingsSub) settingsSub.innerText = 'Data otomatis tersimpan ke Google Spreadsheet Anda';
  } else {
    if (disconnectBtn) disconnectBtn.style.display = 'none';
    if (modalText) modalText.innerHTML = '⚪ Belum Terhubung (Data hanya di browser)';
    if (settingsBadge) {
      settingsBadge.innerText = 'Atur Spreadsheet';
      settingsBadge.className = 'metric-badge';
    }
    if (settingsSub) settingsSub.innerText = 'Simpan data otomatis ke Google Sheets pribadi (seperti Excel online)';
  }

  if (dot && text) {
    dot.className = 'sync-dot';
    if (status === 'synced') {
      dot.classList.add('synced');
      text.innerText = 'Sheets Aktif';
    } else if (status === 'syncing') {
      dot.classList.add('syncing');
      text.innerText = 'Menyimpan...';
    } else {
      text.innerText = state.googleSheetUrl ? 'Sheets' : 'Google Sheets';
    }
  }
}

function openGoogleSheetsModal() {
  const input = document.getElementById('inputGoogleSheetUrl');
  if (input) input.value = state.googleSheetUrl || '';
  updateGoogleSheetUI(state.googleSheetUrl ? 'synced' : 'offline');
  openModal('googleSheetsModal');
}

async function handleConnectGoogleSheet(e) {
  e.preventDefault();
  const input = document.getElementById('inputGoogleSheetUrl');
  const url = input ? input.value.trim() : '';

  if (!url || !url.startsWith('http')) {
    showToast('Harap masukkan URL Web App Google Apps Script yang valid!', 'danger');
    return;
  }

  state.googleSheetUrl = url;
  localStorage.setItem('finsmart_gsheet_url', url);
  closeModal('googleSheetsModal');
  showToast('Menghubungkan ke Google Spreadsheet... 📊', 'info');

  await pullDataFromGoogleSheet(true);
}

function disconnectGoogleSheet() {
  if (confirm('Putuskan koneksi Google Spreadsheet? Data lokal di browser tetap aman.')) {
    state.googleSheetUrl = '';
    localStorage.removeItem('finsmart_gsheet_url');
    updateGoogleSheetUI('offline');
    closeModal('googleSheetsModal');
    showToast('Koneksi Google Spreadsheet diputuskan.', 'info');
  }
}

function forcePushToGoogleSheet() {
  if (!state.googleSheetUrl) {
    showToast('Harap hubungkan URL Google Spreadsheet terlebih dahulu!', 'danger');
    return;
  }
  pushDataToGoogleSheet(true);
}

function forcePullFromGoogleSheet() {
  if (!state.googleSheetUrl) {
    showToast('Harap hubungkan URL Google Spreadsheet terlebih dahulu!', 'danger');
    return;
  }
  pullDataFromGoogleSheet(true);
}

function copyGoogleAppsScriptCode() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE).then(() => {
      showToast('Kode Google Apps Script berhasil disalin ke clipboard! 📋');
    }).catch(() => {
      fallbackCopyText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    });
  } else {
    fallbackCopyText(GOOGLE_APPS_SCRIPT_TEMPLATE);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Kode Google Apps Script berhasil disalin! 📋');
  } catch (err) {
    showToast('Buka file google_apps_script.js di project untuk menyalin kode.', 'info');
  }
  document.body.removeChild(textArea);
}

// --- Theme Management (Valorant Design System) ---
function initTheme() {
  const savedTheme = localStorage.getItem('finsmart_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  updateMetaThemeColor(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('finsmart_theme', newTheme);
  updateThemeIcon(newTheme);
  updateMetaThemeColor(newTheme);

  renderMonthlyAnalytics();
  showToast(`Beralih ke mode ${newTheme === 'dark' ? 'Valorant Dark' : 'Clean Light'}`, 'info');
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    if (theme === 'light') {
      btn.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.title = 'Ubah ke Mode Valorant Dark';
    } else {
      btn.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
      btn.title = 'Ubah ke Mode Terang';
    }
  }
}

function updateMetaThemeColor(theme) {
  const meta = document.getElementById('metaThemeColor');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0F1923' : '#ECE8E1');
  }
}

// --- Account Balance Calculation ---
function calculateAccountBalances() {
  const balances = {};

  // 1. Inisialisasi dengan Saldo Awal
  state.accounts.forEach(acc => {
    balances[acc.id] = Number(acc.initialBalance) || 0;
  });

  // 2. Hitung berdasarkan transaksi
  state.transactions.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    const fee = Number(tx.fee) || 0;

    if (tx.type === 'income') {
      if (balances[tx.account] !== undefined) {
        balances[tx.account] += amt;
      }
    } else if (tx.type === 'expense') {
      if (balances[tx.account] !== undefined) {
        balances[tx.account] -= amt;
      }
    } else if (tx.type === 'transfer') {
      // Transfer: Kurangi dari fromAccount, Tambah ke toAccount
      if (balances[tx.fromAccount] !== undefined) {
        balances[tx.fromAccount] -= (amt + fee);
      }
      if (balances[tx.toAccount] !== undefined) {
        balances[tx.toAccount] += amt;
      }
    }
  });

  return balances;
}

// --- Render UI Components ---

// 1. Render Account Cards Grid (Dompet & Rekening)
function renderAccountCards() {
  const grid = document.getElementById('accountsGrid');
  if (!grid) return;

  const currentBalances = calculateAccountBalances();
  grid.innerHTML = '';

  state.accounts.forEach(acc => {
    const currentBalance = currentBalances[acc.id] !== undefined ? currentBalances[acc.id] : (acc.initialBalance || 0);
    const isNegative = currentBalance < 0;

    const card = document.createElement('div');
    card.className = 'account-card';
    card.innerHTML = `
      <div>
        <div class="account-card-top">
          <div class="account-name-wrap">
            <span class="account-icon">${acc.icon || '💳'}</span>
            <span class="account-name">${escapeHtml(acc.name)}</span>
          </div>
          <button class="action-btn" onclick="openEditAccountModal('${acc.id}')" title="Ubah Saldo Awal">✏️</button>
        </div>
        <div class="account-balance" style="${isNegative ? 'color: var(--accent-rose);' : ''}">
          ${formatRupiah(currentBalance)}
        </div>
      </div>
      <div class="account-initial-sub">
        Saldo Awal: <strong>${formatRupiah(acc.initialBalance || 0)}</strong>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 2. Render Overall Global Metrics
function renderMetrics() {
  const balances = calculateAccountBalances();
  let totalSaldo = 0;
  Object.values(balances).forEach(b => { totalSaldo += b; });

  let totalIncome = 0;
  let totalExpense = 0;

  state.transactions.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    const fee = Number(tx.fee) || 0;

    if (tx.type === 'income') {
      totalIncome += amt;
    } else if (tx.type === 'expense') {
      totalExpense += amt;
    } else if (tx.type === 'transfer' && fee > 0) {
      totalExpense += fee;
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  const elBalance = document.getElementById('metricBalance');
  const elIncome = document.getElementById('metricIncome');
  const elExpense = document.getElementById('metricExpense');
  const elSavingsBadge = document.getElementById('savingsRateBadge');

  if (elBalance) elBalance.innerText = formatRupiah(totalSaldo);
  if (elIncome) elIncome.innerText = formatRupiah(totalIncome);
  if (elExpense) elExpense.innerText = formatRupiah(totalExpense);

  if (elSavingsBadge) {
    if (savingsRate >= 0) {
      elSavingsBadge.className = 'metric-badge badge-positive';
      elSavingsBadge.innerText = `📈 ${savingsRate}% Rasio Tabungan`;
    } else {
      elSavingsBadge.className = 'metric-badge badge-negative';
      elSavingsBadge.innerText = `📉 Defisit (${Math.abs(savingsRate)}%)`;
    }
  }
}

// 3. Filtered Transactions for Table
function getFilteredTransactions() {
  return state.transactions.filter(tx => {
    // Filter Type
    if (state.filter.type !== 'all' && tx.type !== state.filter.type) {
      return false;
    }

    // Filter Account
    if (state.filter.account !== 'all') {
      if (tx.type === 'transfer') {
        if (tx.fromAccount !== state.filter.account && tx.toAccount !== state.filter.account) {
          return false;
        }
      } else {
        if (tx.account !== state.filter.account) {
          return false;
        }
      }
    }

    // Filter Category
    if (state.filter.category !== 'all') {
      if (tx.category !== state.filter.category) return false;
    }

    // Filter Month
    if (state.filter.month) {
      if (!tx.date || !tx.date.startsWith(state.filter.month)) {
        return false;
      }
    }

    // Filter Search Text
    if (state.filter.search) {
      const q = state.filter.search.toLowerCase();
      const descMatch = (tx.desc || '').toLowerCase().includes(q);
      const noteMatch = (tx.note || '').toLowerCase().includes(q);
      const catMatch = tx.category ? getCategoryInfo(tx.category, tx.type).name.toLowerCase().includes(q) : false;
      if (!descMatch && !noteMatch && !catMatch) {
        return false;
      }
    }

    return true;
  });
}

// 4. Helper get Account Name & Icon
function getAccountInfo(accId) {
  const found = state.accounts.find(a => a.id === accId);
  return found || { name: accId || 'Akun Terhapus', icon: '💳' };
}

// 5. Helper get Category Name & Icon
function getCategoryInfo(catId, type) {
  const list = state.categories[type] || [];
  const found = list.find(c => c.id === catId);
  if (found) return found;

  // Search in all categories
  const allCats = [
    ...(state.categories.expense || []),
    ...(state.categories.income || []),
    ...(state.categories.transfer || [])
  ];
  const anyFound = allCats.find(c => c.id === catId);
  if (anyFound) return anyFound;

  return { name: catId || 'Umum', icon: '📝', color: '#64748B' };
}

// 6. Render Transaction List (Dashboard Tab)
function renderTransactionList() {
  const listEl = document.getElementById('transactionList');
  const emptyEl = document.getElementById('emptyTransactionsState');
  const countEl = document.getElementById('transactionCount');

  if (!listEl) return;

  const filtered = getFilteredTransactions();
  listEl.innerHTML = '';

  if (countEl) countEl.innerText = `${filtered.length} Transaksi`;

  if (filtered.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  filtered.forEach(tx => {
    const item = document.createElement('div');
    item.className = 'tx-item';

    if (tx.type === 'transfer') {
      // Transfer Item
      const fromAcc = getAccountInfo(tx.fromAccount);
      const toAcc = getAccountInfo(tx.toAccount);
      const catObj = getCategoryInfo(tx.category || 'topup', 'transfer');

      item.innerHTML = `
        <div class="tx-left">
          <div class="tx-category-icon" style="background: ${catObj.color}20; color: ${catObj.color};" title="${catObj.name}">
            ${catObj.icon || '⇄'}
          </div>
          <div class="tx-info">
            <span class="tx-desc">${escapeHtml(tx.desc || 'Transfer Antar Akun')}</span>
            <div class="tx-meta">
              <span>📅 ${formatDateIndo(tx.date)}</span>
              <span>•</span>
              <span class="tx-account-tag transfer-tag">${fromAcc.icon} ${escapeHtml(fromAcc.name)} → ${toAcc.icon} ${escapeHtml(toAcc.name)}</span>
              <span>•</span>
              <span>${catObj.name}</span>
              ${tx.fee > 0 ? `<span>• Biaya: ${formatRupiah(tx.fee)}</span>` : ''}
              ${tx.note ? `<span>• <em>${escapeHtml(tx.note)}</em></span>` : ''}
            </div>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount transfer">⇄ ${formatRupiah(tx.amount)}</span>
          <div class="tx-actions">
            <button class="action-btn" onclick="openEditTxModal('${tx.id}')" title="Edit Transfer">✏️</button>
            <button class="action-btn delete" onclick="confirmDeleteTx('${tx.id}')" title="Hapus Transfer">🗑️</button>
          </div>
        </div>
      `;
    } else {
      // Income or Expense Item
      const isIncome = tx.type === 'income';
      const catObj = getCategoryInfo(tx.category, tx.type);
      const accObj = getAccountInfo(tx.account);
      const sign = isIncome ? '+' : '-';
      const amountClass = isIncome ? 'income' : 'expense';

      item.innerHTML = `
        <div class="tx-left">
          <div class="tx-category-icon" style="background: ${catObj.color}20; color: ${catObj.color};" title="${catObj.name}">
            ${catObj.icon || '📝'}
          </div>
          <div class="tx-info">
            <span class="tx-desc">${escapeHtml(tx.desc)}</span>
            <div class="tx-meta">
              <span>📅 ${formatDateIndo(tx.date)}</span>
              <span>•</span>
              <span class="tx-account-tag">${accObj.icon} ${escapeHtml(accObj.name)}</span>
              <span>•</span>
              <span>${catObj.name}</span>
              ${tx.note ? `<span>• <em>${escapeHtml(tx.note)}</em></span>` : ''}
            </div>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount ${amountClass}">${sign} ${formatRupiah(tx.amount)}</span>
          <div class="tx-actions">
            <button class="action-btn" onclick="openEditTxModal('${tx.id}')" title="Edit Transaksi">✏️</button>
            <button class="action-btn delete" onclick="confirmDeleteTx('${tx.id}')" title="Hapus Transaksi">🗑️</button>
          </div>
        </div>
      `;
    }

    listEl.appendChild(item);
  });
}

// ==========================================================================
// 7. DETAILED MONTHLY FINANCIAL ANALYTICS & SAVINGS TARGET ENGINE
// ==========================================================================

// Month Navigator Functions
function changeAnalyticsMonth(delta) {
  const [yearStr, monthStr] = state.analyticsMonth.split('-');
  let y = parseInt(yearStr, 10);
  let m = parseInt(monthStr, 10) + delta;

  if (m > 12) {
    m = 1;
    y += 1;
  } else if (m < 1) {
    m = 12;
    y -= 1;
  }

  state.analyticsMonth = `${y}-${String(m).padStart(2, '0')}`;
  renderMonthlyAnalytics();
}

function setAnalyticsMonth(monthStr) {
  if (monthStr) {
    state.analyticsMonth = monthStr;
    renderMonthlyAnalytics();
  }
}

function setAnalyticsMonthToday() {
  state.analyticsMonth = getCurrentYearMonthStr();
  renderMonthlyAnalytics();
  showToast('Menampilkan data laporan bulan ini 📅', 'info');
}

// Switch between Single Month view and Matrix Multi-Month view
function setAnalyticsViewMode(mode) {
  state.analyticsViewMode = mode;
  const singleContainer = document.getElementById('viewSingleMonthContainer');
  const matrixContainer = document.getElementById('viewMatrixAllContainer');
  const btnSingle = document.getElementById('btnViewSingleMonth');
  const btnMatrix = document.getElementById('btnViewMatrixAll');

  if (mode === 'single') {
    if (singleContainer) singleContainer.style.display = 'block';
    if (matrixContainer) matrixContainer.style.display = 'none';
    if (btnSingle) btnSingle.className = 'btn btn-primary btn-sm';
    if (btnMatrix) btnMatrix.className = 'btn btn-secondary btn-sm';
  } else {
    if (singleContainer) singleContainer.style.display = 'none';
    if (matrixContainer) matrixContainer.style.display = 'block';
    if (btnSingle) btnSingle.className = 'btn btn-secondary btn-sm';
    if (btnMatrix) btnMatrix.className = 'btn btn-primary btn-sm';
    renderMultiMonthMatrices();
  }
}

// Modal Edit Target Tabungan Bulanan
function openEditMonthlyTargetModal(customMonth) {
  const targetMonth = customMonth || state.analyticsMonth;
  const currentTarget = getMonthlySavingsTarget(targetMonth);

  document.getElementById('inputMonthlyTargetMonth').value = targetMonth;
  document.getElementById('inputMonthlyTargetAmount').value = currentTarget;
  document.getElementById('monthlyTargetPreview').innerText = formatRupiah(currentTarget);

  openModal('monthlyTargetModal');
}

function handleMonthlyTargetSubmit(e) {
  e.preventDefault();
  const month = document.getElementById('inputMonthlyTargetMonth').value;
  const amount = Number(document.getElementById('inputMonthlyTargetAmount').value);

  if (!month || amount <= 0) {
    showToast('Harap isi bulan dan nominal target tabungan dengan benar!', 'danger');
    return;
  }

  setMonthlySavingsTarget(month, amount);
  closeModal('monthlyTargetModal');
  renderMonthlyAnalytics();
  showToast(`Target tabungan bulan ${formatMonthTitleIndo(month)} diatur ke ${formatRupiah(amount)} 🎯`);
}

// Main Monthly Analytics & Target Renderer
function renderMonthlyAnalytics() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  const selectedMonth = state.analyticsMonth;
  const monthTitle = formatMonthTitleIndo(selectedMonth);

  // Update Header & Pickers
  const titleEl = document.getElementById('currentMonthDisplayTitle');
  const pickerEl = document.getElementById('analyticsMonthPicker');
  if (titleEl) titleEl.innerText = monthTitle;
  if (pickerEl) pickerEl.value = selectedMonth;

  document.querySelectorAll('.month-label-inline').forEach(el => {
    el.innerText = monthTitle;
  });

  // Filter transactions strictly for the selected month
  const monthlyTx = state.transactions.filter(tx => tx.date && tx.date.startsWith(selectedMonth));

  // 1. Calculate Monthly KPIs
  let monthlyIncome = 0;
  let monthlyIncomeCount = 0;
  let monthlyExpense = 0;
  let monthlyExpenseCount = 0;
  let monthlyTransfer = 0;
  let monthlyTransferCount = 0;
  let monthlyTransferFee = 0;

  const expenseCategoryTotals = {};
  const expenseCategoryCounts = {};
  (state.categories.expense || []).forEach(c => {
    expenseCategoryTotals[c.id] = 0;
    expenseCategoryCounts[c.id] = 0;
  });

  const incomeCategoryTotals = {};
  const incomeCategoryCounts = {};
  (state.categories.income || []).forEach(c => {
    incomeCategoryTotals[c.id] = 0;
    incomeCategoryCounts[c.id] = 0;
  });

  const transferCategoryTotals = {};
  const transferCategoryCounts = {};
  (state.categories.transfer || []).forEach(c => {
    transferCategoryTotals[c.id] = 0;
    transferCategoryCounts[c.id] = 0;
  });

  // Transfer Route Grouping
  const transferRoutes = {};
  const monthlyTransferList = [];

  // Daily map for the month
  const [selYear, selMonth] = selectedMonth.split('-');
  const daysInMonth = new Date(parseInt(selYear, 10), parseInt(selMonth, 10), 0).getDate();
  const dailyFlow = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    dailyFlow[`${selectedMonth}-${dStr}`] = { income: 0, expense: 0 };
  }

  monthlyTx.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    const fee = Number(tx.fee) || 0;

    if (tx.type === 'income') {
      monthlyIncome += amt;
      monthlyIncomeCount++;
      const catId = tx.category || 'lainnya';
      incomeCategoryTotals[catId] = (incomeCategoryTotals[catId] || 0) + amt;
      incomeCategoryCounts[catId] = (incomeCategoryCounts[catId] || 0) + 1;

      if (dailyFlow[tx.date]) dailyFlow[tx.date].income += amt;
    } else if (tx.type === 'expense') {
      monthlyExpense += amt;
      monthlyExpenseCount++;
      const catId = tx.category || 'lainnya';
      expenseCategoryTotals[catId] = (expenseCategoryTotals[catId] || 0) + amt;
      expenseCategoryCounts[catId] = (expenseCategoryCounts[catId] || 0) + 1;

      if (dailyFlow[tx.date]) dailyFlow[tx.date].expense += amt;
    } else if (tx.type === 'transfer') {
      monthlyTransfer += amt;
      monthlyTransferCount++;
      monthlyTransferFee += fee;
      if (fee > 0) {
        monthlyExpense += fee; // fee is considered expense
        if (dailyFlow[tx.date]) dailyFlow[tx.date].expense += fee;
      }

      // Group transfer by category
      const trfCatId = tx.category || 'topup';
      transferCategoryTotals[trfCatId] = (transferCategoryTotals[trfCatId] || 0) + amt;
      transferCategoryCounts[trfCatId] = (transferCategoryCounts[trfCatId] || 0) + 1;

      // Record Route
      const routeKey = `${tx.fromAccount}_to_${tx.toAccount}`;
      if (!transferRoutes[routeKey]) {
        transferRoutes[routeKey] = {
          fromAccount: tx.fromAccount,
          toAccount: tx.toAccount,
          totalAmount: 0,
          count: 0
        };
      }
      transferRoutes[routeKey].totalAmount += amt;
      transferRoutes[routeKey].count += 1;

      monthlyTransferList.push(tx);
    }
  });

  const monthlyNet = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.round((monthlyNet / monthlyIncome) * 100) : 0;
  const avgExpensePerDay = daysInMonth > 0 ? Math.round(monthlyExpense / daysInMonth) : 0;

  // 2. Update KPI Elements
  const kpiInc = document.getElementById('monthlyKpiIncome');
  const kpiIncCnt = document.getElementById('monthlyKpiIncomeCount');
  const kpiExp = document.getElementById('monthlyKpiExpense');
  const kpiExpAvg = document.getElementById('monthlyKpiExpenseAvg');
  const kpiNet = document.getElementById('monthlyKpiNet');
  const kpiSav = document.getElementById('monthlyKpiSavingsRate');
  const kpiTrf = document.getElementById('monthlyKpiTransfer');
  const kpiTrfFee = document.getElementById('monthlyKpiTransferFee');

  if (kpiInc) kpiInc.innerText = formatRupiah(monthlyIncome);
  if (kpiIncCnt) kpiIncCnt.innerText = `${monthlyIncomeCount} Transaksi Pemasukan`;

  if (kpiExp) kpiExp.innerText = formatRupiah(monthlyExpense);
  if (kpiExpAvg) kpiExpAvg.innerText = `Rata-rata: ${formatRupiah(avgExpensePerDay)} / hari (${daysInMonth} hari)`;

  if (kpiNet) {
    kpiNet.innerText = formatRupiah(monthlyNet);
    kpiNet.style.color = monthlyNet >= 0 ? 'var(--accent-indigo)' : 'var(--accent-rose)';
  }
  if (kpiSav) {
    if (monthlyIncome > 0) {
      kpiSav.innerText = `Rasio Tabungan: ${savingsRate}% (${monthlyNet >= 0 ? 'Surplus' : 'Defisit'})`;
    } else {
      kpiSav.innerText = 'Belum ada pemasukan';
    }
  }

  if (kpiTrf) kpiTrf.innerText = formatRupiah(monthlyTransfer);
  if (kpiTrfFee) kpiTrfFee.innerText = `Biaya Admin: ${formatRupiah(monthlyTransferFee)} (${monthlyTransferCount}x Transfer)`;

  // Badges in chart card headers
  const badgeExp = document.getElementById('monthTotalExpenseBadge');
  const badgeInc = document.getElementById('monthTotalIncomeBadge');
  const badgeTrf = document.getElementById('monthTotalTransferBadge');
  if (badgeExp) badgeExp.innerText = `Total: ${formatRupiah(monthlyExpense)}`;
  if (badgeInc) badgeInc.innerText = `Total: ${formatRupiah(monthlyIncome)}`;
  if (badgeTrf) badgeTrf.innerText = `Total: ${formatRupiah(monthlyTransfer)}`;

  // 3. TARGET TABUNGAN BULANAN
  const targetAmount = getMonthlySavingsTarget(selectedMonth);
  const targetPct = targetAmount > 0 ? Math.round((monthlyNet / targetAmount) * 100) : 0;
  const targetBarWidth = Math.max(0, Math.min(100, targetPct));

  // Render on Tab 2 (Analisis Bulanan)
  const targetActualText = document.getElementById('monthlyTargetActualText');
  const targetGoalText = document.getElementById('monthlyTargetGoalText');
  const targetBar = document.getElementById('monthlyTargetProgressBar');
  const targetPercentText = document.getElementById('monthlyTargetPercentageText');
  const targetStatusBadge = document.getElementById('monthlyTargetStatusBadge');

  if (targetActualText) {
    targetActualText.innerText = formatRupiah(monthlyNet);
    targetActualText.style.color = monthlyNet >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';
  }
  if (targetGoalText) targetGoalText.innerText = `Target: ${formatRupiah(targetAmount)}`;
  if (targetBar) targetBar.style.width = `${targetBarWidth}%`;
  if (targetPercentText) targetPercentText.innerText = `${targetPct}% Tercapai`;

  if (targetStatusBadge) {
    if (monthlyNet >= targetAmount) {
      targetStatusBadge.className = 'metric-badge badge-positive';
      targetStatusBadge.innerText = `🎉 Target Tercapai! (+${formatRupiah(monthlyNet - targetAmount)})`;
    } else if (monthlyNet > 0) {
      targetStatusBadge.className = 'metric-badge badge-positive';
      targetStatusBadge.innerText = `📈 Sisa ${formatRupiah(targetAmount - monthlyNet)} lagi`;
    } else {
      targetStatusBadge.className = 'metric-badge badge-negative';
      targetStatusBadge.innerText = `⚠️ Defisit Rp ${formatRupiah(Math.abs(monthlyNet))} • Belum menabung`;
    }
  }

  // Render on Tab 3 (Target Tabungan Section 1: Target Bulanan)
  const gTitle = document.getElementById('goalsTabMonthTitle');
  const gActual = document.getElementById('goalsTabActualAmount');
  const gGoal = document.getElementById('goalsTabTargetAmount');
  const gBar = document.getElementById('goalsTabProgressBar');
  const gPct = document.getElementById('goalsTabPercentText');
  const gStatus = document.getElementById('goalsTabStatusText');
  const gBadge = document.getElementById('goalsTabTargetBadge');

  if (gTitle) gTitle.innerText = monthTitle;
  if (gActual) {
    gActual.innerText = formatRupiah(monthlyNet);
    gActual.style.color = monthlyNet >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';
  }
  if (gGoal) gGoal.innerText = `Target: ${formatRupiah(targetAmount)}`;
  if (gBar) gBar.style.width = `${targetBarWidth}%`;
  if (gPct) gPct.innerText = `${targetPct}%`;
  if (gStatus) {
    if (monthlyNet >= targetAmount) {
      gStatus.innerText = `🎉 Selamat! Target tabungan bulan ${monthTitle} telah tercapai sebesar 100%+!`;
    } else if (monthlyNet > 0) {
      gStatus.innerText = `Kurang ${formatRupiah(targetAmount - monthlyNet)} lagi untuk memenuhi target bulan ini.`;
    } else {
      gStatus.innerText = `Belum ada saldo tabungan yang disisihkan bulan ini (arus kas defisit).`;
    }
  }
  if (gBadge) {
    if (monthlyNet >= targetAmount) {
      gBadge.className = 'metric-badge badge-positive';
      gBadge.innerText = '🎉 Target Tercapai';
    } else if (monthlyNet > 0) {
      gBadge.className = 'metric-badge badge-positive';
      gBadge.innerText = '📈 Sedang Berjalan';
    } else {
      gBadge.className = 'metric-badge badge-negative';
      gBadge.innerText = '⚠️ Belum Tercapai';
    }
  }

  // 4. Render Donut Chart 1: Pengeluaran per Kategori
  renderCategoryDonut('monthExpenseCategoryDonut', state.categories.expense || [], expenseCategoryTotals, 'expenseDonutInstance', isDark, textColor, 'Tidak ada pengeluaran');

  // 5. Render Donut Chart 2: Pemasukan per Kategori
  renderCategoryDonut('monthIncomeCategoryDonut', state.categories.income || [], incomeCategoryTotals, 'incomeDonutInstance', isDark, textColor, 'Tidak ada pemasukan');

  // 6. Render Donut Chart 3: Transfer per Kategori
  renderCategoryDonut('monthTransferCategoryDonut', state.categories.transfer || [], transferCategoryTotals, 'transferDonutInstance', isDark, textColor, 'Tidak ada transfer');

  // 7. Render Bar Chart: Daily Trend for the whole month
  const dailyCanvas = document.getElementById('monthDailyCashflowBarChart');
  if (dailyCanvas && typeof Chart !== 'undefined') {
    const dateKeys = Object.keys(dailyFlow);
    const dayLabels = dateKeys.map(k => `Tgl ${parseInt(k.split('-')[2], 10)}`);
    const incArray = dateKeys.map(k => dailyFlow[k].income);
    const expArray = dateKeys.map(k => dailyFlow[k].expense);

    if (state.dailyTrendInstance) {
      state.dailyTrendInstance.destroy();
    }

    state.dailyTrendInstance = new Chart(dailyCanvas, {
      type: 'bar',
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: 'Pemasukan',
            data: incArray,
            backgroundColor: '#00F5D4',
            borderRadius: 4
          },
          {
            label: 'Pengeluaran',
            data: expArray,
            backgroundColor: '#FF4655',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Outfit', size: 9.5 }, maxRotation: 45 }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Outfit', size: 10 },
              callback: function (val) {
                return (val >= 1000000 ? (val / 1000000).toFixed(1) + ' jt' : (val / 1000) + ' rb');
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'Outfit', size: 11, weight: 600 },
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ` ${ctx.dataset.label}: ${formatRupiah(ctx.raw)}`;
              }
            }
          }
        }
      }
    });
  }

  // 8. Render Detailed Tables: Total Pengeluaran, Pemasukan, dan Transfer per Kategori Bulan Ini
  renderMonthlyCategoryTable('monthExpenseCategoryTableBody', state.categories.expense || [], expenseCategoryTotals, expenseCategoryCounts, monthlyExpense, '#FF4655');
  renderMonthlyCategoryTable('monthIncomeCategoryTableBody', state.categories.income || [], incomeCategoryTotals, incomeCategoryCounts, monthlyIncome, '#00F5D4');
  renderMonthlyCategoryTable('monthTransferCategoryTableBody', state.categories.transfer || [], transferCategoryTotals, transferCategoryCounts, monthlyTransfer, '#FFC700');

  // 9. Render Transfer Recap Module
  renderMonthlyTransferRecap(monthlyTransferList, transferRoutes, monthlyTransfer, monthlyTransferFee);

  // If in matrix mode, also refresh matrix
  if (state.analyticsViewMode === 'matrix') {
    renderMultiMonthMatrices();
  }
}

// Donut Chart Generator Helper
function renderCategoryDonut(canvasId, categoriesList, totalsMap, instanceProp, isDark, textColor, emptyText) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;

  const labels = [];
  const dataValues = [];
  const bgColors = [];

  categoriesList.forEach(c => {
    const val = totalsMap[c.id] || 0;
    if (val > 0) {
      labels.push(`${c.icon || ''} ${c.name}`);
      dataValues.push(val);
      bgColors.push(c.color || '#6366F1');
    }
  });

  if (state[instanceProp]) {
    state[instanceProp].destroy();
  }

  if (dataValues.length === 0) {
    labels.push(emptyText);
    dataValues.push(1);
    bgColors.push(isDark ? '#334155' : '#E2E8F0');
  }

  state[instanceProp] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: bgColors,
        borderWidth: 2,
        borderColor: isDark ? '#111827' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { family: 'Outfit', size: 9.5 },
            padding: 8,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ` ${ctx.label}: ${formatRupiah(ctx.raw)}`;
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

// Helper Table Renderer for Categories per Month
function renderMonthlyCategoryTable(tableBodyId, categoriesList, totalsMap, countsMap, grandTotal, defaultColor) {
  const tableBody = document.getElementById(tableBodyId);
  if (!tableBody) return;

  tableBody.innerHTML = '';

  const sorted = categoriesList
    .map(c => ({
      ...c,
      total: totalsMap[c.id] || 0,
      count: countsMap[c.id] || 0
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  if (sorted.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.25rem;">Tidak ada catatan pada bulan ini.</td></tr>`;
    return;
  }

  sorted.forEach(cat => {
    const pct = grandTotal > 0 ? Math.round((cat.total / grandTotal) * 100) : 0;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <span style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600;">
          <span style="font-size: 1.05rem;">${cat.icon || '📦'}</span>
          <span>${escapeHtml(cat.name)}</span>
        </span>
      </td>
      <td style="color: var(--text-secondary); font-size: 0.76rem;">${cat.count}x</td>
      <td style="font-family: var(--font-mono); font-weight: 700;">${formatRupiah(cat.total)}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <div style="flex: 1; height: 6px; background: var(--border-color); border-radius: 99px; overflow: hidden; min-width: 35px;">
            <div style="width: ${pct}%; height: 100%; background: ${cat.color || defaultColor};"></div>
          </div>
          <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); min-width: 28px;">${pct}%</span>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Add Grand Total Footer Row
  const footRow = document.createElement('tr');
  footRow.style.fontWeight = '800';
  footRow.style.background = 'var(--bg-surface-elevated)';
  footRow.innerHTML = `
    <td><strong>TOTAL SEMUA</strong></td>
    <td><strong>${sorted.reduce((acc, c) => acc + c.count, 0)}x</strong></td>
    <td style="font-family: var(--font-mono); color: ${defaultColor}; font-size: 0.88rem;">
      <strong>${formatRupiah(grandTotal)}</strong>
    </td>
    <td><strong>100%</strong></td>
  `;
  tableBody.appendChild(footRow);
}

// ==========================================================================
// 8. MULTI-MONTH COMPARISON MATRIX (TOTAL PER BULAN PER KATEGORI)
// ==========================================================================

function renderMultiMonthMatrices() {
  // Collect all distinct months in transactions
  const monthSet = new Set();
  const currentYear = new Date().getFullYear();

  // Add all months of the current year (Jan..currentMonth)
  for (let m = 1; m <= 12; m++) {
    monthSet.add(`${currentYear}-${String(m).padStart(2, '0')}`);
  }

  state.transactions.forEach(tx => {
    if (tx.date && tx.date.length >= 7) {
      monthSet.add(tx.date.substring(0, 7));
    }
  });

  const sortedMonths = Array.from(monthSet).sort();

  // Render Expense, Income, and Transfer matrices
  renderSingleTypeMatrix('expense', 'matrixExpenseThead', 'matrixExpenseTbody', sortedMonths, state.categories.expense || [], 'var(--accent-rose)');
  renderSingleTypeMatrix('income', 'matrixIncomeThead', 'matrixIncomeTbody', sortedMonths, state.categories.income || [], 'var(--accent-emerald)');
  renderSingleTypeMatrix('transfer', 'matrixTransferThead', 'matrixTransferTbody', sortedMonths, state.categories.transfer || [], 'var(--accent-indigo)');
}

function renderSingleTypeMatrix(type, theadId, tbodyId, monthsList, categoriesList, accentColor) {
  const thead = document.getElementById(theadId);
  const tbody = document.getElementById(tbodyId);
  if (!thead || !tbody) return;

  // Build Thead
  let headHtml = '<tr><th>Kategori</th>';
  monthsList.forEach(mStr => {
    const parts = mStr.split('-');
    const monthShort = new Date(parts[0], parts[1] - 1, 1).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    headHtml += `<th style="text-align: right;">${monthShort}</th>`;
  });
  headHtml += '<th style="text-align: right; background: var(--bg-surface-elevated);">Total Akumulasi</th></tr>';
  thead.innerHTML = headHtml;

  // Aggregate data: category -> month -> total
  const matrixData = {};
  const monthColumnTotals = {};
  monthsList.forEach(m => { monthColumnTotals[m] = 0; });
  let grandMatrixTotal = 0;

  categoriesList.forEach(c => {
    matrixData[c.id] = {};
    monthsList.forEach(m => { matrixData[c.id][m] = 0; });
  });

  state.transactions.forEach(tx => {
    if (tx.type === type && tx.date) {
      const mStr = tx.date.substring(0, 7);
      const catId = tx.category || (type === 'transfer' ? 'topup' : 'lainnya');
      const amt = Number(tx.amount) || 0;

      if (!matrixData[catId]) {
        matrixData[catId] = {};
        monthsList.forEach(m => { matrixData[catId][m] = 0; });
      }

      if (matrixData[catId][mStr] !== undefined) {
        matrixData[catId][mStr] += amt;
      }
      if (monthColumnTotals[mStr] !== undefined) {
        monthColumnTotals[mStr] += amt;
      }
      grandMatrixTotal += amt;
    }
  });

  // Build Tbody rows
  tbody.innerHTML = '';
  categoriesList.forEach(cat => {
    const rowTotals = monthsList.reduce((acc, m) => acc + (matrixData[cat.id]?.[m] || 0), 0);
    const tr = document.createElement('tr');
    let trHtml = `
      <td>
        <span style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600;">
          <span>${cat.icon || '📦'}</span> ${escapeHtml(cat.name)}
        </span>
      </td>
    `;

    monthsList.forEach(m => {
      const val = matrixData[cat.id]?.[m] || 0;
      trHtml += `
        <td style="text-align: right; font-family: var(--font-mono); color: ${val > 0 ? 'var(--text-primary)' : 'var(--text-muted)'};">
          ${val > 0 ? formatRupiah(val) : '-'}
        </td>
      `;
    });

    trHtml += `
      <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; background: var(--bg-surface-elevated); color: ${accentColor};">
        ${formatRupiah(rowTotals)}
      </td>
    `;
    tr.innerHTML = trHtml;
    tbody.appendChild(tr);
  });

  // Add Summary Total Row
  const footTr = document.createElement('tr');
  footTr.style.fontWeight = '800';
  footTr.style.background = 'var(--bg-surface-elevated)';
  let footHtml = '<td><strong>TOTAL SEMUA</strong></td>';
  monthsList.forEach(m => {
    const colTot = monthColumnTotals[m] || 0;
    footHtml += `
      <td style="text-align: right; font-family: var(--font-mono); color: ${colTot > 0 ? accentColor : 'var(--text-muted)'};">
        <strong>${colTot > 0 ? formatRupiah(colTot) : '-'}</strong>
      </td>
    `;
  });
  footHtml += `
    <td style="text-align: right; font-family: var(--font-mono); color: ${accentColor}; font-size: 0.9rem;">
      <strong>${formatRupiah(grandMatrixTotal)}</strong>
    </td>
  `;
  footTr.innerHTML = footHtml;
  tbody.appendChild(footTr);
}

// Helper Transfer Recap Renderer
function renderMonthlyTransferRecap(transferList, routesMap, totalVolume, totalFee) {
  const matrixGrid = document.getElementById('monthlyTransferMatrixGrid');
  const tableBody = document.getElementById('monthlyTransferTableBody');
  const pillBadge = document.getElementById('monthlyTransferSummaryPill');

  if (pillBadge) {
    pillBadge.innerText = `${transferList.length} Mutasi (Total: ${formatRupiah(totalVolume)})`;
  }

  // Render Routes Matrix Cards
  if (matrixGrid) {
    matrixGrid.innerHTML = '';
    const routeKeys = Object.keys(routesMap);

    if (routeKeys.length === 0) {
      matrixGrid.innerHTML = `
        <div style="grid-column: 1 / -1; color: var(--text-muted); font-size: 0.78rem; padding: 0.5rem 0;">
          Tidak ada pemindahan saldo / mutasi rekening pada bulan ini.
        </div>
      `;
    } else {
      routeKeys.forEach(k => {
        const route = routesMap[k];
        const fromAcc = getAccountInfo(route.fromAccount);
        const toAcc = getAccountInfo(route.toAccount);

        const card = document.createElement('div');
        card.className = 'transfer-route-card';
        card.innerHTML = `
          <div>
            <div class="transfer-route-header">
              <span>${fromAcc.icon} ${escapeHtml(fromAcc.name)}</span>
              <span>➔</span>
              <span>${toAcc.icon} ${escapeHtml(toAcc.name)}</span>
            </div>
            <div class="transfer-route-amount">
              ${formatRupiah(route.totalAmount)}
            </div>
          </div>
          <div class="transfer-route-count">
            Frekuensi: <strong>${route.count} kali transfer</strong>
          </div>
        `;
        matrixGrid.appendChild(card);
      });
    }
  }

  // Render Detailed Transfer Log Table
  if (tableBody) {
    tableBody.innerHTML = '';

    if (transferList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.25rem;">Tidak ada transaksi transfer pada bulan ini.</td></tr>`;
      return;
    }

    transferList.sort((a, b) => new Date(b.date) - new Date(a.date));

    transferList.forEach(tx => {
      const fromAcc = getAccountInfo(tx.fromAccount);
      const toAcc = getAccountInfo(tx.toAccount);
      const catObj = getCategoryInfo(tx.category || 'topup', 'transfer');
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${formatDateIndo(tx.date)}</td>
        <td>
          <strong>${escapeHtml(tx.desc || 'Transfer')}</strong>
          <span style="display: block; font-size: 0.7rem; color: ${catObj.color};">${catObj.icon} ${catObj.name}</span>
          ${tx.note ? `<small style="color: var(--text-muted);">${escapeHtml(tx.note)}</small>` : ''}
        </td>
        <td><span class="tx-account-tag">${fromAcc.icon} ${escapeHtml(fromAcc.name)}</span></td>
        <td><span class="tx-account-tag transfer-tag">${toAcc.icon} ${escapeHtml(toAcc.name)}</span></td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-indigo);">${formatRupiah(tx.amount)}</td>
        <td style="font-family: var(--font-mono); color: var(--text-muted);">${tx.fee > 0 ? formatRupiah(tx.fee) : 'Gratis (Rp 0)'}</td>
      `;
      tableBody.appendChild(row);
    });

    // Grand Total Transfer Row
    const footRow = document.createElement('tr');
    footRow.style.fontWeight = '800';
    footRow.style.background = 'var(--bg-surface-elevated)';
    footRow.innerHTML = `
      <td colspan="4"><strong>TOTAL VOLUME MUTASI DANA</strong></td>
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-size: 0.9rem;">
        <strong>${formatRupiah(totalVolume)}</strong>
      </td>
      <td style="font-family: var(--font-mono); color: var(--accent-rose); font-size: 0.82rem;">
        <strong>${formatRupiah(totalFee)}</strong>
      </td>
    `;
    tableBody.appendChild(footRow);
  }
}

// 8. Render Goals (Target Tabungan Impian & Wishlist Jangka Panjang)
function renderGoals() {
  const grid = document.getElementById('goalsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (state.goals.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🎯</div>
        <div class="empty-text">Belum ada target tabungan impian. Tekan tombol <strong>+ Target Baru</strong> untuk memulai!</div>
      </div>
    `;
    return;
  }

  state.goals.forEach(goal => {
    const pct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
      <div class="goal-header">
        <span class="goal-title">${goal.icon || '🎯'} ${escapeHtml(goal.title)}</span>
        <div class="tx-actions">
          <button class="action-btn" onclick="openAddFundsModal('${goal.id}')" title="Tambah Setoran Tabungan">➕</button>
          <button class="action-btn delete" onclick="deleteGoal('${goal.id}')" title="Hapus Target">🗑️</button>
        </div>
      </div>
      <div class="goal-amount">
        Terkumpul: <strong style="color: var(--accent-emerald);">${formatRupiah(goal.currentAmount)}</strong>
        <span style="color: var(--text-muted); font-size: 0.75rem;">/ ${formatRupiah(goal.targetAmount)}</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${pct}%; background: ${pct >= 100 ? 'var(--accent-emerald)' : 'var(--accent-indigo)'};"></div>
      </div>
      <div class="goal-footer">
        <span>${pct >= 100 ? '🎉 Tercapai!' : `Sisa: ${formatRupiah(remaining)}`}</span>
        <span style="font-weight: 700; color: var(--accent-indigo);">${pct}%</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- Dynamic Dropdowns Populate ---
function populateCategorySelects(type = 'expense', selectId = 'formCategory', selectedValue = '') {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '';
  const cats = state.categories[type] || [];

  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.innerText = `${c.icon || ''} ${c.name}`;
    if (selectedValue && selectedValue === c.id) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function populateAccountSelects(selectId = 'formAccount', selectedValue = '') {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '';
  state.accounts.forEach(acc => {
    const opt = document.createElement('option');
    opt.value = acc.id;
    opt.innerText = `${acc.icon || '💳'} ${acc.name}`;
    if (selectedValue && selectedValue === acc.id) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function populateFilterDropdowns() {
  // Filter Categories
  const filterCat = document.getElementById('filterCategory');
  if (filterCat) {
    const curVal = filterCat.value;
    filterCat.innerHTML = '<option value="all">Semua Kategori</option>';
    const allCats = [
      ...(state.categories.expense || []),
      ...(state.categories.income || []),
      ...(state.categories.transfer || [])
    ];
    allCats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.innerText = `${c.icon || ''} ${c.name}`;
      filterCat.appendChild(opt);
    });
    if (curVal) filterCat.value = curVal;
  }

  // Filter Accounts
  const filterAcc = document.getElementById('filterAccount');
  if (filterAcc) {
    const curVal = filterAcc.value;
    filterAcc.innerHTML = '<option value="all">Semua Akun</option>';
    state.accounts.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.innerText = `${a.icon || '💳'} ${a.name}`;
      filterAcc.appendChild(opt);
    });
    if (curVal) filterAcc.value = curVal;
  }
}

// --- CRUD Transaksi & Transfer ---

// Open Modal for Add
function openAddTxModal(defaultType = 'expense') {
  state.editingTxId = null;
  document.getElementById('modalTitle').innerText = 'Tambah Transaksi Baru';
  document.getElementById('formTx').reset();

  document.getElementById('formDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('formAmountPreview').innerText = '';

  setFormType(defaultType);
  populateAccountSelects('formAccount');
  populateAccountSelects('formFromAccount');
  populateAccountSelects('formToAccount');
  populateCategorySelects('transfer', 'formTransferCategory');

  openModal('txModal');
}

// Open Modal for Edit
function openEditTxModal(txId) {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) return;

  state.editingTxId = txId;
  document.getElementById('modalTitle').innerText = tx.type === 'transfer' ? 'Edit Transfer Dana' : 'Edit Transaksi';

  document.getElementById('formDesc').value = tx.desc || '';
  document.getElementById('formAmount').value = tx.amount || '';
  document.getElementById('formAmountPreview').innerText = formatRupiah(tx.amount);
  document.getElementById('formDate').value = tx.date;
  document.getElementById('formNote').value = tx.note || '';

  populateAccountSelects('formAccount', tx.account);
  populateAccountSelects('formFromAccount', tx.fromAccount);
  populateAccountSelects('formToAccount', tx.toAccount);
  populateCategorySelects('transfer', 'formTransferCategory', tx.category);

  if (tx.type === 'transfer') {
    document.getElementById('formFee').value = tx.fee || 0;
  }

  setFormType(tx.type, tx.category);
  openModal('txModal');
}

// Set form type in modal (expense / income / transfer)
function setFormType(type, selectedCategory = '') {
  document.getElementById('formTypeInput').value = type;

  const expBtn = document.getElementById('typeBtnExpense');
  const incBtn = document.getElementById('typeBtnIncome');
  const trfBtn = document.getElementById('typeBtnTransfer');

  const regularFields = document.getElementById('regularTxFields');
  const transferFields = document.getElementById('transferTxFields');

  [expBtn, incBtn, trfBtn].forEach(b => b && b.classList.remove('active', 'expense', 'income', 'transfer'));

  if (type === 'expense') {
    expBtn.classList.add('active', 'expense');
    if (regularFields) regularFields.style.display = 'block';
    if (transferFields) transferFields.style.display = 'none';
    populateCategorySelects('expense', 'formCategory', selectedCategory);
  } else if (type === 'income') {
    incBtn.classList.add('active', 'income');
    if (regularFields) regularFields.style.display = 'block';
    if (transferFields) transferFields.style.display = 'none';
    populateCategorySelects('income', 'formCategory', selectedCategory);
  } else if (type === 'transfer') {
    trfBtn.classList.add('active', 'transfer');
    if (regularFields) regularFields.style.display = 'none';
    if (transferFields) transferFields.style.display = 'block';
    populateCategorySelects('transfer', 'formTransferCategory', selectedCategory);
  }
}

// Handle Form Submit
function handleTransactionSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('formTypeInput').value;
  const desc = document.getElementById('formDesc').value.trim();
  const amount = Number(document.getElementById('formAmount').value);
  const date = document.getElementById('formDate').value;
  const note = document.getElementById('formNote').value.trim();

  if (amount <= 0 || !date) {
    showToast('Harap isi nominal dan tanggal dengan benar!', 'danger');
    return;
  }

  let txData = {
    id: state.editingTxId || ('tx_' + Date.now()),
    desc,
    amount,
    type,
    date,
    note
  };

  if (type === 'transfer') {
    const fromAccount = document.getElementById('formFromAccount').value;
    const toAccount = document.getElementById('formToAccount').value;
    const category = document.getElementById('formTransferCategory') ? document.getElementById('formTransferCategory').value : 'topup';
    const fee = Number(document.getElementById('formFee').value) || 0;

    if (fromAccount === toAccount) {
      showToast('Rekening asal dan tujuan tidak boleh sama!', 'danger');
      return;
    }

    const fromAccInfo = getAccountInfo(fromAccount);
    const toAccInfo = getAccountInfo(toAccount);
    const defaultDesc = `Transfer ${fromAccInfo.name} ke ${toAccInfo.name}`;

    txData = {
      ...txData,
      desc: desc || defaultDesc,
      fromAccount,
      toAccount,
      category,
      fee
    };
  } else {
    const category = document.getElementById('formCategory').value;
    const account = document.getElementById('formAccount').value;

    if (!desc) {
      showToast('Keterangan transaksi tidak boleh kosong!', 'danger');
      return;
    }

    txData = {
      ...txData,
      category,
      account
    };
  }

  if (state.editingTxId) {
    const idx = state.transactions.findIndex(t => t.id === state.editingTxId);
    if (idx !== -1) {
      state.transactions[idx] = txData;
      showToast('Data transaksi berhasil diperbarui! ✏️');
    }
  } else {
    state.transactions.unshift(txData);
    showToast(type === 'transfer' ? 'Pemindahan dana berhasil dicatat! ⇄' : 'Transaksi berhasil dicatat! 🎉');
  }

  saveToStorage();
  closeModal('txModal');
  refreshAll();
}

function confirmDeleteTx(txId) {
  if (confirm('Apakah Anda yakin ingin menghapus catatan transaksi ini?')) {
    state.transactions = state.transactions.filter(t => t.id !== txId);
    saveToStorage();
    refreshAll();
    showToast('Transaksi dihapus 🗑️', 'info');
  }
}

// Preset Cepat
function applyQuickPreset(name, amount, category, type = 'expense', account = 'cash') {
  const newTx = {
    id: 'tx_' + Date.now(),
    desc: name,
    amount: amount,
    type: type,
    category: category,
    account: account,
    date: new Date().toISOString().split('T')[0],
    note: 'Dicatat via preset cepat'
  };

  state.transactions.unshift(newTx);
  saveToStorage();
  refreshAll();
  showToast(`+ Preset "${name}" (${formatRupiah(amount)}) berhasil dicatat! ⚡`);
}

// --- Account Management (Kelola Akun & Saldo Awal) ---
function openManageAccountsModal() {
  renderManageAccountsList();
  document.getElementById('formNewAccountName').value = '';
  document.getElementById('formNewAccountInitial').value = '';
  openModal('manageAccountsModal');
}

function renderManageAccountsList() {
  const listEl = document.getElementById('manageAccountsList');
  if (!listEl) return;

  listEl.innerHTML = '';
  state.accounts.forEach(acc => {
    const item = document.createElement('div');
    item.className = 'manage-item';
    item.innerHTML = `
      <div class="manage-item-info">
        <span style="font-size: 1.2rem;">${acc.icon || '💳'}</span>
        <div>
          <div class="manage-item-name">${escapeHtml(acc.name)}</div>
          <div class="manage-item-sub">Saldo Awal: <strong>${formatRupiah(acc.initialBalance || 0)}</strong></div>
        </div>
      </div>
      <div class="tx-actions">
        <button class="action-btn" onclick="openEditAccountModal('${acc.id}')" title="Ubah Saldo Awal">✏️</button>
        ${state.accounts.length > 1 ? `<button class="action-btn delete" onclick="deleteAccount('${acc.id}')" title="Hapus Akun">🗑️</button>` : ''}
      </div>
    `;
    listEl.appendChild(item);
  });
}

function handleAddNewAccount(e) {
  e.preventDefault();
  const name = document.getElementById('formNewAccountName').value.trim();
  const icon = document.getElementById('formNewAccountIcon').value || '💳';
  const initialBalance = Number(document.getElementById('formNewAccountInitial').value) || 0;

  if (!name) {
    showToast('Nama akun tidak boleh kosong!', 'danger');
    return;
  }

  const id = 'acc_' + Date.now();
  state.accounts.push({ id, name, icon, initialBalance });
  saveToStorage();
  renderManageAccountsList();
  refreshAll();

  document.getElementById('formNewAccountName').value = '';
  document.getElementById('formNewAccountInitial').value = '';
  showToast(`Akun "${name}" berhasil ditambahkan! 💳`);
}

function openEditAccountModal(accId) {
  const acc = state.accounts.find(a => a.id === accId);
  if (!acc) return;

  const newInitial = prompt(`Ubah Saldo Awal untuk akun "${acc.name}" (Rp):`, acc.initialBalance || 0);
  if (newInitial !== null && !isNaN(newInitial)) {
    acc.initialBalance = Number(newInitial);
    saveToStorage();
    refreshAll();
    renderManageAccountsList();
    showToast(`Saldo awal "${acc.name}" diperbarui ke ${formatRupiah(acc.initialBalance)} 💰`);
  }
}

function deleteAccount(accId) {
  if (confirm('Apakah Anda yakin ingin menghapus akun ini? Riwayat transaksi lama akan tetap tersimpan.')) {
    state.accounts = state.accounts.filter(a => a.id !== accId);
    saveToStorage();
    renderManageAccountsList();
    refreshAll();
    showToast('Akun berhasil dihapus 🗑️', 'info');
  }
}

// --- Category Management (Kelola Kategori Kustom) ---
function openManageCategoriesModal() {
  renderManageCategoriesList('expense');
  document.getElementById('formNewCategoryName').value = '';
  openModal('manageCategoriesModal');
}

function renderManageCategoriesList(type = 'expense') {
  const listEl = document.getElementById('manageCategoriesList');
  if (!listEl) return;

  listEl.innerHTML = '';
  const cats = state.categories[type] || [];

  cats.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'manage-item';
    item.innerHTML = `
      <div class="manage-item-info">
        <span style="font-size: 1.2rem; width: 32px; height: 32px; border-radius: 8px; background: ${cat.color}20; display: flex; align-items: center; justify-content: center;">
          ${cat.icon || '📦'}
        </span>
        <span class="manage-item-name">${escapeHtml(cat.name)}</span>
      </div>
      <div class="tx-actions">
        <button class="action-btn delete" onclick="deleteCategory('${cat.id}', '${type}')" title="Hapus Kategori">🗑️</button>
      </div>
    `;
    listEl.appendChild(item);
  });
}

function handleAddNewCategory(e) {
  e.preventDefault();
  const type = document.getElementById('formNewCategoryType').value;
  const name = document.getElementById('formNewCategoryName').value.trim();
  const icon = document.getElementById('formNewCategoryIcon').value || '📦';
  const color = document.getElementById('formNewCategoryColor').value || '#6366F1';

  if (!name) {
    showToast('Nama kategori tidak boleh kosong!', 'danger');
    return;
  }

  const id = 'cat_' + Date.now();
  if (!state.categories[type]) state.categories[type] = [];

  state.categories[type].push({ id, name, icon, color });
  saveToStorage();
  renderManageCategoriesList(type);
  refreshAll();

  document.getElementById('formNewCategoryName').value = '';
  showToast(`Kategori "${name}" berhasil ditambahkan! ✨`);
}

function deleteCategory(catId, type) {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    state.categories[type] = state.categories[type].filter(c => c.id !== catId);
    saveToStorage();
    renderManageCategoriesList(type);
    refreshAll();
    showToast('Kategori berhasil dihapus 🗑️', 'info');
  }
}

// --- Goals (Target Tabungan Impian & Wishlist Jangka Panjang) CRUD ---
function openAddGoalModal() {
  document.getElementById('formGoalTitle').value = '';
  document.getElementById('formGoalTarget').value = '';
  document.getElementById('formGoalCurrent').value = '';
  document.getElementById('formGoalDeadline').value = '';
  openModal('goalModal');
}

function handleGoalSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('formGoalTitle').value.trim();
  const targetAmount = Number(document.getElementById('formGoalTarget').value);
  const currentAmount = Number(document.getElementById('formGoalCurrent').value) || 0;
  const deadline = document.getElementById('formGoalDeadline').value;
  const icon = document.getElementById('formGoalIcon').value || '🎯';

  if (!title || targetAmount <= 0) {
    showToast('Harap isi judul target dan nominal yang valid!', 'danger');
    return;
  }

  const newGoal = {
    id: 'goal_' + Date.now(),
    title,
    targetAmount,
    currentAmount,
    deadline,
    icon
  };

  state.goals.push(newGoal);
  saveToStorage();
  closeModal('goalModal');
  renderGoals();
  showToast('Target tabungan impian baru berhasil ditambahkan! 🎯');
}

function deleteGoal(goalId) {
  if (confirm('Apakah Anda yakin ingin menghapus target tabungan impian ini?')) {
    state.goals = state.goals.filter(g => g.id !== goalId);
    saveToStorage();
    renderGoals();
    showToast('Target tabungan dihapus 🗑️', 'info');
  }
}

function openAddFundsModal(goalId) {
  const goal = state.goals.find(g => g.id === goalId);
  if (!goal) return;

  const added = prompt(`Masukkan jumlah setoran tambahan untuk "${goal.title}":`, '500000');
  if (added && !isNaN(added) && Number(added) > 0) {
    goal.currentAmount += Number(added);
    saveToStorage();
    renderGoals();
    showToast(`Setoran ${formatRupiah(Number(added))} berhasil ditambahkan ke "${goal.title}"! 💰`);
  }
}

// --- Modal Helper Functions ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

// --- Export & Backup Functions ---
function exportToCSV() {
  const filtered = getFilteredTransactions();
  if (filtered.length === 0) {
    showToast('Tidak ada data transaksi untuk diekspor!', 'danger');
    return;
  }

  let csvContent = '\uFEFF';
  csvContent += 'ID,Tanggal,Keterangan,Tipe,Kategori,Akun/Dari,Akun Tujuan,Nominal (Rp),Biaya Admin,Catatan\n';

  filtered.forEach(tx => {
    const fromAcc = tx.type === 'transfer' ? getAccountInfo(tx.fromAccount).name : getAccountInfo(tx.account).name;
    const toAcc = tx.type === 'transfer' ? getAccountInfo(tx.toAccount).name : '-';
    const catName = getCategoryInfo(tx.category, tx.type).name;
    const typeLabel = tx.type === 'income' ? 'Pemasukan' : (tx.type === 'expense' ? 'Pengeluaran' : 'Transfer');

    const row = [
      tx.id,
      tx.date,
      `"${(tx.desc || '').replace(/"/g, '""')}"`,
      typeLabel,
      `"${catName}"`,
      `"${fromAcc}"`,
      `"${toAcc}"`,
      tx.amount,
      tx.fee || 0,
      `"${(tx.note || '').replace(/"/g, '""')}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Catatan_Keuangan_Rizki_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Data berhasil diekspor ke file CSV/Excel! 📊');
}

function backupJSON() {
  const backupData = {
    version: '2.2',
    exportDate: new Date().toISOString(),
    accounts: state.accounts,
    categories: state.categories,
    transactions: state.transactions,
    goals: state.goals,
    monthlyTargets: state.monthlyTargets
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Keuangan_Rizki_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('File backup JSON berhasil diunduh! 💾');
}

function handleRestoreJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data.transactions)) {
        state.transactions = data.transactions;
        if (Array.isArray(data.accounts)) state.accounts = data.accounts;
        if (data.categories) state.categories = ensureCategoriesStructure(data.categories);
        if (Array.isArray(data.goals)) state.goals = data.goals;
        if (data.monthlyTargets) state.monthlyTargets = data.monthlyTargets;

        saveToStorage();
        refreshAll();
        showToast('Data berhasil dipulihkan dari file backup! 🔄');
      } else {
        showToast('Format file backup tidak valid!', 'danger');
      }
    } catch (err) {
      showToast('Gagal membaca file JSON!', 'danger');
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (confirm('⚠️ PERINGATAN: Apakah Anda yakin ingin mereset dan menghapus SEMUA catatan keuangan & akun ke pengaturan awal?')) {
    state.accounts = DEFAULT_ACCOUNTS;
    state.categories = DEFAULT_CATEGORIES;
    state.transactions = [];
    state.goals = [];
    state.monthlyTargets = DEFAULT_MONTHLY_TARGETS;
    saveToStorage();
    refreshAll();
    showToast('Semua data keuangan telah direset ke default.', 'info');
  }
}

function loadDemoData() {
  if (confirm('Muat data sampel demo realistis untuk menguji aplikasi?')) {
    state.accounts = DEFAULT_ACCOUNTS;
    state.categories = DEFAULT_CATEGORIES;
    state.transactions = getInitialDemoData();
    state.goals = getInitialGoals();
    state.monthlyTargets = DEFAULT_MONTHLY_TARGETS;
    saveToStorage();
    refreshAll();
    showToast('Data sampel demo berhasil dimuat! 🚀');
  }
}

// --- Tab Switching ---
function switchTab(tabId) {
  state.currentTab = tabId;

  // Sync Desktop Tab Buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Sync Mobile Bottom Nav Items
  document.querySelectorAll('.mobile-nav-item').forEach(btn => {
    if (btn.getAttribute('data-mobile-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Sync Tab Panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    if (panel.id === `tab-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Scroll to top smoothly on tab switch
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'analytics') {
    renderMonthlyAnalytics();
  } else if (tabId === 'goals') {
    renderGoals();
    renderMonthlyAnalytics();
  }
}

// --- Refresh All UI ---
function refreshAll() {
  populateFilterDropdowns();
  populateAccountSelects('inlineAccount');
  populateAccountSelects('inlineFromAccount');
  populateAccountSelects('inlineToAccount');
  populateCategorySelects('transfer', 'inlineTransferCategory');

  renderAccountCards();
  renderMetrics();
  renderTransactionList();
  renderGoals();
  renderMonthlyAnalytics();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Check and initialize Cloud Sync
  updateSyncUI(state.syncKey ? 'synced' : 'offline');
  if (state.syncKey) {
    pullDataFromCloud(false);
  }

  // Check and initialize Google Sheets Sync
  updateGoogleSheetUI(state.googleSheetUrl ? 'synced' : 'offline');
  if (state.googleSheetUrl) {
    pullDataFromGoogleSheet(false);
  }

  // Setup Amount preview in modal
  const formAmountInput = document.getElementById('formAmount');
  const formAmountPreview = document.getElementById('formAmountPreview');
  if (formAmountInput && formAmountPreview) {
    formAmountInput.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      formAmountPreview.innerText = val > 0 ? formatRupiah(val) : '';
    });
  }

  // Filter Listeners
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filter.search = e.target.value.trim();
      renderTransactionList();
    });
  }

  const filterType = document.getElementById('filterType');
  if (filterType) {
    filterType.addEventListener('change', (e) => {
      state.filter.type = e.target.value;
      renderTransactionList();
    });
  }

  const filterCat = document.getElementById('filterCategory');
  if (filterCat) {
    filterCat.addEventListener('change', (e) => {
      state.filter.category = e.target.value;
      renderTransactionList();
    });
  }

  const filterAcc = document.getElementById('filterAccount');
  if (filterAcc) {
    filterAcc.addEventListener('change', (e) => {
      state.filter.account = e.target.value;
      renderTransactionList();
    });
  }

  const filterMonth = document.getElementById('filterMonth');
  if (filterMonth) {
    filterMonth.addEventListener('change', (e) => {
      state.filter.month = e.target.value;
      renderTransactionList();
    });
  }

  // Initial populate and render
  refreshAll();
});
