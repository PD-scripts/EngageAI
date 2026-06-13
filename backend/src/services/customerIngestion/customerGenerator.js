const CITIES = ['Delhi', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Lucknow', 'Kanpur'];

const FIRST_NAMES = [
  'Rahul', 'Ankit', 'Amit', 'Rohan', 'Vikram', 'Sanjay', 'Arjun', 'Rajiv', 'Pranav', 'Nikhil', 'Kunal', 'Dev', 'Rohit', 'Gaurav', 'Varun',
  'Priya', 'Neha', 'Pooja', 'Sneha', 'Ritu', 'Anjali', 'Tanvi', 'Shreya', 'Divya', 'Meera', 'Aditi', 'Kavita', 'Kiran', 'Sunita', 'Shalini'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Rao', 'Patel', 'Joshi', 'Reddy', 'Sen', 'Das', 'Nair', 'Kumar', 'Singh', 'Iyer', 'Patil'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 2)) + min;
}

/**
 * Generates a single customer object with realistic Indian details.
 * @returns {object}
 */
function generateDummyCustomer() {
  const uniqueId = Date.now().toString() + getRandomInt(100, 999);
  const customerId = `CUST${uniqueId}`;
  
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${getRandomInt(10, 999)}@gmail.com`;
  const phone = `9${getRandomInt(7000, 9999)}${getRandomInt(10000, 99999)}`;
  const city = getRandomElement(CITIES);
  
  // DOB between 1970 and 2005
  const birthYear = getRandomInt(1970, 2005);
  const birthMonth = getRandomInt(0, 11);
  const birthDay = getRandomInt(1, 28);
  const dob = new Date(birthYear, birthMonth, birthDay).toISOString().split('T')[0];
  
  return {
    customerId,
    name,
    email,
    phone,
    city,
    dob,
    customerType: 'Regular',
    createdAt: new Date()
  };
}

module.exports = {
  generateDummyCustomer
};
