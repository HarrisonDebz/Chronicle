import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    isSameDay,
    parseISO,
    startOfMonth,
    startOfWeek,
} from "date-fns";

import type { ChronicleEvent } from "../types/Event";

export function getCalendarDays(month: Date) {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const calendarStart = startOfWeek(
        monthStart,
        {
            weekStartsOn: 1,
        }
    );

    const calendarEnd = endOfWeek(
        monthEnd,
        {
            weekStartsOn: 1,
        }
    );

    return eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });
}

export function getEventsForDay(
    events: ChronicleEvent[],
    day: Date
) {
    return events
        .filter((event) =>
            isSameDay(
                parseISO(event.date),
                day
            )
        )
        .sort(
            (a, b) =>
                parseISO(a.date).getTime() -
                parseISO(b.date).getTime()
        );
}