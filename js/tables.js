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
  if (netEl) netEl.style.color = netResult >= 0 ? '#10B981' : '#dc2626';
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
      return `<td class="exp-cell ${isMax ? 'exp-cell-max' : ''}" onclick="openExpDetail('${month}','${row.cat}')" style="background:${hexToRgba(CAT_COLORS[row.cat] || '#3B82F6', 0.12)}">${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>`;
    }).join('');
    return `<tr><td class="exp-category" style="color:${CAT_COLORS[row.cat] || '#1e3a5f'}">${row.cat}</td>${cells}<td class="exp-total">${row.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td></tr>`;
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
          backgroundColor: sortedRows.map(row => CAT_COLORS[row.cat] || '#3B82F6'),
          borderRadius: 5
        }]
      },
      options: {
        ...chartDefaults,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } },
          y: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial' } } }
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
          backgroundColor: CAT_COLORS[row.cat] || '#3B82F6',
          borderRadius: 2
        }))
      },
      options: {
        ...chartDefaults,
        scales: {
          x: { stacked: true, ticks: { font: { family: 'Segoe UI, Tahoma, Arial', size: 11 } } },
          y: { stacked: true, ticks: { font: { family: 'Segoe UI, Tahoma, Arial' }, callback: v => (v / 1000).toFixed(0) + 'K' } }
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

function renderExpensesPage(period = 'all') {
  const data = getExpenseRows(period);
  renderExpenseKpis(data);
  renderExpenseMatrix(data);
  renderExpenseCharts(data);
}

function setExpensesPeriod(period, btn) {
  document.querySelectorAll('.expenses-filter').forEach(item => {
    item.classList.toggle('active', item.dataset.period === period);
  });
  renderExpensesPage(period);
}

// ===== MODAL: تفاصيل بند مصاريف =====
function openExpDetail(month, cat) {
  const items = getExpenseItems(month, cat);
  const total = items.reduce((s, i) => s + i.amount, 0);
  
  document.getElementById('modal-title').textContent = cat + ' — ' + month;
  document.getElementById('modal-total').textContent = 'الإجمالي: ' + total.toLocaleString('en-US', {maximumFractionDigits:0}) + ' ر';
  
  let rows = '';
  if (items.length === 0) {
    rows = '<tr><td colspan="2" style="text-align:center;color:#94a3b8">لا توجد تفاصيل مسجلة</td></tr>';
  } else {
    items.forEach(i => {
      rows += `<tr><td style="text-align:right">${i.name}</td><td style="font-weight:700">${i.amount.toLocaleString('en-US', {maximumFractionDigits:0})} ر</td></tr>`;
    });
  }
  
  document.getElementById('modal-body').innerHTML = `
    <table>
      <thead><tr><th>البند</th><th>المبلغ (ريال)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  
  document.getElementById('modal-box').classList.remove('month-modal');
  document.getElementById('modal-overlay').classList.add('open');
}

// ===== MODAL: تفاصيل شهر كامل =====
let monthExpenseChart = null;

function openMonthDetail(month) {
  const d = MONTHLY_DETAIL[month];
  if (!d) return;
  
  // تفاصيل المصاريف
  let expRows = '';
  const detailedExpenses = EXP_DETAILS[month] || {};
  const expBreak = Object.keys(detailedExpenses).length ? detailedExpenses : (d.exp_breakdown || {});
  const orderedExpenseCategories = [
    ...CATS,
    ...Object.keys(expBreak).filter(cat => !CATS.includes(cat))
  ];
  const expenseCategoryTotals = [];
  orderedExpenseCategories.forEach(cat => {
    const items = expBreak[cat] || [];
    const total = items.reduce((s, i) => s + i.amount, 0);
    if (total > 0) {
      expenseCategoryTotals.push({ cat, total });
      expRows += `<tr>
        <td style="text-align:right;font-weight:600;color:${CAT_COLORS[cat]}">${cat}</td>
        <td style="font-weight:700">${total.toLocaleString('en-US', {maximumFractionDigits:0})} ر</td>
      </tr>`;
      items.forEach(i => {
        expRows += `<tr style="background:#f8faff"><td style="text-align:right;padding-right:24px;color:#64748b;font-size:0.82rem">↳ ${i.name}</td><td style="color:#475569;font-size:0.82rem">${i.amount.toLocaleString('en-US', {maximumFractionDigits:0})} ر</td></tr>`;
      });
    }
  });
  const sortedExpenseTotals = expenseCategoryTotals.slice().sort((a, b) => b.total - a.total);
  const expenseBreakdownTotal = expenseCategoryTotals.reduce((sum, item) => sum + item.total, 0) || d.expenses;
  const topExpenseItems = sortedExpenseTotals.slice(0, 3);
  const topExpenseRows = topExpenseItems.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="text-align:right;font-weight:700;color:${CAT_COLORS[item.cat] || '#1e3a5f'}">${item.cat}</td>
      <td style="font-weight:800">${item.total.toLocaleString('en-US', {maximumFractionDigits:0})} ر</td>
      <td>${expenseBreakdownTotal ? ((item.total / expenseBreakdownTotal) * 100).toFixed(1) : '0.0'}%</td>
    </tr>
  `).join('');
  
  // مشاكل وملاحظات
  let issuesHtml = '';
  const isTailorNote = text => /خياط|خياطين/.test(text || '');
  const formatIssue = text => {
    if ((text || '').includes('دون مستوى التعادل')) {
      const expectedMargin = d.revenue * 0.15;
      const expenseOverage = d.expenses - expectedMargin;
      return `المصاريف تجاوزت الهامش المتوقع بـ ${expenseOverage.toLocaleString('en-US', {maximumFractionDigits:0})} ر <small style="display:block;margin-top:6px;color:#7f1d1d;font-weight:600">الهامش المتوقع = الإيرادات × 15% = ${d.revenue.toLocaleString('en-US', {maximumFractionDigits:0})} × 15% = ${expectedMargin.toLocaleString('en-US', {maximumFractionDigits:0})} ر، والتجاوز = المصاريف − الهامش المتوقع = ${d.expenses.toLocaleString('en-US', {maximumFractionDigits:0})} − ${expectedMargin.toLocaleString('en-US', {maximumFractionDigits:0})}</small>`;
    }
    return text;
  };
  (d.issues || []).filter(iss => !isTailorNote(iss)).forEach(iss => {
    issuesHtml += `<div class="issue-box">⚠️ ${formatIssue(iss)}</div>`;
  });
  (d.notes || []).filter(note => !isTailorNote(note)).forEach(note => {
    issuesHtml += `<div class="note-box">📌 ${note}</div>`;
  });
  if (!issuesHtml) issuesHtml = '<div class="note-box">✅ لا توجد مشاكل تشغيلية بارزة هذا الشهر</div>';
  
  document.getElementById('modal-title').textContent = '📅 تقرير ' + month + ' التفصيلي';
  document.getElementById('modal-total').innerHTML = '';
  
  const monthIndex = MONTHS.indexOf(month);
  const prevMonth = monthIndex > 0 ? MONTHLY_DETAIL[MONTHS[monthIndex - 1]] : null;
  const pctChange = (current, previous) => {
    if (!previous && previous !== 0) return null;
    if (previous === 0) return current === 0 ? 0 : null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };
  const previousEstimatedProfit = prevMonth ? (prevMonth.metric1 || prevMonth.profit || 0) : null;
  const previousCashSurplus = prevMonth ? (prevMonth.metric3 || 0) : null;

  // دالة مساعدة لعرض نسبة التغيير
  const changeBadge = (val, isExpense) => {
    if (val === null || val === undefined) return '';
    const positive = isExpense ? val <= 0 : val >= 0;
    const color = positive ? '#16a34a' : '#dc2626';
    const bg = positive ? '#dcfce7' : '#fee2e2';
    const arrow = val >= 0 ? '▲' : '▼';
    return `<span class="change-badge" style="color:${color};background:${bg}">${arrow} ${Math.abs(val).toFixed(1)}%</span>`;
  };
  
  // فجوة السيولة
  const liqGap = d.liquidity_gap || 0;
  const liqColor = liqGap > 0 ? '#dc2626' : '#16a34a';
  const liqLabel = liqGap > 0 ? 'عجز نقدي' : 'فائض نقدي';
  const liqIcon = liqGap > 0 ? '⚠️' : '✅';
  
  const estimatedProfit = d.metric1 || d.profit || 0;
  const cashSurplus = d.metric3 || 0;
  const supplierGap = (d.suppliers_paid || 0) - (d.purchases || 0);
  const estimatedProfitColor = estimatedProfit >= 0 ? '#16a34a' : '#dc2626';
  const cashSurplusColor = cashSurplus >= 0 ? '#16a34a' : '#dc2626';
  const supplierGapColor = supplierGap >= 0 ? '#16a34a' : '#dc2626';
  const fmtNum = v => (v>=0?'+':'')+v.toLocaleString('en-US',{maximumFractionDigits:0});
  const currentPurchases = d.purchases || 0;
  const previousPurchases = prevMonth?.purchases || 0;
  const purchasesChange = pctChange(currentPurchases, previousPurchases);
  const purchasesColor = purchasesChange === null ? '#64748b' : (purchasesChange >= 0 ? '#16a34a' : '#dc2626');
  const purchasesMax = Math.max(currentPurchases, previousPurchases, 1);
  const purchaseBar = (label, value, color) => `
    <div class="purchase-compare-row">
      <div class="purchase-compare-label">${label}</div>
      <div class="purchase-compare-track">
        <div class="purchase-compare-fill" style="width:${Math.max((value / purchasesMax) * 100, value ? 4 : 0)}%;background:${color}"></div>
      </div>
      <div class="purchase-compare-value">${value.toLocaleString('en-US', {maximumFractionDigits:0})} ر</div>
    </div>
  `;
  const purchasesCompareHtml = `
    <div class="section-title">🛒 مقارنة المشتريات بالشهر السابق</div>
    <div class="purchase-compare-box">
      <div class="purchase-compare-head">
        <span>${previousPurchases ? `التغير عن الشهر السابق` : 'لا يوجد شهر سابق للمقارنة'}</span>
        <strong style="color:${purchasesColor}">${purchasesChange === null ? '—' : `${purchasesChange >= 0 ? '+' : '-'}${Math.abs(purchasesChange).toFixed(1)}%`}</strong>
      </div>
      ${purchaseBar(month, currentPurchases, '#8B5CF6')}
      ${prevMonth ? purchaseBar(MONTHS[monthIndex - 1], previousPurchases, '#94a3b8') : ''}
    </div>
  `;
  const branchSales = (typeof BRANCH_SALES !== 'undefined' && BRANCH_SALES[month]) ? BRANCH_SALES[month] : null;
  const branchSalesHtml = branchSales ? (() => {
    const b1 = branchSales["فرع 1"] || { cash: 0, bank: 0, total: 0 };
    const b2 = branchSales["فرع 2"] || { cash: 0, bank: 0, total: 0 };
    const total = (b1.total || 0) + (b2.total || 0);
    const share = value => total ? ((value / total) * 100).toFixed(1) + '%' : '0.0%';
    return `
      <div class="section-title">🏪 أداء الفروع</div>
      <div class="branch-sales-grid modal-branch-sales">
        <div class="branch-sales-card">
          <div class="branch-sales-name">فرع 1</div>
          <div class="branch-sales-value">${(b1.total || 0).toLocaleString('en-US', {maximumFractionDigits:0})} ر</div>
          <div class="branch-sales-sub">كاش ${(b1.cash || 0).toLocaleString('en-US', {maximumFractionDigits:0})} · بنك ${(b1.bank || 0).toLocaleString('en-US', {maximumFractionDigits:0})} · ${share(b1.total || 0)}</div>
        </div>
        <div class="branch-sales-card">
          <div class="branch-sales-name">فرع 2</div>
          <div class="branch-sales-value">${(b2.total || 0).toLocaleString('en-US', {maximumFractionDigits:0})} ر</div>
          <div class="branch-sales-sub">كاش ${(b2.cash || 0).toLocaleString('en-US', {maximumFractionDigits:0})} · بنك ${(b2.bank || 0).toLocaleString('en-US', {maximumFractionDigits:0})} · ${share(b2.total || 0)}</div>
        </div>
      </div>
    `;
  })() : '';
  
  document.getElementById('modal-body').innerHTML = `
    <div class="month-kpi">
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#3B82F6">${d.revenue.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">الإيرادات ${changeBadge(pctChange(d.revenue, prevMonth?.revenue))}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:${estimatedProfitColor}">${fmtNum(estimatedProfit)}</div>
        <div class="month-kpi-lbl">ربح ${changeBadge(pctChange(estimatedProfit, previousEstimatedProfit))}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:${cashSurplusColor}">${fmtNum(cashSurplus)}</div>
        <div class="month-kpi-lbl">فائض نقدي ${changeBadge(pctChange(cashSurplus, previousCashSurplus))}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#F59E0B">${d.expenses.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">المصاريف ${changeBadge(pctChange(d.expenses, prevMonth?.expenses), true)}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#EF4444">${d.suppliers_paid.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">مدفوع للموردين ${changeBadge(pctChange(d.suppliers_paid, prevMonth?.suppliers_paid), true)}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#8B5CF6">${d.purchases.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">المشتريات ${changeBadge(pctChange(d.purchases, prevMonth?.purchases))}</div>
      </div>
    </div>

    <div class="metric-definitions">
      <div><strong>ربح:</strong> هامش 15% − المصاريف.</div>
      <div><strong>فائض نقدي:</strong> الإيراد − المصاريف − المدفوع للموردين.</div>
      <div><strong>فرق الموردين:</strong> المدفوع للموردين − المشتريات = <span style="font-weight:800;color:${supplierGapColor}">${fmtNum(supplierGap)} ر</span>.</div>
    </div>

    ${purchasesCompareHtml}

    ${branchSalesHtml}

    <div style="background:${liqGap>0?'#fef2f2':'#f0fdf4'};border:1px solid ${liqGap>0?'#fca5a5':'#86efac'};border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700;color:${liqColor}">${liqIcon} ${liqLabel}</span>
      <span style="font-size:1.1rem;font-weight:800;color:${liqColor}">${Math.abs(liqGap).toLocaleString('en-US',{maximumFractionDigits:0})} ر</span>
    </div>
    
    <div class="section-title">🔍 التشخيص والملاحظات</div>
    ${issuesHtml}
    
    <div class="section-title">📊 ملخص المصاريف</div>
    <table><thead><tr><th>#</th><th>الفئة</th><th>المبلغ</th><th>النسبة</th></tr></thead><tbody>${topExpenseRows || '<tr><td colspan="4">لا توجد مصاريف مسجلة</td></tr>'}</tbody></table>
    <div class="expense-chart-wrap">
      <canvas id="month-expense-chart" height="150"></canvas>
    </div>

    <div class="section-title">💸 تفصيل المصاريف</div>
    <table><thead><tr><th>الفئة / البند</th><th>المبلغ</th></tr></thead><tbody>${expRows}</tbody></table>
  `;
  
  document.getElementById('modal-box').classList.add('month-modal');
  document.getElementById('modal-overlay').classList.add('open');

  if (monthExpenseChart) monthExpenseChart.destroy();
  const chartEl = document.getElementById('month-expense-chart');
  if (chartEl && typeof Chart !== 'undefined' && sortedExpenseTotals.length) {
    monthExpenseChart = new Chart(chartEl, {
      type: 'bar',
      data: {
        labels: sortedExpenseTotals.map(i => i.cat),
        datasets: [{
          label: 'مصاريف الشهر',
          data: sortedExpenseTotals.map(i => i.total),
          backgroundColor: sortedExpenseTotals.map(i => CAT_COLORS[i.cat] || '#3B82F6'),
          borderRadius: 5
        }]
      },
      options: {
        locale: 'en-US',
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } },
          y: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial' } } }
        }
      }
    });
  }
}

