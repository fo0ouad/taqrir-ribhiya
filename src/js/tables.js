/**
 * توليد وبناء جدول قائمة الأرباح والخسائر (P&L Table)
 * @param {Object} data - البيانات الأساسية
 * @param {Object} computed - البيانات المحسوبة
 */
export function renderPlTable(data, computed) {
  const plTbl = document.getElementById('plTable');
  if (!plTbl) return;

  const { months, revenue, faida, salaries, rent_actual, utilities, banking, transport, licensing, other, family } = data;
  const { opexActual, profitActual, profitSpread, profitPct, profitSpreadPct } = computed;

  const plHead = `<thead><tr>
    <th>الشهر</th><th>الإيرادات</th><th>الهامش 15%</th>
    <th>رواتب</th><th>إيجار</th><th>مرافق</th><th>بنكية</th><th>أخرى</th>
    <th>مصاريف عائلة</th><th>إجمالي تشغيلي</th>
    <th>ربح/خسارة (إيجار فعلي)</th><th>%</th>
    <th>ربح/خسارة (موزّع)</th><th>%</th>
  </tr></thead>`;

  let plBody = '<tbody>';
  months.forEach((m, i) => {
    const isHighRev = revenue[i] >= 400000;
    const isLowRev = revenue[i] <= 200000;
    const rowClass = isHighRev ? 'highlight-green' : isLowRev ? 'highlight-red' : '';
    
    const pCls = profitActual[i] >= 0 ? 'profit' : 'loss';
    const psCls = profitSpread[i] >= 0 ? 'profit' : 'loss';
    const rentClass = rent_actual[i] > 40000 ? 'warn' : '';
    
    // بند "أخرى" يدمج النقل والتراخيص ومصاريف أخرى
    const otherMerged = transport[i] + licensing[i] + other[i];

    plBody += `<tr class="${rowClass}">
      <td class="lbl">${m}</td>
      <td>${revenue[i].toLocaleString()}</td>
      <td>${faida[i].toLocaleString()}</td>
      <td>${salaries[i].toLocaleString()}</td>
      <td class="${rentClass}">${rent_actual[i].toLocaleString()}</td>
      <td>${utilities[i].toLocaleString()}</td>
      <td>${banking[i] > 10000 ? `<span class="loss">${banking[i].toLocaleString()}</span>` : banking[i].toLocaleString()}</td>
      <td>${otherMerged.toLocaleString()}</td>
      <td class="${family[i] > 0 ? 'neutral' : ''}">${family[i] > 0 ? family[i].toLocaleString() : '—'}</td>
      <td><strong>${opexActual[i].toLocaleString()}</strong></td>
      <td class="${pCls}">${profitActual[i] >= 0 ? '+' : ''}${profitActual[i].toLocaleString()}</td>
      <td class="${pCls}">${profitPct[i]}%</td>
      <td class="${psCls}">${profitSpread[i] >= 0 ? '+' : ''}${profitSpread[i].toLocaleString()}</td>
      <td class="${psCls}">${profitSpreadPct[i]}%</td>
    </tr>`;
  });
  plBody += '</tbody>';
  plTbl.innerHTML = plHead + plBody;
}

/**
 * توليد جدول التدفقات النقدية (Cash Flow Table)
 * @param {Object} data - البيانات الأساسية
 * @param {Object} computed - البيانات المحسوبة
 */
export function renderCashTable(data, computed) {
  const cashTbl = document.getElementById('cashTable');
  if (!cashTbl) return;

  const { months, revenue, suppliers_paid, family, purchases } = data;
  const { opexActual, cashSurplus, supplierGap } = computed;

  const cashHead = `<thead><tr>
    <th>الشهر</th><th>الإيرادات</th><th>المدفوع للموردين</th><th>المصاريف التشغيلية</th>
    <th>مصاريف العائلة</th><th>الفائض النقدي</th><th>% من الإيراد</th><th>المشتريات</th><th>فجوة الموردين</th>
  </tr></thead>`;

  let cashBody = '<tbody>';
  months.forEach((m, i) => {
    const surp = cashSurplus[i];
    const gap = supplierGap[i];
    
    const surpCls = surp > 5000 ? 'profit' : surp < 0 ? 'loss' : 'neutral';
    const gapCls = gap > 50000 ? 'loss' : gap < -50000 ? 'profit' : 'neutral';

    cashBody += `<tr>
      <td class="lbl">${m}</td>
      <td>${revenue[i].toLocaleString()}</td>
      <td>${suppliers_paid[i].toLocaleString()}</td>
      <td>${opexActual[i].toLocaleString()}</td>
      <td>${family[i] > 0 ? family[i].toLocaleString() : '—'}</td>
      <td class="${surpCls}">${surp >= 0 ? '+' : ''}${surp.toLocaleString()}</td>
      <td class="${surpCls}">${(surp / revenue[i] * 100).toFixed(1)}%</td>
      <td>${purchases[i] > 0 ? purchases[i].toLocaleString() : '—'}</td>
      <td class="${gapCls}">${gap >= 0 ? '+' : ''}${gap.toLocaleString()}</td>
    </tr>`;
  });
  cashBody += '</tbody>';
  cashTbl.innerHTML = cashHead + cashBody;
}

