function renderWorldsTable(worlds) {
  const tbody = document.getElementById("worlds-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
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

document.addEventListener("DOMContentLoaded", function () {
  renderWorldsTable(WORLDS_DATA);
});
