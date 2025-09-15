export function calculateDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end.getDate() - start.getDate()) + 1;
};
