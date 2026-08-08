// ===== tables.js =====
// دوال الجداول والمودال والفلترة

function renderDashboardHeader() {
  if (typeof MONTHS === 'undefined' || !MONTHS.length) return;
  const firstMonth = MONTHS[0];
  const lastMonth = MONTHS[MONTHS.length - 1];
  const monthsCount = MONTHS.length;
  const periodEl = document.getElementById('dashboard-period');
  const updateEl = document.getElementById('dashboard-last-update');
  if (periodEl) periodEl.textContent = `${firstMonth} — ${lastMonth} · ${monthsCount} شهر من البيانات`;
  if (updateEl) updateEl.textContent = `آخر تحديث: ${lastMonth}`;
}

// ===== نظرة عامة: مؤشرات مالية للفترة المحددة، مع مقارنة دائمة بفترة سابقة مكافئة =====
function summaryValuesFor(fromIdx, toIdx) {
  const revenue = [], margin = [], expenses = [], profit = [];
  for (let idx = fromIdx; idx <= toIdx; idx++) {
    const month = MONTHS[idx];
    const detail = MONTHLY_DETAIL[month] || {};
    revenue.push(Number(detail.revenue ?? REVENUES[idx] ?? 0));
    margin.push(Number(detail.gross_margin ?? GROSS_MARGINS[idx] ?? 0));
    expenses.push(Number(detail.expenses ?? EXPENSES[idx] ?? 0));
    profit.push(Number(detail.metric1 ?? detail.profit ?? PROFIT_ACTUAL[idx] ?? ((GROSS_MARGINS[idx] || 0) - (EXPENSES[idx] || 0))));
  }
  const sum = arr => arr.reduce((a, b) => a + b, 0);
  return {
    revenue: sum(revenue), margin: sum(margin), expenses: sum(expenses), profit: sum(profit),
    count: toIdx - fromIdx + 1
  };
}

