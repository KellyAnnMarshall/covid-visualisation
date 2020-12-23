<template>
  <canvas ref="chart"></canvas>
</template>

<script>
import Chart from "chart.js";

export default {
  name: "Chart",
  data() {
    return {};
  },
  props: [
    "chartData",
    "chartAxisLabels",
    "chartLabel",
    "borderColor",
    "backgroundColor",
    "chartType",
    "aspectRatio"
  ],
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.buildLineGraph();
      }
    },
    chartAxisLabels: {
      deep: true,
      handler() {
        this.buildLineGraph();
      }
    }
  },
  methods: {
    buildLineGraph() {
      var ctx = this.$refs.chart.getContext("2d");
      Chart.defaults.global.defaultFontColor = "white";
      Chart.defaults.global.defaultFontSize = 16;
      Chart.defaults.global.defaultFontFamily = "Avenir";
      new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.chartAxisLabels,
          datasets: [
            {
              label: this.chartLabel,
              data: this.chartData,
              backgroundColor: this.backgroundColor,
              fill: this.backgroundColor,
              borderColor: this.borderColor,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: this.aspectRatio,
          tooltips: {
            callbacks: {
              label: tooltipItem => {
                let formattedValue = new Number(
                  tooltipItem.yLabel
                ).toLocaleString("en-US");
                return formattedValue;
              }
            },
            displayColors: false,
            xPadding: 10,
            yPadding: 10
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: value => {
                    let formattedValue = new Number(value).toLocaleString(
                      "en-US"
                    );
                    return formattedValue;
                  }
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  padding: 10
                }
              }
            ]
          }
        }
      });
    }
  },
  mounted() {
    this.buildLineGraph();
  }
};
</script>
