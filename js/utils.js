// ===== utils.js =====
// دوال مساعدة مشتركة

// تنسيق الأرقام
function fmt(n) {
  if (n === null || n === undefined || n === 0) return '—';
  return Math.round(n).toLocaleString('en-US');
}

function fmtSigned(n) {
  if (n === null || n === undefined) return '—';
  const abs = Math.abs(Math.round(n)).toLocaleString('en-US');
  return n >= 0 ? `+${abs}` : `-${abs}`;
}

function fmtPct(n) {
  if (!n) return '—';
  return n.toFixed(1) + '%';
}

// تبديل التبويبات
function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  // إيجاد الزر المناسب
  const btn = document.querySelector(`[onclick="switchTab('${id}')"]`);
  if (btn) btn.classList.add('active');
}

// ترتيب الجداول
function sortTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  const asc = table.dataset.sortCol == colIndex && table.dataset.sortDir === 'asc';
  table.dataset.sortCol = colIndex;
  table.dataset.sortDir = asc ? 'desc' : 'asc';
  
  rows.sort((a, b) => {
    const aText = a.cells[colIndex]?.textContent.trim().replace(/[+,ر]/g, '') || '';
    const bText = b.cells[colIndex]?.textContent.trim().replace(/[+,ر]/g, '') || '';
    const aNum = parseFloat(aText);
    const bNum = parseFloat(bText);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return asc ? bNum - aNum : aNum - bNum;
    }
    return asc ? bText.localeCompare(aText, 'ar') : aText.localeCompare(bText, 'ar');
  });
  
  rows.forEach(r => tbody.appendChild(r));
}

// فلترة الجدول حسب السنة
function filterByYear(year) {
  const rows = document.querySelectorAll('#summary-tbody tr');
  rows.forEach(row => {
    const rowYear = row.dataset.year;
    const month = row.cells[0]?.textContent.trim();
    if (year === 'all') {
      row.style.display = '';
    } else if (year === '2025') {
      row.style.display = rowYear === '2025' || month?.includes('25') ? '' : 'none';
    } else if (year === '2026') {
      row.style.display = rowYear === '2026' || month?.includes('26') ? '' : 'none';
    }
  });
  
  // تحديث أزرار الفلترة
  document.querySelectorAll('.year-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.year === year);
  });
}

// إغلاق المودال
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Chart.js defaults
const chartDefaults = {
  locale: 'en-US',
  responsive: true,
  plugins: { legend: { labels: { font: { family: 'Segoe UI, Tahoma, Arial' } } } },
  scales: {
    x: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial', size: 11 } } },
    y: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial' }, callback: v => (v/1000).toFixed(0)+'K' } }
  }
};
