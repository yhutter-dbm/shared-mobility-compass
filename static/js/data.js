function _initializeBarChart() {
  // See: https://www.chartjs.org/docs/latest/
  var ctx = document.getElementById("barChart").getContext("2d");
  var myBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

function _createBubbleChartData() {
  let data = [];
  for (var i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * 400);
    const y = Math.floor(Math.random() * 400);
    const r = Math.floor(Math.random() * 5 + 1);
    data.push({ x, y, r });
  }
  return data;
}

function _initializeBubbleChart() {
  // See: https://www.chartjs.org/docs/latest/charts/bubble.html
  var ctx = document.getElementById("bubbleChart").getContext("2d");
  var myBubbleChart = new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [
        {
          label: "Group 1",
          data: _createBubbleChartData(),
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        },
        {
          label: "Group 2",
          data: _createBubbleChartData(),
          backgroundColor: "rgba(54, 162, 235, 0.8)",
          hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
        },
      ],
    },
  });
}

function _initializeLineChart() {
  // See: https://www.chartjs.org/docs/latest/charts/bubble.html
  var ctx = document.getElementById("lineChart").getContext("2d");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Prices",
          data: [
            {
              x: 0,
              y: 5,
            },
            {
              x: 5,
              y: 0,
            },
            {
              x: 10,
              y: 5,
            },
            {
              x: 15,
              y: 0,
            },
          ],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        },
      ],
    },
  });
}

_initializeBarChart();
_initializeBubbleChart();
_initializeLineChart();
