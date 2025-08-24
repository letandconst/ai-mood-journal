import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export function useCalendar(currentDate: Date, weekStartsOn = 0) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const start = startOfWeek(monthStart, { weekStartsOn });
  const end = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start, end });
}
