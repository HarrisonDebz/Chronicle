import { v4 as uuid } from "uuid";

import type {
    ChronicleEvent,
    ChronicleEventInput,
} from "../types/Event";

import { useLocalStorage } from "./useLocalStorage";

export function useEvents() {
    const [events, setEvents] =
        useLocalStorage<ChronicleEvent[]>(
            "chronicle-events",
            []
        );

    function addEvent(event: ChronicleEventInput) {
        const newEvent: ChronicleEvent = {
            ...event,
            id: uuid(),
            createdAt: new Date().toISOString(),
        };

        setEvents((currentEvents) => [
            ...currentEvents,
            newEvent,
        ]);
    }

    function updateEvent(updatedEvent: ChronicleEvent) {
        setEvents((currentEvents) =>
            currentEvents.map((event) =>
                event.id === updatedEvent.id
                    ? updatedEvent
                    : event
            )
        );
    }

    function deleteEvent(id: string) {
        setEvents((currentEvents) =>
            currentEvents.filter(
                (event) => event.id !== id
            )
        );
    }

    return {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
    };
}