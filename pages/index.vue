<template>
  <div :class="`weather-app ${backgroundColour}`">
    <div class="content">
      <h1 class="text-9xl pb-8">{{ isWearACoat }}</h1>
      <p v-if="comments.length > 0">It's {{ formattedComments }}.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      postData: {},
      minTemp: null,
      maxTemp: null,
      currentTemp: null,
      windspeed: null,
      snow: 0,
      conditions: "",
      comments: [],
      precipitationProb: 0,
    };
  },
  mounted() {
    this.asyncData();
    this.updateComments();
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
      return this.isWearACoat === "Yep" ? "bg-green-300" : "bg-red-300";
    },
    formattedComments() {
      if (this.comments.length > 1) {
        return (
          this.comments.slice(0, -1).join(", ") +
          ", and " +
          this.comments.slice(-1)
        );
      } else if (this.comments.length === 1) {
        return this.comments[0];
      } else {
        return "";
      }
    },
  },
  methods: {
    async asyncData() {
      const response = await fetch(
        //TODO: change this to ask the user for the location
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/slough?unitGroup=metric&key=${this.config.public.API_KEY}&contentType=json`
      );
      this.postData = await response.json();
      this.updateComments();
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

.content {
  max-width: 600px;
  text-align: center;
  padding: 20px;
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
</style>
