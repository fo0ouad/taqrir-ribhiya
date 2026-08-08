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

function renderExecutiveKpis(period = 'all') {
  const selectedMonths = MONTHS
    .map((month, idx) => ({ month, idx }))
    .filter(item => period === 'all' || item.month.includes(period.slice(-2)));
  const monthCount = selectedMonths.length;
  const revenueValues = selectedMonths.map(({ month, idx }) => MONTHLY_DETAIL[month]?.revenue ?? REVENUES[idx] ?? 0);
  const profitValues = selectedMonths.map(({ month, idx }) => {
    const detail = MONTHLY_DETAIL[month];
    if (detail?.metric1 !== undefined) return detail.metric1;
    if (detail?.profit !== undefined) return detail.profit;
    return PROFIT_ACTUAL[idx] ?? ((GROSS_MARGINS[idx] || 0) - (EXPENSES[idx] || 0));
  });
  const totalRevenue = revenueValues.reduce((sum, value) => sum + value, 0);
  const profitTotal = profitValues.filter(value => value > 0).reduce((sum, value) => sum + value, 0);
  const lossTotal = profitValues.filter(value => value < 0).reduce((sum, value) => sum + value, 0);
  const netResult = profitValues.reduce((sum, value) => sum + value, 0);
  const profitableMonths = profitValues.filter(value => value > 0).length;
  const formatK = (value, showPlus = false) => {
    const sign = value < 0 ? '-' : (showPlus && value > 0 ? '+' : '');
    const abs = Math.abs(value) / 1000;
    return `${sign}${abs.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
  };
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('summary-total-revenue', formatK(totalRevenue));
  setText('summary-total-revenue-sub', period === 'all' ? `آخر ${monthCount} شهر` : `${period} (${monthCount} شهر)`);
  setText('summary-net-result', formatK(netResult));
  setText('summary-profit-months', `${profitableMonths}/${monthCount}`);
  setText('summary-profit-months-sub', `${profitableMonths} أشهر رابحة من أصل ${monthCount}`);
  setText('summary-loss-total', formatK(lossTotal));
  setText('summary-profit-total', formatK(profitTotal, true));

  const netEl = document.getElementById('summary-net-result');
  if (netEl) netEl.style.color = netResult >= 0 ? '#15803D' : '#B91C1C';
  renderBranchSalesSummary(selectedMonths);
}

function renderBranchSalesSummary(selectedMonths) {
  const box = document.getElementById('branch-sales-summary');
  if (!box || typeof BRANCH_SALES === 'undefined') return;
  const latest = selectedMonths
    .slice()
    .reverse()
    .find(({ month }) => BRANCH_SALES[month]);
  if (!latest) {
    box.style.display = 'none';
    return;
  }
  const month = latest.month;
  const sales = BRANCH_SALES[month] || {};
  const branch1 = sales["فرع 1"] || { cash: 0, bank: 0, total: 0 };
  const branch2 = sales["فرع 2"] || { cash: 0, bank: 0, total: 0 };
  const total = (branch1.total || 0) + (branch2.total || 0);
  const gap = Math.abs((branch1.total || 0) - (branch2.total || 0));
  const leader = (branch1.total || 0) === (branch2.total || 0) ? 'الأداء متعادل' : ((branch1.total || 0) > (branch2.total || 0) ? 'فرع 1 أعلى' : 'فرع 2 أعلى');
  const fmt = value => value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ر';
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  box.style.display = 'block';
  setText('branch-sales-period', `آخر شهر لديه بيانات فروع: ${month}`);
  setText('branch-sales-total', fmt(total));
  setText('branch-1-total', fmt(branch1.total || 0));
  setText('branch-1-split', `كاش ${fmt(branch1.cash || 0)} · بنك ${fmt(branch1.bank || 0)}`);
  setText('branch-2-total', fmt(branch2.total || 0));
  setText('branch-2-split', `كاش ${fmt(branch2.cash || 0)} · بنك ${fmt(branch2.bank || 0)}`);
  setText('branch-sales-gap', fmt(gap));
  setText('branch-sales-leader', leader);
}

function setExecutiveKpiPeriod(period, btn) {
  document.querySelectorAll('.summary-kpi-filter').forEach(item => item.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderExecutiveKpis(period);
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

function renderExpenseMatrix(data) {
  const head = document.getElementById('exp-table-head');
  const body = document.getElementById('exp-table-body');
  const foot = document.getElementById('exp-table-foot');
  if (!head || !body || !foot) return;
  head.innerHTML = `<tr><th>الفئة</th>${data.selectedMonths.map(month => `<th>${month}</th>`).join('')}<th>الإجمالي</th></tr>`;
  body.innerHTML = data.categoryRows.map(row => {
    const rowMax = Math.max(...row.values);
    const cells = row.values.map((value, idx) => {
      if (!value) return '<td class="exp-empty">—</td>';
      const month = data.selectedMonths[idx];
      const isMax = value === rowMax;
      return `<td class="exp-cell ${isMax ? 'exp-cell-max' : ''}" onclick="openExpDetail('${month}','${row.cat}')" style="background:${hexToRgba(CAT_COLORS[row.cat] || '#4E7CFF', 0.12)}">${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>`;
    }).join('');
    return `<tr><td class="exp-category" style="color:${CAT_COLORS[row.cat] || '#33394C'}">${row.cat}</td>${cells}<td class="exp-total">${row.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td></tr>`;
  }).join('');
  foot.innerHTML = `<tr><td>إجمالي الشهر</td>${data.monthTotals.map(item => `<td>${item.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>`).join('')}<td>${data.monthTotals.reduce((sum, item) => sum + item.total, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td></tr>`;
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

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function renderExpenseRankedList(data) {
  const el = document.getElementById('exp-ranked-list');
  if (!el) return;
  const sorted = data.categoryRows.slice().sort((a, b) => b.total - a.total);
  const max = sorted.length ? sorted[0].total : 0;
  el.innerHTML = sorted.map(row => {
    const pct = max ? (row.total / max) * 100 : 0;
    return `
      <div>
        <div class="exp-ranked-row-head"><span>${row.cat}</span><span>${fmt(row.total)} ر</span></div>
        <div class="exp-ranked-track"><div class="exp-ranked-fill" style="width:${pct}%;background:${CAT_COLORS[row.cat] || '#4E7CFF'}"></div></div>
      </div>
    `;
  }).join('') || '<div style="color:#94A3B8;font-size:0.85rem">لا توجد بيانات لهذه الفترة</div>';
}

function renderExpensesPage(period = 'all') {
  const data = getExpenseRows(period);
  renderExpenseKpis(data);
  renderExpenseRankedList(data);
  renderExpenseMatrix(data);
  renderExpenseCharts(data);
}

function setExpensesPeriod(period, btn) {
  document.querySelectorAll('.expenses-filter').forEach(item => {
    item.classList.toggle('active', item.dataset.period === period);
  });
  renderExpensesPage(period);
}

// ===== INLINE EXPAND: تفاصيل بند مصاريف (بدل نافذة منبثقة) =====
function openExpDetail(month, cat) {
  const box = document.getElementById('exp-cell-detail');
  if (!box) return;
  const items = getExpenseItems(month, cat);
  const total = items.reduce((s, i) => s + i.amount, 0);

  const rows = items.length === 0
    ? '<tr><td colspan="2" style="text-align:center;color:#94A3B8">لا توجد تفاصيل مسجلة</td></tr>'
    : items.map(i => `<tr><td style="text-align:right">${i.name}</td><td style="font-weight:700">${i.amount.toLocaleString('en-US', {maximumFractionDigits:0})} ر</td></tr>`).join('');

  box.innerHTML = `
    <div class="detail-item-label" style="margin-bottom:8px">${cat} — ${month} · الإجمالي: ${total.toLocaleString('en-US', {maximumFractionDigits:0})} ر</div>
    <table><thead><tr><th>البند</th><th>المبلغ (ريال)</th></tr></thead><tbody>${rows}</tbody></table>
  `;
  box.classList.add('open');
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

function renderSummaryTable() {
  const tbody = document.getElementById('summary-tbody');
  if (!tbody || typeof MONTHS === 'undefined') return;

  tbody.innerHTML = MONTHS.map((month, index) => {
    const detail = MONTHLY_DETAIL[month] || {};
    const revenue = Number(detail.revenue ?? REVENUES[index] ?? 0);
    const grossMargin = Number(detail.gross_margin ?? GROSS_MARGINS[index] ?? 0);
    const expenses = Number(detail.expenses ?? EXPENSES[index] ?? 0);
    const profit = Number(detail.metric1 ?? detail.profit ?? (grossMargin - expenses));
    const cashSurplus = Number(detail.metric3 ?? (revenue - expenses - Number(detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0)));
    const suppliersPaid = Number(detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0);
    const purchases = Number(detail.purchases ?? PURCHASES[index] ?? 0);
    const supplierGap = suppliersPaid - purchases;
    const dailyAverage = grossMargin / summaryMonthDays(month);
    const year = summaryYearFromMonth(month);
    const escapedMonth = String(month).replace(/'/g, "\\'");
    const rowId = 'summary-row-' + index;

    return `
      <tr class="summary-month-row row-expand-toggle" id="${rowId}" data-year="${year}" data-month="${month}" onclick="toggleSummaryRow('${rowId}')">
        <td style="font-weight:600;color:#33394C"><span class="row-expand-arrow">▾</span> ${month}</td>
        <td>${fmt(revenue)}</td>
        <td>${fmt(grossMargin)}</td>
        <td style="color:#7033FF;font-weight:700">${fmt(dailyAverage)} ر</td>
        <td>${fmt(expenses)}</td>
        ${signedCell(profit)}
        ${signedCell(cashSurplus)}
        <td>${fmt(suppliersPaid)}</td>
        <td>${fmt(purchases)}</td>
        ${signedCell(supplierGap)}
      </tr>
      <tr class="detail-row" id="${rowId}-detail" data-year="${year}">
        <td colspan="10">
          <div class="detail-grid">
            <div><div class="detail-item-label">هامش 15%</div><div class="detail-item-value">${fmt(grossMargin)} ر</div></div>
            <div><div class="detail-item-label">متوسط يومي</div><div class="detail-item-value">${fmt(dailyAverage)} ر</div></div>
            <div><div class="detail-item-label">فائض نقدي</div><div class="detail-item-value" style="color:${cashSurplus >= 0 ? '#15803D' : '#B91C1C'}">${fmtSigned(cashSurplus)} ر</div></div>
            <div><div class="detail-item-label">فرق الموردين</div><div class="detail-item-value" style="color:${supplierGap >= 0 ? '#15803D' : '#B91C1C'}">${fmtSigned(supplierGap)} ر</div></div>
            <div><div class="detail-item-label">موردين مدفوع</div><div class="detail-item-value">${fmt(suppliersPaid)} ر</div></div>
            <div><div class="detail-item-label">مشتريات</div><div class="detail-item-value">${fmt(purchases)} ر</div></div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== INLINE EXPAND: تفاصيل شهر (بدل نافذة منبثقة) =====
function toggleSummaryRow(rowId) {
  const row = document.getElementById(rowId);
  const detail = document.getElementById(rowId + '-detail');
  if (!row || !detail) return;
  const willOpen = !detail.classList.contains('open');
  document.querySelectorAll('.detail-row.open').forEach(el => { if (el !== detail) el.classList.remove('open'); });
  document.querySelectorAll('.summary-month-row.open').forEach(el => { if (el !== row) el.classList.remove('open'); });
  detail.classList.toggle('open', willOpen);
  row.classList.toggle('open', willOpen);
}

function updateSummaryYearCounts() {
  if (typeof MONTHS === 'undefined') return;
  const counts = MONTHS.reduce((acc, month) => {
    const year = summaryYearFromMonth(month);
    acc.all += 1;
    if (year) acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, { all: 0 });

  const labels = {
    all: `الكل (${counts.all})`,
    '2025': `2025 (${counts['2025'] || 0})`,
    '2026': `2026 (${counts['2026'] || 0})`
  };

  Object.entries(labels).forEach(([year, label]) => {
    const btn = document.querySelector(`.year-btn[data-year="${year}"]`);
    if (btn) btn.textContent = label;
  });
}

function initSummaryTable() {
  renderSummaryTable();
  updateSummaryYearCounts();
  const activeBtn = document.querySelector('.year-btn.active');
  filterByYear(activeBtn?.dataset.year || 'all');
  if (typeof renderLatestAnalysisInto === 'function') {
    renderLatestAnalysisInto('summary-latest-analysis');
  }
}

// ===== YEAR FILTER =====
function filterByYear(year) {
  const rows = document.querySelectorAll('#summary-tbody tr');
  rows.forEach(row => {
    const rowYear = row.dataset.year;
    const month = row.cells[0] ? row.cells[0].textContent.trim() : '';
    if (year === 'all') {
      row.style.display = '';
    } else if (year === '2025') {
      row.style.display = rowYear === '2025' || month.includes('25') ? '' : 'none';
    } else if (year === '2026') {
      row.style.display = rowYear === '2026' || month.includes('26') ? '' : 'none';
    }
  });
  document.querySelectorAll('.year-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.year === year);
  });
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
  renderExecutiveKpis();
  renderExpensesPage();
  const rows = document.querySelectorAll('#customers-tbody tr');
  rows.forEach((r, i) => { if(r.cells[0]) r.cells[0].textContent = i+1; });
})();
