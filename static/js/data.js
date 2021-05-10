const searchField = $("#searchField");
const barChartElement = $("#barChart");
const bubbleChartElement = $("#bubbleChart");
const noBarChartContent = $("#noBarChartContent");
const noBubbleChartContent = $("#noBubbleChartContent");

const colorPalette = [
    "#FFFFFF",
    "#E2E2E2",
    "#C6C6C6",
    "#ABABAB",
    "#919191",
];

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
const maxBubbleSize = 50;
const maxYBubbleChart = 400
const maxXBubbleChart = 400
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
                    max: maxYBubbleChart
                },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: maxXBubbleChart
                },
            }]
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const index = context.dataIndex;
                        const bubble = context.dataset.data[index];
                        return `${bubble.vehicleType}: ${bubble.count}`
                    }
                }
            }
        }
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
        data: barChartDataSet.map(d => d['count']),
        borderColor: colorPalette,
        backgroundColor: colorPalette
    }];
    barChart.update();
}

function _updateBubbleChart(bubbleChartLabels, bubbleChartDataSet) {
    bubbleChart.data.labels = bubbleChartLabels;
    // See: https://www.chartjs.org/docs/latest/samples/other-charts/bubble.html

    const counts = bubbleChartDataSet.map(d => d['count']);
    const maxCount = Math.max(...counts);
    bubbleChart.data.datasets = [{
        label: 'Number of Providers',
        data: bubbleChartDataSet.map(d => {
            return {
                // Do not allow the bubble to be placed inside the entire chart...
                x: Math.floor(Math.random() * (maxXBubbleChart * 0.7)),
                y: Math.floor(Math.random() * (maxYBubbleChart * 0.7)),
                // Calculate radius based on fraction of the maxCount
                r: Math.floor((1.0 / maxCount * d['count']) * maxBubbleSize),
                vehicleType: d['vehicle_type'],
                count: d['count']
            };
        }),
        borderColor: colorPalette,
        backgroundColor: colorPalette
    }];
    bubbleChart.update();
}



function _doChartsRequest(address, radius) {
    // We explicitely do NOT work with show and hide as this would result in removing the element from the DOM
    // This in turn would have the effect that the charts would change their height, which is not intended.
    NProgress.start();
    $.post('chartData', { 'address': address, 'radius': radius }, (response) => {
        if (response.barChartData && response.bubbleChartData) {
            barChartElement.css("visibility", "visible");
            bubbleChartElement.css("visibility", "visible");
            noBarChartContent.css("visibility", "hidden");
            noBubbleChartContent.css("visibility", "hidden");
            const barChartLabels = response.barChartData.labels;
            // We need to convert the stringify json into actual data
            const barChartDataSet = JSON.parse(response.barChartData.dataset);
            _updateBarChart(barChartLabels, barChartDataSet);


            const bubbleChartLabels = response.bubbleChartData.labels;
            // We need to convert the stringify json into actual data
            const bubbleChartDataSet = JSON.parse(response.bubbleChartData.dataset);
            _updateBubbleChart(bubbleChartLabels, bubbleChartDataSet);

        } else {
            barChartElement.css("visibility", "hidden");
            bubbleChartElement.css("visibility", "hidden");
            noBarChartContent.css("visibility", "visible");
            noBubbleChartContent.css("visibility", "visible");
            _sendNotification("No results were found...");
        }
        NProgress.done();

    }).fail(function(error) {
        NProgress.done();
        barChartElement.css("visibility", "hidden");
        bubbleChartElement.css("visibility", "hidden");
        noBarChartContent.css("visibility", "visible");
        noBubbleChartContent.css("visibility", "visible");
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