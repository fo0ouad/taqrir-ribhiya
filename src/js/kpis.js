/**
 * تنسيق الأرقام بطريقة مبسطة (مثال: +120K أو -2.4M)
 * @param {number} val - القيمة الرقمية
 * @returns {string}
 */
export function formatValue(val) {
  const abs = Math.abs(val);
  const sign = val >= 0 ? "+" : "−";
  if (abs >= 1000000) {
    return sign + (abs / 1000000).toFixed(2) + "M";
  }
  if (abs >= 1000) {
    return sign + Math.round(abs / 1000) + "K";
  }
  return sign + abs.toLocaleString();
}

/**
 * حساب وعرض مؤشرات الأداء (KPIs) لتبويب الربح والخسارة
 * @param {Object} data - البيانات المستوردة من financials.json
 * @param {Array} profitActual - مصفوفة صافي الأرباح الفعلية شهرياً
 */
export function renderPlKpis(data, profitActual) {
  let totalProfit = 0;
  let totalLoss = 0;
  let profitMonthsCount = 0;

  profitActual.forEach((p) => {
    if (p >= 0) {
      totalProfit += p;
      profitMonthsCount++;
    } else {
      totalLoss += p;
    }
  });

  const net = totalProfit + totalLoss;
  const avgMargin = profitActual.reduce((s, p, i) => s + (p / data.revenue[i] * 100), 0) / data.months.length;

  document.getElementById("kpiTotalProfit").textContent = "+" + Math.round(totalProfit / 1000) + "K";
  document.getElementById("kpiTotalLoss").textContent = "−" + Math.round(Math.abs(totalLoss) / 1000) + "K";
  document.getElementById("kpiNet").textContent = formatValue(net);
  document.getElementById("kpiProfitMonths").textContent = `${profitMonthsCount} / ${data.months.length}`;
  document.getElementById("kpiAvgMargin").textContent = (avgMargin >= 0 ? "+" : "") + avgMargin.toFixed(1) + "%";
}

/**
 * حساب وعرض مؤشرات الأداء (KPIs) لتبويب ضغط الكاش فلو ديناميكياً
 * @param {Object} data - البيانات المستوردة من financials.json
 * @param {Array} opexActual - مصفوفة المصاريف التشغيلية الفعلية
 */
export function renderCashKpis(data, opexActual) {
  const sum = arr => arr.reduce((a, b) => a + b, 0);

  const totalRev = sum(data.revenue);
  const totalPaid = sum(data.suppliers_paid);
  const totalOpex = sum(opexActual);
  const totalPurch = sum(data.purchases);
  const totalGap = totalPurch - totalPaid; // فجوة الموردين

  // جلب العناصر وعرضها ديناميكياً
  const kpis = document.querySelectorAll("#tab-cash .kpi-val");
  if (kpis.length >= 5) {
    kpis[0].textContent = (totalRev / 1000000).toFixed(2) + "M";
    kpis[1].textContent = (totalPaid / 1000000).toFixed(2) + "M";
    kpis[2].textContent = Math.round(totalOpex / 1000) + "K";
    kpis[3].textContent = (totalPurch / 1000000).toFixed(2) + "M";
    
    // تنسيق الفجوة (تخزين قيمة الفرق)
    const gapVal = totalPaid - totalPurch;
    kpis[4].textContent = formatValue(-gapVal); // سيظهر علامة السالب عند استنزاف الكاش
  }
}
