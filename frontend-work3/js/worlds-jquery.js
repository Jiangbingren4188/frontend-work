function renderWorldsTable(worlds) {
  const $tbody = $("#worlds-tbody").empty();
  $("#worlds-count").text(worlds.length);
  if (worlds.length === 0) {
    $tbody.html('<tr><td colspan="6" class="empty-row">未找到匹配的世界税籍记录。</td></tr>');
    return;
  }
  $.each(worlds, function (i, w) {
    const $tr = $("<tr></tr>");
    $.each([w.name, w.type, w.grade, w.tribute, w.cycle], function (j, val) {
      $tr.append($("<td></td>").text(val));
    });
    $tr.append($("<td></td>").addClass(w.statusClass).text(w.status));
    $tbody.append($tr);
  });
}

function filterWorlds() {
  const keyword = $.trim($("#search-input").val()).toLowerCase();
  const grade = $("#grade-filter").val();
  const filtered = $.grep(WORLDS_DATA, function (w) {
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
