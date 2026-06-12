const axios = require('axios');

/**
 * Fetches current weather info (temperature, condition, location) for a given city name.
 * Uses WeatherAPI.com.
 * 
 * @param {string} city - The name of the city (e.g. 'Delhi')
 * @returns {Promise<{city: string, temperature: number, condition: string}>}
 */
async function fetchWeather(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    throw new Error('WEATHER_API_KEY is not configured or is a placeholder.');
  }

  const url = 'https://api.weatherapi.com/v1/current.json';
  try {
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        q: city,
        aqi: 'no'
      },
      timeout: 5000
    });

    const data = response.data;
    if (!data || !data.current || !data.location) {
      throw new Error('Malformed response from WeatherAPI');
    }

    return {
      city: data.location.name,
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text
    };
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    throw new Error(`WeatherAPI error for ${city}: ${errorMsg}`);
  }
}

module.exports = {
  fetchWeather
};
