import {
    differenceInCalendarDays,
    format,
    parseISO,
} from "date-fns";

export function formatEventDate(date: string) {
    return format(parseISO(date), "MMM dd");
}

export function formatEventDateLong(date: string) {
    return format(parseISO(date), "MMM dd, yyyy");
}

export function formatMemoryDate(date: string) {
    return format(parseISO(date), "MMM yyyy");
}

export function getDaysLeftLabel(date: string) {
    const days = differenceInCalendarDays(
        parseISO(date),
        new Date()
    );

    if (days <= 0) {
        return "Completed";
    }

    if (days === 1) {
        return "1 Day Remaining";
    }

    return `${days} Days Remaining`;
}