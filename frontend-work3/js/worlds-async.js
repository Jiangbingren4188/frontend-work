let allWorlds = [];

function setControlsEnabled(enabled) {
  document.getElementById("search-input").disabled = !enabled;
  document.getElementById("grade-filter").disabled = !enabled;
  document.getElementById("reset-filter").disabled = !enabled;
}

function renderWorldsTable(worlds) {
  const tbody = document.getElementById("worlds-tbody");
  tbody.innerHTML = "";
  document.getElementById("worlds-count").textContent = worlds.length;
  if (worlds.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "empty-row";
    td.textContent = "未找到匹配的世界税籍记录。";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
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

function showLoadError(msg) {
  const tbody = document.getElementById("worlds-tbody");
  tbody.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 6;
  td.className = "load-error";
  td.textContent = "税籍档卷调取失败：" + msg + "（请确认通过本地服务器访问，且 data/worlds.json 存在）";
  tr.appendChild(td);
  tbody.appendChild(tr);
  document.getElementById("worlds-count").textContent = 0;
}

function loadWorlds() {
  fetch("data/worlds.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      allWorlds = data;
      setControlsEnabled(true);
      renderWorldsTable(allWorlds);
    })
    .catch(function (err) {
      setControlsEnabled(false);
      showLoadError(err.message);
    });
}

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
