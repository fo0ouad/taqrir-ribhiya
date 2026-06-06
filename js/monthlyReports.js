// ===== monthlyReports.js =====
// صفحة التقارير الشهرية المستقلة

let monthlyReportExpenseChart = null;

function mrFmt(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

function mrYear(month) {
  const match = String(month).match(/(\d{2})$/);
  return match ? 2000 + Number(match[1]) : null;
}

function mrDetail(month) {
  const index = MONTHS.indexOf(month);
  const detail = MONTHLY_DETAIL[month] || {};
  return {
    month,
    index,
    year: mrYear(month),
    revenue: Number(detail.revenue ?? REVENUES[index] ?? 0),
    grossMargin: Number(detail.gross_margin ?? GROSS_MARGINS[index] ?? 0),
    expenses: Number(detail.expenses ?? EXPENSES[index] ?? 0),
    profit: Number(detail.metric1 ?? detail.profit ?? ((detail.gross_margin ?? GROSS_MARGINS[index] ?? 0) - (detail.expenses ?? EXPENSES[index] ?? 0))),
    cash: Number(detail.metric3 ?? ((detail.revenue ?? REVENUES[index] ?? 0) - (detail.expenses ?? EXPENSES[index] ?? 0) - (detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0))),
    suppliersPaid: Number(detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0),
    purchases: Number(detail.purchases ?? PURCHASES[index] ?? 0),
    issues: detail.issues || [],
    notes: detail.notes || [],
    breakdown: detail.exp_breakdown || getExpenseBreakdown(month) || {}
  };
}

function renderMonthlyReportsPage() {
  const tab = document.getElementById("tab-monthly-reports");
  if (!tab || typeof MONTHS === "undefined") return;
  const latest = MONTHS[MONTHS.length - 1];
  tab.innerHTML = `
    <section class="monthly-reports-page">
      <div class="women-header">
        <div>
          <h2>التقارير الشهرية</h2>
          <p>عرض مستقل للتقرير الشهري بدلاً من الاعتماد فقط على النافذة المنبثقة في الملخص.</p>
        </div>
        <div class="women-header-badge" id="monthly-report-current">${latest}</div>
      </div>

      <div class="women-controls">
        <div class="women-control-group">
          <button class="women-filter active" data-mr-year="all" onclick="setMonthlyReportYear('all')">الكل</button>
          <button class="women-filter" data-mr-year="2025" onclick="setMonthlyReportYear('2025')">2025</button>
          <button class="women-filter" data-mr-year="2026" onclick="setMonthlyReportYear('2026')">2026</button>
        </div>
        <select id="monthly-report-select" class="monthly-report-select" onchange="renderMonthlyReportDetail(this.value)"></select>
      </div>

      <div id="monthly-report-content"></div>
    </section>
  `;
  setMonthlyReportYear("all", latest);
}

function setMonthlyReportYear(year, preferredMonth) {
  document.querySelectorAll("[data-mr-year]").forEach(btn => btn.classList.toggle("active", btn.dataset.mrYear === year));
  const select = document.getElementById("monthly-report-select");
  if (!select) return;
  const months = MONTHS.filter(month => year === "all" || mrYear(month) === Number(year));
  select.innerHTML = months.map(month => `<option value="${month}">${month}</option>`).join("");
  const target = preferredMonth && months.includes(preferredMonth) ? preferredMonth : months[months.length - 1];
  select.value = target;
  renderMonthlyReportDetail(target);
}

function renderMonthlyReportDetail(month) {
  const current = mrDetail(month);
  const previous = current.index > 0 ? mrDetail(MONTHS[current.index - 1]) : null;
  const content = document.getElementById("monthly-report-content");
  const badge = document.getElementById("monthly-report-current");
  if (!content) return;
  if (badge) badge.textContent = month;
  const purchaseChange = previous ? ((current.purchases - previous.purchases) / Math.abs(previous.purchases || 1)) * 100 : null;
  const expRows = Object.entries(current.breakdown)
    .map(([cat, items]) => ({ cat, total: items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0), items }))
    .filter(row => row.total > 0)
    .sort((a, b) => b.total - a.total);

  content.innerHTML = `
    <div class="women-kpi-grid">
      <div class="women-kpi blue"><span>الإيرادات</span><strong>${mrFmt(current.revenue)} ر</strong><small>${month}</small></div>
      <div class="women-kpi green"><span>هامش 15%</span><strong>${mrFmt(current.grossMargin)} ر</strong><small>حسب عمود الفائدة</small></div>
      <div class="women-kpi danger"><span>المصاريف</span><strong>${mrFmt(current.expenses)} ر</strong><small>${previous ? monthlyChangeText(current.expenses, previous.expenses, true) : "—"}</small></div>
      <div class="women-kpi ${current.profit >= 0 ? "green" : "danger"}"><span>الربح</span><strong>${mrFmt(current.profit)} ر</strong><small>هامش 15% - المصاريف</small></div>
      <div class="women-kpi purple"><span>المشتريات</span><strong>${mrFmt(current.purchases)} ر</strong><small>${purchaseChange === null ? "—" : `${purchaseChange >= 0 ? "+" : ""}${purchaseChange.toFixed(1)}% عن السابق`}</small></div>
      <div class="women-kpi amber"><span>الفائض النقدي</span><strong>${mrFmt(current.cash)} ر</strong><small>الإيراد - المصاريف - المدفوع للموردين</small></div>
    </div>

    <div class="purchase-compare-box">
      <div class="purchase-compare-head"><span>مقارنة مشتريات الشهر بالشهر السابق</span><strong>${previous ? previous.month : "لا يوجد شهر سابق"}</strong></div>
      ${purchaseCompareRow(month, current.purchases, Math.max(current.purchases, previous?.purchases || 0), "#10B981")}
      ${previous ? purchaseCompareRow(previous.month, previous.purchases, Math.max(current.purchases, previous.purchases), "#CBD5E1") : ""}
    </div>

    <div class="report-dyn-grid">
      <div class="table-card">
        <h3>تفصيل المصاريف حسب البند</h3>
        <table>
          <thead><tr><th>البند</th><th>الإجمالي</th><th>عدد العمليات</th></tr></thead>
          <tbody>
            ${expRows.map(row => `<tr><td><strong>${row.cat}</strong></td><td>${mrFmt(row.total)} ر</td><td>${row.items.length}</td></tr>`).join("")}
          </tbody>
          <tfoot><tr><td>الإجمالي</td><td>${mrFmt(expRows.reduce((sum, row) => sum + row.total, 0))} ر</td><td>—</td></tr></tfoot>
        </table>
      </div>
      <div class="chart-card"><div class="chart-title">مصاريف الشهر حسب البنود</div><canvas id="monthly-report-expense-chart" height="210"></canvas></div>
    </div>

    <div class="report-dyn-section">
      <h3>التشخيص والملاحظات</h3>
      ${(current.issues.length || current.notes.length) ? [...current.issues.map(text => `<div class="issue-box">${text}</div>`), ...current.notes.map(text => `<div class="note-box">${text}</div>`)].join("") : "<div class='note-box'>لا توجد ملاحظات مسجلة لهذا الشهر.</div>"}
    </div>
  `;
  renderMonthlyExpenseChart(expRows);
}

