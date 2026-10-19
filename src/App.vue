<template>
  <div id="app" class="text-light">
    <form>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="country">Country:</label>
          <select v-model="selectedCountry" class="form-control">
            <option disabled value="">Please select a country</option>
            <option
              v-for="country in allCountries"
              :key="country"
              :value="country"
            >
              {{ country }}
            </option>
          </select>
        </div>
        <div class="form-group col col-md-3">
          <datepicker
            :dateRange="calendarDates"
            :selectedDate="selectedStartDate"
            :maxDate="latestAllowedDate"
            inputLabel="Start Date"
            inputId="startDate"
            @setSelectedDate="setSelectedStartDate"
          />
        </div>
        <div class="form-group col col-md-3">
          <datepicker
            :dateRange="calendarDates"
            :selectedDate="selectedEndDate"
            :maxDate="latestAllowedDate"
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

const DEFAULT_START_DATE = "2020-01-01";

function weekIdentifierToDate(isoWeekValue) {
  if (!isoWeekValue || typeof isoWeekValue !== "string") {
    return null;
  }

  const match = /^([0-9]{4})-([0-9]{2})$/.exec(isoWeekValue.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const week = Number(match[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(week) ||
    week < 1 ||
    week > 53
  ) {
    return null;
  }

  const isoWeekDate = moment.utc(
    `${year}-W${String(week).padStart(2, "0")}-1`,
    "GGGG-[W]WW-E",
  );
  if (!isoWeekDate.isValid()) {
    return null;
  }

  return isoWeekDate.format("YYYY-MM-DD");
}

export default {
  name: "app",
  components: {
    Chart,
    Datepicker,
  },
  data() {
    return {
      allCountries: [],
      covidData: [],
      formattedCountryData: [],
      calendarDates: [],
      latestAllowedDate: null,
      selectedCountry: "Austria",
      selectedStartDate: "",
      selectedEndDate: "",
      initChart: false,
    };
  },
  props: {
    isAsync: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    population() {
      if (this.selectedCountryData !== undefined) {
        const population =
          this.selectedCountryData[this.selectedCountryData.length - 1]
            .population;
        return new Number(population).toLocaleString("en-US");
      }
      return null;
    },
    dateLabels() {
      if (this.filteredCountryData !== undefined) {
        return this.filteredCountryData.map((row) =>
          moment(row.formattedRowDate).format("MMM DD"),
        );
      }
      return null;
    },
    cumulativeCases() {
      if (this.filteredCountryData !== undefined) {
        return this.filteredCountryData.map((row) => row.cumulativeCases);
      }
      return null;
    },
    cases() {
      if (this.filteredCountryData !== undefined) {
        return this.filteredCountryData.map((row) => row.cases);
      }
      return null;
    },
    cumulativeDeaths() {
      if (this.filteredCountryData !== undefined) {
        return this.filteredCountryData.map((row) => row.cumulativeDeaths);
      }
      return null;
    },
    deaths() {
      if (this.filteredCountryData !== undefined) {
        return this.filteredCountryData.map((row) => row.deaths);
      }
      return null;
    },
    selectedCountryData() {
      if (!this.selectedCountry) {
        return [];
      }

      return this.covidData.filter((row) =>
        row.country.includes(this.selectedCountry),
      );
    },
    filteredCountryData() {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        return [];
      }

      return this.formattedCountryData.filter((row) => {
        return (
          row.formattedRowDate >= this.selectedStartDate &&
          row.formattedRowDate <= this.selectedEndDate
        );
      });
    },
  },
  watch: {
    selectedCountry: {
      handler() {
        this.setChart();
      },
    },
    selectedCountryData: {
      deep: true,
      handler() {
        this.setFormattedData();
      },
    },
    cumulativeCases: {
      deep: true,
      handler() {
        this.setChart();
      },
    },
    cases: {
      deep: true,
      handler() {
        this.setChart();
      },
    },
    cumulativeDeaths: {
      deep: true,
      handler() {
        this.setChart();
      },
    },
    deaths: {
      deep: true,
      handler() {
        this.setChart();
      },
    },
  },
  methods: {
    setChart() {
      this.initChart = false;
      this.$nextTick(() => {
        this.initChart = true;
      });
    },
    formatYearWeekFromDate(date) {
      const actualDate = moment(date);
      const year = actualDate.year();
      let week = actualDate.isoWeek();
      if (week < 10) {
        week = `0${week}`;
      }
      return `${year}-${week}`;
    },
    getCalendarDates() {
      const startWeek = moment.utc(DEFAULT_START_DATE, "YYYY-MM-DD");
      const latestUserSelectableDate =
        this.latestAllowedDate || moment.utc().format("YYYY-MM-DD");
      this.calendarDates = [];

      const workingDate = moment.utc(startWeek);
      while (workingDate.isBefore(latestUserSelectableDate, "day")) {
        this.calendarDates.push(workingDate.format("YYYY-MM-DD"));
        workingDate.add(1, "week");
      }

      if (this.calendarDates.length === 0) {
        this.calendarDates = [latestUserSelectableDate];
      }

      this.initDefaultStartEndDates();
    },
    getCountries() {
      this.allCountries = Array.from(
        new Set(this.covidData.map((record) => record.country)),
      );
    },
    getData() {
      const url = `${process.env.BASE_URL}download.json`;
      return axios
        .get(url)
        .then((response) => {
          this.covidData = Array.isArray(response.data) ? response.data : [];
          this.updateLatestAllowedDate();
          this.getCountries();
          this.initDefaultStartEndDates();
          this.setFormattedData();
        })
        .catch(() => {
          this.covidData = [];
          this.latestAllowedDate = null;
          this.allCountries = [];
          this.selectedStartDate = "";
          this.selectedEndDate = "";
          this.formattedCountryData = [];
        });
    },
    updateLatestAllowedDate() {
      const validDates = this.covidData
        .map((record) => record.year_week)
        .map((yearWeek) => weekIdentifierToDate(yearWeek))
        .filter(Boolean)
        .sort();

      this.latestAllowedDate =
        validDates.length > 0 ? validDates[validDates.length - 1] : null;
      if (this.latestAllowedDate) {
        this.getCalendarDates();
      }
    },
    initDefaultStartEndDates() {
      if (!this.calendarDates.length) {
        this.selectedStartDate = "";
        this.selectedEndDate = "";
        return;
      }

      this.selectedStartDate = this.calendarDates[0];
      this.selectedEndDate =
        this.latestAllowedDate ||
        this.calendarDates[this.calendarDates.length - 1];
    },
    setFormattedData() {
      this.formattedCountryData = [];
      if (!this.calendarDates.length || !this.selectedCountryData.length) {
        return;
      }

      this.calendarDates.forEach((day) => {
        const formattedDataObj = {};
        const yearWeek = this.formatYearWeekFromDate(day);
        const matchedData = this.selectedCountryData.filter(
          (record) => record.year_week === yearWeek,
        );

        matchedData.forEach((row) => {
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
    },
    setSelectedCountry(country) {
      this.selectedCountry = country;
    },
    setSelectedEndDate(date) {
      if (!this.latestAllowedDate || date <= this.latestAllowedDate) {
        this.selectedEndDate = date;
      }
    },
    setSelectedStartDate(date) {
      if (!this.latestAllowedDate || date <= this.latestAllowedDate) {
        this.selectedStartDate = date;
      }
    },
  },
  mounted() {
    this.getData();
  },
  unmounted() {},
};
</script>
