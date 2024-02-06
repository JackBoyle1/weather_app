<template>
  <div>
    <div class="input-container">
      <img src="@/assets/img/should_i_wear.png"/>
      <input
        v-model="localLocation"
        @input="updateParentLocation"
        @keydown.enter="submitSearch"
        class="shadow appearance-none border rounded w-full text-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="location"
        type="text"
        placeholder="Please type out your location..."
      />
      <span class="search-icon pb-12" @click="submitSearch">&#128269;</span>
      <img class="pt-11" src="@/assets/img/coat.png"/>
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
    }
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