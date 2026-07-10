import {
    format,
    parseISO,
} from "date-fns";

const MINUTE_IN_MILLISECONDS =
    60 * 1000;

const MINUTES_IN_DAY =
    24 * 60;

function padTime(value: number) {
    return value
        .toString()
        .padStart(2, "0");
}

export function formatJourneyCountdown(
    date: string,
    now: Date
) {
    const targetDate =
        parseISO(date);

    const difference =
        Math.max(
            targetDate.getTime() -
            now.getTime(),
            0
        );

    const totalMinutes =
        Math.ceil(
            difference /
            MINUTE_IN_MILLISECONDS
        );

    const days = Math.floor(
        totalMinutes /
        MINUTES_IN_DAY
    );

    const hours = Math.floor(
        (
            totalMinutes %
            MINUTES_IN_DAY
        ) / 60
    );

    const minutes =
        totalMinutes % 60;

    return [
        days,
        padTime(hours),
        padTime(minutes),
    ].join(":");
}

export function formatJourneyMemoryDate(
    date: string
) {
    return format(
        parseISO(date),
        "MMM dd, yyyy"
    ).toUpperCase();
}