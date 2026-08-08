// ===== customers.js =====
// صفحة عملاء النسائي مبنية من CUSTOMERS في data.js

let customersState = { branch: 'all', search: '' };
let collectionState = { scope: 'all', target: 10000 };
let customersCharts = { top: null, branch: null, collection: null };

function customerFmt(value) {
  return Math.round(Number(value) || 0).toLocaleString('en-US');
}

function getCustomerBranchValue(customer, branch = 'all') {
  if (branch === 'm') return customer.branch_m || 0;
  if (branch === 'h') return customer.branch_h || 0;
  return customer.total || 0;
}

function getCustomerPriority(customer) {
  if (customer.total >= 5000) return { label: 'عالي', className: 'high' };
  if (customer.total >= 1000) return { label: 'متوسط', className: 'medium' };
  return { label: 'منخفض', className: 'low' };
}

function customerBranchMatches(customer, branch) {
  if (branch === 'all') return true;
  if (branch === 'm') return (customer.branch_m || 0) > 0;
  if (branch === 'h') return (customer.branch_h || 0) > 0;
  if (branch === 'both') return (customer.branch_m || 0) > 0 && (customer.branch_h || 0) > 0;
  return true;
}

function getFilteredCustomers() {
  const query = customersState.search.trim().toLowerCase();
  return CUSTOMERS.filter(customer => {
    const searchMatch = !query || customer.name.toLowerCase().includes(query);
    return searchMatch && customerBranchMatches(customer, customersState.branch);
  }).sort((a, b) => b.total - a.total);
}

function getCustomersSummary(rows = CUSTOMERS) {
  const total = rows.reduce((sum, customer) => sum + customer.total, 0);
  const branchM = rows.reduce((sum, customer) => sum + customer.branch_m, 0);
  const branchH = rows.reduce((sum, customer) => sum + customer.branch_h, 0);
  const top = rows.slice().sort((a, b) => b.total - a.total)[0];
  const top5Total = rows.slice().sort((a, b) => b.total - a.total).slice(0, 5).reduce((sum, customer) => sum + customer.total, 0);
  const average = rows.length ? total / rows.length : 0;
  const leadBranch = branchM === branchH ? 'متعادل' : (branchM > branchH ? 'فرع محمد' : 'فرع هاني');
  return { total, branchM, branchH, top, top5Total, average, leadBranch };
}

