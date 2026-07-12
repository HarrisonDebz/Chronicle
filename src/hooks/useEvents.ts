import { useState } from "react";
import { v4 as uuid } from "uuid";

import type {
    ChronicleEvent,
    ChronicleEventInput,
} from "../types/Event";

export function useEvents() {
    const [events, setEvents] = useState<ChronicleEvent[]>([]);

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
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
    };
}