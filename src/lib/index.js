export const addCommas = (number) => {
  return `${number || ""}`?.replace(/(.)(?=(.{3})+$)/g, "$1,");
};
export function calculateHoursAndMinutesDifference(startDate, endDate) {
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = new Date(endDate) - new Date(startDate);

  // Convert to hours
  const hoursDifference = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );

  // Calculate remaining milliseconds after removing hours
  const remainingMilliseconds = differenceInMilliseconds % (1000 * 60 * 60);

  // Convert remaining milliseconds to minutes and seconds
  const minutesDifference = Math.floor(remainingMilliseconds / (1000 * 60));
  const secondsDifference = Math.floor(remainingMilliseconds / 1000) % 60;

  return {
    hours: hoursDifference > 0 ? hoursDifference : 0,
    minutes: minutesDifference > 0 ? minutesDifference : 0,
    seconds: secondsDifference > 0 ? secondsDifference : 0,
    text:
      (hoursDifference > 0 ? hoursDifference : 0) +
      " h " +
      (minutesDifference > 0 ? minutesDifference : 0) +
      " m " +
      (secondsDifference > 0 ? secondsDifference : 0) +
      " s",
  };
}
export function calculateDaysDifference(startDate, endDate) {
  let date1 = new Date(startDate);
  let date2 = new Date(endDate);

  // Calculating the time difference
  // of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return Difference_In_Days;
}