function renderCustomersPage() {
  const tab = document.getElementById('tab-customers');
  if (!tab || typeof CUSTOMERS === 'undefined') return;
  const summary = getCustomersSummary();

  tab.innerHTML = `
    <section class="customers-page">
      <div class="customers-header">
        <div>
          <h2>عملاء النسائي</h2>
          <p>المبالغ المستحقة للمحلات لدى عملاء خارجيين حتى 31-12-2025.</p>
        </div>
        <div class="customers-header-badge">${CUSTOMERS.length} عميل</div>
      </div>

      <div class="customers-kpi-grid">
        <div class="customers-kpi danger"><span>إجمالي الذمم</span><strong>${customerFmt(summary.total)} ر</strong><small>كل العملاء</small></div>
        <div class="customers-kpi blue"><span>فرع محمد</span><strong>${customerFmt(summary.branchM)} ر</strong><small>${((summary.branchM / summary.total) * 100).toFixed(1)}% من الإجمالي</small></div>
        <div class="customers-kpi purple"><span>فرع هاني</span><strong>${customerFmt(summary.branchH)} ر</strong><small>${((summary.branchH / summary.total) * 100).toFixed(1)}% من الإجمالي</small></div>
        <div class="customers-kpi amber"><span>أعلى عميل</span><strong>${summary.top.name}</strong><small>${customerFmt(summary.top.total)} ر</small></div>
        <div class="customers-kpi green"><span>متوسط العميل</span><strong>${customerFmt(summary.average)} ر</strong><small>متوسط الرصيد</small></div>
        <div class="customers-kpi slate"><span>أرصدة أعلى 5</span><strong>${customerFmt(summary.top5Total)} ر</strong><small>${((summary.top5Total / summary.total) * 100).toFixed(1)}% من الإجمالي</small></div>
      </div>

      <div class="customers-chart-grid">
        <div class="chart-card"><div class="chart-title">أعلى 10 عملاء حسب الرصيد</div><canvas id="customers-top-chart" height="210"></canvas></div>
        <div class="chart-card"><div class="chart-title">توزيع الذمم حسب الفرع</div><canvas id="customers-branch-chart" height="210"></canvas></div>
      </div>

      <div class="customers-page-links">
        <a href="#customers-collection-plan">الانتقال إلى خطة التحصيل</a>
      </div>

      <div class="customers-controls">
        <input id="customer-search-input" type="search" placeholder="بحث باسم العميل" oninput="setCustomerSearch(this.value)">
        <div class="customers-control-group">
          <button class="customers-filter active" data-customer-branch="all" onclick="setCustomerBranch('all')">كل العملاء</button>
          <button class="customers-filter" data-customer-branch="m" onclick="setCustomerBranch('m')">فرع محمد</button>
          <button class="customers-filter" data-customer-branch="h" onclick="setCustomerBranch('h')">فرع هاني</button>
          <button class="customers-filter" data-customer-branch="both" onclick="setCustomerBranch('both')">الفرعين</button>
        </div>
      </div>

      <div class="table-card customers-table-card">
        <h3>قائمة العملاء <span id="customers-count"></span></h3>
        <div style="overflow-x:auto">
          <table id="customers-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>فرع محمد</th>
                <th>فرع هاني</th>
                <th>الإجمالي</th>
                <th>نسبة من الإجمالي</th>
                <th>أولوية التحصيل</th>
              </tr>
            </thead>
            <tbody id="customers-tbody"></tbody>
            <tfoot id="customers-foot"></tfoot>
          </table>
        </div>
      </div>

      <div class="customers-collection-plan" id="customers-collection-plan">
        <div class="customers-plan-head">
          <div>
            <h3>خطة تحصيل العملاء</h3>
            <p>جرّب هدف التحصيل الشهري حسب الفرع. الخطة تساعد في معرفة مدة التحصيل وأي العملاء يبدأون أولاً.</p>
          </div>
        </div>

        <div class="customers-plan-controls">
          <div class="customers-control-group">
            <button class="customers-filter active" data-collection-scope="all" onclick="setCollectionScope('all')">كل الفروع</button>
            <button class="customers-filter" data-collection-scope="m" onclick="setCollectionScope('m')">فرع محمد</button>
            <button class="customers-filter" data-collection-scope="h" onclick="setCollectionScope('h')">فرع هاني</button>
          </div>
          <label>هدف التحصيل الشهري <input id="collection-target-input" type="number" min="500" step="500" value="${collectionState.target}" onchange="setCollectionTarget(this.value)"></label>
        </div>

        <div class="customers-plan-summary">
          <div><span>الرصيد المختار</span><strong id="collection-selected-debt">—</strong></div>
          <div><span>هدف التحصيل الشهري</span><strong id="collection-target">—</strong></div>
          <div><span>نسبة التحصيل شهرياً</span><strong id="collection-coverage">—</strong></div>
          <div><span>مدة التحصيل المتوقعة</span><strong id="collection-months">—</strong></div>
        </div>

        <div class="customers-plan-grid">
          <div class="customers-plan-table-wrap">
            <table id="collection-table">
              <thead><tr><th>العميل</th><th>الرصيد المختار</th><th>الأولوية</th><th>نسبة من الخطة</th></tr></thead>
              <tbody id="collection-body"></tbody>
            </table>
          </div>
          <div class="chart-card"><div class="chart-title">أكبر العملاء المستهدفين للتحصيل</div><canvas id="customers-collection-chart" height="210"></canvas></div>
        </div>
      </div>
    </section>
  `;

  renderCustomersTable();
  renderCustomersCharts();
  renderCollectionPlan();
}

function renderCustomersTable() {
  const rows = getFilteredCustomers();
  const totalSummary = getCustomersSummary(CUSTOMERS);
  const body = document.getElementById('customers-tbody');
  const foot = document.getElementById('customers-foot');
  const count = document.getElementById('customers-count');
  if (!body) return;
  if (count) count.textContent = `(${rows.length} عميل)`;

  body.innerHTML = rows.map(customer => {
    const priority = getCustomerPriority(customer);
    const pct = totalSummary.total ? (customer.total / totalSummary.total) * 100 : 0;
    return `
      <tr>
        <td><strong>${customer.name}</strong></td>
        <td>${customer.branch_m ? customerFmt(customer.branch_m) : '—'}</td>
        <td>${customer.branch_h ? customerFmt(customer.branch_h) : '—'}</td>
        <td class="customer-total">${customerFmt(customer.total)}</td>
        <td>
          <div class="customer-share"><span style="width:${Math.max(pct, customer.total ? 2 : 0)}%"></span></div>
          <small>${pct.toFixed(1)}%</small>
        </td>
        <td><span class="customer-priority ${priority.className}">${priority.label}</span></td>
      </tr>
    `;
  }).join('');

  if (foot) {
    const branchM = rows.reduce((sum, customer) => sum + customer.branch_m, 0);
    const branchH = rows.reduce((sum, customer) => sum + customer.branch_h, 0);
    const total = rows.reduce((sum, customer) => sum + customer.total, 0);
    foot.innerHTML = `
      <tr>
        <td>الإجمالي</td>
        <td>${customerFmt(branchM)}</td>
        <td>${customerFmt(branchH)}</td>
        <td>${customerFmt(total)}</td>
        <td colspan="2"></td>
      </tr>
    `;
  }
}

