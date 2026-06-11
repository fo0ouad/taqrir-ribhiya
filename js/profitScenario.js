const DEFAULT_SCENARIO = {
  expenses: 30000,
  capital: 50000,
  turnover: 4,
  costMarginPct: 20,
  investorSharePct: 10
};

const EXCEL_SCENARIOS = [
  { name: "السناريو الحالي", expenses: 30000, capital: 38000, turnover: 104350 / 38000, costMarginPct: 7.74, investorSharePct: 10 },
  { name: "رأس مال إضافي", expenses: 30000, capital: 160000, turnover: 104350 / 38000, costMarginPct: 7.74, investorSharePct: 10 },
  { name: "رفع الهامش", expenses: 30000, capital: 38000, turnover: 104350 / 38000, costMarginPct: 32, investorSharePct: 10 },
  { name: "رفع التدوير", expenses: 30000, capital: 38000, turnover: 12, costMarginPct: 7.74, investorSharePct: 10 },
  { name: "السيناريو المختلط", expenses: 30000, capital: 50000, turnover: 4, costMarginPct: 20, investorSharePct: 10 }
];

const fields = {
  expenses: document.getElementById("expense-input"),
  capital: document.getElementById("capital-input"),
  turnover: document.getElementById("turnover-input"),
  costMarginPct: document.getElementById("cost-margin-input"),
  investorSharePct: document.getElementById("investor-share-input"),
  capitalSlider: document.getElementById("capital-slider"),
  turnoverSlider: document.getElementById("turnover-slider"),
  marginSlider: document.getElementById("margin-slider")
};

function numberValue(input) {
  return Number(input.value) || 0;
}

function money(value) {
  return `${Math.round(value).toLocaleString("en-US")} ر`;
}

function signedMoney(value) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")} ر`;
}

