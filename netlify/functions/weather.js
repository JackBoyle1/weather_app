exports.handler = async (event) => {
  const requestParams = JSON.parse(event.body);

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${requestParams.location}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`
    );

    if (!response.ok) {
      throw new Error("Oops! Something went wrong");
    }

    const jsonData = await response.json();

    const todayData = jsonData.days?.[0];
    const tomorrowData = jsonData.days?.[0];

    const time = new Date(
      "1970-01-01T" + jsonData.currentConditions.datetime + "Z"
    );
    const currentHour = time.getHours();
    // const currentHour = 20;

    let daysData = [];
    //fewer than 5 data points remaining for the day
    if (currentHour >= 19) {
      const todaysRemainingElements = 23 - currentHour;

      //push the rest of today's data
      let i = 0;
      while (i <= todaysRemainingElements) {
        daysData.push(todayData.hours[currentHour + i]);
        i++;
      }
      //add the remaining data from tomorrowsData
      const daysDataLength = daysData.length;
      let j = 0;
      while (j < 5 - daysDataLength) {
        daysData.push(tomorrowData.hours[j]);
        j++;
      }
    } else {
      let i = 1;
      while (i <= 5) {
        daysData.push(todayData.hours[currentHour + i]);
        i++;
      }
    }

    const body = {
      time: jsonData.currentConditions?.datetime,
      currentTemperature: jsonData.currentConditions?.feelslike,
      currentWindspeed: jsonData.currentConditions?.windspeed,
      isSnowing: !!jsonData.currentConditions?.snow,
      precipitationProbability: jsonData.currentConditions?.precipprob,
      conditions: jsonData.currentConditions?.conditions,
      daysData: daysData,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
