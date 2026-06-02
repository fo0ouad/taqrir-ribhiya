// ===== tables.js =====
// دوال الجداول والمودال والفلترة

// ===== MODAL: تفاصيل بند مصاريف =====
function openExpDetail(month, cat) {
  const detail = EXP_DETAILS[month] || {};
  const items = detail[cat] || [];
  const total = items.reduce((s, i) => s + i.amount, 0);
  
  document.getElementById('modal-title').textContent = cat + ' — ' + month;
  document.getElementById('modal-total').textContent = 'الإجمالي: ' + total.toLocaleString('ar-SA', {maximumFractionDigits:0}) + ' ر';
  
  let rows = '';
  if (items.length === 0) {
    rows = '<tr><td colspan="2" style="text-align:center;color:#94a3b8">لا توجد تفاصيل مسجلة</td></tr>';
  } else {
    items.forEach(i => {
      rows += `<tr><td style="text-align:right">${i.name}</td><td style="font-weight:700">${i.amount.toLocaleString('ar-SA', {maximumFractionDigits:0})} ر</td></tr>`;
    });
  }
  
  document.getElementById('modal-body').innerHTML = `
    <table>
      <thead><tr><th>البند</th><th>المبلغ (ريال)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  
  document.getElementById('modal-box').classList.remove('month-modal');
  document.getElementById('modal-overlay').classList.add('open');
}

// ===== MODAL: تفاصيل شهر كامل =====
function openMonthDetail(month) {
  const d = MONTHLY_DETAIL[month];
  if (!d) return;
  
  const profitColor = d.profit >= 0 ? '#16a34a' : '#dc2626';
  
  // تفاصيل المصاريف
  let expRows = '';
  const expBreak = d.exp_breakdown || {};
  CATS.forEach(cat => {
    const items = expBreak[cat] || [];
    const total = items.reduce((s, i) => s + i.amount, 0);
    if (total > 0) {
      expRows += `<tr>
        <td style="text-align:right;font-weight:600;color:${CAT_COLORS[cat]}">${cat}</td>
        <td style="font-weight:700">${total.toLocaleString('ar-SA', {maximumFractionDigits:0})} ر</td>
      </tr>`;
      items.forEach(i => {
        expRows += `<tr style="background:#f8faff"><td style="text-align:right;padding-right:24px;color:#64748b;font-size:0.82rem">↳ ${i.name}</td><td style="color:#475569;font-size:0.82rem">${i.amount.toLocaleString('ar-SA', {maximumFractionDigits:0})} ر</td></tr>`;
      });
    }
  });
  
  // قائمة الخياطين
  let tailorRows = '';
  const tailors = d.tailors_list || TAILORS_V2[month] || [];
  tailors.forEach(t => {
    tailorRows += `<tr><td style="text-align:right">${t.name}</td><td style="font-weight:700">${t.balance.toLocaleString('ar-SA', {maximumFractionDigits:0})} ر</td></tr>`;
  });
  
  // مشاكل وملاحظات
  let issuesHtml = '';
  (d.issues || []).forEach(iss => {
    issuesHtml += `<div class="issue-box">⚠️ ${iss}</div>`;
  });
  (d.notes || []).forEach(note => {
    issuesHtml += `<div class="note-box">📌 ${note}</div>`;
  });
  if (!issuesHtml) issuesHtml = '<div class="note-box">✅ لا توجد مشاكل تشغيلية بارزة هذا الشهر</div>';
  
  document.getElementById('modal-title').textContent = '📅 تقرير ' + month + ' التفصيلي';
  document.getElementById('modal-total').innerHTML = '';
  
  // دالة مساعدة لعرض نسبة التغيير
  const changeBadge = (val, isExpense) => {
    if (val === null || val === undefined) return '';
    const positive = isExpense ? val <= 0 : val >= 0;
    const color = positive ? '#16a34a' : '#dc2626';
    const bg = positive ? '#dcfce7' : '#fee2e2';
    const arrow = val >= 0 ? '▲' : '▼';
    return `<span style="font-size:0.75rem;font-weight:700;color:${color};margin-right:6px;background:${bg};padding:2px 6px;border-radius:10px">${arrow} ${Math.abs(val)}%</span>`;
  };
  
  // فجوة السيولة
  const liqGap = d.liquidity_gap || 0;
  const liqColor = liqGap > 0 ? '#dc2626' : '#16a34a';
  const liqLabel = liqGap > 0 ? 'عجز نقدي — يحتاج تمويل خارجي' : 'فائض نقدي';
  const liqIcon = liqGap > 0 ? '⚠️' : '✅';
  
  // المقاييس الثلاثة
  const m1 = d.metric1 || 0;
  const m2 = d.metric2 || 0;
  const m3 = d.metric3 || 0;
  const m1c = m1 >= 0 ? '#16a34a' : '#dc2626';
  const m2c = m2 >= 0 ? '#16a34a' : '#dc2626';
  const m3c = m3 >= 0 ? '#16a34a' : '#dc2626';
  const fmtNum = v => (v>=0?'+':'')+v.toLocaleString('ar-SA',{maximumFractionDigits:0});
  
  document.getElementById('modal-body').innerHTML = `
    <div class="month-kpi">
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#3B82F6">${d.revenue.toLocaleString('ar-SA', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">الإيرادات (ريال) ${changeBadge(d.revenue_change)}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#F59E0B">${d.expenses.toLocaleString('ar-SA', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">إجمالي المصاريف (ريال) ${changeBadge(d.expenses_change, true)}</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#10B981">${d.gross_margin.toLocaleString('ar-SA', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">هامش 15% التقديري (ريال)</div>
      </div>
    </div>
    <div style="background:#f8faff;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;margin-bottom:14px">
      <div style="font-size:0.78rem;font-weight:700;color:#64748b;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:6px">المقاييس المالية الثلاثة</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        <div style="text-align:center;padding:10px;background:white;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:1.1rem;font-weight:800;color:${m1c}">${fmtNum(m1)}</div>
          <div style="font-size:0.7rem;color:#64748b;margin-top:3px">ربح تقديري</div>
          <div style="font-size:0.65rem;color:#94a3b8">هامش 15% − مصاريف</div>
        </div>
        <div style="text-align:center;padding:10px;background:white;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:1.1rem;font-weight:800;color:${m2c}">${fmtNum(m2)}</div>
          <div style="font-size:0.7rem;color:#64748b;margin-top:3px">فائض تشغيلي</div>
          <div style="font-size:0.65rem;color:#94a3b8">مبيعات − مصاريف</div>
        </div>
        <div style="text-align:center;padding:10px;background:white;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:1.1rem;font-weight:800;color:${m3c}">${fmtNum(m3)}</div>
          <div style="font-size:0.7rem;color:#64748b;margin-top:3px">فائض نقدي صافي</div>
          <div style="font-size:0.65rem;color:#94a3b8">مبيعات − مصاريف − موردين</div>
        </div>
      </div>
    </div>
    <div class="month-kpi">
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#EF4444">${d.suppliers_paid.toLocaleString('ar-SA', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">مدفوع للموردين (ريال)</div>
      </div>
      <div class="month-kpi-card">
        <div class="month-kpi-val" style="color:#8B5CF6">${d.tailors_balance.toLocaleString('ar-SA', {maximumFractionDigits:0})}</div>
        <div class="month-kpi-lbl">رصيد الخياطين (ريال)</div>
      </div>
    </div>
    
    <div style="background:${liqGap>0?'#fef2f2':'#f0fdf4'};border:1px solid ${liqGap>0?'#fca5a5':'#86efac'};border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700;color:${liqColor}">${liqIcon} ${liqLabel}</span>
      <span style="font-size:1.1rem;font-weight:800;color:${liqColor}">${Math.abs(liqGap).toLocaleString('ar-SA',{maximumFractionDigits:0})} ر</span>
    </div>
    
    <div class="section-title">🔍 التشخيص والملاحظات</div>
    ${issuesHtml}
    
    <div class="section-title">💸 تفصيل المصاريف</div>
    <table><thead><tr><th>الفئة / البند</th><th>المبلغ</th></tr></thead><tbody>${expRows}</tbody></table>
    
    ${tailorRows ? `<div class="section-title">✂️ رصيد الخياطين</div>
    <table><thead><tr><th>الخياط</th><th>الرصيد</th></tr></thead><tbody>${tailorRows}</tbody></table>` : ''}
  `;
  
  document.getElementById('modal-box').classList.add('month-modal');
  document.getElementById('modal-overlay').classList.add('open');
}

// ===== MODAL: إغلاق =====
function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalBtn();
}
function closeModalBtn() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal-box').classList.remove('month-modal');
}

// ===== SUPPLIERS FILTER =====
let currentStatusFilter = 'الكل';
function filterSuppliers() {
  const search = document.getElementById('supplier-search-input').value.trim().toLowerCase();
  document.querySelectorAll('.supplier-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const status = card.dataset.status;
    const matchSearch = !search || name.includes(search);
    const matchStatus = currentStatusFilter === 'الكل' || status === currentStatusFilter;
    card.style.display = matchSearch && matchStatus ? '' : 'none';
  });
}
function filterByStatus(status, btn) {
  currentStatusFilter = status;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterSuppliers();
}

// ===== CUSTOMERS FILTER =====
function filterCustomers() {
  const search = document.getElementById('customer-search-input').value.trim().toLowerCase();
  document.querySelectorAll('#customers-tbody tr').forEach(row => {
    const name = row.cells[1]?.textContent.toLowerCase() || '';
    row.style.display = !search || name.includes(search) ? '' : 'none';
  });
}

// ===== TABLE SORT =====
function sortTable(tableId, col) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const asc = table.dataset.sortCol == col && table.dataset.sortDir === 'asc';
  table.dataset.sortCol = col;
  table.dataset.sortDir = asc ? 'desc' : 'asc';
  rows.sort((a, b) => {
    const av = a.cells[col]?.textContent.replace(/[,+%ر—]/g, '').trim() || '';
    const bv = b.cells[col]?.textContent.replace(/[,+%ر—]/g, '').trim() || '';
    const an = parseFloat(av), bn = parseFloat(bv);
    if (!isNaN(an) && !isNaN(bn)) return asc ? bn - an : an - bn;
    return asc ? bv.localeCompare(av, 'ar') : av.localeCompare(bv, 'ar');
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ===== YEAR FILTER =====
function filterByYear(year) {
  const rows = document.querySelectorAll('#summary-tbody tr');
  rows.forEach(row => {
    const month = row.cells[0] ? row.cells[0].textContent.trim() : '';
    if (year === 'all') {
      row.style.display = '';
    } else if (year === '2025') {
      row.style.display = month.includes('25') ? '' : 'none';
    } else if (year === '2026') {
      row.style.display = month.includes('26') ? '' : 'none';
    }
  });
  // تحديث أزرار الفلترة
  ['all','2025','2026'].forEach(y => {
    const btn = document.getElementById('filter-' + y);
    if (btn) {
      btn.style.background = y === year ? '#1e3a5f' : '#fff';
      btn.style.color = y === year ? '#fff' : '#1e3a5f';
    }
  });
}

// ===== WOMEN SUPPLIERS FILTER =====
function filterWomenSuppliers(filter) {
  const btns = ['ws-filter-all','ws-filter-m','ws-filter-h','ws-filter-both'];
  btns.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.style.background = '#fff';
    btn.style.color = btn.id.includes('both') ? '#15803d' : '#1e3a5f';
  });
  const activeBtn = document.getElementById('ws-filter-' + filter);
  if (activeBtn) {
    activeBtn.style.background = activeBtn.id.includes('both') ? '#15803d' : '#1e3a5f';
    activeBtn.style.color = '#fff';
  }

  ['goods-suppliers-table','workshops-suppliers-table'].forEach(tableId => {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const hasM = row.getAttribute('data-branch-m') === 'true';
      const hasH = row.getAttribute('data-branch-h') === 'true';
      let show = true;
      if (filter === 'm') show = hasM;
      else if (filter === 'h') show = hasH;
      else if (filter === 'both') show = hasM && hasH;
      row.style.display = show ? '' : 'none';
    });
  });

  const showM = filter === 'all' || filter === 'm' || filter === 'both';
  const showH = filter === 'all' || filter === 'h' || filter === 'both';
  document.querySelectorAll('.branch-m-col').forEach(el => {
    el.style.display = showM ? '' : 'none';
  });
  document.querySelectorAll('.branch-h-col').forEach(el => {
    el.style.display = showH ? '' : 'none';
  });
}

function sortWomenTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const isAsc = table.getAttribute('data-sort-col') == colIndex && table.getAttribute('data-sort-dir') === 'asc';
  table.setAttribute('data-sort-col', colIndex);
  table.setAttribute('data-sort-dir', isAsc ? 'desc' : 'asc');
  rows.sort((a, b) => {
    const aVal = a.cells[colIndex]?.textContent.replace(/[,ر—]/g,'').trim() || '0';
    const bVal = b.cells[colIndex]?.textContent.replace(/[,ر—]/g,'').trim() || '0';
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) return isAsc ? bNum - aNum : aNum - bNum;
    return isAsc ? bVal.localeCompare(aVal, 'ar') : aVal.localeCompare(bVal, 'ar');
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ===== SWITCH TAB =====
function switchTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ===== INIT: Row numbers for customers =====
(function() {
  const rows = document.querySelectorAll('#customers-tbody tr');
  rows.forEach((r, i) => { if(r.cells[0]) r.cells[0].textContent = i+1; });
})();
