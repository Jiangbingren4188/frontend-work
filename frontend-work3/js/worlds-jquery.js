function renderWorldsTable(worlds) {
  const $tbody = $("#worlds-tbody").empty();
  $("#worlds-count").text(worlds.length);
  if (worlds.length === 0) {
    $tbody.html('<tr><td colspan="6" class="empty-row">未找到匹配的世界税籍记录。</td></tr>');
    return;
  }
  worlds.forEach(function (w) {
    const $tr = $("<tr>");
    $tr.append($("<td>").text(w.name));
    $tr.append($("<td>").text(w.type));
    $tr.append($("<td>").text(w.grade));
    $tr.append($("<td>").text(w.tribute));
    $tr.append($("<td>").text(w.cycle));
    $tr.append($("<td>").addClass(w.statusClass).text(w.status));
    $tbody.append($tr);
  });
}

function filterWorlds() {
  const keyword = $("#search-input").val().trim().toLowerCase();
  const grade = $("#grade-filter").val();
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

$(function () {
  renderWorldsTable(WORLDS_DATA);
  $("#search-input").on("input", filterWorlds);
  $("#grade-filter").on("change", filterWorlds);
  $("#reset-filter").on("click", function () {
    $("#search-input").val("");
    $("#grade-filter").val("");
    renderWorldsTable(WORLDS_DATA);
  });
});
