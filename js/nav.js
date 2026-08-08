// ===== nav.js =====
// القائمة الجانبية، شريط التنقل السفلي على الجوال، البحث الموحّد، وضع المقارنة، والفترة المخصصة.

const NAV_GROUPS = [
  { id: 'home', label: 'الرئيسية', tabs: ['tab-summary'] },
  { id: 'reports', label: 'التقارير', tabs: ['tab-monthly-reports', 'tab-expenses', 'tab-purchases', 'tab-report'] },
  { id: 'parties', label: 'الأطراف', tabs: ['tab-suppliers', 'tab-women-suppliers', 'tab-customers'] },
  { id: 'tools', label: 'الأدوات', tabs: ['tab-profit-scenario', 'tab-profit-first'] }
];
const TAB_LABELS = {
  'tab-summary': 'نظرة عامة',
  'tab-monthly-reports': 'التقارير الشهرية',
  'tab-expenses': 'المصاريف التفصيلية',
  'tab-purchases': 'المشتريات',
  'tab-report': 'التقرير التحليلي',
  'tab-suppliers': 'موردين الرجالي',
  'tab-women-suppliers': 'موردين النسائي',
  'tab-customers': 'عملاء النسائي',
  'tab-profit-scenario': 'سيناريو الربحية',
  'tab-profit-first': 'تقييم Profit First'
};

function groupOf(tabId) {
  return NAV_GROUPS.find(g => g.tabs.includes(tabId));
}

function renderMobileSubnav(tabId) {
  const el = document.getElementById('mobile-subnav');
  if (!el) return;
  const group = groupOf(tabId);
  if (!group || group.tabs.length < 2) { el.innerHTML = ''; return; }
  el.innerHTML = group.tabs.map(id => `
    <button class="mobile-subnav-item ${id === tabId ? 'active' : ''}" onclick="switchTab('${id}')">${TAB_LABELS[id] || id}</button>
  `).join('');
}

function syncSidebarActive(tabId) {
  const group = groupOf(tabId);
  document.querySelectorAll('.sidebar-item[data-nav-group]').forEach(btn => {
    btn.classList.toggle('active', group && btn.dataset.navGroup === group.id);
  });
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', group && btn.dataset.navGroup === group.id);
  });
}

function switchNavGroup(groupId) {
  const group = NAV_GROUPS.find(g => g.id === groupId);
  if (!group) return;
  switchTab(group.tabs[0]);
}

// ===== Global search =====
function runGlobalSearch(query) {
  const box = document.getElementById('global-search-results');
  if (!box) return;
  const q = (query || '').trim().toLowerCase();
  if (!q) { box.innerHTML = ''; return; }
  const results = [];

  if (typeof MONTHS !== 'undefined') {
    MONTHS.filter(m => m.toLowerCase().includes(q)).slice(0, 5).forEach(m => {
      results.push({ label: m, sub: 'شهر — التقارير الشهرية', onClick: `switchTab('tab-monthly-reports'); setTimeout(()=>jumpToMonthlyReport('${m.replace(/'/g, "\\'")}'), 60);` });
    });
  }
  if (typeof CATS !== 'undefined') {
    CATS.filter(c => c.toLowerCase().includes(q)).slice(0, 5).forEach(c => {
      results.push({ label: c, sub: 'فئة مصاريف', onClick: `switchTab('tab-expenses')` });
    });
  }
  if (typeof SUPPLIERS !== 'undefined' && Array.isArray(SUPPLIERS)) {
    SUPPLIERS.filter(s => (s.name || '').toLowerCase().includes(q)).slice(0, 5).forEach(s => {
      results.push({ label: s.name, sub: 'مورد رجالي', onClick: `switchTab('tab-suppliers')` });
    });
  }
  if (typeof CUSTOMERS !== 'undefined' && Array.isArray(CUSTOMERS)) {
    CUSTOMERS.filter(c => (c.name || '').toLowerCase().includes(q)).slice(0, 5).forEach(c => {
      results.push({ label: c.name, sub: 'عميلة نسائي', onClick: `switchTab('tab-customers')` });
    });
  }

  if (!results.length) { box.innerHTML = '<div style="padding:8px;font-size:0.78rem;color:var(--muted-2)">لا نتائج</div>'; return; }
  box.innerHTML = results.map(r => `
    <button class="sidebar-search-result" onclick="${r.onClick}">${r.label}<small>${r.sub}</small></button>
  `).join('');
}