function formatK(value, showPlus = false) {
  const sign = value < 0 ? '-' : (showPlus && value > 0 ? '+' : '');
  const abs = Math.abs(value) / 1000;
  return `${sign}${abs.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
}

function changeSubText(current, previous) {
  if (previous === null || previous === undefined || !previous) return 'لا توجد فترة سابقة للمقارنة';
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const color = pct >= 0 ? '#15803D' : '#B91C1C';
  return `<span style="color:${color};font-weight:800">${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(0)}%</span> عن الفترة السابقة المكافئة`;
}

function renderExecutiveKpis(fromIdx, toIdx) {
  if (typeof MONTHS === 'undefined' || !MONTHS.length) return;
  const lo = Math.max(0, fromIdx ?? 0);
  const hi = Math.min(MONTHS.length - 1, toIdx ?? MONTHS.length - 1);
  const current = summaryValuesFor(lo, hi);
  const periodLen = hi - lo + 1;
  const prevHi = lo - 1;
  const prevLo = prevHi - periodLen + 1;
  const previous = prevLo >= 0 ? summaryValuesFor(prevLo, prevHi) : null;

  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const setHtml = (id, value) => { const el = document.getElementById(id); if (el) el.innerHTML = value; };

  setText('summary-total-revenue', formatK(current.revenue));
  setHtml('summary-total-revenue-sub', previous ? changeSubText(current.revenue, previous.revenue) : `${current.count} شهر`);

  setText('summary-gross-margin', formatK(current.margin));
  setHtml('summary-gross-margin-sub', previous ? changeSubText(current.margin, previous.margin) : `${current.count} شهر`);

  setText('summary-expenses-total', formatK(current.expenses));
  setHtml('summary-expenses-total-sub', previous ? changeSubText(current.expenses, previous.expenses) : `${current.count} شهر`);

  setText('summary-net-result', formatK(current.profit));
  setHtml('summary-net-result-sub', previous ? changeSubText(current.profit, previous.profit) : 'هامش 15% − المصاريف');

  const netEl = document.getElementById('summary-net-result');
  if (netEl) netEl.style.color = current.profit >= 0 ? '#15803D' : '#B91C1C';

  renderPurchasesMini();
}

// بطاقة "إجمالي المشتريات" — دايم آخر شهر فعلي بالبيانات، بغض النظر عن فلتر الفترة (رقم واحد فقط، التفصيل بتاب المشتريات)
function renderPurchasesMini() {
  if (typeof MONTHS === 'undefined' || !MONTHS.length) return;
  const lastMonth = MONTHS[MONTHS.length - 1];
  const detail = MONTHLY_DETAIL[lastMonth] || {};
  const purchases = Number(detail.purchases ?? PURCHASES[MONTHS.length - 1] ?? 0);
  const el = document.getElementById('summary-purchases-value');
  if (el) el.textContent = `${fmt(purchases)} ر — ${lastMonth}`;
}

let expensesTopChart = null;

function getExpenseBreakdown(month) {
  const detailed = EXP_DETAILS[month] || {};
  if (Object.keys(detailed).length) return detailed;
  return MONTHLY_DETAIL[month]?.exp_breakdown || {};
}

function getExpenseItems(month, cat) {
  const breakdown = getExpenseBreakdown(month);
  return breakdown[cat] || [];
}

function getExpenseRows(period = 'all') {
  const selectedMonths = MONTHS.filter(month => period === 'all' || month.includes(period.slice(-2)));
  const categories = [
    ...CATS,
    ...selectedMonths.flatMap(month => Object.keys(getExpenseBreakdown(month))).filter(cat => !CATS.includes(cat))
  ].filter((cat, idx, arr) => arr.indexOf(cat) === idx);
  const categoryRows = categories.map(cat => {
    const values = selectedMonths.map(month => getExpenseItems(month, cat).reduce((sum, item) => sum + (item.amount || 0), 0));
    const total = values.reduce((sum, value) => sum + value, 0);
    return { cat, values, total };
  }).filter(row => row.total > 0);
  const monthTotals = selectedMonths.map((month, idx) => ({
    month,
    total: categoryRows.reduce((sum, row) => sum + row.values[idx], 0)
  }));
  return { selectedMonths, categoryRows, monthTotals };
}

function renderExpenseKpis(data) {
  const total = data.categoryRows.reduce((sum, row) => sum + row.total, 0);
  const topCategory = data.categoryRows.slice().sort((a, b) => b.total - a.total)[0];
  const topMonth = data.monthTotals.slice().sort((a, b) => b.total - a.total)[0];
  const average = data.selectedMonths.length ? total / data.selectedMonths.length : 0;
  const fmtAmount = value => value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ر';
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('expenses-total', fmtAmount(total));
  setText('expenses-total-sub', `${data.selectedMonths.length} شهر`);
  setText('expenses-top-category', topCategory?.cat || '—');
  setText('expenses-top-category-sub', topCategory ? fmtAmount(topCategory.total) : '—');
  setText('expenses-top-month', topMonth?.month || '—');
  setText('expenses-top-month-sub', topMonth ? fmtAmount(topMonth.total) : '—');
  setText('expenses-average', fmtAmount(average));
  setText('expenses-average-sub', 'متوسط الفترة المختارة');
}

function renderExpenseCharts(data) {
  const topCanvas = document.getElementById('ch-exp-top');
  const stackCanvas = document.getElementById('ch-exp-stack');
  const sortedRows = data.categoryRows.slice().sort((a, b) => b.total - a.total);
  if (topCanvas && typeof Chart !== 'undefined') {
    if (expensesTopChart) expensesTopChart.destroy();
    expensesTopChart = new Chart(topCanvas, {
      type: 'bar',
      data: {
        labels: sortedRows.map(row => row.cat),
        datasets: [{
          label: 'إجمالي الفئة',
          data: sortedRows.map(row => row.total),
          backgroundColor: sortedRows.map(row => CAT_COLORS[row.cat] || '#4E7CFF'),
          borderRadius: 5
        }]
      },
      options: {
        ...chartDefaults,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } },
          y: { ticks: { font: { family: 'IBM Plex Sans Arabic, Tahoma, Arial' } } }
        }
      }
    });
  }
  if (stackCanvas && typeof Chart !== 'undefined') {
    const existingChart = Chart.getChart(stackCanvas);
    if (existingChart) existingChart.destroy();
    window.expStackChart = new Chart(stackCanvas, {
      type: 'bar',
      data: {
        labels: data.selectedMonths,
        datasets: data.categoryRows.map(row => ({
          label: row.cat,
          data: row.values,
          backgroundColor: CAT_COLORS[row.cat] || '#4E7CFF',
          borderRadius: 2
        }))
      },
      options: {
        ...chartDefaults,
        scales: {
          x: { stacked: true, ticks: { font: { family: 'IBM Plex Sans Arabic, Tahoma, Arial', size: 11 } } },
          y: { stacked: true, ticks: { font: { family: 'IBM Plex Sans Arabic, Tahoma, Arial' }, callback: v => (v / 1000).toFixed(0) + 'K' } }
        }
      }
    });
  }
}

// ===== خط اتجاه مصغّر (Sparkline) بدون أي مكتبة خارجية =====
function buildSparklineSvg(values, color) {
  const w = 108, h = 32, pad = 3;
  if (!values.length) return '';
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = (max - min) || 1;
  const stepX = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePoints = points.join(' ');
  const areaPoints = `${pad},${h - pad} ${linePoints} ${(w - pad).toFixed(1)},${h - pad}`;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${areaPoints}" fill="${color}" opacity="0.14" stroke="none"></polyline>
    <polyline points="${linePoints}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
  </svg>`;
}

