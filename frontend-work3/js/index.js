const GRADE_RULES = {
  hive: { grade: "Exactis Prima", rate: 0.12, unit: "兵员与武备" },
  forge: { grade: "Exactis Prima", rate: 0.15, unit: "武器与战舰" },
  agri: { grade: "Exactis Secundus", rate: 0.08, unit: "粮秣" },
  industrial: { grade: "Exactis Secundus", rate: 0.1, unit: "物资" },
  garden: { grade: "Exactis Tertius", rate: 0.05, unit: "圣油作物" },
  fief: { grade: "Aptus Non", rate: 0, unit: "豁免" },
  frontier: { grade: "Exactis Tertius", rate: 0.04, unit: "原料" }
};

function estimateTithe() {
  const type = document.getElementById("calc-type").value;
  const pop = parseFloat(document.getElementById("calc-pop").value);
  const resultEl = document.getElementById("calc-result");
  if (!type) {
    resultEl.textContent = "请先选择世界类型。";
    resultEl.className = "calc-result calc-warn";
    return;
  }
  if (isNaN(pop) || pop < 0) {
    resultEl.textContent = "请输入有效的人口基数（不小于 0）。";
    resultEl.className = "calc-result calc-warn";
    return;
  }
  const cfg = GRADE_RULES[type];
  if (cfg.grade === "Aptus Non") {
    resultEl.textContent = "该类世界享有 Aptus Non 豁免，无需缴纳什一税。";
    resultEl.className = "calc-result";
    return;
  }
  const amount = (pop * cfg.rate).toFixed(2);
  resultEl.textContent =
    "核定税级：" + cfg.grade +
    "；约征 " + amount + " 单位" + cfg.unit + "。";
  resultEl.className = "calc-result";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("calc-btn").addEventListener("click", estimateTithe);
});
