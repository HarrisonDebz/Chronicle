export type EventType = "countdown" | "countup";

export type EventCategory =
    | "birthday"
    | "relationship"
    | "education"
    | "sports"
    | "coding"
    | "holiday"
    | "goal"
    | "other";

export type NotificationSetting = "none" | "on-day" | "1-day" | "1-hour" | "15-min";

export interface ChronicleEvent {
    id: string;
    title: string;
    description?: string;

    type: EventType;

    date: string;

    category: EventCategory;

    /** Custom label shown when category is "other" */
    customCategory?: string;

    recurring: boolean;

    notifyBefore?: NotificationSetting;

    createdAt: string;

    /** ISO timestamp of the most recent edit — used for sync conflict resolution */
    updatedAt?: string;
}

export type ChronicleEventInput = Omit<
    ChronicleEvent,
    "id" | "createdAt"
>;