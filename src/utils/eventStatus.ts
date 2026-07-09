import { isAfter, parseISO } from "date-fns";
import type { ChronicleEvent } from "../types/Event";

export function isUpcomingCountdown(event: ChronicleEvent) {
    return (
        event.type === "countdown" &&
        isAfter(parseISO(event.date), new Date())
    );
}

export function isCompletedEvent(event: ChronicleEvent) {
    return !isUpcomingCountdown(event);
}