// ===== الفئات مرتّبة + Sparkline لكل فئة، مفلترة بنفس فترة الصفحة =====
let expOpenCategory = null;

function renderExpenseRankedList(data) {
  const el = document.getElementById('exp-ranked-list');
  if (!el) return;
  const sorted = data.categoryRows.slice().sort((a, b) => b.total - a.total);
  const max = sorted.length ? sorted[0].total : 0;

  el.innerHTML = sorted.map(row => {
    const pct = max ? (row.total / max) * 100 : 0;
    const color = CAT_COLORS[row.cat] || '#4E7CFF';
    const nonZero = row.values.filter(v => v > 0);
    const firstVal = nonZero[0] || 0;
    const lastVal = nonZero[nonZero.length - 1] || 0;
    const change = (firstVal && nonZero.length > 1) ? ((lastVal - firstVal) / firstVal) * 100 : null;
    // مصروف أكثر = أسوأ، فنعكس منطق الألوان الوظيفي المعتاد (ارتفاع = أحمر)
    const changeColor = change === null ? '#94A3B8' : (change > 0 ? '#B91C1C' : '#15803D');
    const changeText = change === null ? '—' : `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(0)}%`;
    const isOpen = expOpenCategory === row.cat;
    const safeCat = row.cat.replace(/'/g, "\\'").replace(/"/g, '&quot;');

    return `
      <div class="exp-ranked-row row-expand-toggle ${isOpen ? 'open' : ''}" onclick="toggleExpCategory('${safeCat}')">
        <div class="exp-ranked-row-top">
          <div class="exp-ranked-name"><span class="row-expand-arrow">▾</span> ${row.cat}</div>
          <div class="exp-ranked-track2"><div class="exp-ranked-fill2" style="width:${pct}%;background:${color}"></div></div>
          <div class="exp-ranked-spark">${buildSparklineSvg(row.values, color)}</div>
          <div class="exp-ranked-total">${fmt(row.total)} ر</div>
          <div class="exp-ranked-change" style="color:${changeColor}">${changeText}</div>
        </div>
        <div class="exp-ranked-detail ${isOpen ? 'open' : ''}">
          ${isOpen ? renderExpCategoryMonths(row, data.selectedMonths) : ''}
        </div>
      </div>
    `;
  }).join('') || '<div style="color:#94A3B8;font-size:0.85rem;padding:8px">لا توجد بيانات لهذه الفترة</div>';
}

