import { isAfter, parseISO } from "date-fns";
import type { ChronicleEvent } from "../types/Event";

export function isUpcomingCountdown(event: ChronicleEvent) {
    return (
        event.type === "countdown" &&
        isAfter(parseISO(event.date), new Date())
    );
}

/**
 * Returns true when an event should appear in the "Memories" section:
 * - All `countup` events are memories by definition.
 * - A `countdown` whose date has already passed becomes a memory.
 */
export function isCompletedEvent(event: ChronicleEvent) {
    if (event.type === "countup") return true;
    return !isAfter(parseISO(event.date), new Date());
}