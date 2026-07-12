import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import type {
    ChronicleEvent,
    ChronicleEventInput,
} from "../types/Event";

const STORAGE_KEY = "chronicle_events";

function loadFromStorage(): ChronicleEvent[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ChronicleEvent[]) : [];
    } catch {
        return [];
    }
}

export function useEvents() {
    const [events, setEventsState] = useState<ChronicleEvent[]>(loadFromStorage);

    // Persist every change back to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }, [events]);

    // Wrapper so external callers (e.g. useSync) can replace the full list
    function setEvents(next: ChronicleEvent[]) {
        setEventsState(next);
    }

    function addEvent(event: ChronicleEventInput) {
        const newEvent: ChronicleEvent = {
            ...event,
            id: uuid(),
            createdAt: new Date().toISOString(),
        };

        setEventsState((currentEvents) => [
            ...currentEvents,
            newEvent,
        ]);
    }

    function updateEvent(updatedEvent: ChronicleEvent) {
        setEventsState((currentEvents) =>
            currentEvents.map((event) =>
                event.id === updatedEvent.id
                    ? updatedEvent
                    : event
            )
        );
    }

    function deleteEvent(id: string) {
        setEventsState((currentEvents) =>
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