function pct(value, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

function readScenario() {
  return {
    expenses: numberValue(fields.expenses),
    capital: numberValue(fields.capital),
    turnover: numberValue(fields.turnover),
    costMarginPct: numberValue(fields.costMarginPct),
    investorSharePct: numberValue(fields.investorSharePct)
  };
}

function calculateScenario(scenario) {
  const costMargin = scenario.costMarginPct / 100;
  const investorShare = scenario.investorSharePct / 100;
  const goodsTotal = scenario.capital * scenario.turnover;
  const salesTotal = goodsTotal * (1 + costMargin);
  const grossMargin = salesTotal - goodsTotal;
  const investorAmount = grossMargin * investorShare;
  const afterInvestor = grossMargin - investorAmount;
  const netProfit = afterInvestor - scenario.expenses;
  const profitMarginOnSales = salesTotal ? netProfit / salesTotal : 0;
  const effectiveMargin = costMargin * (1 - investorShare);
  const requiredGoods = effectiveMargin ? scenario.expenses / effectiveMargin : Infinity;
  const requiredTurnover = scenario.capital ? requiredGoods / scenario.capital : Infinity;
  const requiredCapital = scenario.turnover ? requiredGoods / scenario.turnover : Infinity;
  const requiredMarginPct = scenario.capital && scenario.turnover && (1 - investorShare)
    ? (scenario.expenses / (scenario.capital * scenario.turnover * (1 - investorShare))) * 100
    : Infinity;

  return {
    goodsTotal,
    salesTotal,
    grossMargin,
    investorAmount,
    afterInvestor,
    netProfit,
    profitMarginOnSales,
    requiredTurnover,
    requiredCapital,
    requiredMarginPct
  };
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function updateLinkedControls(source) {
  if (source === fields.capital) fields.capitalSlider.value = fields.capital.value;
  if (source === fields.capitalSlider) fields.capital.value = fields.capitalSlider.value;
  if (source === fields.turnover) fields.turnoverSlider.value = fields.turnover.value;
  if (source === fields.turnoverSlider) fields.turnover.value = fields.turnoverSlider.value;
  if (source === fields.costMarginPct) fields.marginSlider.value = fields.costMarginPct.value;
  if (source === fields.marginSlider) fields.costMarginPct.value = fields.marginSlider.value;
}

function updateScenario(source) {
  updateLinkedControls(source);
  const scenario = readScenario();
  const result = calculateScenario(scenario);
  const positive = result.netProfit >= 0;

  setText("goods-total", money(result.goodsTotal));
  setText("sales-total", money(result.salesTotal));
  setText("gross-margin", money(result.grossMargin));
  setText("investor-amount", money(result.investorAmount));
  setText("after-investor", money(result.afterInvestor));
  setText("net-profit", signedMoney(result.netProfit));
  setText("required-turnover", Number.isFinite(result.requiredTurnover) ? result.requiredTurnover.toFixed(2) : "—");
  setText("required-margin", Number.isFinite(result.requiredMarginPct) ? pct(result.requiredMarginPct, 2) : "—");
  setText("required-capital", Number.isFinite(result.requiredCapital) ? money(result.requiredCapital) : "—");

  const status = document.getElementById("scenario-status");
  status.textContent = positive ? "رابح" : "خاسر";
  status.className = `scenario-status ${positive ? "positive" : "negative"}`;

  const netProfit = document.getElementById("net-profit");
  netProfit.className = `scenario-profit ${positive ? "positive" : "negative"}`;

  const progress = Math.min(100, Math.abs(result.netProfit) / Math.max(scenario.expenses, 1) * 100);
  const bar = document.getElementById("profit-bar");
  bar.style.width = `${progress}%`;
  bar.className = positive ? "positive" : "negative";

  document.getElementById("scenario-message").textContent = positive
    ? `السيناريو يغطي المصاريف ويحقق فائضاً قدره ${signedMoney(result.netProfit)}.`
    : `السيناريو لا يغطي المصاريف، والفجوة الحالية ${signedMoney(result.netProfit)}.`;

  renderNotes(scenario, result);
}

function renderNotes(scenario, result) {
  const notes = [];
  if (result.netProfit >= 0) {
    notes.push(`المحل رابح عند هذه المدخلات، وصافي الهامش على المبيع يساوي ${pct(result.profitMarginOnSales * 100, 2)}.`);
  } else {
    notes.push(`للوصول للتعادل بنفس رأس المال والهامش، التدوير يحتاج أن يصل إلى ${result.requiredTurnover.toFixed(2)} تقريباً.`);
  }
  notes.push(`كل نقطة هامش إضافية ترفع النتيجة بنحو ${money(scenario.capital * scenario.turnover * 0.01 * (1 - scenario.investorSharePct / 100))}.`);
  notes.push(`كل تدويرة إضافية تضيف نحو ${money(scenario.capital * (scenario.costMarginPct / 100) * (1 - scenario.investorSharePct / 100))} بعد حصة المستثمر.`);

  document.getElementById("scenario-notes").innerHTML = notes.map(note => `<li>${note}</li>`).join("");
}

function renderComparison() {
  const rows = EXCEL_SCENARIOS.map(scenario => {
    const result = calculateScenario(scenario);
    const positive = result.netProfit >= 0;
    return `
      <tr>
        <td>${scenario.name}</td>
        <td>${money(scenario.expenses)}</td>
        <td>${money(scenario.capital)}</td>
        <td>${scenario.turnover.toFixed(2)}</td>
        <td>${pct(scenario.costMarginPct, 2)}</td>
        <td class="${positive ? "scenario-green" : "scenario-red"}">${signedMoney(result.netProfit)}</td>
        <td><span class="scenario-pill ${positive ? "positive" : "negative"}">${positive ? "رابح" : "خاسر"}</span></td>
      </tr>
    `;
  });
  document.getElementById("scenario-comparison").innerHTML = rows.join("");
}

function resetScenario() {
  fields.expenses.value = DEFAULT_SCENARIO.expenses;
  fields.capital.value = DEFAULT_SCENARIO.capital;
  fields.turnover.value = DEFAULT_SCENARIO.turnover;
  fields.costMarginPct.value = DEFAULT_SCENARIO.costMarginPct;
  fields.investorSharePct.value = DEFAULT_SCENARIO.investorSharePct;
  fields.capitalSlider.value = DEFAULT_SCENARIO.capital;
  fields.turnoverSlider.value = DEFAULT_SCENARIO.turnover;
  fields.marginSlider.value = DEFAULT_SCENARIO.costMarginPct;
  updateScenario();
}

Object.values(fields).forEach(field => {
  field.addEventListener("input", event => updateScenario(event.target));
});

document.getElementById("reset-scenario").addEventListener("click", resetScenario);

renderComparison();
resetScenario();
