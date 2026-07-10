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

export interface ChronicleEvent {
    id: string;
    title: string;
    description?: string;

    type: EventType;

    date: string;

    category: EventCategory;

    recurring: boolean;

    createdAt: string;
}

export type ChronicleEventInput = Omit<
    ChronicleEvent,
    "id" | "createdAt"
>;