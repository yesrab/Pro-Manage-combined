const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  let suffix;

  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  } else if (day === 2 || day === 22) {
    suffix = "nd";
  } else if (day === 3 || day === 23) {
    suffix = "rd";
  } else {
    suffix = "th";
  }

  return `${month}${day}${suffix}`;
}

export function getCurrentFormattedDate() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  function getOrdinalSuffix(number) {
    if (number >= 11 && number <= 13) {
      return `${number}th`;
    }
    switch (number % 10) {
      case 1:
        return `${number}st`;
      case 2:
        return `${number}nd`;
      case 3:
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  }

  const formattedDate = `${getOrdinalSuffix(day)} ${month}, ${year}`;
  return formattedDate;
}

export default formatDate;
