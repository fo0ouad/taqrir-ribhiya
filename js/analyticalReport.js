// ===== analyticalReport.js =====
// التقرير التحليلي الديناميكي

const OPENING_INVENTORY_2025 = 669672;
const INVENTORY_2026 = {
  "فرع محمد": {
    itemRows: 72,
    quantity: 8391,
    cost: 68961.88,
    sale: 90272.58,
    topItems: [
      { name: "روز سويقة الأصلي نصف كم", quantity: 690, cost: 5754.6, sale: 7935 },
      { name: "مسرحات بناتي", quantity: 696, cost: 5220, sale: 6960 },
      { name: "تراثي يد شيفون بناتي", quantity: 360, cost: 4201.2, sale: 5400 },
      { name: "روز سويقة عادي نصف كم", quantity: 528, cost: 3785.76, sale: 4488 },
      { name: "تراثي يد شيفون نسائي", quantity: 216, cost: 3240, sale: 3672 }
    ]
  },
  "فرع هاني": {
    itemRows: 72,
    quantity: 6704.5,
    cost: 65069.31,
    sale: 84657,
    topItems: [
      { name: "ربطة شعر", quantity: 672, cost: 10080, sale: 13440 },
      { name: "روز سويقة الأصلي نصف كم", quantity: 672, cost: 5604.48, sale: 7728 },
      { name: "قمصان شتوي صوف", quantity: 330, cost: 4125, sale: 4950 },
      { name: "روز سويقة عادي نصف كم", quantity: 516, cost: 3699.72, sale: 4386 },
      { name: "روز بيجامة ساده + مشجر", quantity: 240, cost: 3000, sale: 3600 }
    ]
  }
};

let reportCharts = {};

