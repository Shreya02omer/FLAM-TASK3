import {
  addDays,
  addWeeks,
  addMonths,
  format,
  isSameDay,
  parseISO,
} from "date-fns";

export const generateRecurringInstances = (event, startDate, endDate) => {
  const instances = [];
  let current = parseISO(event.date);

  while (current <= endDate) {
    if (current >= startDate) {
      instances.push({ ...event, date: format(current, "yyyy-MM-dd") });
    }

    if (event.recurrence === "Daily") current = addDays(current, 1);
    else if (event.recurrence === "Weekly") current = addWeeks(current, 1);
    else if (event.recurrence === "Monthly") current = addMonths(current, 1);
    else break;
  }
  return instances;
};
