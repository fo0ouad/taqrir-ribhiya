// ===== purchases.js =====
// صفحة المشتريات الديناميكية

let purchasesCharts = {};
let purchasesPeriod = "2026";

function purchaseFmt(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

function purchaseYear(month) {
  const match = String(month).match(/(\d{2})$/);
  return match ? 2000 + Number(match[1]) : null;
}

function purchaseRows(period = "2026") {
  return MONTHS.map((month, index) => {
    const detail = MONTHLY_DETAIL[month] || {};
    const branchPurchase = (typeof PURCHASES_BY_BRANCH !== "undefined" && PURCHASES_BY_BRANCH[month]) ? PURCHASES_BY_BRANCH[month] : {};
    const branch2 = Number(branchPurchase["فرع 2"] ?? detail.purchases_branch2 ?? 0);
    const total = Number(detail.purchases ?? PURCHASES[index] ?? 0);
    const branch1 = Number(branchPurchase["فرع 1"] ?? detail.purchases_branch1 ?? Math.max(0, total - branch2));
    return {
      month,
      year: purchaseYear(month),
      revenue: Number(detail.revenue ?? REVENUES[index] ?? 0),
      purchases: total,
      branch1,
      branch2,
      suppliersPaid: Number(detail.suppliers_paid ?? SUPPLIERS_PAID[index] ?? 0)
    };
  }).filter(row => period === "all" || row.year === Number(period));
}

function purchaseSummary(rows) {
  const total = rows.reduce((sum, row) => sum + row.purchases, 0);
  const branch1 = rows.reduce((sum, row) => sum + row.branch1, 0);
  const branch2 = rows.reduce((sum, row) => sum + row.branch2, 0);
  const paid = rows.reduce((sum, row) => sum + row.suppliersPaid, 0);
  const latest = rows[rows.length - 1];
  const previous = rows[rows.length - 2];
  return { total, branch1, branch2, paid, latest, previous, average: rows.length ? total / rows.length : 0 };
}

function purchaseItemComparison(currentMonth, previousMonth) {
  const current = (typeof PURCHASE_ITEMS !== "undefined" && PURCHASE_ITEMS[currentMonth]) ? PURCHASE_ITEMS[currentMonth] : [];
  const previous = (typeof PURCHASE_ITEMS !== "undefined" && PURCHASE_ITEMS[previousMonth]) ? PURCHASE_ITEMS[previousMonth] : [];
  const previousMap = new Map(previous.map(item => [item.name, item]));
  return current.map(item => {
    const prev = previousMap.get(item.name) || { quantity: 0, amount: 0 };
    return {
      ...item,
      previousQuantity: prev.quantity || 0,
      previousAmount: prev.amount || 0,
      quantityChange: (item.quantity || 0) - (prev.quantity || 0),
      amountChange: (item.amount || 0) - (prev.amount || 0)
    };
  }).sort((a, b) => b.amount - a.amount);
}

function renderPurchasesPage() {
  const tab = document.getElementById("tab-purchases");
  if (!tab || typeof MONTHS === "undefined") return;
  tab.innerHTML = `
    <section class="purchases-page">
      <div class="women-header">
        <div>
          <h2>المشتريات</h2>
          <p>متابعة مشتريات البضاعة شهرياً، مع مقارنة الشهر السابق وتفصيل الفروع عند توفره.</p>
        </div>
        <div class="women-header-badge" id="purchases-period-label">2026</div>
      </div>

      <div class="report-period-filter">
        <button class="report-period-btn" data-purchase-period="all" onclick="setPurchasesPeriod('all')">الكل</button>
        <button class="report-period-btn" data-purchase-period="2025" onclick="setPurchasesPeriod('2025')">2025</button>
        <button class="report-period-btn active" data-purchase-period="2026" onclick="setPurchasesPeriod('2026')">2026</button>
      </div>

      <div class="women-kpi-grid">
        <div class="women-kpi blue"><span>إجمالي المشتريات</span><strong id="purchases-total">—</strong><small id="purchases-count">—</small></div>
        <div class="women-kpi green"><span>آخر شهر</span><strong id="purchases-latest">—</strong><small id="purchases-latest-sub">—</small></div>
        <div class="women-kpi amber"><span>التغير عن الشهر السابق</span><strong id="purchases-change">—</strong><small>ارتفاع المشتريات مؤشر جيد إذا ارتبط بارتفاع المبيعات</small></div>
        <div class="women-kpi purple"><span>مدفوع للموردين</span><strong id="purchases-paid">—</strong><small id="purchases-paid-sub">—</small></div>
      </div>

      <div class="women-chart-grid">
        <div class="chart-card"><div class="chart-title">المشتريات الشهرية</div><canvas id="purchases-monthly-chart" height="190"></canvas></div>
        <div class="chart-card"><div class="chart-title">تفصيل الفروع</div><canvas id="purchases-branch-chart" height="190"></canvas></div>
      </div>

      <div class="report-dyn-section" id="purchase-items-section" style="display:none">
        <h3>الأصناف والكميات</h3>
        <div class="report-dyn-grid">
          <div class="table-card" style="margin-bottom:0">
            <h3 id="purchase-items-title">مقارنة الأصناف</h3>
            <table>
              <thead>
                <tr><th>الصنف</th><th>كمية الشهر</th><th>كمية السابق</th><th>التغير</th><th>قيمة الشهر</th><th>قيمة السابق</th></tr>
              </thead>
              <tbody id="purchase-items-body"></tbody>
            </table>
            <div class="table-note compact-note">ملاحظة: الأصناف هنا خاصة بمشتريات فرع 1 لشهري أبريل ومايو 2026، وسيتم تحديثها لفرع 2 عند توفر البيانات التفصيلية.</div>
          </div>
          <div class="chart-card"><div class="chart-title">أعلى الأصناف المشتراة</div><canvas id="purchase-items-chart" height="220"></canvas></div>
        </div>
      </div>

      <div class="table-card">
        <h3>جدول المشتريات الشهرية</h3>
        <table>
          <thead>
            <tr><th>الشهر</th><th>مشتريات فرع 1</th><th>مشتريات فرع 2</th><th>الإجمالي</th><th>التغير عن السابق</th><th>مدفوع للموردين</th><th>فرق الموردين</th></tr>
          </thead>
          <tbody id="purchases-table-body"></tbody>
          <tfoot id="purchases-table-foot"></tfoot>
        </table>
      </div>
    </section>
  `;
  setPurchasesPeriod("2026");
}

function setPurchasesPeriod(period) {
  purchasesPeriod = period;
  document.querySelectorAll("[data-purchase-period]").forEach(btn => btn.classList.toggle("active", btn.dataset.purchasePeriod === period));
  const label = document.getElementById("purchases-period-label");
  if (label) label.textContent = period === "all" ? "كل الفترة" : period;
  renderPurchasesContent();
}

function renderPurchasesContent() {
  const rows = purchaseRows(purchasesPeriod);
  const summary = purchaseSummary(rows);
  const latestChange = summary.previous ? ((summary.latest.purchases - summary.previous.purchases) / Math.abs(summary.previous.purchases || 1)) * 100 : null;
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setText("purchases-total", `${purchaseFmt(summary.total)} ر`);
  setText("purchases-count", `${rows.length} شهر`);
  setText("purchases-latest", summary.latest ? `${purchaseFmt(summary.latest.purchases)} ر` : "—");
  setText("purchases-latest-sub", summary.latest ? summary.latest.month : "—");
  setText("purchases-change", latestChange === null ? "—" : `${latestChange >= 0 ? "+" : ""}${latestChange.toFixed(1)}%`);
  setText("purchases-paid", `${purchaseFmt(summary.paid)} ر`);
  setText("purchases-paid-sub", `فرق ${purchaseFmt(summary.paid - summary.total)} ر`);
  const changeEl = document.getElementById("purchases-change");
  if (changeEl && latestChange !== null) changeEl.style.color = latestChange >= 0 ? "#15803D" : "#B91C1C";

  const body = document.getElementById("purchases-table-body");
  const foot = document.getElementById("purchases-table-foot");
  if (body && foot) {
    body.innerHTML = rows.map((row, idx) => {
      const prev = idx > 0 ? rows[idx - 1] : null;
      const change = prev ? ((row.purchases - prev.purchases) / Math.abs(prev.purchases || 1)) * 100 : null;
      const gap = row.suppliersPaid - row.purchases;
      return `<tr><td><strong>${row.month}</strong></td><td>${purchaseFmt(row.branch1)}</td><td>${row.branch2 ? purchaseFmt(row.branch2) : "—"}</td><td>${purchaseFmt(row.purchases)}</td><td style="color:${change === null ? "#64748B" : change >= 0 ? "#15803D" : "#B91C1C"};font-weight:900">${change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}</td><td>${purchaseFmt(row.suppliersPaid)}</td><td>${purchaseFmt(gap)}</td></tr>`;
    }).join("");
    foot.innerHTML = `<tr><td>الإجمالي</td><td>${purchaseFmt(summary.branch1)}</td><td>${purchaseFmt(summary.branch2)}</td><td>${purchaseFmt(summary.total)}</td><td>—</td><td>${purchaseFmt(summary.paid)}</td><td>${purchaseFmt(summary.paid - summary.total)}</td></tr>`;
  }
  renderPurchaseCharts(rows);
  renderPurchaseItems(summary.latest, summary.previous);
}

function renderPurchaseItems(latest, previous) {
  const section = document.getElementById("purchase-items-section");
  const title = document.getElementById("purchase-items-title");
  const body = document.getElementById("purchase-items-body");
  if (!section || !body || !latest) return;
  const rows = purchaseItemComparison(latest.month, previous?.month).slice(0, 15);
  if (!rows.length) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";
  if (title) title.textContent = `مقارنة أصناف ${latest.month}${previous ? ` مع ${previous.month}` : ""}`;
  body.innerHTML = rows.map(row => {
    const color = row.quantityChange >= 0 ? "#15803D" : "#B91C1C";
    return `<tr>
      <td><strong>${row.name}</strong></td>
      <td>${purchaseFmt(row.quantity)}</td>
      <td>${row.previousQuantity ? purchaseFmt(row.previousQuantity) : "—"}</td>
      <td style="color:${color};font-weight:900">${row.quantityChange >= 0 ? "+" : ""}${purchaseFmt(row.quantityChange)}</td>
      <td>${purchaseFmt(row.amount)} ر</td>
      <td>${row.previousAmount ? `${purchaseFmt(row.previousAmount)} ر` : "—"}</td>
    </tr>`;
  }).join("");
  if (typeof Chart !== "undefined") {
    renderPurchaseChart("purchase-items-chart", {
      type: "bar",
      data: {
        labels: rows.slice(0, 10).map(row => row.name),
        datasets: [
          { label: latest.month, data: rows.slice(0, 10).map(row => row.quantity), backgroundColor: "#15803D", borderRadius: 4 },
          { label: previous?.month || "السابق", data: rows.slice(0, 10).map(row => row.previousQuantity), backgroundColor: "#E7E9EE", borderRadius: 4 }
        ]
      },
      options: { ...chartDefaults, plugins: { legend: { position: "bottom" } }, scales: { y: { ticks: { callback: v => purchaseFmt(v) } } } }
    });
  }
}

function renderPurchaseCharts(rows) {
  if (typeof Chart === "undefined") return;
  renderPurchaseChart("purchases-monthly-chart", {
    type: "bar",
    data: { labels: rows.map(row => row.month), datasets: [{ label: "المشتريات", data: rows.map(row => row.purchases), backgroundColor: "#15803D", borderRadius: 5 }] },
    options: { ...chartDefaults, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => `${(v / 1000).toFixed(0)}K` } } } }
  });
  renderPurchaseChart("purchases-branch-chart", {
    type: "bar",
    data: {
      labels: rows.map(row => row.month),
      datasets: [
        { label: "فرع 1", data: rows.map(row => row.branch1), backgroundColor: "#4E7CFF", borderRadius: 4 },
        { label: "فرع 2", data: rows.map(row => row.branch2), backgroundColor: "#7033FF", borderRadius: 4 }
      ]
    },
    options: { ...chartDefaults, plugins: { legend: { position: "bottom" } }, scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => `${(v / 1000).toFixed(0)}K` } } } }
  });
}

function renderPurchaseChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (purchasesCharts[id]) purchasesCharts[id].destroy();
  purchasesCharts[id] = new Chart(canvas, config);
}

document.addEventListener("DOMContentLoaded", renderPurchasesPage);
