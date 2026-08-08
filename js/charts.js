// ===== charts.js =====
// رسوم بيانية Chart.js لتاب "نظرة عامة" — تعتمد على data.js و utils.js
// الشارتات هنا تُعاد رسمها عند تغيير فلتر الفترة الموحّد (انظر renderSummaryCharts في nav.js)

let chRevenueMargin = null;
let chProfitLoss = null;
let chExpensesTrend = null;

function summaryChartsRangeSlice(fromIdx, toIdx) {
  return {
    labels: MONTHS.slice(fromIdx, toIdx + 1),
    revenues: REVENUES.slice(fromIdx, toIdx + 1),
    margins: GROSS_MARGINS.slice(fromIdx, toIdx + 1),
    profits: PROFIT_ACTUAL.slice(fromIdx, toIdx + 1),
    expenses: EXPENSES.slice(fromIdx, toIdx + 1)
  };
}

function renderSummaryCharts(fromIdx, toIdx) {
  if (typeof MONTHS === 'undefined' || typeof Chart === 'undefined') return;
  const lo = Math.max(0, fromIdx ?? 0);
  const hi = Math.min(MONTHS.length - 1, toIdx ?? MONTHS.length - 1);
  const { labels, revenues, margins, profits, expenses } = summaryChartsRangeSlice(lo, hi);

  const ctx1 = document.getElementById('ch-revenue');
  if (ctx1) {
    if (chRevenueMargin) chRevenueMargin.destroy();
    chRevenueMargin = new Chart(ctx1, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'الإيراد', data: revenues, borderColor: '#4E7CFF', backgroundColor: 'rgba(78,124,255,0.1)', borderWidth: 2.5, pointRadius: 3, fill: true, tension: 0.3 },
          { label: 'هامش 15%', data: margins, borderColor: '#7033FF', backgroundColor: 'rgba(112,51,255,0.08)', borderWidth: 2.5, pointRadius: 3, fill: false, tension: 0.3 }
        ]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, title: { display: false } } }
    });
  }

  const ctx2 = document.getElementById('ch-profit');
  if (ctx2) {
    if (chProfitLoss) chProfitLoss.destroy();
    chProfitLoss = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'صافي الربح/الخسارة',
          data: profits,
          backgroundColor: profits.map(v => v >= 0 ? 'rgba(21,128,61,0.75)' : 'rgba(185,28,28,0.75)'),
          borderRadius: 4
        }]
      },
      options: { ...chartDefaults }
    });
  }

  const ctx3 = document.getElementById('ch-expenses');
  if (ctx3) {
    if (chExpensesTrend) chExpensesTrend.destroy();
    chExpensesTrend = new Chart(ctx3, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'المصاريف التشغيلية',
          data: expenses,
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
}

// أول رسم للشارتات يجي من tables.js عبر initSummaryTable() -> applySummaryRange()
// (نقطة تحكم واحدة بالفترة تغطي الكروت + الشارتات + الجدول معاً)
