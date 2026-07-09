import {
    differenceInCalendarDays,
    parseISO,
} from "date-fns";

import type { ChronicleEvent } from "../types/Event";
import { isCompletedEvent } from "./eventStatus";

const MAX_COUNTDOWN_DAYS = 365;

export function getProgress(event: ChronicleEvent) {
    if (isCompletedEvent(event)) {
        return 100;
    }

    const daysRemaining = differenceInCalendarDays(
        parseISO(event.date),
        new Date()
    );

    if (daysRemaining <= 0) {
        return 100;
    }

    const percentage =
        (daysRemaining / MAX_COUNTDOWN_DAYS) * 100;

    return Math.min(
        Math.max(percentage, 0),
        100
    );
}