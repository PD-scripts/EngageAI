const Customer = require('../../models/Customer');

/**
 * Reusable core query function to locate customers with upcoming birthdays.
 * Analyzes DOB in a year-independent manner.
 * 
 * @param {number} days - Time window in days
 * @param {function} filterFn - Optional filter callback for Customer document
 * @returns {Promise<Array<object>>} Plain objects array
 */
async function getUpcomingBirthdays(days = 30, filterFn = null) {
  const customers = await Customer.find().lean();
  const today = new Date();
  
  // Normalize comparison start to 00:00:00.000 today
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const upcoming = [];

  for (const customer of customers) {
    if (!customer.dateOfBirth) continue;
    if (filterFn && !filterFn(customer)) continue;

    const dob = new Date(customer.dateOfBirth);
    let birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

    if (birthdayThisYear < start) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = birthdayThisYear - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= days) {
      upcoming.push(customer);
    }
  }

  return upcoming;
}

/**
 * Returns customers whose birthdays occur in the next 7 days.
 */
async function getUpcomingBirthdays7Days() {
  return getUpcomingBirthdays(7);
}

/**
 * Returns customers whose birthdays occur in the next 30 days.
 */
async function getUpcomingBirthdays30Days() {
  return getUpcomingBirthdays(30);
}

/**
 * Returns VIP customers whose birthdays occur in the next 14 days.
 */
async function getUpcomingVIPBirthdays() {
  return getUpcomingBirthdays(14, (c) => c.customerType === 'VIP');
}

/**
 * Returns High Value customers whose birthdays occur in the next 30 days.
 */
async function getUpcomingHighValueBirthdays() {
  return getUpcomingBirthdays(30, (c) => c.customerType === 'High Value');
}

/**
 * Generates birthday-based recommendations from live MongoDB data.
 * Reusable function consumed by the AI Strategist and Campaign Agents.
 * 
 * @returns {Promise<Array<object>>}
 */
async function generateBirthdayRecommendations() {
  const recommendations = [];

  try {
    const list7Days = await getUpcomingBirthdays7Days();
    const count7Days = list7Days.length;

    const list30Days = await getUpcomingBirthdays30Days();
    const count30Days = list30Days.length;

    const listVip14Days = await getUpcomingVIPBirthdays();
    const countVip = listVip14Days.length;

    // Rule 1: Birthday Week Campaign
    // Condition: Upcoming birthdays within 7 days > 0
    if (count7Days > 0) {
      recommendations.push({
        id: "birthday-week-campaign",
        type: "BIRTHDAY_WEEK",
        priority: "HIGH",
        title: "Birthday Week Opportunity",
        description: `${count7Days} customers have birthdays within the next 7 days.`,
        action: "Launch Free Cappuccino Birthday Campaign",
        path: "/campaigns",
        state: { 
          prompt: `Create a WhatsApp campaign for customers with birthdays this week to reward them with a Free Cappuccino` 
        }
      });
    }

    // Rule 3: VIP Birthday Campaign
    // Condition: VIP customers have birthdays in next 14 days > 0
    if (countVip > 0) {
      recommendations.push({
        id: "vip-birthday-campaign",
        type: "VIP_BIRTHDAY",
        priority: "HIGH",
        title: "VIP Birthday Opportunity",
        description: `${countVip} VIP customers have birthdays approaching.`,
        action: "Launch Premium Coffee Gift Campaign",
        path: "/campaigns",
        state: { 
          prompt: `Create a WhatsApp campaign for VIP customers with upcoming birthdays to Promote Premium Coffee Gift` 
        }
      });
    }

    // Rule 2: Birthday Month Campaign
    // Condition: Upcoming birthdays within 30 days > 20
    if (count30Days > 20) {
      recommendations.push({
        id: "birthday-month-campaign",
        type: "BIRTHDAY_MONTH",
        priority: "MEDIUM",
        title: "Birthday Month Special",
        description: `${count30Days} customers celebrate birthdays this month.`,
        action: "Launch Birthday Month Coffee Rewards Campaign",
        path: "/campaigns",
        state: { 
          prompt: `Create a WhatsApp campaign for customers with birthdays this month to Promote Birthday Month Coffee Rewards` 
        }
      });
    }

  } catch (error) {
    console.error('[Birthday Service] Recommendation generation failed:', error.message);
  }

  return recommendations;
}

module.exports = {
  getUpcomingBirthdays,
  getUpcomingBirthdays7Days,
  getUpcomingBirthdays30Days,
  getUpcomingVIPBirthdays,
  getUpcomingHighValueBirthdays,
  getCustomersWithUpcomingBirthdays: getUpcomingBirthdays30Days,
  generateBirthdayRecommendations
};
