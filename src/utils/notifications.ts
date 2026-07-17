import type { ChronicleEvent } from "../types/Event";

/**
 * Calculates the Unix timestamp (ms) at which the notification for an event
 * should fire, or `null` if no notification is configured / applicable.
 *
 * Shared between the main-thread hook (useNotifications) and the service
 * worker (sw.ts) so both sides always produce the same schedule.
 */
export function calculateNotificationTime(
    event: ChronicleEvent
): number | null {
    if (event.notifyBefore === "none" || !event.notifyBefore) return null;

    const eventDate = new Date(event.date);
    const eventTime = eventDate.getTime();
    const now = Date.now();

    if (event.type === "countdown") {
        // Don't schedule if the event has already passed
        if (eventTime < now) return null;

        switch (event.notifyBefore) {
            case "on-day":
                // 9:00 AM on the day of the event
                return new Date(
                    eventDate.getFullYear(),
                    eventDate.getMonth(),
                    eventDate.getDate(),
                    9, 0, 0
                ).getTime();
            case "1-day":
                return eventTime - 24 * 60 * 60 * 1000;
            case "1-hour":
                return eventTime - 60 * 60 * 1000;
            case "15-min":
                return eventTime - 15 * 60 * 1000;
            default:
                return null;
        }
    }

    if (event.type === "countup") {
        // Only "on-day" (anniversary reminder) is supported for memories
        if (event.notifyBefore !== "on-day") return null;

        // Find the next anniversary of this memory in the future
        const nowLocal = new Date();
        let anniversaryYear = nowLocal.getFullYear();
        const anniversaryEnd = new Date(
            anniversaryYear,
            eventDate.getMonth(),
            eventDate.getDate(),
            23, 59, 59, 999
        ).getTime();

        if (anniversaryEnd < nowLocal.getTime()) {
            anniversaryYear += 1;
        }
        return new Date(
            anniversaryYear,
            eventDate.getMonth(),
            eventDate.getDate(),
            9, 0, 0
        ).getTime();
    }

    return null;
}

/**
 * Builds the notification title and body text for an event, given the time at
 * which the notification will fire (`notifyTime`).
 */
export function buildNotificationContent(
    event: ChronicleEvent,
    notifyTime: number
): { title: string; body: string } {
    if (event.type === "countdown") {
        const diff = new Date(event.date).getTime() - notifyTime;
        let body: string;
        if (diff <= 0) body = "Starting now!";
        else if (diff <= 20 * 60 * 1000) body = "Starting in 15 minutes!";
        else if (diff <= 90 * 60 * 1000) body = "Starting in 1 hour!";
        else if (diff <= 25 * 60 * 60 * 1000) body = "Starting tomorrow!";
        else body = "Starting today!";
        return { title: event.title, body };
    }

    // countup — anniversary
    const eventDate = new Date(event.date);
    const anniversaryDate = new Date(notifyTime);
    const years = anniversaryDate.getFullYear() - eventDate.getFullYear();
    return {
        title: `Anniversary: ${event.title}`,
        body: `Today marks ${years} ${years === 1 ? "year" : "years"} since this memory occurred.`,
    };
}
