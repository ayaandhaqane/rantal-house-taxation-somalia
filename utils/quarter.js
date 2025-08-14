function getQuarterInfo(date) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let quarter = '';
  let dueDate = null;

  if (month >= 1 && month <= 3) {
    quarter = 'Q1';
    dueDate = new Date(year, 2, 30);
  } else if (month >= 4 && month <= 6) {
    quarter = 'Q2';
    dueDate = new Date(year, 5, 30);
  } else if (month >= 7 && month <= 9) {
    quarter = 'Q3';
    dueDate = new Date(year, 8, 30);
  } else {
    quarter = 'Q4';
    dueDate = new Date(year, 11, 31);
  }
  return { quarter, dueDate };
}

function getAllQuartersBetween(startDate, endDate) {
  const quarters = [];
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth() + 1;

  while (
    currentYear < endDate.getFullYear() ||
    (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth() + 1)
  ) {
    let quarter, dueDate;

    if (currentMonth >= 1 && currentMonth <= 3) {
      quarter = 'Q1';
      dueDate = new Date(currentYear, 2, 30);
      currentMonth = 4;
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      quarter = 'Q2';
      dueDate = new Date(currentYear, 5, 30);
      currentMonth = 7;
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      quarter = 'Q3';
      dueDate = new Date(currentYear, 8, 30);
      currentMonth = 10;
    } else {
      quarter = 'Q4';
      dueDate = new Date(currentYear, 11, 31);
      currentMonth = 1;
      currentYear++;
    }
    quarters.push({ quarter, dueDate });
  }
  return quarters;
}

module.exports = { getQuarterInfo, getAllQuartersBetween };