function toggleExpCategory(cat) {
  expOpenCategory = expOpenCategory === cat ? null : cat;
  renderExpensesPage(currentExpensesPeriod);
}

function renderExpCategoryMonths(row, months) {
  const safeCat = row.cat.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  const chips = months.map((month, i) => {
    const value = row.values[i];
    if (!value) return '';
    const safeMonth = month.replace(/'/g, "\\'");
    return `<button type="button" class="exp-ranked-month-chip" data-month="${month}" onclick="event.stopPropagation(); showExpMonthItems(this, '${safeMonth}', '${safeCat}')">
      <span>${month}</span><strong>${fmt(value)} ر</strong>
    </button>`;
  }).join('');
  return `
    <div class="exp-ranked-chips">${chips}</div>
    <div class="exp-ranked-item-detail" id="exp-item-detail" onclick="event.stopPropagation()"></div>
  `;
}

function showExpMonthItems(chipEl, month, cat) {
  document.querySelectorAll('.exp-ranked-month-chip').forEach(c => c.classList.toggle('active', c === chipEl));
  const box = document.getElementById('exp-item-detail');
  if (!box) return;
  const items = getExpenseItems(month, cat);
  const total = items.reduce((s, i) => s + (i.amount || 0), 0);
  const rows = items.length === 0
    ? '<tr><td colspan="2" style="text-align:center;color:#94A3B8">لا توجد تفاصيل مسجلة</td></tr>'
    : items.map(i => `<tr><td style="text-align:right">${i.name}</td><td style="font-weight:700">${fmt(i.amount)} ر</td></tr>`).join('');
  box.innerHTML = `
    <div class="detail-item-label" style="margin-bottom:8px">${cat} — ${month} · الإجمالي: ${fmt(total)} ر</div>
    <table><thead><tr><th>البند</th><th>المبلغ (ريال)</th></tr></thead><tbody>${rows}</tbody></table>
  `;
}

let currentExpensesPeriod = 'all';

function renderExpensesPage(period = currentExpensesPeriod) {
  currentExpensesPeriod = period;
  const data = getExpenseRows(period);
  renderExpenseKpis(data);
  renderExpenseRankedList(data);
  renderExpenseCharts(data);
}

function setExpensesPeriod(period, btn) {
  document.querySelectorAll('.expenses-filter').forEach(item => {
    item.classList.toggle('active', item.dataset.period === period);
  });
  expOpenCategory = null;
  renderExpensesPage(period);
}

// ===== SUPPLIERS FILTER =====
let currentStatusFilter = 'الكل';
function filterSuppliers() {
  const search = document.getElementById('supplier-search-input').value.trim().toLowerCase();
  document.querySelectorAll('.supplier-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const status = card.dataset.status;
    const matchSearch = !search || name.includes(search);
    const matchStatus = currentStatusFilter === 'الكل' || status === currentStatusFilter;
    card.style.display = matchSearch && matchStatus ? '' : 'none';
  });
}
function filterByStatus(status, btn) {
  currentStatusFilter = status;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterSuppliers();
}

// ===== CUSTOMERS FILTER =====
function filterCustomers() {
  const search = document.getElementById('customer-search-input').value.trim().toLowerCase();
  document.querySelectorAll('#customers-tbody tr').forEach(row => {
    const name = row.cells[1]?.textContent.toLowerCase() || '';
    row.style.display = !search || name.includes(search) ? '' : 'none';
  });
}

// ===== TABLE SORT =====
function monthSortValue(text) {
  const monthOrder = {
    'يناير': 1,
    'فبراير': 2,
    'مارس': 3,
    'أبريل': 4,
    'ابريل': 4,
    'مايو': 5,
    'يونيو': 6,
    'يوليو': 7,
    'أغسطس': 8,
    'اغسطس': 8,
    'سبتمبر': 9,
    'أكتوبر': 10,
    'اكتوبر': 10,
    'نوفمبر': 11,
    'ديسمبر': 12
  };
  const parts = text.trim().split(/\s+/);
  const month = monthOrder[parts[0]];
  const year = parseInt(parts[1], 10);
  if (!month || isNaN(year)) return null;
  return (2000 + year) * 12 + month;
}