function reportFmt(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

function reportPct(value, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

function reportSignedPct(value) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function reportYear(month) {
  const match = String(month).match(/(\d{2})$/);
  return match ? 2000 + Number(match[1]) : null;
}

function reportMonthName(month) {
  return String(month).replace(/\s+\d{2}$/, "");
}

function reportMonthData(month, index) {
  const detail = MONTHLY_DETAIL[month] || {};
  return {
    month,
    index,
    year: reportYear(month),
    monthName: reportMonthName(month),
    revenue: Number(detail.revenue ?? REVENUES[index] ?? 0),
    grossMargin: Number(detail.gross_margin ?? GROSS_MARGINS[index] ?? 0),
    expenses: Number(detail.expenses ?? EXPENSES[index] ?? 0),
    purchases: Number(detail.purchases ?? PURCHASES[index] ?? 0),
    suppliersPaid: Number(detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0),
    profit: Number(detail.metric1 ?? detail.profit ?? ((detail.gross_margin ?? GROSS_MARGINS[index] ?? 0) - (detail.expenses ?? EXPENSES[index] ?? 0))),
    cash: Number(detail.metric3 ?? ((detail.revenue ?? REVENUES[index] ?? 0) - (detail.expenses ?? EXPENSES[index] ?? 0) - (detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0)))
  };
}

function allReportMonths() {
  return MONTHS.map((month, index) => reportMonthData(month, index));
}

function sumBy(rows, key) {
  return rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
}

function periodSummary(rows) {
  return {
    months: rows.length,
    revenue: sumBy(rows, "revenue"),
    grossMargin: sumBy(rows, "grossMargin"),
    expenses: sumBy(rows, "expenses"),
    purchases: sumBy(rows, "purchases"),
    suppliersPaid: sumBy(rows, "suppliersPaid"),
    profit: sumBy(rows, "profit"),
    cash: sumBy(rows, "cash")
  };
}

function pctChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function inventoryTotals() {
  const branches = Object.entries(INVENTORY_2026).map(([name, data]) => ({ name, ...data }));
  const cost = branches.reduce((sum, branch) => sum + branch.cost, 0);
  const sale = branches.reduce((sum, branch) => sum + branch.sale, 0);
  const quantity = branches.reduce((sum, branch) => sum + branch.quantity, 0);
  const itemRows = Math.max(...branches.map(branch => branch.itemRows));
  return {
    branches,
    cost,
    sale,
    quantity,
    itemRows,
    margin: sale ? ((sale - cost) / sale) * 100 : 0
  };
}

function getReportMetrics() {
  const rows = allReportMonths();
  const rows2025 = rows.filter(row => row.year === 2025);
  const rows2026 = rows.filter(row => row.year === 2026);
  const ytd2025 = rows2025.filter(row => rows2026.some(current => current.monthName === row.monthName));
  const inventory = inventoryTotals();
  const summary2025 = periodSummary(rows2025);
  const summary2026 = periodSummary(rows2026);
  const summaryYtd2025 = periodSummary(ytd2025);
  const cogs2025 = OPENING_INVENTORY_2025 + summary2025.purchases - inventory.cost;
  const grossProfit2025 = summary2025.revenue - cogs2025;
  const netProfit2025 = grossProfit2025 - summary2025.expenses;
  const latest = rows[rows.length - 1];
  const latestIndex = latest.index;
  const latestPrev = latestIndex > 0 ? rows[latestIndex - 1] : null;
  const latestYoY = rows.find(row => row.year === latest.year - 1 && row.monthName === latest.monthName);
  const last3 = rows.slice(Math.max(0, rows.length - 3));
  const prev3 = rows.slice(Math.max(0, rows.length - 6), Math.max(0, rows.length - 3));
  const last3PrevYear = last3.map(row => rows.find(prev => prev.year === row.year - 1 && prev.monthName === row.monthName)).filter(Boolean);
  return {
    rows,
    rows2025,
    rows2026,
    ytd2025,
    inventory,
    summary2025,
    summary2026,
    summaryYtd2025,
    cogs2025,
    grossProfit2025,
    netProfit2025,
    latest,
    latestPrev,
    latestYoY,
    last3,
    prev3,
    last3PrevYear,
    last3Summary: periodSummary(last3),
    prev3Summary: periodSummary(prev3),
    last3PrevYearSummary: periodSummary(last3PrevYear)
  };
}

function metricCard(label, value, sub, tone = "") {
  return `<div class="report-dyn-card ${tone}"><span>${label}</span><strong>${value}</strong><small>${sub}</small></div>`;
}

function reportYearCards(year, m) {
  const summary = year === 2025 ? m.summary2025 : m.summary2026;
  const supplierGap = summary.suppliersPaid - summary.purchases;
  if (year === 2025) {
    return `
      ${metricCard("إيرادات 2025", `${reportFmt(summary.revenue)} ر`, `${summary.months} شهر`, "blue")}
      ${metricCard("COGS 2025", `${reportFmt(m.cogs2025)} ر`, "تكلفة البضاعة المباعة", "amber")}
      ${metricCard("مجمل الربح 2025", `${reportFmt(m.grossProfit2025)} ر`, reportPct(m.grossProfit2025 / summary.revenue * 100), "green")}
      ${metricCard("صافي الربح 2025", `${reportFmt(m.netProfit2025)} ر`, reportPct(m.netProfit2025 / summary.revenue * 100), "green")}
      ${metricCard("مشتريات 2025", `${reportFmt(summary.purchases)} ر`, "إجمالي مشتريات السنة", "purple")}
      ${metricCard("فرق الموردين 2025", `${supplierGap >= 0 ? "" : "-"}${reportFmt(Math.abs(supplierGap))} ر`, supplierGap >= 0 ? "مدفوعات أعلى من المشتريات" : "مشتريات أعلى من المدفوعات", supplierGap >= 0 ? "red" : "green")}
    `;
  }
  return `
    ${metricCard("إيرادات 2026", `${reportFmt(summary.revenue)} ر`, `حتى ${m.latest.month}`, "blue")}
    ${metricCard("هامش 15% 2026", `${reportFmt(summary.grossMargin)} ر`, "حسب عمود الفائدة", "green")}
    ${metricCard("المصاريف 2026", `${reportFmt(summary.expenses)} ر`, `${summary.months} شهر`, "red")}
    ${metricCard("الربح 2026", `${reportFmt(summary.profit)} ر`, "هامش 15% - المصاريف", summary.profit >= 0 ? "green" : "red")}
    ${metricCard("مشتريات 2026", `${reportFmt(summary.purchases)} ر`, "إجمالي مشتريات السنة الحالية", "purple")}
    ${metricCard("فرق الموردين 2026", `${supplierGap >= 0 ? "" : "-"}${reportFmt(Math.abs(supplierGap))} ر`, supplierGap >= 0 ? "مدفوعات أعلى من المشتريات" : "مشتريات أعلى من المدفوعات", supplierGap >= 0 ? "red" : "green")}
  `;
}

function comparisonCell(value, inverse = false) {
  if (value === null || value === undefined || !Number.isFinite(value)) return `<td>—</td>`;
  const good = inverse ? value <= 0 : value >= 0;
  return `<td style="color:${good ? "#15803D" : "#B91C1C"};font-weight:900">${reportSignedPct(value)}</td>`;
}

function latestAnalysisMarkup(m, sectionId = "report-dyn-latest") {
  const latestRevenueChange = pctChange(m.latest.revenue, m.latestPrev?.revenue);
  const latestYoYRevenueChange = pctChange(m.latest.revenue, m.latestYoY?.revenue);
  const last3RevenueChange = pctChange(m.last3Summary.revenue, m.prev3Summary.revenue);
  const last3YoYRevenueChange = pctChange(m.last3Summary.revenue, m.last3PrevYearSummary.revenue);
  return `
    <div class="report-dyn-section latest-analysis-section" id="${sectionId}">
      <h3>تحليل آخر شهر وآخر 3 أشهر</h3>
      <div class="report-dyn-grid">
        <div class="report-dyn-panel">
          <h4>آخر شهر: ${m.latest.month}</h4>
          <table>
            <thead><tr><th>المؤشر</th><th>${m.latest.month}</th><th>الشهر السابق</th><th>نفس الشهر من السنة الماضية</th></tr></thead>
            <tbody>
              ${renderLatestRow("الإيرادات", "revenue", m.latest, m.latestPrev, m.latestYoY)}
              ${renderLatestRow("المصاريف", "expenses", m.latest, m.latestPrev, m.latestYoY, true)}
              ${renderLatestRow("المشتريات", "purchases", m.latest, m.latestPrev, m.latestYoY)}
              ${renderLatestRow("الربح", "profit", m.latest, m.latestPrev, m.latestYoY)}
              ${renderLatestRow("الفائض النقدي", "cash", m.latest, m.latestPrev, m.latestYoY)}
            </tbody>
          </table>
          <div class="report-note">${latestInsight(m, latestRevenueChange, latestYoYRevenueChange)}</div>
        </div>
        <div class="report-dyn-panel">
          <h4>آخر 3 أشهر</h4>
          <table>
            <thead><tr><th>المقارنة</th><th>الإيرادات</th><th>المصاريف</th><th>الربح</th><th>المشتريات</th></tr></thead>
            <tbody>
              <tr><td>آخر 3 أشهر</td><td>${reportFmt(m.last3Summary.revenue)}</td><td>${reportFmt(m.last3Summary.expenses)}</td><td>${reportFmt(m.last3Summary.profit)}</td><td>${reportFmt(m.last3Summary.purchases)}</td></tr>
              <tr><td>آخر 3 أشهر سابقة</td><td>${reportFmt(m.prev3Summary.revenue)}</td><td>${reportFmt(m.prev3Summary.expenses)}</td><td>${reportFmt(m.prev3Summary.profit)}</td><td>${reportFmt(m.prev3Summary.purchases)}</td></tr>
              <tr><td>نفس آخر 3 أشهر من العام السابق</td><td>${reportFmt(m.last3PrevYearSummary.revenue)}</td><td>${reportFmt(m.last3PrevYearSummary.expenses)}</td><td>${reportFmt(m.last3PrevYearSummary.profit)}</td><td>${reportFmt(m.last3PrevYearSummary.purchases)}</td></tr>
              <tr><td>تغير عن آخر 3 أشهر سابقة</td>${comparisonCell(last3RevenueChange)}${comparisonCell(pctChange(m.last3Summary.expenses, m.prev3Summary.expenses), true)}${comparisonCell(pctChange(m.last3Summary.profit, m.prev3Summary.profit))}${comparisonCell(pctChange(m.last3Summary.purchases, m.prev3Summary.purchases))}</tr>
              <tr><td>تغير عن نفس الفترة من العام السابق</td>${comparisonCell(last3YoYRevenueChange)}${comparisonCell(pctChange(m.last3Summary.expenses, m.last3PrevYearSummary.expenses), true)}${comparisonCell(pctChange(m.last3Summary.profit, m.last3PrevYearSummary.profit))}${comparisonCell(pctChange(m.last3Summary.purchases, m.last3PrevYearSummary.purchases))}</tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderLatestAnalysisInto(elementId) {
  const target = document.getElementById(elementId);
  if (!target || typeof MONTHS === "undefined") return;
  target.innerHTML = latestAnalysisMarkup(getReportMetrics(), elementId);
}

function renderAnalyticalReport() {
  const tab = document.getElementById("tab-report");
  if (!tab || typeof MONTHS === "undefined") return;
  const m = getReportMetrics();

  tab.innerHTML = `
    <section class="report-dyn-page">
      <div class="report-dyn-header">
        <div>
          <h2>التقرير التحليلي</h2>
          <p>تحليل ديناميكي يتحدث من بيانات الأشهر والمخزون، حتى ${m.latest.month}.</p>
        </div>
        <div class="report-dyn-badge">آخر تحديث: ${m.latest.month}</div>
      </div>

      <div class="report-dyn-subnav">
        <a href="#report-dyn-latest">آخر شهر وآخر 3 أشهر</a>
        <a href="#report-dyn-cogs">المخزون و COGS</a>
        <a href="#report-dyn-performance">الأداء</a>
        <a href="#report-dyn-cash">السيولة والموردين</a>
        <a href="#report-dyn-actions">التوصيات</a>
      </div>

      <div class="report-period-filter report-kpi-filter" aria-label="فلتر كروت التقرير">
        <button class="report-period-btn active" data-report-kpi-year="2026" onclick="setReportKpiYear(2026)">2026</button>
        <button class="report-period-btn" data-report-kpi-year="2025" onclick="setReportKpiYear(2025)">2025</button>
      </div>
      <div class="report-dyn-kpis" id="report-year-kpis">
        ${reportYearCards(2026, m)}
      </div>

      ${latestAnalysisMarkup(m)}

      <div class="report-dyn-section" id="report-dyn-cogs">
        <h3>المخزون و COGS</h3>
        <div class="report-cogs-equation">
          <div><span>مخزون بداية 2025</span><strong>${reportFmt(OPENING_INVENTORY_2025)} ر</strong></div>
          <b>+</b>
          <div><span>مشتريات 2025</span><strong>${reportFmt(m.summary2025.purchases)} ر</strong></div>
          <b>−</b>
          <div><span>مخزون بداية 2026</span><strong>${reportFmt(m.inventory.cost)} ر</strong></div>
          <b>=</b>
          <div class="result"><span>COGS</span><strong>${reportFmt(m.cogs2025)} ر</strong></div>
        </div>
        <div class="report-note">
          COGS يعني تكلفة البضاعة التي تم بيعها خلال 2025. الحساب يأخذ مخزون بداية السنة، ويضيف مشتريات السنة، ثم يطرح المخزون المتبقي في بداية 2026. الناتج هو تكلفة البضاعة التي خرجت من المخزون وبيعت خلال السنة.
        </div>
        <div class="report-dyn-grid">
          <div class="report-dyn-panel">
            <h4>تفصيل مخزون بداية 2026 حسب الفرع</h4>
            <table>
              <thead><tr><th>الفرع</th><th>صفوف الأصناف</th><th>الكمية</th><th>التكلفة</th><th>سعر البيع</th><th>الهامش</th></tr></thead>
              <tbody>
                ${m.inventory.branches.map(branch => `
                  <tr>
                    <td><strong>${branch.name}</strong></td>
                    <td>${branch.itemRows}</td>
                    <td>${reportFmt(branch.quantity)}</td>
                    <td>${reportFmt(branch.cost)}</td>
                    <td>${reportFmt(branch.sale)}</td>
                    <td style="color:#15803D;font-weight:900">${reportPct((branch.sale - branch.cost) / branch.sale * 100)}</td>
                  </tr>
                `).join("")}
                <tr class="report-total-row"><td>الإجمالي</td><td>${m.inventory.itemRows} صنف موحد</td><td>${reportFmt(m.inventory.quantity)}</td><td>${reportFmt(m.inventory.cost)}</td><td>${reportFmt(m.inventory.sale)}</td><td>${reportPct(m.inventory.margin)}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="chart-card"><div class="chart-title">التكلفة وسعر البيع حسب الفرع</div><canvas id="report-inventory-chart" height="210"></canvas><div class="chart-explain">التكلفة = إجمالي تكلفة الأصناف من ملف المخزون. سعر البيع = الكمية × سعر البيع لكل صنف.</div></div>
        </div>
        <div class="report-dyn-panel">
          <h4>أعلى الأصناف تكلفة في مخزون بداية 2026</h4>
          <table>
            <thead><tr><th>الفرع</th><th>الصنف</th><th>الكمية</th><th>إجمالي التكلفة</th><th>سعر البيع الإجمالي</th></tr></thead>
            <tbody>
              ${m.inventory.branches.flatMap(branch => branch.topItems.map(item => ({ branch: branch.name, ...item }))).sort((a, b) => b.cost - a.cost).slice(0, 10).map(item => `
                <tr><td>${item.branch}</td><td><strong>${item.name}</strong></td><td>${reportFmt(item.quantity)}</td><td class="report-red">${reportFmt(item.cost)} ر</td><td>${reportFmt(item.sale)} ر</td></tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="report-dyn-section" id="report-dyn-performance">
        <h3>الأداء حسب السنة والفترة</h3>
        <div class="report-dyn-grid">
          <div class="report-dyn-panel">
            <table>
              <thead><tr><th>الفترة</th><th>الإيرادات</th><th>المصاريف</th><th>المشتريات</th><th>مدفوع للموردين</th><th>الربح</th></tr></thead>
              <tbody>
                ${renderPerformanceRow("2025", m.summary2025)}
                ${renderPerformanceRow(`2025 حتى ${m.latest.monthName}`, m.summaryYtd2025)}
                ${renderPerformanceRow(`2026 حتى ${m.latest.month}`, m.summary2026)}
                ${renderPerformanceRow("آخر 3 أشهر", m.last3Summary)}
                ${renderComparisonRow("فرق 2026 حتى الآن مقابل نفس فترة 2025", m.summary2026, m.summaryYtd2025)}
              </tbody>
            </table>
          </div>
          <div class="chart-card"><div class="chart-title">الإيرادات والربح شهرياً</div><canvas id="report-performance-chart" height="230"></canvas></div>
        </div>
      </div>

      <div class="report-dyn-section" id="report-dyn-cash">
        <h3>السيولة والموردين</h3>
        <div class="report-period-filter">
          <button class="report-period-btn active" data-report-supplier-period="2026" onclick="setReportSupplierPeriod('2026')">2026</button>
          <button class="report-period-btn" data-report-supplier-period="last12" onclick="setReportSupplierPeriod('last12')">آخر 12 شهر</button>
          <button class="report-period-btn" data-report-supplier-period="2025" onclick="setReportSupplierPeriod('2025')">2025</button>
          <button class="report-period-btn" data-report-supplier-period="all" onclick="setReportSupplierPeriod('all')">الكل</button>
        </div>
        <div class="report-dyn-kpis compact">
          <div class="report-dyn-card red"><span id="report-supplier-paid-label">مدفوع للموردين</span><strong id="report-supplier-paid">—</strong><small id="report-supplier-paid-sub">—</small></div>
          <div class="report-dyn-card green"><span>المشتريات</span><strong id="report-supplier-purchases">—</strong><small>بضاعة جديدة</small></div>
          <div class="report-dyn-card amber"><span>الفرق</span><strong id="report-supplier-gap">—</strong><small id="report-supplier-gap-sub">—</small></div>
          ${metricCard("فائض نقدي آخر 3 أشهر", `${reportFmt(m.last3Summary.cash)} ر`, "بعد المصاريف والموردين", m.last3Summary.cash >= 0 ? "green" : "red")}
        </div>
        <div class="chart-card"><div class="chart-title">المشتريات مقابل المدفوع للموردين</div><canvas id="report-suppliers-chart" height="210"></canvas></div>
      </div>

      <div class="report-dyn-section" id="report-dyn-actions">
        <h3>التوصيات العملية</h3>
        <div class="report-actions-list">
          ${recommendations(m).map(item => `<div class="${item.tone}"><strong>${item.title}</strong><span>${item.body}</span></div>`).join("")}
        </div>
      </div>
    </section>
  `;
  renderAnalyticalReportCharts(m);
  setReportSupplierPeriod("2026");
}

function renderPerformanceRow(label, summary) {
  return `<tr><td><strong>${label}</strong></td><td>${reportFmt(summary.revenue)}</td><td>${reportFmt(summary.expenses)}</td><td>${reportFmt(summary.purchases)}</td><td>${reportFmt(summary.suppliersPaid)}</td><td class="${summary.profit >= 0 ? "report-green" : "report-red"}">${reportFmt(summary.profit)}</td></tr>`;
}

function renderComparisonRow(label, current, previous) {
  return `<tr class="report-total-row"><td>${label}</td>${comparisonCell(pctChange(current.revenue, previous.revenue))}${comparisonCell(pctChange(current.expenses, previous.expenses), true)}${comparisonCell(pctChange(current.purchases, previous.purchases))}${comparisonCell(pctChange(current.suppliersPaid, previous.suppliersPaid), true)}${comparisonCell(pctChange(current.profit, previous.profit))}</tr>`;
}

function renderLatestRow(label, key, latest, previous, lastYear, inverse = false) {
  return `<tr><td>${label}</td><td><strong>${reportFmt(latest[key])}</strong></td>${comparisonCell(pctChange(latest[key], previous?.[key]), inverse)}${comparisonCell(pctChange(latest[key], lastYear?.[key]), inverse)}</tr>`;
}

function latestInsight(m, mom, yoy) {
  const parts = [];
  if (mom !== null) parts.push(`الإيرادات ${mom >= 0 ? "ارتفعت" : "انخفضت"} عن الشهر السابق بنسبة ${Math.abs(mom).toFixed(1)}%.`);
  if (yoy !== null) parts.push(`ومقارنة بنفس الشهر من السنة الماضية ${yoy >= 0 ? "ارتفعت" : "انخفضت"} بنسبة ${Math.abs(yoy).toFixed(1)}%.`);
  parts.push(m.latest.profit >= 0 ? "الربح موجب في آخر شهر، وهذا مؤشر تحسن." : "الربح سالب في آخر شهر ويحتاج متابعة المصاريف والمبيعات.");
  return parts.join(" ");
}

function recommendations(m) {
  const recs = [];
  if (m.inventory.cost < 200000) {
    recs.push({ tone: "urgent", title: "مراجعة المخزون", body: `مخزون بداية 2026 منخفض (${reportFmt(m.inventory.cost)} ر)، ويجب متابعة أثره على المبيعات مع كل شهر جديد.` });
  }
  if (m.latestYoY && m.latest.revenue < m.latestYoY.revenue) {
    recs.push({ tone: "urgent", title: "استعادة المبيعات", body: `${m.latest.month} أقل من نفس الشهر في السنة الماضية، راجع الأصناف المتوفرة والفروع الأعلى تراجعاً.` });
  }
  if (m.last3Summary.cash < 0) {
    recs.push({ tone: "watch", title: "إدارة السيولة", body: "آخر 3 أشهر فيها ضغط نقدي، راقب المدفوع للموردين مقابل المشتريات قبل اعتماد دفعات كبيرة." });
  } else {
    recs.push({ tone: "good", title: "السيولة تتحسن", body: "آخر 3 أشهر لا تظهر عجزاً نقدياً إجمالياً، وهذا يعطي مساحة أفضل لتنظيم السداد والمشتريات." });
  }
  recs.push({ tone: "watch", title: "تحديث التقرير شهرياً", body: "مع إضافة كل شهر جديد، راجع آخر شهر وآخر 3 أشهر قبل اتخاذ قرار مشتريات أو سداد موردين." });
  return recs;
}

function renderAnalyticalReportCharts(m) {
  if (typeof Chart === "undefined") return;
  renderReportChart("report-inventory-chart", {
    type: "bar",
    data: {
      labels: m.inventory.branches.map(branch => branch.name),
      datasets: [
        { label: "التكلفة", data: m.inventory.branches.map(branch => branch.cost), backgroundColor: "#4E7CFF", borderRadius: 5 },
        { label: "سعر البيع", data: m.inventory.branches.map(branch => branch.sale), backgroundColor: "#15803D", borderRadius: 5 }
      ]
    },
    options: reportBarOptions()
  });
  renderReportChart("report-performance-chart", {
    type: "bar",
    data: {
      labels: m.rows.map(row => row.month),
      datasets: [
        { label: "الإيرادات", data: m.rows.map(row => row.revenue), backgroundColor: "#4E7CFF", borderRadius: 5 },
        { label: "الربح", data: m.rows.map(row => row.profit), backgroundColor: m.rows.map(row => row.profit >= 0 ? "#15803D" : "#B91C1C"), borderRadius: 5 }
      ]
    },
    options: reportBarOptions()
  });
}

function getSupplierPeriodRows(period) {
  const rows = allReportMonths();
  if (period === "2026") return rows.filter(row => row.year === 2026);
  if (period === "2025") return rows.filter(row => row.year === 2025);
  if (period === "last12") return rows.slice(Math.max(0, rows.length - 12));
  return rows;
}

function setReportKpiYear(year) {
  const m = getReportMetrics();
  const targetYear = Number(year) === 2025 ? 2025 : 2026;
  document.querySelectorAll("[data-report-kpi-year]").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.reportKpiYear) === targetYear);
  });
  const container = document.getElementById("report-year-kpis");
  if (container) container.innerHTML = reportYearCards(targetYear, m);
}

