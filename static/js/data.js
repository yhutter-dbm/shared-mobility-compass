const searchField = $("#searchField");

// Initialize bar chart references...
const barChartContext = document.getElementById("barChart").getContext("2d");
let barChart = new Chart(barChartContext, {
    type: "bar",
    data: {
        labels: [],
        datasets: [],
    }
});

// Initialize bubble chart references...
const minBubbleSize = 5;
const bubbleChartContext = document.getElementById("bubbleChart").getContext("2d");
const bubbleChart = new Chart(bubbleChartContext, {
    type: "bubble",
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 400
                },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 400
                },
            }]
        },
    },
});

function _handleSearch() {
    const address = searchField.val().trim();

    if (!address) {
        _sendNotification("No address was entered");
        return;
    }

    const radius = 10;
    _doChartsRequest(address, radius);
}

function _updateBarChart(barChartLabels, barChartDataSet) {
    barChart.data.labels = barChartLabels;
    barChart.data.datasets = [{
        label: 'Number of Providers',
        data: barChartDataSet.map(d => d['count'])
    }];
    barChart.update();
}

function _updateBubbleChart(bubbleChartLabels, bubbleChartDataSet) {
    bubbleChart.data.labels = bubbleChartLabels;

    // Here we need to generate a dataset per vehicle type as we do not have a legend as in the bar chart.
    // See: https://www.chartjs.org/docs/latest/samples/other-charts/bubble.html
    bubbleChart.data.datasets = bubbleChartDataSet.map(d => {
        return {
            label: d['vehicle_type'],
            data: [{
                x: Math.floor(Math.random() * 400),
                y: Math.floor(Math.random() * 400),
                r: minBubbleSize * d['count']
            }],
        };
    });
    bubbleChart.update();
}



function _doChartsRequest(address, radius) {
    $.post('chartData', { 'address': address, 'radius': radius }, (response) => {
        if (response.barChartData && response.bubbleChartData) {
            const barChartLabels = response.barChartData.labels;
            // We need to convert the stringify json into actual data
            const barChartDataSet = JSON.parse(response.barChartData.dataset);
            _updateBarChart(barChartLabels, barChartDataSet);


            const bubbleChartLabels = response.bubbleChartData.labels;
            // We need to convert the stringify json into actual data
            const bubbleChartDataSet = JSON.parse(response.bubbleChartData.dataset);
            _updateBubbleChart(bubbleChartLabels, bubbleChartDataSet);

        } else {
            _sendNotification("No results were found...");
        }

    }).fail(function(error) {
        _sendNotification("An error occurred...");
    });
}

// Register event handlers
searchField.on('keyup', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        _handleSearch();
    }
});