// ===== MODAL: إغلاق =====
function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalBtn();
}
function closeModalBtn() {
  if (monthExpenseChart) {
    monthExpenseChart.destroy();
    monthExpenseChart = null;
  }
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal-box').classList.remove('month-modal');
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
  const color = isGood ? '#16a34a' : '#dc2626';
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

    return `
      <tr data-year="${year}" onclick="openMonthDetail('${escapedMonth}')">
        <td style="font-weight:600;color:#1e3a5f;text-decoration:underline;text-underline-offset:3px">${month}</td>
        <td>${fmt(revenue)}</td>
        <td>${fmt(grossMargin)}</td>
        <td style="color:#b45309;font-weight:700">${fmt(dailyAverage)} ر</td>
        <td>${fmt(expenses)}</td>
        ${signedCell(profit)}
        ${signedCell(cashSurplus)}
        <td>${fmt(suppliersPaid)}</td>
        <td>${fmt(purchases)}</td>
        ${signedCell(supplierGap)}
      </tr>
    `;
  }).join('');
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
    btn.style.color = btn.id.includes('both') ? '#15803d' : '#1e3a5f';
  });
  const activeBtn = document.getElementById('ws-filter-' + filter);
  if (activeBtn) {
    activeBtn.style.background = activeBtn.id.includes('both') ? '#15803d' : '#1e3a5f';
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
}

// ===== INIT: Row numbers for customers =====
(function() {
  renderExecutiveKpis();
  renderExpensesPage();
  const rows = document.querySelectorAll('#customers-tbody tr');
  rows.forEach((r, i) => { if(r.cells[0]) r.cells[0].textContent = i+1; });
})();
