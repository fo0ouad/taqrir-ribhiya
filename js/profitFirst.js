// ===== profitFirst.js =====
// تقييم Profit First الفوري — يعتمد على data.js (MONTHS, REVENUES, PURCHASES, SUPPLIERS_PAID, EXPENSES, EXP_TOTALS)

(function () {
  const N = 12;
  const pfMonths = MONTHS.slice(-N);
  const sumLast = arr => (arr || []).slice(-N).reduce((a, b) => a + b, 0);

  const topLineRevenue = sumLast(REVENUES);
  const purchasesSum = sumLast(PURCHASES);
  const suppliersPaidSum = sumLast(SUPPLIERS_PAID);
  const taxSum = sumLast(EXP_TOTALS['الزكاة والدخل']);
  const familySum = sumLast(EXP_TOTALS['مصاريف عائلة']);

  // أجر المالك = رواتب محمد وهاني وسعيد (مسجّلة كبنود منفصلة داخل فئة "رواتب" في EXP_DETAILS)
  const OWNER_NAME_PREFIXES = ['راتب محمد', 'راتب هاني', 'راتب سعيد'];
  function ownerPayForMonth(month) {
    const rows = (EXP_DETAILS[month] && EXP_DETAILS[month]['رواتب']) || [];
    return rows.reduce((sum, r) => OWNER_NAME_PREFIXES.some(p => r.name.startsWith(p)) ? sum + r.amount : sum, 0);
  }
  const ownerPaySum = pfMonths.reduce((sum, m) => sum + ownerPayForMonth(m), 0);

  const opexSum = Math.max(sumLast(EXPENSES) - taxSum - familySum - ownerPaySum, 0);

  // الربح = عمود "ربح" في جدول الملخص الشهري (هامش 15% − مصاريف)، مجموع آخر 12 شهر
  const profitSum = sumLast(PROFIT_ACTUAL);

  document.getElementById('pfMonthsRange').textContent = pfMonths[0] + ' — ' + pfMonths[pfMonths.length - 1];

  // Figure 1 — Target Allocation Percentages by Real Revenue range
  const TAP = [
    { key: 'A', label: '٠ – ٢٥٠ ألف',     max: 250000,   profit: 5,  owner: 50, tax: 15, opex: 30 },
    { key: 'B', label: '٢٥٠ – ٥٠٠ ألف',   max: 500000,   profit: 10, owner: 35, tax: 15, opex: 40 },
    { key: 'C', label: '٥٠٠ ألف – مليون', max: 1000000,  profit: 15, owner: 20, tax: 15, opex: 50 },
    { key: 'D', label: '١ – ٥ مليون',     max: 5000000,  profit: 10, owner: 10, tax: 15, opex: 65 },
    { key: 'E', label: '٥ – ١٠ مليون',    max: 10000000, profit: 15, owner: 5,  tax: 15, opex: 65 },
    { key: 'F', label: '١٠ – ٥٠ مليون',   max: 50000000, profit: 20, owner: 0,  tax: 15, opex: 65 },
  ];
  function pickColumn(realRevenue) {
    for (const c of TAP) { if (c.key === 'F' || realRevenue < c.max) return c; }
    return TAP[TAP.length - 1];
  }

  const state = { materialSubs: purchasesSum, profit: profitSum, owner: ownerPaySum, tax: taxSum, opex: opexSum };
  const money = v => Math.round(v).toLocaleString('en-US');
  const BLEED_TOL = rr => Math.max(rr * 0.01, 2000);

  function render() {
    const active = document.activeElement;
    const activeId = (active && active.id && active.id.startsWith('pfInput-')) ? active.id : null;
    const selStart = activeId ? active.selectionStart : null;

    const realRevenue = topLineRevenue - state.materialSubs;
    const col = pickColumn(Math.max(realRevenue, 0));
    const cats = [
      { id: 'profit', label: 'الربح (Profit)', pct: col.profit },
      { id: 'owner', label: 'أجر المالك (Owner’s Pay)', pct: col.owner },
      { id: 'tax', label: 'الضريبة / الزكاة (Tax)', pct: col.tax },
      { id: 'opex', label: 'المصاريف التشغيلية (Operating Exp.)', pct: col.opex },
    ];

    document.getElementById('pfKpiTop').textContent = money(topLineRevenue);
    document.getElementById('pfKpiReal').textContent = money(realRevenue);
    document.getElementById('pfKpiCol').textContent = 'عمود ' + col.key + ' (' + col.label + ')';

    const sumFour = state.profit + state.owner + state.tax + state.opex;
    const diff = realRevenue - sumFour;
    const balanced = Math.abs(diff) < BLEED_TOL(topLineRevenue);
    document.getElementById('pfKpiBalance').textContent = fmtSigned(diff);
    document.getElementById('pfKpiBalance').style.color = balanced ? '#15803D' : '#B91C1C';
    document.getElementById('pfKpiBalanceCard').style.borderColor = balanced ? '#15803D' : '#B91C1C';

    let bleedCount = 0;
    let head = `<thead><tr><th>البند</th><th>الفعلي</th><th>PF%</th><th>PF$</th><th>الفجوة (Bleed)</th><th>الإجراء (Fix)</th></tr></thead>`;
    let body = '<tbody>';
    body += `<tr class="row-revenue">
      <td class="lbl">الإيراد الإجمالي (Top Line Revenue)</td>
      <td><input class="pf-input" type="text" readonly value="${money(topLineRevenue)}"></td>
      <td colspan="4" class="pf-neutral">—</td>
    </tr>`;
    body += `<tr class="row-revenue">
      <td class="lbl">المواد والمقاولون (Material &amp; Subs)</td>
      <td><input class="pf-input" type="number" id="pfInput-matsub" value="${Math.round(state.materialSubs)}"></td>
      <td colspan="4" class="pf-neutral">—</td>
    </tr>`;
    body += `<tr class="row-revenue">
      <td class="lbl">الإيراد الحقيقي (Real Revenue)</td>
      <td><input class="pf-input" type="text" readonly value="${money(realRevenue)}"></td>
      <td>100%</td><td colspan="3" class="pf-neutral">—</td>
    </tr>`;

    cats.forEach(c => {
      const pfDollar = realRevenue * c.pct / 100;
      const bleed = state[c.id] - pfDollar;
      if (Math.abs(bleed) > BLEED_TOL(realRevenue)) bleedCount++;
      const bleedCls = bleed < 0 ? 'pf-loss' : bleed > 0 ? 'pf-profit' : 'pf-neutral';
      const fixLabel = bleed < -1 ? 'زيادة ⬆️' : bleed > 1 ? 'تقليل ⬇️' : 'مضبوط ✅';
      const fixCls = bleed < -1 ? 'pf-loss' : bleed > 1 ? 'pf-neutral' : 'pf-profit';
      body += `<tr>
        <td class="lbl">${c.label}</td>
        <td><input class="pf-input" type="number" id="pfInput-${c.id}" value="${Math.round(state[c.id])}"></td>
        <td>${c.pct}%</td>
        <td>${money(pfDollar)}</td>
        <td class="${bleedCls}">${fmtSigned(bleed)}</td>
        <td class="${fixCls}"><strong>${fixLabel}</strong></td>
      </tr>`;
    });
    body += '</tbody>';
    document.getElementById('pfTable').innerHTML = head + body;
    document.getElementById('pfKpiBleedCount').textContent = bleedCount + ' / 4';

    document.getElementById('pfInput-matsub').addEventListener('input', e => { state.materialSubs = +e.target.value || 0; render(); });
    cats.forEach(c => {
      document.getElementById('pfInput-' + c.id).addEventListener('input', e => { state[c.id] = +e.target.value || 0; render(); });
    });

    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) { el.focus(); if (selStart != null) el.setSelectionRange(selStart, selStart); }
    }

    const noteEl = document.getElementById('pfBalanceNote');
    if (balanced) {
      noteEl.innerHTML = `<strong style="color:#15803D">✅ الأرقام متوازنة</strong> — مجموع (الربح + أجر المالك + الضريبة + المصاريف التشغيلية) يساوي تقريباً الإيراد الحقيقي.`;
    } else {
      noteEl.innerHTML = `<strong style="color:#B91C1C">⚠️ فرق توازن قدره ${money(diff)} ريال</strong> — مجموع البنود الأربعة لا يساوي الإيراد الحقيقي. `
        + (diff > 0
          ? 'يعني في مبلغ غير مخصص رسمياً لأي بند حتى الآن — راجع الأرقام وعدّلها إذا لزم.'
          : 'يعني البنود الأربعة مجتمعة أكبر من الإيراد الحقيقي. سبب محتمل: بند "الربح" مبني على هامش 15% تقديري على كامل الإيراد، بينما "الإيراد الحقيقي" هنا مبني على تكلفة البضاعة الفعلية — الأساسان مختلفان. راجع الأرقام وعدّلها لتطابق واقعك.');
    }

    let tapHead = `<thead><tr><th>البند</th>${TAP.map(c => `<th class="${c.key === col.key ? 'selected' : ''}">${c.key}<br><span style="font-weight:400;font-size:.7rem">${c.label}</span></th>`).join('')}</tr></thead>`;
    const tapRows = [
      { label: 'الإيراد الحقيقي', field: null },
      { label: 'الربح', field: 'profit' },
      { label: 'أجر المالك', field: 'owner' },
      { label: 'الضريبة', field: 'tax' },
      { label: 'المصاريف التشغيلية', field: 'opex' },
    ];
    let tapBody = '<tbody>';
    tapRows.forEach(r => {
      tapBody += `<tr><td class="lbl">${r.label}</td>`;
      TAP.forEach(c => {
        const v = r.field ? c[r.field] + '%' : '100%';
        tapBody += `<td class="${c.key === col.key ? 'selected' : ''}">${v}</td>`;
      });
      tapBody += '</tr>';
    });
    tapBody += '</tbody>';
    document.getElementById('pfTapTable').innerHTML = tapHead + tapBody;

    const ctx = document.getElementById('pfBarChart');
    if (window._pfChart) window._pfChart.destroy();
    window._pfChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cats.map(c => c.label.split(' (')[0]),
        datasets: [
          { label: 'الفعلي', data: cats.map(c => state[c.id]), backgroundColor: 'rgba(30,58,95,.85)', borderRadius: 5 },
          { label: 'الهدف (PF$)', data: cats.map(c => realRevenue * c.pct / 100), backgroundColor: 'rgba(16,185,129,.55)', borderRadius: 5 },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { font: { family: 'Segoe UI, Tahoma, Arial' } } },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} ريال` } },
        },
        scales: {
          y: { ticks: { callback: v => (v / 1000) + 'K', font: { family: 'Segoe UI, Tahoma, Arial' } }, grid: { color: '#F5F7FB' } },
          x: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial' } } },
        },
      },
    });

    const insightsEl = document.getElementById('pfInsights');
    let insightsHtml = '';
    cats.forEach(c => {
      const pfDollar = realRevenue * c.pct / 100;
      const bleed = state[c.id] - pfDollar;
      if (Math.abs(bleed) <= BLEED_TOL(realRevenue)) return;
      const cls = bleed < 0 ? 'negative' : 'warning';
      const action = bleed < 0
        ? `زيادة التخصيص بمقدار ~${money(Math.abs(bleed))} ريال سنوياً`
        : `تقليل بمقدار ~${money(bleed)} ريال سنوياً`;
      insightsHtml += `<div class="quick-insight-card ${cls}">
        <div class="quick-insight-label">${bleed < 0 ? '📉' : '📈'} ${c.label}</div>
        <div class="quick-insight-value">${action}</div>
        <div class="quick-insight-note">للوصول للنسبة المستهدفة (${c.pct}% من الإيراد الحقيقي)</div>
      </div>`;
    });
    if (!insightsHtml) {
      insightsHtml = `<div class="quick-insight-card positive">
        <div class="quick-insight-label">✅ كل البنود قريبة من المستهدف</div>
        <div class="quick-insight-value">استمر بنفس التوزيع الحالي</div>
        <div class="quick-insight-note">راقب الأرقام كل 3 أشهر</div>
      </div>`;
    }
    insightsEl.innerHTML = insightsHtml;
  }

  document.getElementById('pfBasisSelect').addEventListener('change', e => {
    state.materialSubs = e.target.value === 'paid' ? suppliersPaidSum : purchasesSum;
    render();
  });

  render();
})();