/**
 * توليد جدول أكبر بنود المصاريف شهرياً
 * @param {Object} data - البيانات الأساسية
 */
export function renderExpenseTopTable(data) {
  const expTopTbl = document.getElementById('expTopTable');
  if (!expTopTbl) return;

  const { months, salaries, rent_actual, utilities, banking, transport, licensing, other } = data;
  const topCats = ['رواتب', 'إيجار', 'مرافق', 'رسوم بنكية', 'أخرى'];
  
  const expHead2 = `<thead><tr>
    <th>الشهر</th>
    ${topCats.map(c => `<th>${c}</th>`).join('')}
    <th>أكبر بند مصروف</th>
  </tr></thead>`;

  // مصفوفات البنود المقابلة للأعمدة
  const otherMergedArr = other.map((v, i) => v + transport[i] + licensing[i]);
  const expRows = [salaries, rent_actual, utilities, banking, otherMergedArr];

  let expBody = '<tbody>';
  months.forEach((m, i) => {
    const vals = expRows.map(r => r[i]);
    const maxIdx = vals.indexOf(Math.max(...vals));

    expBody += `<tr><td class="lbl">${m}</td>`;
    vals.forEach((v, j) => {
      expBody += `<td ${j === maxIdx ? 'class="warn"' : ''}>${v.toLocaleString()}</td>`;
    });
    expBody += `<td class="warn"><strong>${topCats[maxIdx]}</strong></td></tr>`;
  });
  expBody += '</tbody>';
  expTopTbl.innerHTML = expHead2 + expBody;
}

/**
 * توليد جدول تشخيص المشاكل والتقييم الشهري (Diagnosis Table)
 * @param {Object} data - البيانات الأساسية
 * @param {Object} computed - البيانات المحسوبة
 */
export function renderDiagnosisTable(data, computed) {
  const diagTbl = document.getElementById('diagTable');
  if (!diagTbl) return;

  const { months, revenue, rent_actual, salaries, faida } = data;
  const { profitActual, profitPct, cashSurplus } = computed;

  const diagHead = `<thead><tr>
    <th>الشهر</th><th>الإيرادات</th><th>ربح/خسارة</th><th>%</th>
    <th>ضغط الكاش</th><th>حمل الإيجار</th><th>الرواتب / الهامش</th><th>التقييم العام للشهر</th>
  </tr></thead>`;

  let diagBody = '<tbody>';
  months.forEach((m, i) => {
    const p = profitActual[i];
    const surp = cashSurplus[i];
    const rentLoad = (rent_actual[i] / revenue[i] * 100).toFixed(0);
    const salLoad = (salaries[i] / faida[i] * 100).toFixed(0);
    
    let status = '';
    let statusClass = '';

    if (revenue[i] < 200000 && p < 0) {
      status = '⚠️ ضعيف هيكلي';
      statusClass = 'loss';
    } else if (rent_actual[i] > 40000) {
      status = '🏠 شهر إيجار ضخم';
      statusClass = 'warn';
    } else if (p > 15000) {
      status = '✅ جيد ومستقر';
      statusClass = 'profit';
    } else if (p > 0) {
      status = '➕ هامشي موجب';
      statusClass = 'neutral';
    } else {
      status = '🔴 خسارة تشغيلية';
      statusClass = 'loss';
    }

    diagBody += `<tr>
      <td class="lbl">${m}</td>
      <td>${revenue[i].toLocaleString()}</td>
      <td class="${p >= 0 ? 'profit' : 'loss'}">${p >= 0 ? '+' : ''}${p.toLocaleString()}</td>
      <td class="${p >= 0 ? 'profit' : 'loss'}">${profitPct[i]}%</td>
      <td class="${surp > 5000 ? 'profit' : surp < 1000 ? 'loss' : 'neutral'}">${surp.toLocaleString()}</td>
      <td class="${rent_actual[i] > 40000 ? 'warn' : ''}">${rentLoad}%</td>
      <td class="${+salLoad > 100 ? 'loss' : +salLoad > 70 ? 'warn' : ''}">${salLoad}%</td>
      <td class="${statusClass}"><strong>${status}</strong></td>
    </tr>`;
  });
  diagBody += '</tbody>';
  diagTbl.innerHTML = diagHead + diagBody;
}
