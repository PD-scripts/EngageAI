export const kpisData = [
  {
    id: 'total-customers',
    title: 'TOTAL CUSTOMERS',
    value: '200',
    trend: '↑ 8.2%',
    subtext: 'vs last month'
  },
  {
    id: 'upcoming-birthdays',
    title: 'UPCOMING BIRTHDAYS',
    value: '0 Customers',
    trend: 'Next 30 days',
    subtext: 'Upcoming celebrations'
  },
  {
    id: 'campaigns-sent',
    title: 'CAMPAIGNS SENT',
    value: '8',
    trend: 'Live drafts',
    subtext: ''
  },
  {
    id: 'conversion-rate',
    title: 'CONVERSION RATE',
    value: '3.8%',
    trend: '↑ 4.1%',
    subtext: 'vs last month'
  }
];

export const recommendationsData = [
  {
    id: 'rec-1',
    category: 'HIGH CHURN RISK',
    title: 'Hyderabad shows 67.6% inactivity rate.',
    description: 'Re-engage inactive customers with a personalized offer.',
    actionText: 'Create Reactivation Campaign',
    path: '/campaigns',
    state: { prompt: 'Draft an SMS campaign for Inactive Customers in Hyderabad to reactivate them' },
    imageName: 'coffee_cup_top.png',
    themeColor: 'rose'
  },
  {
    id: 'rec-2',
    category: 'REVENUE OPPORTUNITY',
    title: '63 inactive high-value customers represent ₹4.8L potential revenue.',
    description: 'Target them with an exclusive loyalty campaign.',
    actionText: 'Draft High Value Campaign',
    path: '/campaigns',
    state: { prompt: 'Create a WhatsApp campaign for High Value Customers to Increase Repeat Purchases' },
    imageName: 'coffee_beans_cup.png',
    themeColor: 'emerald'
  },
  {
    id: 'rec-3',
    category: 'BEST PERFORMING CHANNEL',
    title: 'WhatsApp outperforms SMS by 1.4% click rate.',
    description: 'Shift more campaigns to WhatsApp for better engagement.',
    actionText: 'Shift Focus to WhatsApp',
    path: '/campaigns',
    state: { prompt: 'Draft a WhatsApp campaign for All Customers to Increase Sales' },
    imageName: 'iced_coffee.png',
    themeColor: 'amber'
  }
];

export const revenueChartData = [
  { name: 'Jan', revenue: 4200, orders: 2000 },
  { name: 'Feb', revenue: 5100, orders: 2400 },
  { name: 'Mar', revenue: 4900, orders: 2100 },
  { name: 'Apr', revenue: 6200, orders: 3200 },
  { name: 'May', revenue: 7800, orders: 4800 },
  { name: 'Jun', revenue: 9500, orders: 6400 }
];

export const strategyDraftsData = [
  {
    id: 'draft-1',
    title: 'Summer Coffee Delight',
    audienceName: 'Loyalty Members',
    channel: 'WhatsApp',
    score: 90,
    imageName: 'coffee_latte_art.png'
  },
  {
    id: 'draft-2',
    title: 'Monsoon Warmers',
    audienceName: 'All Customers',
    channel: 'SMS',
    score: 90,
    imageName: 'coffee_drip.png'
  },
  {
    id: 'draft-3',
    title: 'Cold Brew Weekend Offer',
    audienceName: 'High Value Customers',
    channel: 'WhatsApp',
    score: 88,
    imageName: 'coffee_cup_top.png'
  }
];
