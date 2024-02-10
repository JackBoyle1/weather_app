<template>
  <div :class="`weather-app ${backgroundColour}`">
    <div class="text-center lg:w-1/4 md:w-1/3 sm: w-4/5">
      <div v-if="!loading">
        <Location
          v-if="showSearch"
          :value="location"
          @input="location = $event.target.value"
          @submit-search="requestWeather"
        />
        <Results
          v-else
          :comments="comments"
          :isWearACoat="isWearACoat"
          @back="goBack"
        />
      </div>
      <Spinner v-else />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Location from "@/components/Location.vue";
import Results from "@/components/Results.vue";
import Spinner from "@/components/Spinner.vue";

export default {
  components: {
    Location,
    Results,
    Spinner,
  },
  props: {
    config: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      showSearch: true,
      highestForecastedPrecip: null,
      lowestForecastedTemp: null,
      windspeed: null,
      willItRain: "",
      willItGetCold: "",
      isSnowing: false,
      conditions: "",
      comments: [],
      precipitationProb: 0,
      location: "",
      isError: false,
    };
  },
  computed: {
    isWearACoat() {
      if (this.isError) {
        return "Oops! Something went wrong";
      } else {
        return this.feelsLike <= 10 ||
          this.lowestForecastedTemp <= 10 ||
          this.isSnowing ||
          this.conditions.includes("Rain") ||
          this.highestForecastedPrecip >= 5
          ? "Yep"
          : "Nah";
      }
    },
    backgroundColour() {
      if (this.isError) {
        return "bg-gray-300";
      } else if (this.showSearch) {
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
      this.loading = true;
      try {
        const response = await axios.post("/.netlify/functions/weather", {
          location: this.location,
        });
        this.updateValues(response.data);
        this.updateComments();
      } catch (error) {
        this.comments = [];
        this.isError = true;
        this.showSearch = false;
        this.loading = false;
        throw new Error("Oops! Something went wrong");
      }
      this.showSearch = false;
      this.loading = false;
    },
    updateValues(data) {
      this.highestForecastedPrecip =
        this.highestForecastedPrecipitationOdds(data);
      this.lowestForecastedTemp = this.lowestForecastedTemperature(data);
      (this.windspeed = data.currentWindspeed),
        (this.snow = data.isSnowing),
        (this.conditions = data.conditions),
        (this.precipitationProb = data.precipitationProbability);
    },
    updateComments() {
      this.comments = [];

      if (this.isSnowing) {
        this.comments.push("snowing");
      } else if (this.feelsLike > 0 && this.feelsLike <= 10) {
        this.comments.push("cold");
      } else if (
        this.lowestForecastedTemp > 0 &&
        this.lowestForecastedTemp <= 10
      ) {
        this.comments.push("cold");
      } else if (this.lowestForecastedTemp <= 0 || this.feelsLike <= 0) {
        this.comments.push("freezing");
      }

      if (this.conditions.includes("Rain")) {
        this.comments.push("raining");
      } else {
        if (
          this.highestForecastedPrecip >= 5 &&
          this.highestForecastedPrecip <= 50
        ) {
          this.comments.push("got a chance of raining");
        } else if (this.highestForecastedPrecip > 50) {
          this.comments.push("probably going to rain");
        }
      }
    },
    highestForecastedPrecipitationOdds(data) {
      let futurePrecipProbs = [];

      data.daysData.forEach(day => {
        futurePrecipProbs.push(day.precipprob);
      });

      let highestPrecipProb = futurePrecipProbs[0];
      futurePrecipProbs.forEach((precipProb) => {
        if (precipProb > highestPrecipProb) {
          highestPrecipProb = precipProb;
        }
      });

      return highestPrecipProb;
    },
    lowestForecastedTemperature(data) {
      let futureTemps = [];

      data.daysData.forEach(day => {
        futureTemps.push(day.feelslike);
      });

      let lowestTemp = futureTemps[0];
      futureTemps.forEach((temp) => {
        if (temp < lowestTemp) {
          lowestTemp = temp;
        }
      });

      return lowestTemp;
    },
    goBack() {
      this.isError = false;
      this.showSearch = true;
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
