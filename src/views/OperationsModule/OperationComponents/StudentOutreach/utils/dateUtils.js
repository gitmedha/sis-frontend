// Function to determine financial year based on date (assuming Indian FY: April-March)
export const getFinancialYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

// Function to determine quarter based on date
export const getQuarterFromDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const month = date.getMonth() + 1;

  if (month >= 4 && month <= 6) return "Q1";
  if (month >= 7 && month <= 9) return "Q2";
  if (month >= 10 && month <= 12) return "Q3";
  if (month >= 1 && month <= 3) return "Q4";

  return "";
};

// Function to get month name from date
export const getMonthFromDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()];
}; 