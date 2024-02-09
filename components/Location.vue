<template>
  <div>
    <div class="input-container">
      <img src="@/assets/img/should_i_wear.png" />
      <div class="flex">
        <div class="relative w-full">
          <input
            id="location"
            v-model="localLocation"
            @input="updateParentLocation"
            @keydown.enter="submitSearch"
            type="search"
            class="text-center block w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-800"
            placeholder="Enter your town and country..."
            required
          />
          <button
            @click="submitSearch"
            type="submit"
            class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-gray-500 rounded-e-lg border border-gray-300 hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </div>
      </div>
      <img class="pt-11" src="@/assets/img/coat.png" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localLocation: this.value,
    };
  },
  methods: {
    updateParentLocation() {
      this.$emit("input", this.localLocation);
    },
    submitSearch() {
      this.$emit("submitSearch");
    },
  },
};
</script>

<style scoped>
.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.input-container {
  position: relative;
}
</style>
