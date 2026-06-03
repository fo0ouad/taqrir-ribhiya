import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// ألوان لوحة التحكم الموحدة والفاخرة
const C = {
  blue: 'rgba(15, 52, 96, 0.85)',
  bluelt: 'rgba(15, 52, 96, 0.12)',
  green: 'rgba(16, 185, 129, 0.85)',
  greenlt: 'rgba(16, 185, 129, 0.12)',
  orange: 'rgba(245, 158, 11, 0.85)',
  orangelt: 'rgba(245, 158, 11, 0.12)',
  red: 'rgba(239, 68, 68, 0.85)',
  redlt: 'rgba(239, 68, 68, 0.1)',
  purple: 'rgba(139, 92, 246, 0.85)',
  gray: 'rgba(107, 114, 128, 0.65)'
};

const font = {
  family: 'Tajawal, Segoe UI, Tahoma, sans-serif',
  size: 10
};

/**
 * تحديد لون العمود بناءً على قيمة الربح أو الخسارة
 * @param {Array} arr - القيم المالية
 */
function getProfitColors(arr) {
  return arr.map(v => v >= 0 ? C.green : C.red);
}

// لتخزين مرجع الرسوم البيانية ومنع إعادة إنشائها بشكل يسبب تداخلات
const chartInstances = {};

/**
 * تهيئة كافة الرسوم البيانية للتقرير
 * @param {Object} data - البيانات المالية
 * @param {Object} computed - البيانات المحسوبة (profitActual, profitSpread, opexActual, cashSurplus, supplierGap)
 */
