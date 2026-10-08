const STORAGE_KEY = "ultramar_tithe_records";

function getRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderRecords() {
  const container = document.getElementById("records-list");
  if (!container) return;
  const records = getRecords();
  container.innerHTML = "";
  if (records.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-note";
    p.textContent = "暂无已呈递的申报册记录。";
    container.appendChild(p);
    return;
  }
  records.forEach(function (r, idx) {
    const div = document.createElement("div");
    div.className = "record-item";
    const head = document.createElement("div");
    head.className = "record-head";
    const items = [
      { cls: "record-id", text: "#" + (idx + 1) },
      { cls: "record-world", text: r.world },
      { cls: "record-grade", text: r.gradeLabel },
      { cls: "record-date", text: r.submittedAt }
    ];
    items.forEach(function (it) {
      const span = document.createElement("span");
      span.className = it.cls;
      span.textContent = it.text;
      head.appendChild(span);
    });
    const body = document.createElement("div");
    body.className = "record-body";
    body.textContent =
      "总督：" + r.governor +
      " ｜ 税籍编号：" + r.taxid +
      " ｜ 贡赋：" + r.tributes.join("、") +
      " ｜ 兵团数：" + r.regiments +
      " ｜ 交割日：" + r.duedate;
    div.appendChild(head);
    div.appendChild(body);
    container.appendChild(div);
  });
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

function updateCharCount() {
  const ta = document.getElementById("petition");
  const counter = document.getElementById("char-count");
  if (!ta || !counter) return;
  const len = ta.value.length;
  counter.textContent = len;
  counter.style.color = len > 280 ? "#d64545" : "#b0a68c";
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const gradeEl = form.querySelector('input[name="grade"]:checked');
  const tributeEls = form.querySelectorAll('input[name="tribute"]:checked');
  const gradeLabels = {
    prima: "Exactis Prima",
    secundus: "Exactis Secundus",
    tertia: "Exactis Tertius",
    non: "Aptus Non"
  };
  const tributeLabels = {
    men: "兵员什一税",
    arms: "武备什一税",
    food: "粮秣什一税",
    relic: "圣物什一税"
  };
  const record = {
    taxid: form.taxid.value,
    world: form.world.value,
    governor: form.governor.value,
    gradeLabel: gradeEl ? gradeLabels[gradeEl.value] : "",
    tributes: Array.prototype.map.call(tributeEls, function (el) {
      return tributeLabels[el.value];
    }),
    regiments: form.regiments.value,
    duedate: form.duedate.value,
    submittedAt: new Date().toLocaleString("zh-CN")
  };
  const records = getRecords();
  records.unshift(record);
  saveRecords(records);
  renderRecords();
  showToast("申报册已呈递并记入税籍档案。");
  form.reset();
  updateCharCount();
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tithe-form");
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("reset", function () {
    setTimeout(updateCharCount, 0);
  });
  const ta = document.getElementById("petition");
  ta.addEventListener("input", updateCharCount);
  updateCharCount();
  document.getElementById("clear-records").addEventListener("click", function () {
    if (confirm("确定要清空所有已呈递的申报册记录吗？")) {
      localStorage.removeItem(STORAGE_KEY);
      renderRecords();
      showToast("税籍档案已清空。");
    }
  });
  renderRecords();
});
