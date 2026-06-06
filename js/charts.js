// ===== charts.js =====
// رسوم بيانية Chart.js — تعتمد على data.js و utils.js

document.addEventListener('DOMContentLoaded', function() {

// Chart 1: Revenue + Gross Margin
const ctx1 = document.getElementById('ch-revenue');
if (ctx1) {
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'الإيرادات', data: REVENUES, backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 4 },
        { label: 'هامش 15%', data: GROSS_MARGINS, type: 'line', borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 2.5, pointRadius: 4, fill: false, tension: 0.3 }
      ]
    },
    options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, title: { display: false } } }
  });
}

// Chart 2: Net Profit/Loss
const ctx2 = document.getElementById('ch-profit');
if (ctx2) {
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'صافي الربح/الخسارة',
        data: PROFIT_ACTUAL,
        backgroundColor: PROFIT_ACTUAL.map(v => v >= 0 ? 'rgba(22,163,74,0.75)' : 'rgba(220,38,38,0.75)'),
        borderRadius: 4
      }]
    },
    options: { ...chartDefaults }
  });
}

// Chart 3: Suppliers vs Purchases
const ctx3 = document.getElementById('ch-suppliers');
if (ctx3) {
  new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'المدفوع للموردين', data: SUPPLIERS_PAID, backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4 },
        { label: 'المشتريات', data: PURCHASES, backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 4 }
      ]
    },
    options: { ...chartDefaults }
  });
}

// Chart 4: Expenses
const ctx4 = document.getElementById('ch-expenses');
if (ctx4) {
  new Chart(ctx4, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'المصاريف التشغيلية',
        data: EXPENSES,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245,158,11,0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3,
        pointRadius: 4
      }]
    },
    options: { ...chartDefaults }
  });
}

// Chart 5: Tailors Balance
const ctx5 = document.getElementById('ch-tailors');
if (ctx5) {
  new Chart(ctx5, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'رصيد الخياطين',
        data: TAILORS_BALANCE,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139,92,246,0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3,
        pointRadius: 4
      }]
    },
    options: { ...chartDefaults }
  });
}

}); // end DOMContentLoaded
