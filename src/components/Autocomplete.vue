<template>
  <div class="autocomplete form-group" v-if="items">
    <label :for="inputId">{{ inputLabel }}</label>
    <input
      :id="inputId"
      type="text"
      v-model="search"
      class="form-control"
      autocomplete="off"
      @input="onChange"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter.prevent="onEnter"
    />
    <ul v-show="isOpen" class="autocomplete-results">
      <li class="loading" v-if="isLoading">Loading results...</li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        class="autocomplete-result"
        @click="setResult(result)"
        :class="{ 'is-active': i === arrowCounter }"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Autocomplete",
  data() {
    return {
      arrowCounter: 0,
      isLoading: false,
      isOpen: false,
      results: [],
      search: ""
    };
  },
  props: ["items", "selectedItem", "inputLabel", "inputId"],
  methods: {
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.setResult(this.results[this.arrowCounter]);
      this.arrowCounter = -1;
    },
    onChange() {
      this.$emit("input", this.search);
      if (this.isAsync) {
        this.isLoading = true;
      } else {
        this.filterResults();
        this.isOpen = true;
      }
    },
    filterResults() {
      this.results = this.items.filter(item =>
        item.toLowerCase().startsWith(this.search.toLowerCase())
      );
    },
    setResult(result) {
      this.search = result;
      this.isOpen = false;
      if (result == this.selectedItem) {
        this.$emit("setSelectedItem", "");
      } else {
        this.$emit("setSelectedItem", result);
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  background: rgba(0, 0, 0, 0.6);
  height: 120px;
  overflow: auto;
  width: 100%;
  position: absolute;
  z-index: 1;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>
