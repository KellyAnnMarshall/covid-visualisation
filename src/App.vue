<template>
  <div id="app" class="text-light">
    <form>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="country">Country:</label>
          <select v-model="selectedCountry" class="form-control">
            <option disabled value>Please select a country</option>
            <option v-for="(country, i) in allCountries" :key="i">
              {{ country }}
            </option>
          </select>
        </div>
        <div class="form-group col col-md-3">
          <datepicker
            :dateRange="calendarDates"
            :selectedDate="selectedStartDate"
            inputLabel="Start Date"
            inputId="startDate"
            @setSelectedDate="setSelectedStartDate"
          />
        </div>
        <div class="form-group col col-md-3">
          <datepicker
            :dateRange="calendarDates"
            :selectedDate="selectedEndDate"
            inputLabel="End Date"
            inputId="endDate"
            @setSelectedDate="setSelectedEndDate"
          />
        </div>
      </div>
    </form>
    <div v-if="initChart">
      <div v-if="selectedCountry" class="col-12 text-center">
        <h2 class="h4">{{ selectedCountry }}</h2>
        <p>Population: {{ population }}</p>
      </div>
      <div class="row">
        <div class="col-12 col-md-6 mb-5">
          <chart
            :chartData="deaths"
            :chartAxisLabels="dateLabels"
            aspectRatio="1.5"
            chartType="line"
            chartLabel="Weekly Deaths"
            borderColor="rgba(54, 162, 235, 1)"
            backgroundColor="rgba(54, 162, 235, 0.2)"
          />
        </div>
        <div class="col-12 col-md-6 mb-5">
          <chart
            :chartData="cases"
            :chartAxisLabels="dateLabels"
            aspectRatio="1.5"
            chartType="line"
            chartLabel="Weekly Cases"
            borderColor="rgba(255, 99, 132, 1)"
            backgroundColor="rgba(255, 99, 132, 0.2)"
          />
        </div>
        <div class="col-12 col-md-6 mb-5">
          <chart
            :chartData="cumulativeDeaths"
            :chartAxisLabels="dateLabels"
            aspectRatio="1.5"
            chartType="line"
            chartLabel="Cumulative Deaths"
            borderColor="rgba(54, 162, 235, 1)"
            backgroundColor="rgba(54, 162, 235, 0.2)"
          />
        </div>
        <div class="col-12 col-md-6 mb-5">
          <chart
            :chartData="cumulativeCases"
            :chartAxisLabels="dateLabels"
            aspectRatio="1.5"
            chartType="line"
            chartLabel="Cumulative Cases"
            borderColor="rgba(255, 99, 132, 1)"
            backgroundColor="rgba(255, 99, 132, 0.2)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Datepicker from "./components/Datepicker.vue";
import Chart from "./components/Chart.vue";