function setReportSupplierPeriod(period) {
  const rows = getSupplierPeriodRows(period);
  const summary = periodSummary(rows);
  const gap = summary.suppliersPaid - summary.purchases;
  const label = period === "2026" ? "2026" : period === "2025" ? "2025" : period === "last12" ? "آخر 12 شهر" : "كل الفترة";
  document.querySelectorAll("[data-report-supplier-period]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.reportSupplierPeriod === period);
  });
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText("report-supplier-paid-label", `مدفوع للموردين (${label})`);
  setText("report-supplier-paid", `${reportFmt(summary.suppliersPaid)} ر`);
  setText("report-supplier-paid-sub", `${summary.months} شهر`);
  setText("report-supplier-purchases", `${reportFmt(summary.purchases)} ر`);
  setText("report-supplier-gap", `${gap >= 0 ? "" : "-"}${reportFmt(Math.abs(gap))} ر`);
  setText("report-supplier-gap-sub", gap >= 0 ? "مدفوعات أعلى من المشتريات" : "مشتريات أعلى من المدفوعات");
  renderReportSupplierChart(rows);
}

function renderReportSupplierChart(rows) {
  renderReportChart("report-suppliers-chart", {
    type: "bar",
    data: {
      labels: rows.map(row => row.month),
      datasets: [
        { label: "المشتريات", data: rows.map(row => row.purchases), backgroundColor: "#7033FF", borderRadius: 5 },
        { label: "مدفوع للموردين", data: rows.map(row => row.suppliersPaid), backgroundColor: "#7033FF", borderRadius: 5 }
      ]
    },
    options: reportBarOptions()
  });
}

function reportBarOptions() {
  return {
    ...chartDefaults,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { ticks: { font: { family: "Segoe UI, Tahoma, Arial", size: 10 } } },
      y: { ticks: { callback: v => `${(v / 1000).toFixed(0)}K` } }
    }
  };
}

function renderReportChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (reportCharts[id]) reportCharts[id].destroy();
  reportCharts[id] = new Chart(canvas, config);
}

document.addEventListener("DOMContentLoaded", renderAnalyticalReport);
