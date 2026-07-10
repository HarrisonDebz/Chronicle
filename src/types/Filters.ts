import type { EventCategory } from "./Event";

export type EventViewFilter =
    | "all"
    | "upcoming"
    | "memories";

export type EventDateFilter =
    | "anytime"
    | "week"
    | "month"
    | "year";

export type EventCategoryFilter =
    | "all"
    | EventCategory;

export interface EventFilterState {
    query: string;
    view: EventViewFilter;
    category: EventCategoryFilter;
    dateRange: EventDateFilter;
}