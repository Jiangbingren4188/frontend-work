function renderWorldsTable(worlds) {
  const tbody = document.getElementById("worlds-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const countEl = document.getElementById("worlds-count");
  if (countEl) {
    countEl.textContent = worlds.length;
  }
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
    const fields = [w.name, w.type, w.grade, w.tribute, w.cycle];
    fields.forEach(function (val) {
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
  const filtered = WORLDS_DATA.filter(function (w) {
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

document.addEventListener("DOMContentLoaded", function () {
  renderWorldsTable(WORLDS_DATA);
  document.getElementById("search-input").addEventListener("input", filterWorlds);
  document.getElementById("grade-filter").addEventListener("change", filterWorlds);
  document.getElementById("reset-filter").addEventListener("click", function () {
    document.getElementById("search-input").value = "";
    document.getElementById("grade-filter").value = "";
    renderWorldsTable(WORLDS_DATA);
  });
});
