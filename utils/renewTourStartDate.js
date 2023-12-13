module.exports = (tour) => {
  // This is just a trick to automatically renew the tour start date as time goes by
  const now = new Date();
  const tourDate = tour.startDates[0];
  tourDate.setFullYear(
    now.getFullYear() + (tourDate.getMonth() > now.getMonth() ? 0 : 1)
  );
  tour.startDates[0] = tourDate;
  return tour;
};
