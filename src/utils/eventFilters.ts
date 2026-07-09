import type { ChronicleEvent } from "../types/Event";
import { parseISO } from "date-fns";
import {
    isCompletedEvent,
    isUpcomingCountdown,
} from "./eventStatus";

export function getUpcomingEvents(events: ChronicleEvent[]) {
    return events
        .filter((event) => isUpcomingCountdown(event))
        .sort(
            (a, b) =>
                parseISO(a.date).getTime() - parseISO(b.date).getTime()
        );
}

export function getMemoryEvents(events: ChronicleEvent[]) {
    return events
        .filter((event) => isCompletedEvent(event))
        .sort(
            (a, b) =>
                parseISO(b.date).getTime() - parseISO(a.date).getTime()
        );
}