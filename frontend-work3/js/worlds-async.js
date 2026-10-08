let allWorlds = [];

function setControlsEnabled(enabled) {
  document.getElementById("search-input").disabled = !enabled;
  document.getElementById("grade-filter").disabled = !enabled;
  document.getElementById("reset-filter").disabled = !enabled;
}

function showMessageRow(text, extraNode) {
  const tbody = document.getElementById("worlds-tbody");
  tbody.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 6;
  td.className = "empty-row";
  td.textContent = text;
  if (extraNode) {
    td.appendChild(document.createElement("br"));
    td.appendChild(extraNode);
  }
  tr.appendChild(td);
  tbody.appendChild(tr);
}

function renderWorldsTable(worlds) {
  const tbody = document.getElementById("worlds-tbody");
  tbody.innerHTML = "";
  document.getElementById("worlds-count").textContent = worlds.length;
  worlds.forEach(function (w) {
    const tr = document.createElement("tr");
    [w.name, w.type, w.grade, w.tribute, w.cycle].forEach(function (val) {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    const statusTd = document.createElement("td");
    statusTd.textContent = w.status;
    statusTd.className = w.statusClass;
    tr.appendChild(statusTd);
    tbody.appendChild(tr);
  });
}

function filterWorlds() {
  const keyword = document.getElementById("search-input").value.trim().toLowerCase();
  const grade = document.getElementById("grade-filter").value;
  const filtered = allWorlds.filter(function (w) {
    const matchKeyword =
      !keyword ||
      w.name.toLowerCase().indexOf(keyword) !== -1 ||
      w.type.toLowerCase().indexOf(keyword) !== -1 ||
      w.tribute.toLowerCase().indexOf(keyword) !== -1;
    const matchGrade = !grade || w.grade === grade;
    return matchKeyword && matchGrade;
  });
  renderWorldsTable(filtered);
}

const loadWorlds = async () => {
  setControlsEnabled(false);
  showMessageRow("税籍档卷正在从本地档库调取，请稍候…");
  document.getElementById("worlds-count").textContent = 0;
  try {
    const response = await fetch("data/worlds.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("HTTP错误：" + response.status);
    }
    const data = await response.json();
    if (data.length === 0) {
      showMessageRow("暂无世界税籍数据。");
      return;
    }
    allWorlds = data;
    setControlsEnabled(true);
    renderWorldsTable(allWorlds);
  } catch (error) {
    const retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.className = "btn btn-outline btn-sm";
    retryBtn.style.marginTop = "8px";
    retryBtn.textContent = "重新调取";
    retryBtn.addEventListener("click", loadWorlds);
    showMessageRow("税籍档卷调取失败：" + error.message, retryBtn);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("search-input").addEventListener("input", filterWorlds);
  document.getElementById("grade-filter").addEventListener("change", filterWorlds);
  document.getElementById("reset-filter").addEventListener("click", function () {
    document.getElementById("search-input").value = "";
    document.getElementById("grade-filter").value = "";
    renderWorldsTable(allWorlds);
  });
  loadWorlds();
});
