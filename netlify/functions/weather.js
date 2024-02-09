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
    const body = {
      time: jsonData.currentConditions?.datetime,
      currentTemperature: jsonData.currentConditions?.feelslike,
      currentWindspeed: jsonData.currentConditions?.windspeed,
      isSnowing: !!(jsonData.currentConditions?.snow),
      precipitationProbability: jsonData.currentConditions?.precipprob,
      conditions: jsonData.currentConditions?.conditions,
      todayData: jsonData.days?.[0],
      tomorrowData: jsonData.days?.[1],
    }

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
