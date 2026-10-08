let populationChart = null;
let relationChart = null;

const AXIS_COLOR = "#b0a68c";
const GRID_COLOR = "rgba(176, 166, 140, 0.18)";

function setStatus(text, isError) {
  const el = document.getElementById("chart-status");
  el.textContent = text;
  el.className = isError ? "chart-status load-error" : "chart-status";
}

function destroyCharts() {
  if (populationChart) {
    populationChart.destroy();
    populationChart = null;
  }
  if (relationChart) {
    relationChart.destroy();
    relationChart = null;
  }
}

function shortName(w) {
  return w.name.split("（")[0];
}

function buildPopulationChart(worlds) {
  const ctx = document.querySelector("#population-chart");
  populationChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: worlds.map(shortName),
      datasets: [{
        label: "人口（亿）",
        data: worlds.map(function (w) { return w.population; }),
        borderWidth: 1,
        backgroundColor: "rgba(200, 162, 77, 0.75)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "各世界人口规模对比（单位：亿）", color: "#e8e0cc" },
        legend: { position: "bottom", labels: { color: AXIS_COLOR } }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "人口（亿）", color: AXIS_COLOR },
          ticks: { color: AXIS_COLOR },
          grid: { color: GRID_COLOR }
        },
        x: {
          ticks: { color: AXIS_COLOR },
          grid: { color: GRID_COLOR }
        }
      }
    }
  });
}

function buildRelationChart(worlds) {
  const ctx = document.querySelector("#relation-chart");
  relationChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [{
        label: "世界（人口，税率）",
        data: worlds.map(function (w) {
          return { x: w.population, y: Math.round(w.rate * 1000) / 10, name: shortName(w) };
        }),
        pointRadius: 6,
        backgroundColor: "rgba(143, 184, 222, 0.85)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "人口规模与什一税税率的关系", color: "#e8e0cc" },
        legend: { position: "bottom", labels: { color: AXIS_COLOR } },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.raw.name + "：人口 " + ctx.raw.x + " 亿，税率 " + ctx.raw.y + "%";
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "税率（%）", color: AXIS_COLOR },
          ticks: { color: AXIS_COLOR },
          grid: { color: GRID_COLOR }
        },
        x: {
          beginAtZero: true,
          title: { display: true, text: "人口（亿）", color: AXIS_COLOR },
          ticks: { color: AXIS_COLOR },
          grid: { color: GRID_COLOR }
        }
      }
    }
  });
}

const loadData = async () => {
  setStatus("图表数据加载中…");
  destroyCharts();
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
    buildPopulationChart(data);
    buildRelationChart(data);
    setStatus("数据加载完成，共 " + data.length + " 个世界。");
  } catch (error) {
    setStatus("图表数据加载失败：" + error.message + "（请确认通过本地服务器访问且 lib 与 data 文件完整）", true);
  }
};

document.addEventListener("DOMContentLoaded", loadData);
