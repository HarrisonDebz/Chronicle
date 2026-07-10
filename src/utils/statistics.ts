import {
    differenceInCalendarDays,
    parseISO,
} from "date-fns";

import type {
    ChronicleEvent,
    EventCategory,
} from "../types/Event";

import {
    getMemoryEvents,
    getUpcomingEvents,
} from "./eventFilters";

// ─── Soonest upcoming countdown ───────────────────────────────────────────────

export function getSoonestMilestone(
    events: ChronicleEvent[]
): ChronicleEvent | null {
    const upcoming = getUpcomingEvents(events);
    return upcoming[0] ?? null;
}

// ─── Memory with the most days elapsed ───────────────────────────────────────

export function getLongestMemory(
    events: ChronicleEvent[]
): ChronicleEvent | null {
    const memories = getMemoryEvents(events);

    if (memories.length === 0) return null;

    return memories.reduce((oldest, current) =>
        parseISO(current.date) < parseISO(oldest.date)
            ? current
            : oldest
    );
}

// ─── Days since a past date ───────────────────────────────────────────────────

export function formatDaysAgo(date: string): number {
    return Math.abs(
        differenceInCalendarDays(parseISO(date), new Date())
    );
}

// ─── Category distribution ────────────────────────────────────────────────────

export interface CategoryStat {
    category: EventCategory;
    count: number;
    percentage: number;
}

export function getCategoryDistribution(
    events: ChronicleEvent[]
): CategoryStat[] {
    if (events.length === 0) return [];

    const counts: Partial<Record<EventCategory, number>> = {};

    for (const event of events) {
        counts[event.category] =
            (counts[event.category] ?? 0) + 1;
    }

    return (
        Object.entries(counts) as [EventCategory, number][]
    )
        .map(([category, count]) => ({
            category,
            count,
            percentage: Math.round(
                (count / events.length) * 100
            ),
        }))
        .sort((a, b) => b.count - a.count);
}

// ─── Completion stats ─────────────────────────────────────────────────────────

export interface CompletionStats {
    upcomingCount: number;
    completedCount: number;
    overallRate: number;
}

export function getCompletionStats(
    events: ChronicleEvent[]
): CompletionStats {
    const upcomingCount = getUpcomingEvents(events).length;
    const completedCount = getMemoryEvents(events).length;
    const total = events.length;

    const overallRate =
        total === 0
            ? 0
            : Math.round((completedCount / total) * 100);

    return { upcomingCount, completedCount, overallRate };
}
