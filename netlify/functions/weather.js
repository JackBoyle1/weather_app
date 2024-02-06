exports.handler = async (event) => {
  let requestParams = JSON.parse(event.body);

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${requestParams.location}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`
    );

    if (!response.ok) {
      throw new Error("Oops! Something went wrong");
    }

    const jsonData = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
