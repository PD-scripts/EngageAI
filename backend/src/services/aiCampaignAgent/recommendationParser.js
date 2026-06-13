/**
 * Parses simple recommendation prompts to extract key details.
 * Useful for categorizing the type of target campaign and identifying the city context.
 */
function parseRecommendation(text) {
  const lower = text.toLowerCase();
  
  let type = 'Reactivation'; // Default type
  let city = '';
  
  // Identify city names in India database bounds
  if (lower.includes('delhi')) city = 'Delhi';
  else if (lower.includes('mumbai')) city = 'Mumbai';
  else if (lower.includes('pune')) city = 'Pune';
  else if (lower.includes('bangalore')) city = 'Bangalore';
  else if (lower.includes('hyderabad')) city = 'Hyderabad';

  // Categorize campaign type
  if (lower.includes('birthday') || lower.includes('birthdays')) {
    type = 'Birthday';
  } else if (lower.includes('weather') || lower.includes('temperature') || lower.includes('heatwave') || lower.includes('cold brew')) {
    type = 'Weather';
  } else if (lower.includes('reactivate') || lower.includes('inactive') || lower.includes('win-back') || lower.includes('win back')) {
    type = 'Reactivation';
  }
  
  return {
    type,
    city
  };
}

module.exports = {
  parseRecommendation
};