export function initAllCharts(data, computed) {
  const { months, revenue, salaries, rent_actual, banking, utilities, transport, licensing, other, suppliers_paid, purchases, family } = data;
  const { profitActual, profitSpread, opexActual, cashSurplus, supplierGap } = computed;

  // تدمير الرسوم البيانية القديمة في حال إعادة التحميل لتجنب أخطاء تداخل الرسم
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
    }
  });

  // -----------------------------------------------------------------
  // 1. الربح والخسارة - الإيجار الفعلي
  // -----------------------------------------------------------------
  chartInstances.profitActual = new Chart(document.getElementById('profitActualChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'ربح/خسارة فعلية',
        data: profitActual,
        backgroundColor: getProfitColors(profitActual),
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw.toLocaleString()} ريال` } }
      },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 2. الربح والخسارة - الإيجار الموزع
  // -----------------------------------------------------------------
  chartInstances.profitSpread = new Chart(document.getElementById('profitSpreadChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'ربح/خسارة (موزّع)',
        data: profitSpread,
        backgroundColor: getProfitColors(profitSpread),
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw.toLocaleString()} ريال` } }
      },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 3. الكاش فلو - أين يذهب كل ريال من الإيراد (مكدّس)
  // -----------------------------------------------------------------
  chartInstances.cashFlow = new Chart(document.getElementById('cashFlowChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'موردون', data: suppliers_paid, backgroundColor: 'rgba(239, 68, 68, 0.75)' },
        { label: 'مصاريف تشغيل', data: opexActual, backgroundColor: 'rgba(245, 158, 11, 0.75)' },
        { label: 'عائلة', data: family, backgroundColor: 'rgba(139, 92, 246, 0.7)' },
        { label: 'فائض الكاش', data: cashSurplus.map(v => Math.max(v, 0)), backgroundColor: 'rgba(16, 185, 129, 0.7)', borderRadius: 3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font } }
      },
      scales: {
        x: { stacked: true, ticks: { font: { ...font, size: 9 } } },
        y: { stacked: true, ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 4. الفائض النقدي بعد كل المدفوعات
  // -----------------------------------------------------------------
  chartInstances.surplus = new Chart(document.getElementById('surplusChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'الفائض النقدي',
        data: cashSurplus,
        backgroundColor: getProfitColors(cashSurplus),
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 5. مدفوع للموردين مقابل المشتريات الفعلية
  // -----------------------------------------------------------------
  chartInstances.supVsPurch = new Chart(document.getElementById('supVsPurchChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'مدفوع للموردين', data: suppliers_paid, backgroundColor: C.red, borderRadius: 4 },
        { label: 'مشتريات فعلية', data: purchases, backgroundColor: C.orange, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font } } },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 6. كعكة المصاريف التشغيلية الكلية (Pie Chart)
  // -----------------------------------------------------------------
  const expTotals = {
    'رواتب': salaries.reduce((a, b) => a + b, 0),
    'إيجار': rent_actual.reduce((a, b) => a + b, 0),
    'مرافق': utilities.reduce((a, b) => a + b, 0),
    'رسوم بنكية': banking.reduce((a, b) => a + b, 0),
    'نقل': transport.reduce((a, b) => a + b, 0),
    'تراخيص': licensing.reduce((a, b) => a + b, 0),
    'أخرى': other.reduce((a, b) => a + b, 0)
  };

  chartInstances.expPie = new Chart(document.getElementById('expPieChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(expTotals),
      datasets: [{
        data: Object.values(expTotals),
        backgroundColor: [C.blue, C.red, C.orange, C.purple, '#22c55e', '#14b8a6', '#6b7280'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font, padding: 12 } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw.toLocaleString()} ريال` } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 7. تطور أكبر بنود المصاريف شهرياً
  // -----------------------------------------------------------------
  chartInstances.expTrend = new Chart(document.getElementById('expTrendChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'رواتب', data: salaries, borderColor: C.blue, fill: false, tension: .3, pointRadius: 3 },
        { label: 'إيجار', data: rent_actual, borderColor: C.red, fill: false, tension: .3, pointRadius: 4 },
        { label: 'رسوم بنكية', data: banking, borderColor: C.purple, fill: false, tension: .3, pointRadius: 3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font } } },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 8. تفصيل المصاريف شهرياً (مكدّس)
  // -----------------------------------------------------------------
  chartInstances.expStack = new Chart(document.getElementById('expStackChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'رواتب', data: salaries, backgroundColor: C.blue },
        { label: 'إيجار', data: rent_actual, backgroundColor: C.red },
        { label: 'مرافق', data: utilities, backgroundColor: C.orange },
        { label: 'رسوم بنكية', data: banking, backgroundColor: C.purple },
        { label: 'أخرى', data: other.map((v, i) => v + transport[i] + licensing[i]), backgroundColor: 'rgba(107, 114, 128, 0.6)' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font, padding: 10 } } },
      scales: {
        x: { stacked: true, ticks: { font: { ...font, size: 9 } } },
        y: { stacked: true, ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 9. تشخيص - نسبة كل بند من الإيراد الشهري
  // -----------------------------------------------------------------
  chartInstances.ratio = new Chart(document.getElementById('ratioChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'موردون / إيراد', data: suppliers_paid.map((v, i) => +(v / revenue[i] * 100).toFixed(1)), borderColor: C.red, fill: false, tension: .3, pointRadius: 3 },
        { label: 'مصاريف تشغيل / إيراد', data: opexActual.map((v, i) => +(v / revenue[i] * 100).toFixed(1)), borderColor: C.orange, fill: false, tension: .3, pointRadius: 3 },
        { label: 'هامش إجمالي 15%', data: months.map(() => 15), borderColor: C.green, borderDash: [5, 5], fill: false, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font } } },
      scales: {
        y: { ticks: { callback: v => v + '%', font }, grid: { color: '#f1f5f9' }, min: 0 },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });

  // -----------------------------------------------------------------
  // 10. تشخيص - فجوة الموردين (مدفوع - مشتريات)
  // -----------------------------------------------------------------
  chartInstances.gap = new Chart(document.getElementById('gapChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'فجوة (مدفوع − مشتريات)',
        data: supplierGap,
        backgroundColor: supplierGap.map(v => v > 0 ? C.red : C.green),
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const raw = ctx.raw;
              return `${raw > 0 ? 'سداد ديون قديمة: ' : 'استدانة جديدة: '}${Math.abs(raw).toLocaleString()} ريال`;
            }
          }
        }
      },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'K', font }, grid: { color: '#f1f5f9' } },
        x: { ticks: { font: { ...font, size: 9 } } }
      }
    }
  });
}