export default {
  name: "app",
  components: {
    Chart,
    Datepicker
  },
  data() {
    return {
      allCountries: [],
      covidData: [],
      formattedCountryData: [],
      calendarDates: [],
      selectedCountry: "United Kingdom",
      selectedStartDate: "",
      selectedEndDate: "",
      initChart: false
    };
  },
  props: {
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    population() {
      if (this.selectedCountryData !== undefined) {
        let population = this.selectedCountryData[
          this.selectedCountryData.length - 1
        ].population;
        let formattedPopulation = new Number(population).toLocaleString(
          "en-US"
        );
        return formattedPopulation;
      }
      return null;
    },
    dateLabels() {
      if (this.filteredCountryData !== undefined) {
        let dateLabels = [];
        this.filteredCountryData.map(row => {
          var day = moment(row.formattedRowDate);
          dateLabels.push(day.format("MMM DD"));
        });
        return dateLabels;
      }
      return null;
    },
    cumulativeCases() {
      if (this.filteredCountryData !== undefined) {
        let cumulativeCases = [];
        this.filteredCountryData.map(row => {
          cumulativeCases.push(row.cumulativeCases);
        });
        return cumulativeCases;
      }
      return null;
    },
    cases() {
      if (this.filteredCountryData !== undefined) {
        let cases = [];
        this.filteredCountryData.map(row => {
          cases.push(row.cases);
        });
        return cases;
      }
      return null;
    },
    cumulativeDeaths() {
      if (this.filteredCountryData !== undefined) {
        let cumulativeDeaths = [];
        this.filteredCountryData.map(row => {
          cumulativeDeaths.push(row.cumulativeDeaths);
        });
        return cumulativeDeaths;
      }
      return null;
    },
    deaths() {
      if (this.filteredCountryData !== undefined) {
        let deaths = [];
        this.filteredCountryData.map(row => {
          deaths.push(row.deaths);
        });
        return deaths;
      }
      return null;
    },
    selectedCountryData() {
      let selectedCountryData = [];
      if (this.selectedCountry !== "") {
        selectedCountryData = this.covidData.filter(row => {
          return row.country.includes(this.selectedCountry);
        });
      }
      return selectedCountryData;
    },
    filteredCountryData() {
      return this.formattedCountryData.filter(row => {
        return (
          row.formattedRowDate >= this.selectedStartDate &&
          row.formattedRowDate <= this.selectedEndDate
        );
      });
    }
  },
  watch: {
    selectedCountry: {
      handler() {
        this.setChart();
      }
    },
    selectedCountryData: {
      deep: true,
      handler() {
        this.setFormattedData();
      }
    },
    cumulativeCases: {
      deep: true,
      handler() {
        this.setChart();
      }
    },
    cases: {
      deep: true,
      handler() {
        this.setChart();
      }
    },
    cumulativeDeaths: {
      deep: true,
      handler() {
        this.setChart();
      }
    },
    deaths: {
      deep: true,
      handler() {
        this.setChart();
      }
    }
  },
  methods: {
    setChart() {
      this.initChart = false;
      this.$nextTick(() => {
        this.initChart = true;
      });
    },
    formatYearWeekFromDate(date) {
      let year = moment(date).year();
      let week = moment(date).isoWeek();
      if (week < 10) {
        week = "0" + week;
      }
      return `${year}-${week}`;
    },
    getCalendarDates() {
      let startWeek = moment("2020-01-01");
      let today = moment().format("YYYY-MM-DD");
      while (startWeek.isBefore(today)) {
        startWeek = startWeek.add(1, "week");
        var startWeekFormatted = startWeek.format("YYYY-MM-DD");
        this.calendarDates.push(startWeekFormatted);
      }
      this.initDefaultStartEndDates();
    },
    getCountries() {
      this.covidData.map(record => {
        if (this.allCountries.indexOf(record.country) === -1) {
          this.allCountries.push(record.country);
        }
      });
    },
    getData() {
      let url = "download.json";
      return axios
        .get(url)
        .then(response => {
          this.covidData = response.data;
        })
        .then(this.getCountries);
    },
    initDefaultStartEndDates() {
      this.selectedStartDate = this.calendarDates[0];
      this.selectedEndDate = this.calendarDates[this.calendarDates.length - 1];
    },
    setFormattedData() {
      this.formattedCountryData = [];
      if (
        this.calendarDates !== undefined &&
        this.selectedCountryData !== undefined
      ) {
        this.calendarDates.map(day => {
          let formattedDataObj = {};
          let year_week = this.formatYearWeekFromDate(day);
          let matchedData = this.selectedCountryData.filter(record => record.year_week === year_week);
          matchedData.map(row => {
            formattedDataObj.formattedRowDate = day;
              if (row.indicator === "cases") {
                formattedDataObj.cases = row.weekly_count;
                formattedDataObj.cumulativeCases = row.cumulative_count;
              } else if (row.indicator === "deaths") {
                formattedDataObj.deaths = row.weekly_count;
                formattedDataObj.cumulativeDeaths = row.cumulative_count;
              }
          });
          this.formattedCountryData.push(formattedDataObj);
        });
      }
    },
    setSelectedCountry(country) {
      this.selectedCountry = country;
    },
    setSelectedEndDate(date) {
      this.selectedEndDate = date;
    },
    setSelectedStartDate(date) {
      this.selectedStartDate = date;
    }
  },
  mounted() {
    this.getCalendarDates();
    this.getData();
  },
  destroyed() {}
};
</script>
