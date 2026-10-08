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
  showToast("申报册已呈递，书记官将尽快核验。");
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
});
