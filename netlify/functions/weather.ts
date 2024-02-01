// netlify/functions/weather.js

exports.handler = async function (event, context) {
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${event.queryStringParameters.location}?unitGroup=metric&key=VXFWNWG38Q65YTHF2M8K3ZU7J&contentType=json`
      );
  
      if (!response.ok) {
        throw new Error('Oops! Something went wrong');
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
  