function jumpToMonthlyReport(month) {
  const select = document.getElementById('monthly-report-select');
  if (select && [...select.options].some(o => o.value === month)) {
    select.value = month;
    if (typeof renderMonthlyReportDetail === 'function') renderMonthlyReportDetail(month);
  }
}

// ===== Compare mode (Executive Summary) =====
let compareModeOn = false;
function toggleCompareMode() {
  compareModeOn = !compareModeOn;
  const btn = document.getElementById('compare-toggle-btn');
  const panel = document.getElementById('summary-compare-panel');
  if (btn) btn.classList.toggle('on', compareModeOn);
  if (panel) panel.classList.toggle('open', compareModeOn);
  if (compareModeOn) renderComparePanel();
}

function renderComparePanel() {
  const body = document.getElementById('compare-panel-body');
  const title = document.getElementById('compare-panel-title');
  if (!body || typeof MONTHS === 'undefined' || MONTHS.length < 2) return;
  // قارن آخر شهر بنفس الشهر في السنة السابقة إن وُجد، وإلا آخر شهرين
  const lastMonth = MONTHS[MONTHS.length - 1];
  const lastLabel = lastMonth.split(' ')[0];
  const sameMonthPrevYear = MONTHS.slice(0, -1).reverse().find(m => m.startsWith(lastLabel));
  const compareMonth = sameMonthPrevYear || MONTHS[MONTHS.length - 2];
  title.textContent = `مقارنة: ${compareMonth} مقابل ${lastMonth}`;

  const detailOf = m => MONTHLY_DETAIL[m] || {};
  const profitOf = m => { const d = detailOf(m); return d.metric1 ?? d.profit ?? 0; };
  const revenueOf = m => detailOf(m).revenue ?? 0;

  const cols = [compareMonth, lastMonth].map(m => {
    const revenue = revenueOf(m);
    const profit = profitOf(m);
    const profitColor = profit >= 0 ? '#15803D' : '#B91C1C';
    return { m, revenue, profit, profitColor };
  });
  const revenueDelta = cols[0].revenue ? ((cols[1].revenue - cols[0].revenue) / cols[0].revenue) * 100 : null;
  const profitWorse = cols[1].profit < cols[0].profit;

  body.innerHTML = cols.map((c, i) => `
    <div>
      <div class="compare-col-label">${c.m}</div>
      <div class="compare-col-value">${fmt(c.revenue)} ريال ${i === 1 && revenueDelta !== null ? `<span style="font-size:0.72rem;color:${revenueDelta >= 0 ? '#15803D' : '#B91C1C'};font-weight:800">${revenueDelta >= 0 ? '▲' : '▼'} ${Math.abs(revenueDelta).toFixed(0)}%</span>` : ''}</div>
      <div class="compare-col-delta" style="color:${c.profitColor}">ربح: ${fmtSigned(c.profit)} ${i === 1 && profitWorse ? '<span style="color:#B91C1C">▼ أسوأ</span>' : ''}</div>
    </div>
  `).join('');
}

