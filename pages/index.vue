<template>
  <div :class="`weather-app ${backgroundColour}`">
    <div class="text-center w-1/4">
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
          @back="showSearch = true"
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
      minTemp: null,
      maxTemp: null,
      highestForecastedPrecip: null,
      lowestForecastedTemp: null,
      currentTemp: null,
      windspeed: null,
      willItRain: "",
      willItGetCold: "",
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
      this.loading = true;
      try {
        const response = await axios.post("/.netlify/functions/weather", {
          location: this.location,
        });
        this.updateValues(response.data);
        this.updateComments();
        this.showSearch = !this.showSearch;
      } catch (error) {
        console.log(error);
        throw new Error("Oops! Something went wrong");
      }
      this.loading = false;
    },
    updateValues(data) {
      this.highestForecastedPrecip = this.highestForecastedPrecipitationOdds(data);
      this.lowestForecastedTemp = this.lowestForecastedTemperature(data);
      this.minTemp = data.days[0].tempmin;
      this.maxTemp = data.days[0].tempmax;
      this.currentTemp = data.currentConditions.temp;
      (this.windspeed = data.currentConditions.windspeed),
        (this.snow = data.currentConditions.snow),
        (this.conditions = data.currentConditions.conditions),
        (this.precipitationProb = data.currentConditions.precipprob);
    },
    updateComments() {
      this.comments = [];

      if (this.snow > 0) {
        this.comments.push("snowing");
      } else if (
        this.lowestForecastedTemp > 0 &&
        this.lowestForecastedTemp <= 10
      ) {
        this.comments.push("cold");
      } else if (this.lowestForecastedTemp <= 0) {
        this.comments.push("freezing");
      }

      if (this.conditions.includes("Rain")) {
        this.comments.push("raining");
      } else {
        if (this.highestForecastedPrecip >= 5 && this.highestForecastedPrecip <= 50) {
          this.comments.push("might rain");
        } else if (this.highestForecastedPrecip > 50) {
          this.comments.push("will probably rain");
        }
      }
    },
    highestForecastedPrecipitationOdds(data) {
      const date = new Date(
        "1970-01-01T" + data.currentConditions.datetime + "Z"
      );
      const currentHour = date.getHours();
      let futurePrecipProbs = [];

      let hour = currentHour + 1;
      while (hour < 24 && hour < currentHour + 5) {
        console.log(hour);
        futurePrecipProbs.push(data.days[0].hours[hour].precipprob);
        hour++;
      }

      let highestPrecipProb = futurePrecipProbs[0];
      futurePrecipProbs.forEach((precipProb) => {
        if (precipProb > highestPrecipProb) {
          highestPrecipProb = precipProb;
        }
      });
      
      console.log(highestPrecipProb);
      return highestPrecipProb;
    },
    lowestForecastedTemperature(data) {
      const date = new Date(
        "1970-01-01T" + data.currentConditions.datetime + "Z"
      );
      const currentHour = date.getHours();
      let futureTemps = [];

      let hour = currentHour + 1;
      while (hour < 24 && hour < currentHour + 5) {
        futureTemps.push(data.days[0].hours[hour].temp);
        hour++;
      }

      let lowestTemp = futureTemps[0];
      futureTemps.forEach((temp) => {
        if (temp < lowestTemp) {
          lowestTemp = temp;
        }
      });

      console.log(lowestTemp);
      return lowestTemp;
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