function setCustomerSearch(value) {
  customersState.search = value || '';
  renderCustomersTable();
}

function setCustomerBranch(branch) {
  customersState.branch = branch;
  document.querySelectorAll('[data-customer-branch]').forEach(btn => btn.classList.toggle('active', btn.dataset.customerBranch === branch));
  renderCustomersTable();
}

function setCollectionScope(scope) {
  collectionState.scope = scope;
  document.querySelectorAll('[data-collection-scope]').forEach(btn => btn.classList.toggle('active', btn.dataset.collectionScope === scope));
  renderCollectionPlan();
}

function setCollectionTarget(value) {
  collectionState.target = Math.max(0, Number(value) || 0);
  renderCollectionPlan();
}

function getCollectionRows() {
  return CUSTOMERS.map(customer => ({
    ...customer,
    selectedTotal: getCustomerBranchValue(customer, collectionState.scope)
  })).filter(customer => customer.selectedTotal > 0).sort((a, b) => b.selectedTotal - a.selectedTotal);
}

function renderCollectionPlan() {
  const body = document.getElementById('collection-body');
  if (!body) return;
  const rows = getCollectionRows();
  const total = rows.reduce((sum, customer) => sum + customer.selectedTotal, 0);
  const months = collectionState.target ? Math.ceil(total / collectionState.target) : 0;
  const coverage = total ? (collectionState.target / total) * 100 : 0;
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('collection-selected-debt', `${customerFmt(total)} ر`);
  setText('collection-target', `${customerFmt(collectionState.target)} ر`);
  setText('collection-coverage', `${coverage.toFixed(1)}%`);
  setText('collection-months', months ? `${months} شهر` : '—');

  body.innerHTML = rows.slice(0, 10).map(customer => {
    const priority = getCustomerPriority({ ...customer, total: customer.selectedTotal });
    const share = total ? (customer.selectedTotal / total) * 100 : 0;
    return `
      <tr>
        <td><strong>${customer.name}</strong></td>
        <td class="customer-total">${customerFmt(customer.selectedTotal)}</td>
        <td><span class="customer-priority ${priority.className}">${priority.label}</span></td>
        <td>${share.toFixed(1)}%</td>
      </tr>
    `;
  }).join('');

  renderCollectionChart(rows.slice(0, 10));
}

function renderCustomersCharts() {
  if (typeof Chart === 'undefined') return;
  const topCanvas = document.getElementById('customers-top-chart');
  const branchCanvas = document.getElementById('customers-branch-chart');
  const summary = getCustomersSummary();
  const topRows = CUSTOMERS.slice().sort((a, b) => b.total - a.total).slice(0, 10);

  if (topCanvas) {
    if (customersCharts.top) customersCharts.top.destroy();
    customersCharts.top = new Chart(topCanvas, {
      type: 'bar',
      data: {
        labels: topRows.map(customer => customer.name),
        datasets: [{ label: 'الرصيد', data: topRows.map(customer => customer.total), backgroundColor: '#4E7CFF', borderRadius: 5 }]
      },
      options: { ...chartDefaults, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } }, y: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial', size: 10 } } } } }
    });
  }

  if (branchCanvas) {
    if (customersCharts.branch) customersCharts.branch.destroy();
    customersCharts.branch = new Chart(branchCanvas, {
      type: 'doughnut',
      data: {
        labels: ['فرع محمد', 'فرع هاني'],
        datasets: [{ data: [summary.branchM, summary.branchH], backgroundColor: ['#4E7CFF', '#7033FF'] }]
      },
      options: { locale: 'en-US', responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Segoe UI, Tahoma, Arial' } } } } }
    });
  }
}

function renderCollectionChart(rows) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('customers-collection-chart');
  if (!canvas) return;
  if (customersCharts.collection) customersCharts.collection.destroy();
  customersCharts.collection = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: rows.map(customer => customer.name),
      datasets: [{ label: 'الرصيد المستهدف', data: rows.map(customer => customer.selectedTotal), backgroundColor: '#15803D', borderRadius: 5 }]
    },
    options: { ...chartDefaults, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } }, y: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial', size: 10 } } } } }
  });
}

document.addEventListener('DOMContentLoaded', renderCustomersPage);
