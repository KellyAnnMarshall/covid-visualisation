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
            chartLabel="Daily Deaths"
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
            chartLabel="Daily Cases"
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
    <div class="row">
      <div class="col-12 col-md-6 mb-5">
        <chart
          :chartData="topTenDeaths"
          :chartAxisLabels="topTenDeathsCountries"
          aspectRatio="1.5"
          chartType="bar"
          :chartLabel="topTenDeathsLabel"
          borderColor="rgba(54, 162, 235, 1)"
          backgroundColor="rgba(54, 162, 235, 0.2)"
        />
      </div>
      <div class="col-12 col-md-6 mb-5">
        <chart
          :chartData="topTenCases"
          :chartAxisLabels="topTenCasesCountries"
          aspectRatio="1.5"
          chartType="bar"
          :chartLabel="topTenCasesLabel"
          borderColor="rgba(255, 99, 132, 1)"
          backgroundColor="rgba(255, 99, 132, 0.2)"
        />
      </div>
    </div>

    <!-- <Pivot ref="pivot" toolbar v-bind:report="'report.json'" /> -->
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
      pivotData: "",
      formattedCountryData: [],
      calendarDates: ["2019-12-31"],
      selectedCountry: "",
      selectedStartDate: "",
      selectedEndDate: "",
      topTenCasesCountries: [],
      topTenCases: [],
      topTenCasesLabel: "",
      topTenDeathsCountries: [],
      topTenDeaths: [],
      topTenDeathsLabel: "",
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
        ].popData2019;
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
          var day = moment(row.day);
          dateLabels.push(day.format("MMM DD"));
        });
        return dateLabels;
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
    selectedCountryData() {
      let selectedCountryData = [];
      if (this.selectedCountry !== "") {
        selectedCountryData = this.covidData.records.filter(row => {
          return row.countryName.includes(this.selectedCountry);
        });
      }
      return selectedCountryData;
    },
    filteredCountryData() {
      return this.formattedCountryData.filter(row => {
        return (
          row.day >= this.selectedStartDate && row.day <= this.selectedEndDate
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
    cumulativeDeaths: {
      deep: true,
      handler() {
        this.setChart();
      }
    },
    cumulativeCases: {
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
    },
    cases: {
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
    getCalendarDates() {
      let startDate = moment("2019-12-31");
      let yesterday = moment().subtract(2, "days");
      while (startDate.isBefore(yesterday)) {
        startDate = startDate.add(1, "days");
        var startDateFormatted = startDate.format("YYYY-MM-DD");
        this.calendarDates.push(startDateFormatted);
      }
      this.initDefaultStartEndDates();
    },
    getCountries() {
      this.covidData.records.map(record => {
        record.countryName = record.countriesAndTerritories.replace(/_/g, " ");
        if (this.allCountries.indexOf(record.countryName) === -1) {
          this.allCountries.push(record.countryName);
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
        .then(this.getCountries)
        .then(this.getTopTwentyCases)
        .then(this.getTopTwentyDeaths);
    },
    getTopTwentyCases() {
      let yesterday = moment().subtract(1, "days");
      let yesterdayFormatted = yesterday.format("DD/MM/YYYY");
      let topTenCaseData = this.covidData.records
        .filter(record => {
          return record.dateRep == yesterdayFormatted;
        })
        .sort((a, b) => {
          return b.cases - a.cases;
        })
        .slice(0, 10);
      topTenCaseData.map(row => {
        let name = row.countriesAndTerritories.replace(/_/g, " ");
        if (name == "United States of America") {
          name = "USA";
        }
        if (name == "United Kingdom") {
          name = "UK";
        }
        this.topTenCasesCountries.push(name);
        this.topTenCases.push(row.cases);
      });
    },
    getTopTwentyDeaths() {
      let yesterday = moment().subtract(1, "days");
      let yesterdayFormatted = yesterday.format("DD/MM/YYYY");
      let topTenDeathsData = this.covidData.records
        .filter(record => {
          return record.dateRep == yesterdayFormatted;
        })
        .sort((a, b) => {
          return b.deaths - a.deaths;
        })
        .slice(0, 10);
      topTenDeathsData.map(row => {
        let name = row.countriesAndTerritories.replace(/_/g, " ");
        if (name == "United States of America") {
          name = "USA";
        }
        if (name == "United Kingdom") {
          name = "UK";
        }
        this.topTenDeathsCountries.push(name);
        this.topTenDeaths.push(row.deaths);
      });
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
        let totalDeaths = 0;
        let totalCases = 0;
        this.calendarDates.map(day => {
          let formattedDataObj = {};
          formattedDataObj.day = day;
          formattedDataObj.deaths = 0;
          formattedDataObj.cases = 0;
          formattedDataObj.cumulativeDeaths = totalDeaths;
          formattedDataObj.cumulativeCases = totalCases;
          this.selectedCountryData.map(row => {
            var formattedDate = row.dateRep
              .split("/")
              .reverse()
              .join("-");
            if (day == formattedDate) {
              formattedDataObj.deaths = row.deaths;
              formattedDataObj.cases = row.cases;
              totalDeaths += parseInt(row.deaths, 10);
              totalCases += parseInt(row.cases, 10);
              formattedDataObj.cumulativeDeaths = totalDeaths;
              formattedDataObj.cumulativeCases = totalCases;
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
    },
    setTopTenCasesLabel() {
      let yesterday = moment().subtract(1, "days");
      this.topTenCasesLabel =
        yesterday.format("DD MMMM YYYY") + " Total Cases - Top 10";
    },
    setTopTenDeathsLabel() {
      let yesterday = moment().subtract(1, "days");
      this.topTenDeathsLabel =
        yesterday.format("DD MMMM YYYY") + " Total Deaths - Top 10";
    }
  },
  mounted() {
    this.getCalendarDates();
    this.getData();
    this.setTopTenDeathsLabel();
    this.setTopTenCasesLabel();
  },
  destroyed() {}
};
</script>
