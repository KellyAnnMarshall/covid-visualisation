<template>
  <div
    class="form-group position-relative"
    v-if="dateRange && dateRange.length"
  >
    <label :for="inputId">{{ inputLabel }}:</label>
    <input
      ref="datepicker"
      class="form-control"
      type="date"
      :value="selectedDate"
      @blur="setSelectedDate"
      @input="setSelectedDate"
      @change="setSelectedDate"
      :aria-describedby="inputId"
      :id="inputId"
      autocomplete="off"
      :min="minDate"
      :max="resolvedMaxDate"
      :disabled="!dateRange.length || !selectedDate"
    />
  </div>
</template>

<script>
export default {
  name: "Datepicker",
  props: {
    dateRange: {
      type: Array,
      required: true,
      default: () => [],
    },
    selectedDate: {
      type: String,
      default: "",
    },
    inputLabel: {
      type: String,
      default: "Date",
    },
    inputId: {
      type: String,
      default: "date-input",
    },
    maxDate: {
      type: String,
      default: "",
    },
  },
  computed: {
    minDate() {
      return this.dateRange[0] || "";
    },
    resolvedMaxDate() {
      if (this.maxDate) {
        return this.maxDate;
      }
      return this.dateRange[this.dateRange.length - 1] || "";
    },
  },
  methods: {
    setSelectedDate(event) {
      const value = event.target.value;
      if (!value) {
        this.$emit("setSelectedDate", "");
        return;
      }

      if (this.resolvedMaxDate && value > this.resolvedMaxDate) {
        this.$emit("setSelectedDate", this.resolvedMaxDate);
        return;
      }

      this.$emit("setSelectedDate", value);
    },
  },
};
</script>

<style lang="scss"></style>
