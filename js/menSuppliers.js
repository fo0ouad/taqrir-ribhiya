// ===== menSuppliers.js =====
// صفحة موردين الرجالي الديناميكية

const MEN_SUPPLIERS = [
  { name: "ثوب السفير - سند امر", opening: 28448, paid: 24000, discount: 4448, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة غريفين", opening: 4190, paid: 1700, discount: 2490, remaining: 0, status: "تمت التصفية" },
  { name: "أبو شام السوري", opening: 6560, paid: 4500, discount: 2060, remaining: 0, status: "تمت التصفية" },
  { name: "شركة كروزا للتجارة", opening: 567, paid: 500, discount: 67, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة أصالة الأنيق للمحلابس - فتحي", opening: 1000, paid: 500, discount: 500, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة قلوب الاخوين", opening: 700, paid: 500, discount: 200, remaining: 0, status: "تمت التصفية" },
  { name: "شركة خيوط الفخامة التجارية", opening: 5475, paid: 3900, discount: 1575, remaining: 0, status: "تمت التصفية" },
  { name: "شركة إسدام العربية", opening: 1293, paid: 1290, discount: 3, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة نجاح الشمري - زكريا", opening: 15795, paid: 10500, discount: 5295, remaining: 0, status: "تمت التصفية" },
  { name: "عبدالعزيز عتين", opening: 2240, paid: 1900, discount: 340, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة خالد زعيل للتجارة", opening: 2141, paid: 2000, discount: 141, remaining: 0, status: "تمت التصفية" },
  { name: "ايكاف", opening: 1094, paid: 1000, discount: 94, remaining: 0, status: "تمت التصفية" },
  { name: "شركة أبناء محمد السعد العجلان - البسام", opening: 3766, paid: 3766, discount: 0, remaining: 0, status: "تمت التصفية" },
  { name: "العجلان - سند الامر", opening: 100737, paid: 5000, discount: 0, remaining: 95736.56, status: "لديه رصيد" },
  { name: "ثوب الأصيل - سند الامر", opening: 40468, paid: 21000, discount: 0, remaining: 19468, status: "لديه رصيد" },
  { name: "مؤسسة دنيا الجوارب", opening: 3217, paid: 1125, discount: 0, remaining: 2091.9, status: "لديه رصيد" },
  { name: "شركة الإمتياز المحدودة - سند الامر", opening: 16152, paid: 4120, discount: 0, remaining: 12032, status: "لديه رصيد" },
  { name: "شركة زهرة بيرحا للتجارة", opening: 23300, paid: 15000, discount: 8300, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة بصمة إمتياز", opening: 8964, paid: 0, discount: 0, remaining: 8964.5, status: "لديه رصيد" },
  { name: "شركة الخياطة العربية", opening: 1300, paid: 1300, discount: 0, remaining: 0, status: "تمت التصفية" },
  { name: "شركة قطونيل", opening: 1575, paid: 1575, discount: 0, remaining: 0, status: "تمت التصفية" },
  { name: "شركة ملبوسات الإبداع", opening: 900, paid: 0, discount: 0, remaining: 900, status: "لديه رصيد" },
  { name: "مؤسسة عالم التذكار", opening: 1050, paid: 1000, discount: 50, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة الرجل الأنيق - سند الامر", opening: 20000, paid: 4500, discount: 0, remaining: 15500, status: "لديه رصيد" },
  { name: "شركة ردائي الدولية", opening: 4090, paid: 4040, discount: 50, remaining: 0, status: "تمت التصفية" },
  { name: "شركة نخبة العود التجارية - العسلي", opening: 1160, paid: 0, discount: 0, remaining: 1159.5, status: "لديه رصيد" },
  { name: "مؤسسة منى اليامي - الخياط فيصل", opening: 5200, paid: 3520, discount: 0, remaining: 1680, status: "لديه رصيد" },
  { name: "شركة دنيا الأصواف للتجارة المحدودة -الشياكة - سند امر", opening: 66718, paid: 30600, discount: 0, remaining: 36117.58, status: "لديه رصيد" },
  { name: "مؤسسة تميز المنتجات الحديثة للتجارة - سند امر", opening: 26936, paid: 9050, discount: 7386, remaining: 10500, status: "لديه رصيد" },
  { name: "شركة محمد سراج عطار واخويه - سند امر", opening: 9407, paid: 1000, discount: 0, remaining: 8407, status: "لديه رصيد" },
  { name: "شركة الدفة - سند امر", opening: 51369, paid: 46164, discount: 5205, remaining: 0, status: "تمت التصفية" },
  { name: "شركة نماء العربية للألبسة المحدودة - سند امر - مرفوع", opening: 39458, paid: 0, discount: 0, remaining: 39457.65, status: "لديه رصيد" },
  { name: "نجاح الشمري _ محمد", opening: 1100, paid: 1000, discount: 100, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة لباس الأصلية للتجارة", opening: 2880, paid: 500, discount: 0, remaining: 2380, status: "لديه رصيد" },
  { name: "شركة مجمع الشنط الراقية المحدودة", opening: 3832, paid: 1925, discount: 0, remaining: 1906.68, status: "لديه رصيد" },
  { name: "مؤسسة سيف التجارية", opening: 11639, paid: 7580, discount: 0, remaining: 4059, status: "لديه رصيد" },
  { name: "مؤسسة الجمال الحقيقي", opening: 770, paid: 700, discount: 70, remaining: 0, status: "تمت التصفية" },
  { name: "مؤسسة هدف الثقة", opening: 1242, paid: 1150, discount: 92, remaining: 0, status: "تمت التصفية" },
  { name: "أرجنتوا", opening: 750, paid: 750, discount: 0, remaining: 0, status: "تمت التصفية" }
];

let menSupplierCharts = {};
let menSupplierStatus = "active";

function msFmt(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

function menSupplierSummary(rows = MEN_SUPPLIERS) {
  return {
    count: rows.length,
    opening: rows.reduce((sum, row) => sum + row.opening, 0),
    paid: rows.reduce((sum, row) => sum + row.paid, 0),
    discount: rows.reduce((sum, row) => sum + row.discount, 0),
    remaining: rows.reduce((sum, row) => sum + row.remaining, 0),
    active: rows.filter(row => row.remaining > 0).length,
    closed: rows.filter(row => row.remaining <= 0).length
  };
}

function menSupplierRows() {
  const search = (document.getElementById("men-supplier-search")?.value || "").trim().toLowerCase();
  return MEN_SUPPLIERS
    .filter(row => {
      const matchSearch = !search || row.name.toLowerCase().includes(search);
      const matchStatus = menSupplierStatus === "all" || (menSupplierStatus === "active" ? row.remaining > 0 : row.remaining <= 0);
      return matchSearch && matchStatus;
    })
    .sort((a, b) => b.remaining - a.remaining);
}

function renderMenSuppliers() {
  const tab = document.getElementById("tab-suppliers");
  if (!tab) return;
  const summary = menSupplierSummary();
  tab.innerHTML = `
    <section class="men-suppliers-page">
      <div class="women-header">
        <div>
          <h2>موردين الرجالي</h2>
          <p>أرصدة الموردين وخطة السداد بناءً على بيانات الرصيد الافتتاحي والمدفوع والخصومات.</p>
        </div>
        <div class="women-header-badge">${summary.active} مورد لديه رصيد</div>
      </div>

      <div class="women-kpi-grid">
        <div class="women-kpi blue"><span>الرصيد الافتتاحي</span><strong>${msFmt(summary.opening)} ر</strong><small>${summary.count} مورد</small></div>
        <div class="women-kpi green"><span>إجمالي المدفوع</span><strong>${msFmt(summary.paid)} ر</strong><small>حتى آخر تحديث</small></div>
        <div class="women-kpi danger"><span>المتبقي للسداد</span><strong>${msFmt(summary.remaining)} ر</strong><small>${summary.active} مورد نشط</small></div>
        <div class="women-kpi amber"><span>الخصومات المكتسبة</span><strong>${msFmt(summary.discount)} ر</strong><small>${summary.closed} مورد تمت تصفيته</small></div>
      </div>

      <div class="women-chart-grid">
        <div class="chart-card"><div class="chart-title">أعلى الموردين رصيداً</div><canvas id="men-suppliers-top-chart" height="180"></canvas></div>
        <div class="chart-card"><div class="chart-title">توزيع حالة الموردين</div><canvas id="men-suppliers-status-chart" height="180"></canvas></div>
      </div>

      <div class="women-controls">
        <input id="men-supplier-search" type="text" placeholder="بحث باسم المورد" oninput="updateMenSuppliersTable()">
        <div class="women-control-group">
          <button class="women-filter" data-men-status="all" onclick="setMenSupplierStatus('all')">الكل</button>
          <button class="women-filter active" data-men-status="active" onclick="setMenSupplierStatus('active')">لديه رصيد</button>
          <button class="women-filter" data-men-status="closed" onclick="setMenSupplierStatus('closed')">تمت التصفية</button>
        </div>
      </div>

      <div class="table-card women-table-card">
        <h3>قائمة الموردين <span id="men-suppliers-count"></span></h3>
        <table id="men-suppliers-table">
          <thead>
            <tr><th>المورد</th><th>الحالة</th><th>الرصيد الافتتاحي</th><th>المدفوع</th><th>الخصم</th><th>المتبقي</th><th>نسبة السداد</th></tr>
          </thead>
          <tbody id="men-suppliers-body"></tbody>
          <tfoot id="men-suppliers-foot"></tfoot>
        </table>
      </div>

      <section class="women-debt-plan" id="men-supplier-plan">
        <div class="women-plan-head">
          <div>
            <h3>خطة سداد موردين الرجالي</h3>
            <p>الأرقام هنا للتخطيط فقط. غيّر الدفعة الشهرية لترى مدة السداد المتوقعة.</p>
          </div>
        </div>
        <div class="women-plan-controls">
          <label>الدفعة الشهرية <input id="men-plan-payment" class="women-plan-input" type="number" value="30000" min="1000" step="1000" oninput="renderMenSupplierPlan()"></label>
          <label><input type="checkbox" id="men-plan-top5" onchange="renderMenSupplierPlan()"> أعلى 5 فقط</label>
        </div>
        <div class="women-plan-summary">
          <div><span>الرصيد المختار</span><strong id="men-plan-balance">—</strong></div>
          <div><span>الدفعة الشهرية</span><strong id="men-plan-monthly">—</strong></div>
          <div><span>مدة السداد</span><strong id="men-plan-months">—</strong></div>
          <div><span>عدد الموردين</span><strong id="men-plan-count">—</strong></div>
        </div>
        <div class="women-plan-grid">
          <div class="chart-card"><div class="chart-title">توزيع الرصيد والدفعة الشهرية</div><canvas id="men-plan-chart" height="180"></canvas></div>
          <div class="women-plan-table-wrap">
            <table><thead><tr><th>المورد</th><th>الرصيد</th><th>أشهر السداد</th></tr></thead><tbody id="men-plan-body"></tbody></table>
          </div>
        </div>
      </section>
    </section>
  `;
  updateMenSuppliersTable();
  renderMenSupplierCharts();
  renderMenSupplierPlan();
}

function setMenSupplierStatus(status) {
  menSupplierStatus = status;
  document.querySelectorAll("[data-men-status]").forEach(btn => btn.classList.toggle("active", btn.dataset.menStatus === status));
  updateMenSuppliersTable();
}

function updateMenSuppliersTable() {
  const rows = menSupplierRows();
  const body = document.getElementById("men-suppliers-body");
  const foot = document.getElementById("men-suppliers-foot");
  const count = document.getElementById("men-suppliers-count");
  if (!body || !foot) return;
  const total = menSupplierSummary(rows);
  if (count) count.textContent = `(${rows.length} مورد)`;
  body.innerHTML = rows.map(row => {
    const paidRatio = row.opening ? ((row.paid + row.discount) / row.opening) * 100 : 0;
    return `
      <tr>
        <td><strong>${row.name}</strong></td>
        <td><span class="women-status ${row.remaining > 0 ? "remove" : "current"}">${row.status}</span></td>
        <td>${msFmt(row.opening)}</td>
        <td>${msFmt(row.paid)}</td>
        <td>${msFmt(row.discount)}</td>
        <td class="${row.remaining > 0 ? "women-total" : ""}">${msFmt(row.remaining)}</td>
        <td>${paidRatio.toFixed(1)}%</td>
      </tr>
    `;
  }).join("");
  foot.innerHTML = `<tr><td>الإجمالي</td><td>${rows.length}</td><td>${msFmt(total.opening)}</td><td>${msFmt(total.paid)}</td><td>${msFmt(total.discount)}</td><td>${msFmt(total.remaining)}</td><td>—</td></tr>`;
}

function renderMenSupplierCharts() {
  if (typeof Chart === "undefined") return;
  const active = MEN_SUPPLIERS.filter(row => row.remaining > 0).sort((a, b) => b.remaining - a.remaining);
  renderMenChart("men-suppliers-top-chart", {
    type: "bar",
    data: {
      labels: active.slice(0, 8).map(row => row.name),
      datasets: [{ label: "المتبقي", data: active.slice(0, 8).map(row => row.remaining), backgroundColor: "#B91C1C", borderRadius: 5 }]
    },
    options: { ...chartDefaults, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => `${(v / 1000).toFixed(0)}K` } } } }
  });
  const summary = menSupplierSummary();
  renderMenChart("men-suppliers-status-chart", {
    type: "doughnut",
    data: { labels: ["لديه رصيد", "تمت التصفية"], datasets: [{ data: [summary.active, summary.closed], backgroundColor: ["#B91C1C", "#15803D"] }] },
    options: { ...chartDefaults, plugins: { legend: { position: "bottom" } } }
  });
}

function renderMenSupplierPlan() {
  const payment = Number(document.getElementById("men-plan-payment")?.value) || 1;
  const top5Only = document.getElementById("men-plan-top5")?.checked;
  const rows = MEN_SUPPLIERS.filter(row => row.remaining > 0).sort((a, b) => b.remaining - a.remaining);
  const selected = top5Only ? rows.slice(0, 5) : rows;
  const balance = selected.reduce((sum, row) => sum + row.remaining, 0);
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setText("men-plan-balance", `${msFmt(balance)} ر`);
  setText("men-plan-monthly", `${msFmt(payment)} ر`);
  setText("men-plan-months", `${Math.ceil(balance / payment)} شهر`);
  setText("men-plan-count", `${selected.length} مورد`);
  const body = document.getElementById("men-plan-body");
  if (body) body.innerHTML = selected.map(row => `<tr><td>${row.name}</td><td>${msFmt(row.remaining)}</td><td>${Math.ceil(row.remaining / payment)} شهر</td></tr>`).join("");
  if (typeof Chart !== "undefined") {
    renderMenChart("men-plan-chart", {
      type: "bar",
      data: {
        labels: ["الرصيد", "دفعة شهرية"],
        datasets: [{ label: "ريال", data: [balance, payment], backgroundColor: ["#E7E9EE", "#15803D"], borderRadius: 5 }]
      },
      options: { ...chartDefaults, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => `${(v / 1000).toFixed(0)}K` } } } }
    });
  }
}

function renderMenChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (menSupplierCharts[id]) menSupplierCharts[id].destroy();
  menSupplierCharts[id] = new Chart(canvas, config);
}

document.addEventListener("DOMContentLoaded", renderMenSuppliers);
