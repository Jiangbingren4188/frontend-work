function setStatus(text, isError) {
  const el = document.getElementById("chart-status");
  el.textContent = text;
  el.className = isError ? "chart-status load-error" : "chart-status";
}

function buildPie(worlds) {
  const gradeNames = ["Exactis Prima", "Exactis Secundus", "Exactis Tertius", "Aptus Non"];
  const data = gradeNames.map(function (name) {
    const count = worlds.filter(function (w) { return w.grade === name; }).length;
    return { value: count, name: name };
  });
  const pieChart = echarts.init(document.querySelector("#pie-chart"));
  pieChart.setOption({
    title: { text: "各税级世界数量占比（单位：个）", left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [{
      name: "税级分布",
      type: "pie",
      radius: "60%",
      data: data,
      label: { show: true, formatter: "{b}: {d}%" }
    }]
  });
  return pieChart;
}

function buildBar(worlds) {
  const names = worlds.map(function (w) { return w.name.split("（")[0]; });
  const rates = worlds.map(function (w) { return Math.round(w.rate * 1000) / 10; });
  const barChart = echarts.init(document.querySelector("#bar-chart"));
  barChart.setOption({
    title: { text: "各世界什一税税率对比（单位：%）" },
    tooltip: {},
    xAxis: { data: names },
    yAxis: { name: "税率（%）", min: 0 },
    series: [{
      name: "什一税税率",
      type: "bar",
      data: rates
    }]
  });
  return barChart;
}

const loadData = async () => {
  setStatus("图表数据加载中…");
  try {
    const response = await fetch("data/worlds.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("HTTP错误：" + response.status);
    }
    const data = await response.json();
    if (data.length === 0) {
      setStatus("暂无数据。");
      return;
    }
    const charts = [buildPie(data), buildBar(data)];
    window.addEventListener("resize", function () {
      charts.forEach(function (chart) { chart.resize(); });
    });
    setStatus("数据加载完成，共 " + data.length + " 个世界。");
  } catch (error) {
    setStatus("图表数据加载失败：" + error.message + "（请确认通过本地服务器访问且 lib 与 data 文件完整）", true);
  }
};

document.addEventListener("DOMContentLoaded", loadData);
