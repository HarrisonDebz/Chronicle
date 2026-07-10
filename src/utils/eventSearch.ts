import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    isWithinInterval,
    parseISO,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from "date-fns";

import type { ChronicleEvent } from "../types/Event";
import type {
    EventDateFilter,
    EventFilterState,
} from "../types/Filters";

import {
    isCompletedEvent,
    isUpcomingCountdown,
} from "./eventStatus";

function matchesSearch(
    event: ChronicleEvent,
    query: string
) {
    const normalizedQuery =
        query.trim().toLowerCase();

    if (!normalizedQuery) {
        return true;
    }

    const searchableText = [
        event.title,
        event.description ?? "",
        event.category,
    ]
        .join(" ")
        .toLowerCase();

    return searchableText.includes(
        normalizedQuery
    );
}

function matchesView(
    event: ChronicleEvent,
    view: EventFilterState["view"]
) {
    if (view === "upcoming") {
        return isUpcomingCountdown(event);
    }

    if (view === "memories") {
        return isCompletedEvent(event);
    }

    return true;
}

function matchesCategory(
    event: ChronicleEvent,
    category: EventFilterState["category"]
) {
    return (
        category === "all" ||
        event.category === category
    );
}

function getDateInterval(
    dateRange: EventDateFilter,
    now: Date
) {
    switch (dateRange) {
        case "week":
            return {
                start: startOfWeek(now, {
                    weekStartsOn: 1,
                }),
                end: endOfWeek(now, {
                    weekStartsOn: 1,
                }),
            };

        case "month":
            return {
                start: startOfMonth(now),
                end: endOfMonth(now),
            };

        case "year":
            return {
                start: startOfYear(now),
                end: endOfYear(now),
            };

        default:
            return null;
    }
}

function matchesDateRange(
    event: ChronicleEvent,
    dateRange: EventDateFilter,
    now: Date
) {
    const interval =
        getDateInterval(dateRange, now);

    if (!interval) {
        return true;
    }

    return isWithinInterval(
        parseISO(event.date),
        interval
    );
}

export function filterChronicleEvents(
    events: ChronicleEvent[],
    filters: EventFilterState
) {
    const now = new Date();

    return events.filter((event) => {
        return (
            matchesSearch(
                event,
                filters.query
            ) &&
            matchesView(
                event,
                filters.view
            ) &&
            matchesCategory(
                event,
                filters.category
            ) &&
            matchesDateRange(
                event,
                filters.dateRange,
                now
            )
        );
    });
}