<template>
  <div class="weather-app">
    <div class="content">
      <h1>{{ isWearACoat }}</h1>
      <p v-if="comments.length > 0">It's {{ formattedComments }}!</p>
    </div>
  </div>
</template>

<script>
export default {
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
    // this.updateComments();
  },
  computed: {
    isWearACoat() {
      //IF ITS RAINING, SNOWING, WINDY, OR BELOW 10 DEGREES THEN RETURN YES.
      //IF NONE OF THESE ARE TRUE, RETURN NO.
      return this.minTemp <= 10 ||
        this.snow > 0 ||
        this.conditions.includes("Rain") ||
        this.precipitationProb >= 5
        ? "Yep"
        : "Nah";
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
      // Make a GET request to an API or server to fetch data
      const response = await fetch(
        //TODO: change this to ask the user for the location
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/slough?unitGroup=metric&key=VXFWNWG38Q65YTHF2M8K3ZU7J&contentType=json"
      );
      this.postData = await response.json();
      this.updateComments();
    },
    updateComments() {
      this.comments = [];
      //TODO: account for current and future temperatures
      switch (true) {
        case this.snow > 0:
          this.comments.push("snowing");
        case this.minTemp > 0 && this.minTemp <= 10:
          this.comments.push("a bit chilly");
        case this.minTemp <= 0:
          this.comments.push("freeeeezing");
        case this.conditions.includes("Rain"):
          this.comments.push("raining");
        case this.precipitationProb >= 5 &&
          this.precipitationProb <= 50 &&
          !this.conditions.includes("Rain"):
          "might rain";
        case this.precipitationProb > 50 && !this.conditions.includes("Rain"):
          "will probably rain";
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
  background-color: lightgreen;
}

.content {
  max-width: 600px;
  text-align: center;
  padding: 20px;
  /* border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
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