function monthlyChangeText(current, previous, inverse = false) {
  if (!previous) return "—";
  const value = ((current - previous) / Math.abs(previous)) * 100;
  const good = inverse ? value <= 0 : value >= 0;
  return `<span style="color:${good ? "#15803d" : "#dc2626"}">${value >= 0 ? "+" : ""}${value.toFixed(1)}% عن السابق</span>`;
}

function purchaseCompareRow(label, value, max, color) {
  const width = max ? Math.max(4, (value / max) * 100) : 0;
  return `<div class="purchase-compare-row"><div class="purchase-compare-label">${label}</div><div class="purchase-compare-track"><div class="purchase-compare-fill" style="width:${width}%;background:${color}"></div></div><div class="purchase-compare-value">${mrFmt(value)} ر</div></div>`;
}

function renderMonthlyExpenseChart(rows) {
  const canvas = document.getElementById("monthly-report-expense-chart");
  if (!canvas || typeof Chart === "undefined") return;
  if (monthlyReportExpenseChart) monthlyReportExpenseChart.destroy();
  monthlyReportExpenseChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(row => row.cat),
      datasets: [{ label: "المصاريف", data: rows.map(row => row.total), backgroundColor: rows.map(row => CAT_COLORS[row.cat] || "#3B82F6"), borderRadius: 5 }]
    },
    options: { ...chartDefaults, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => `${(v / 1000).toFixed(0)}K` } } } }
  });
}

document.addEventListener("DOMContentLoaded", renderMonthlyReportsPage);