// ===== Automatic alert (latest month loss) =====
function renderAutoAlert() {
  const el = document.getElementById('summary-alert-banner');
  if (!el || typeof MONTHS === 'undefined' || !MONTHS.length) return;
  const lastMonth = MONTHS[MONTHS.length - 1];
  const d = MONTHLY_DETAIL[lastMonth] || {};
  const profit = d.metric1 ?? d.profit ?? 0;
  const cashSurplus = d.metric3 ?? 0;
  if (profit >= 0 && cashSurplus >= 0) { el.style.display = 'none'; return; }
  const dailyAvg = (d.gross_margin ?? 0) / (typeof summaryMonthDays === 'function' ? summaryMonthDays(lastMonth) : 30);
  el.style.display = 'flex';
  el.innerHTML = `<span>⚠️</span><span>تنبيه تلقائي — ${lastMonth} (آخر شهر) ${profit < 0 ? `في خسارة تشغيلية: ${fmtSigned(profit)} ريال` : ''}${profit < 0 && cashSurplus < 0 ? '، و' : ''}${cashSurplus < 0 ? `الفائض النقدي سالب: ${fmtSigned(cashSurplus)} ريال` : ''}${dailyAvg ? `، والمتوسط اليومي ${fmt(dailyAvg)} ريال.` : '.'}</span>`;
}

// ===== فلتر الفترة الموحّد لـ"نظرة عامة" — يتحكم بالكروت + الشارتات + الجدول معاً =====
function toggleRangePanel() {
  const panel = document.getElementById('range-panel');
  if (panel) panel.classList.toggle('open');
}
function populateRangeSelects() {
  const from = document.getElementById('range-from');
  const to = document.getElementById('range-to');
  if (!from || !to || typeof MONTHS === 'undefined') return;
  from.innerHTML = MONTHS.map(m => `<option value="${m}">${m}</option>`).join('');
  to.innerHTML = MONTHS.map(m => `<option value="${m}">${m}</option>`).join('');
  from.value = MONTHS[0];
  to.value = MONTHS[MONTHS.length - 1];
}

// نقطة الحقيقة الوحيدة للفترة المختارة بتاب "نظرة عامة"
function applySummaryRange(fromIdx, toIdx, label) {
  if (typeof MONTHS === 'undefined') return;
  const lo = Math.max(0, Math.min(fromIdx, toIdx));
  const hi = Math.min(MONTHS.length - 1, Math.max(fromIdx, toIdx));
  const pillBtn = document.getElementById('range-pill-btn');
  if (pillBtn) pillBtn.textContent = `الفترة: ${label || (MONTHS[lo] + ' – ' + MONTHS[hi])} ▾`;
  if (typeof renderExecutiveKpis === 'function') renderExecutiveKpis(lo, hi);
  if (typeof renderSummaryCharts === 'function') renderSummaryCharts(lo, hi);
  if (typeof renderSummaryTable === 'function') renderSummaryTable(lo, hi);
}

// أزرار الفترة الجاهزة (الكل/2025/2026) داخل قائمة "الفترة"
function setExecutiveKpiPeriod(period, btn) {
  document.querySelectorAll('.summary-kpi-filter').forEach(item => item.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (typeof MONTHS === 'undefined' || !MONTHS.length) return;
  if (period === 'all') { applySummaryRange(0, MONTHS.length - 1, 'الكل'); return; }
  const indices = MONTHS.map((m, i) => ({ m, i })).filter(({ m }) => m.includes(period.slice(-2)));
  if (!indices.length) return;
  applySummaryRange(indices[0].i, indices[indices.length - 1].i, period);
}

function applyCustomRange() {
  const from = document.getElementById('range-from')?.value;
  const to = document.getElementById('range-to')?.value;
  if (!from || !to || typeof MONTHS === 'undefined') return;
  const fromIdx = MONTHS.indexOf(from);
  const toIdx = MONTHS.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return;
  document.querySelectorAll('.summary-kpi-filter').forEach(b => b.classList.remove('active'));
  applySummaryRange(fromIdx, toIdx);
  toggleRangePanel();
}


document.addEventListener('DOMContentLoaded', () => {
  populateRangeSelects();
  renderAutoAlert();
  document.addEventListener('click', e => {
    const panel = document.getElementById('range-panel');
    const control = e.target.closest('.range-control');
    if (panel && panel.classList.contains('open') && !control) panel.classList.remove('open');
  });
  const initialTab = (location.hash || '').replace('#', '') || 'tab-summary';
  if (document.getElementById(initialTab)) switchTab(initialTab);
  else syncSidebarActive('tab-summary');
});
