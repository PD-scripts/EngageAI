const weatherService = require('./weatherService');

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Shimla', 'Pune'];

/**
 * Evaluates weather parameters for a city and returns recommendation details.
 * 
 * @param {{city: string, temperature: number, condition: string}} weather 
 * @returns {object}
 */
function evaluateCityWeather(weather) {
  const { city, temperature, condition } = weather;
  const condLower = condition.toLowerCase();

  // Rule 2: RAIN
  // If condition contains: Rain, Drizzle, Thunderstorm
  if (
    condLower.includes('rain') ||
    condLower.includes('drizzle') ||
    condLower.includes('thunderstorm') ||
    condLower.includes('shower')
  ) {
    return {
      type: 'RAIN',
      city,
      title: 'Rainy Day Coffee Moment',
      description: `Rainfall expected in ${city} today.`,
      recommendation: 'Promote Cappuccino and Mocha.',
      campaignIdea: 'Rain & Brew Campaign',
      score: 100 // High priority
    };
  }

  // Rule 1: HOT
  // If temperature > 35°C
  if (temperature > 35) {
    return {
      type: 'HOT',
      city,
      title: 'Heatwave Opportunity',
      description: `${city} is experiencing ${temperature}°C weather today.`,
      recommendation: 'Promote Cold Brew and Iced Latte.',
      campaignIdea: 'Beat The Heat Campaign',
      score: 80 + (temperature - 35)
    };
  }

  // Rule 3: COLD
  // If temperature < 15°C
  if (temperature < 15) {
    return {
      type: 'COLD',
      city,
      title: 'Winter Coffee Opportunity',
      description: `${city} is currently ${temperature}°C.`,
      recommendation: 'Promote Hot Chocolate and Espresso.',
      campaignIdea: 'Warm Up Campaign',
      score: 80 + (15 - temperature)
    };
  }

  // Moderate/Warm Weather Fallback Rules (ensures dashboard is never blank)
  if (temperature >= 25) {
    return {
      type: 'WARM',
      city,
      title: 'Sunny Day Coffee Peak',
      description: `${city} is warm at ${temperature}°C today.`,
      recommendation: 'Promote Iced Latte and Flat White.',
      campaignIdea: 'Sunny Sips Campaign',
      score: 30 + (temperature - 25)
    };
  } else {
    return {
      type: 'NORMAL',
      city,
      title: 'Mild Brew Opportunity',
      description: `${city} is pleasant at ${temperature}°C today.`,
      recommendation: 'Promote Cappuccino and Flat White.',
      campaignIdea: 'Perfect Day Blend',
      score: 10 + (25 - temperature)
    };
  }
}

/**
 * Aggregates and returns weather-based marketing recommendations for all cities,
 * sorted by strength of opportunity.
 * 
 * @returns {Promise<Array<object>>}
 */
async function getWeatherRecommendations() {
  const weatherPromises = CITIES.map(async (city) => {
    try {
      return await weatherService.fetchWeather(city);
    } catch (err) {
      console.error(`[WeatherRecommendationService] Error for ${city}:`, err.message);
      return null;
    }
  });

  const results = await Promise.all(weatherPromises);
  const activeWeatherData = results.filter(w => w !== null);

  if (activeWeatherData.length === 0) {
    throw new Error('All weather API calls failed.');
  }

  const recommendations = activeWeatherData.map(evaluateCityWeather);

  // Sort descending by priority score (strongest opportunity first)
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}

module.exports = {
  getWeatherRecommendations
};