function sortTable(tableId, col) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const asc = table.dataset.sortCol == col && table.dataset.sortDir === 'asc';
  table.dataset.sortCol = col;
  table.dataset.sortDir = asc ? 'desc' : 'asc';
  rows.sort((a, b) => {
    if (tableId === 'summary-table' && col === 0) {
      const am = monthSortValue(a.cells[col]?.textContent || '');
      const bm = monthSortValue(b.cells[col]?.textContent || '');
      if (am !== null && bm !== null) return asc ? bm - am : am - bm;
    }
    const av = a.cells[col]?.textContent.replace(/[,+%ر—]/g, '').trim() || '';
    const bv = b.cells[col]?.textContent.replace(/[,+%ر—]/g, '').trim() || '';
    const an = parseFloat(av), bn = parseFloat(bv);
    if (!isNaN(an) && !isNaN(bn)) return asc ? bn - an : an - bn;
    return asc ? bv.localeCompare(av, 'ar') : av.localeCompare(bv, 'ar');
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ===== EXECUTIVE SUMMARY TABLE =====
function summaryYearFromMonth(month) {
  const match = String(month).match(/(\d{2})$/);
  return match ? `20${match[1]}` : '';
}

function summaryMonthDays(month) {
  const monthMap = {
    'يناير': 0,
    'فبراير': 1,
    'مارس': 2,
    'أبريل': 3,
    'ابريل': 3,
    'مايو': 4,
    'يونيو': 5,
    'يوليو': 6,
    'أغسطس': 7,
    'اغسطس': 7,
    'سبتمبر': 8,
    'أكتوبر': 9,
    'اكتوبر': 9,
    'نوفمبر': 10,
    'ديسمبر': 11
  };
  const parts = String(month).trim().split(/\s+/);
  const monthIndex = monthMap[parts[0]];
  const shortYear = Number(parts[1]);
  if (monthIndex === undefined || Number.isNaN(shortYear)) return 30;
  return new Date(2000 + shortYear, monthIndex + 1, 0).getDate();
}

function signedCell(value, options = {}) {
  const { inverse = false, suffix = '' } = options;
  const numeric = Number(value) || 0;
  const isGood = inverse ? numeric <= 0 : numeric >= 0;
  const color = isGood ? '#15803D' : '#B91C1C';
  return `<td style="color:${color};font-weight:700">${fmtSigned(numeric)}${suffix}</td>`;
}

// جدول "نظرة عامة" مختصر — 5 أعمدة فقط. النقر على شهر يفتحه بتفصيله الكامل في التقارير الشهرية (بدون توسيع مكانه هنا)
function renderSummaryTable(fromIdx, toIdx) {
  const tbody = document.getElementById('summary-tbody');
  if (!tbody || typeof MONTHS === 'undefined') return;
  const lo = Math.max(0, fromIdx ?? 0);
  const hi = Math.min(MONTHS.length - 1, toIdx ?? MONTHS.length - 1);

  const rows = [];
  for (let index = hi; index >= lo; index--) {
    const month = MONTHS[index];
    const detail = MONTHLY_DETAIL[month] || {};
    const revenue = Number(detail.revenue ?? REVENUES[index] ?? 0);
    const grossMargin = Number(detail.gross_margin ?? GROSS_MARGINS[index] ?? 0);
    const expenses = Number(detail.expenses ?? EXPENSES[index] ?? 0);
    const profit = Number(detail.metric1 ?? detail.profit ?? (grossMargin - expenses));
    const escapedMonth = String(month).replace(/'/g, "\\'");

    rows.push(`
      <tr class="summary-month-row" data-month="${month}" onclick="openMonthInReports('${escapedMonth}')">
        <td style="font-weight:600;color:#33394C">${month}</td>
        <td>${fmt(revenue)}</td>
        <td>${fmt(grossMargin)}</td>
        <td>${fmt(expenses)}</td>
        ${signedCell(profit)}
      </tr>
    `);
  }
  tbody.innerHTML = rows.join('');
}

// النقر على شهر بجدول "نظرة عامة" ينقل لتاب التقارير الشهرية بنفس الشهر (بدون نافذة منبثقة ولا توسيع مكانه)
function openMonthInReports(month) {
  switchTab('tab-monthly-reports');
  setTimeout(() => { if (typeof jumpToMonthlyReport === 'function') jumpToMonthlyReport(month); }, 60);
}

function initSummaryTable() {
  if (typeof MONTHS === 'undefined' || !MONTHS.length) return;
  applySummaryRange(0, MONTHS.length - 1, 'الكل');
}

document.addEventListener('DOMContentLoaded', () => {
  renderDashboardHeader();
  initSummaryTable();
});

// ===== WOMEN SUPPLIERS FILTER =====
function filterWomenSuppliers(filter) {
  const btns = ['ws-filter-all','ws-filter-m','ws-filter-h','ws-filter-both'];
  btns.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.style.background = '#fff';
    btn.style.color = btn.id.includes('both') ? '#15803D' : '#33394C';
  });
  const activeBtn = document.getElementById('ws-filter-' + filter);
  if (activeBtn) {
    activeBtn.style.background = activeBtn.id.includes('both') ? '#15803D' : '#33394C';
    activeBtn.style.color = '#fff';
  }

  ['goods-suppliers-table','workshops-suppliers-table'].forEach(tableId => {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const hasM = row.getAttribute('data-branch-m') === 'true';
      const hasH = row.getAttribute('data-branch-h') === 'true';
      let show = true;
      if (filter === 'm') show = hasM;
      else if (filter === 'h') show = hasH;
      else if (filter === 'both') show = hasM && hasH;
      row.style.display = show ? '' : 'none';
    });
  });

  const showM = filter === 'all' || filter === 'm' || filter === 'both';
  const showH = filter === 'all' || filter === 'h' || filter === 'both';
  document.querySelectorAll('.branch-m-col').forEach(el => {
    el.style.display = showM ? '' : 'none';
  });
  document.querySelectorAll('.branch-h-col').forEach(el => {
    el.style.display = showH ? '' : 'none';
  });
}

function sortWomenTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const isAsc = table.getAttribute('data-sort-col') == colIndex && table.getAttribute('data-sort-dir') === 'asc';
  table.setAttribute('data-sort-col', colIndex);
  table.setAttribute('data-sort-dir', isAsc ? 'desc' : 'asc');
  rows.sort((a, b) => {
    const aVal = a.cells[colIndex]?.textContent.replace(/[,ر—]/g,'').trim() || '0';
    const bVal = b.cells[colIndex]?.textContent.replace(/[,ر—]/g,'').trim() || '0';
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) return isAsc ? bNum - aNum : aNum - bNum;
    return isAsc ? bVal.localeCompare(aVal, 'ar') : aVal.localeCompare(bVal, 'ar');
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ===== SWITCH TAB =====
function switchTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (btn) btn.classList.add('active');
  if (typeof syncSidebarActive === 'function') syncSidebarActive(id);
  if (typeof renderMobileSubnav === 'function') renderMobileSubnav(id);
  if (history.replaceState) history.replaceState(null, '', '#' + id);
}

// ===== INIT: Row numbers for customers =====
(function() {
  // نظرة عامة (كروت/شارتات/جدول) تُرسم عبر initSummaryTable() -> applySummaryRange() بعد DOMContentLoaded
  renderExpensesPage();
  const rows = document.querySelectorAll('#customers-tbody tr');
  rows.forEach((r, i) => { if(r.cells[0]) r.cells[0].textContent = i+1; });
})();
