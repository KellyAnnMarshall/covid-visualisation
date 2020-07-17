<template>
  <div class="form-group position-relative" v-if="dateRange">
    <label :for="inputId">{{ inputLabel }}:</label>
    <input
      ref="datepicker"
      class="form-control"
      type="date"
      v-model="date"
      @blur="setSelectedDate"
      @input="setSelectedDate"
      @change="setSelectedDate"
      :aria-describedby="inputId"
      :id="inputId"
      autocomplete="off"
      :min="minDate"
      :max="maxDate"
    />
  </div>
</template>

<script>
export default {
  name: "Datepicker",
  data() {
    return {
      date: this.selectedDate
    };
  },
  props: ["dateRange", "selectedDate", "inputLabel", "inputId"],
  computed: {
    minDate() {
      return this.dateRange[0];
    },
    maxDate() {
      return this.dateRange[this.dateRange.length - 1];
    }
  },
  watch: {
    selectedDate: {
      handler(val, oldValue) {
        if (val.length !== oldValue.length) {
          this.date = this.selectedDate;
        }
      }
    }
  },
  methods: {
    setSelectedDate() {
      this.$emit("setSelectedDate", this.date);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
