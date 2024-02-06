<template>
  <div :class="`weather-app ${backgroundColour}`">
    <div class="text-center w-1/4">
      <Location v-if="showSearch" :value="location" @input="location = $event.target.value" @submit-search="requestWeather"/>
      <Results v-else :comments="comments" :isWearACoat="isWearACoat" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Location from "@/components/Location.vue";
import Results from "@/components/Results.vue";

export default {
  components: {
    Location,
    Results,
  },
  props: {
    config: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      showSearch: true,
      postData: {},
      minTemp: null,
      maxTemp: null,
      currentTemp: null,
      windspeed: null,
      snow: 0,
      conditions: "",
      comments: [],
      precipitationProb: 0,
      location: "",
    };
  },
  computed: {
    isWearACoat() {
      return this.minTemp <= 10 ||
        this.snow > 0 ||
        this.conditions.includes("Rain") ||
        this.precipitationProb >= 5
        ? "Yep"
        : "Nah, no need";
    },
    backgroundColour() {
      if (this.showSearch) {
        return "bg-indigo-200";
      } else if (this.isWearACoat === "Yep") {
        return "bg-green-300";
      } else {
        return "bg-red-300";
      }
    },
  },
  methods: {
    async requestWeather() {
      try {
        await axios.post("/.netlify/functions/weather", {
        location: this.location,
      });
      this.updateComments();
      this.showSearch = !this.showSearch;
      } catch (error) {
        throw new Error('Oops! Something went wrong');
      }
    },
    updateComments() {
      this.comments = [];

      if (this.snow > 0) {
        this.comments.push("snowing");
      } else if (this.minTemp > 0 && this.minTemp <= 10) {
        this.comments.push("cold");
      } else if (this.minTemp <= 0) {
        this.comments.push("freezing");
      }

      if (this.conditions.includes("Rain")) {
        this.comments.push("raining");
      } else {
        if (this.precipitationProb >= 5 && this.precipitationProb <= 50) {
          this.comments.push("might rain");
        } else if (this.precipitationProb > 50) {
          this.comments.push("will probably rain");
        }
      }
    },
  },
};
</script>

<style>
.weather-app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

h1 {
  color: #333;
}

p {
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  color: #009688;
  font-weight: bold;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}
</style>
