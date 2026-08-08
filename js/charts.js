// ===== charts.js =====
// رسوم بيانية Chart.js — تعتمد على data.js و utils.js

document.addEventListener('DOMContentLoaded', function() {

// Chart 1: Revenue vs 15% margin — line chart, Primary 1 + Primary 2
const ctx1 = document.getElementById('ch-revenue');
if (ctx1) {
  new Chart(ctx1, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'الإيراد', data: REVENUES, borderColor: '#4E7CFF', backgroundColor: 'rgba(78,124,255,0.1)', borderWidth: 2.5, pointRadius: 3, fill: true, tension: 0.3 },
        { label: 'هامش 15%', data: GROSS_MARGINS, borderColor: '#7033FF', backgroundColor: 'rgba(112,51,255,0.08)', borderWidth: 2.5, pointRadius: 3, fill: false, tension: 0.3 }
      ]
    },
    options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, title: { display: false } } }
  });
}

// Chart 2: Net Profit/Loss — functional green/red only
const ctx2 = document.getElementById('ch-profit');
if (ctx2) {
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'صافي الربح/الخسارة',
        data: PROFIT_ACTUAL,
        backgroundColor: PROFIT_ACTUAL.map(v => v >= 0 ? 'rgba(21,128,61,0.75)' : 'rgba(185,28,28,0.75)'),
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
        { label: 'المدفوع للموردين', data: SUPPLIERS_PAID, backgroundColor: 'rgba(246,81,100,0.7)', borderRadius: 4 },
        { label: 'المشتريات', data: PURCHASES, backgroundColor: 'rgba(78,124,255,0.7)', borderRadius: 4 }
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
        borderColor: '#7033FF',
        backgroundColor: 'rgba(112,51,255,0.1)',
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
        borderColor: '#F65164',
        backgroundColor: 'rgba(246,81,100,0.1)',
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
