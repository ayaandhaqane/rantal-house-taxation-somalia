// // utils/quarterUtils.js
// function getQuarterInfo(date) {
//   const month = date.getMonth() + 1; // JavaScript months are 0-indexed
//   let quarter = '';
//   let dueDate = null;

//   if (month >= 1 && month <= 3) {
//     quarter = 'Q1';
//     dueDate = new Date(date.getFullYear(), 3, 30); // April 30
//   } else if (month >= 4 && month <= 6) {
//     quarter = 'Q2';
//     dueDate = new Date(date.getFullYear(), 6, 30); // July 30
//   } else if (month >= 7 && month <= 9) {
//     quarter = 'Q3';
//     dueDate = new Date(date.getFullYear(), 9, 30); // October 30
//   } else {
//     quarter = 'Q4';
//     dueDate = new Date(date.getFullYear(), 11, 31); // December 31
//   }

//   return { quarter, dueDate };
// }

// module.exports = { getQuarterInfo };


// // utils/quarterUtils.js
// function getQuarterInfo(date) {
//     const month = date.getMonth() + 1; // 0-indexed
//     let quarter = '';
//     let dueDate = null;
  
//     if (month >= 1 && month <= 3) {
//       quarter = 'Q1';
//       dueDate = new Date(date.getFullYear(), 3, 31); // April 30
//     } else if (month >= 4 && month <= 6) {
//       quarter = 'Q2';
//       dueDate = new Date(date.getFullYear(), 6, 30); // July 30
//     } else if (month >= 7 && month <= 9) {
//       quarter = 'Q3';
//       dueDate = new Date(date.getFullYear(), 9, 30); // October 30
//     } else {
//       quarter = 'Q4';
//       dueDate = new Date(date.getFullYear(), 11, 31); // December 31
//     }
  
//     return { quarter, dueDate };
//   }
  
//   module.exports = { getQuarterInfo };
  



// // utils/quarter.js

// function getQuarterInfo(date) {
//     const month = date.getMonth() + 1; // 1-12
//     const year = date.getFullYear();
//     let quarter = '';
//     let dueDate = null;
  
//     if (month >= 1 && month <= 3) {
//       quarter = 'Q1';
//       dueDate = new Date(year, 2, 30); // March 30
//     } else if (month >= 4 && month <= 6) {
//       quarter = 'Q2';
//       dueDate = new Date(year, 5, 30); // June 30
//     } else if (month >= 7 && month <= 9) {
//       quarter = 'Q3';
//       dueDate = new Date(year, 8, 30); // September 30
//     } else {
//       quarter = 'Q4';
//       dueDate = new Date(year, 11, 31); // December 31
//     }
  
//     return { quarter, dueDate };
//   }
  
//   module.exports = { getQuarterInfo };
  



// function getQuarterInfo(date) {
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();
//   let quarter = '';
//   let dueDate = null;

//   if (month >= 1 && month <= 3) {
//     quarter = 'Q1';
//     dueDate = new Date(year, 2, 30); // March 30
//   } else if (month >= 4 && month <= 6) {
//     quarter = 'Q2';
//     dueDate = new Date(year, 5, 30); // June 30
//   } else if (month >= 7 && month <= 9) {
//     quarter = 'Q3';
//     dueDate = new Date(year, 8, 30); // September 30
//   } else {
//     quarter = 'Q4';
//     dueDate = new Date(year, 11, 31); // December 31
//   }

//   return { quarter, dueDate };
// }

// // Generate all quarters between two dates inclusive
// function getAllQuartersBetween(startDate, endDate) {
//   const quarters = [];
//   let currentYear = startDate.getFullYear();
//   let currentMonth = startDate.getMonth() + 1;

//   while (
//     currentYear < endDate.getFullYear() ||
//     (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth() + 1)
//   ) {
//     let quarter, dueDate;

//     if (currentMonth >= 1 && currentMonth <= 3) {
//       quarter = 'Q1';
//       dueDate = new Date(currentYear, 2, 30);
//       currentMonth = 4;
//     } else if (currentMonth >= 4 && currentMonth <= 6) {
//       quarter = 'Q2';
//       dueDate = new Date(currentYear, 5, 30);
//       currentMonth = 7;
//     } else if (currentMonth >= 7 && currentMonth <= 9) {
//       quarter = 'Q3';
//       dueDate = new Date(currentYear, 8, 30);
//       currentMonth = 10;
//     } else {
//       quarter = 'Q4';
//       dueDate = new Date(currentYear, 11, 31);
//       currentMonth = 1;
//       currentYear++;
//     }
//     quarters.push({ quarter, dueDate });
//   }

//   return quarters;
// }

// module.exports = { getQuarterInfo, getAllQuartersBetween };









// utils/quarter.js
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
