import { useLocalStorage } from "./useLocalStorage";
import type { ChronicleEvent } from "../types/Event";
import { demoEvents } from "../data/demoEvents";
import { v4 as uuid } from "uuid";


export function useEvents() {

    const [events, setEvents] =
        useLocalStorage<ChronicleEvent[]>(
            "chronicle-events",
            demoEvents
        );


    function addEvent(
        event: Omit<ChronicleEvent, "id" | "createdAt">
    ) {

        const newEvent: ChronicleEvent = {
            ...event,
            id: uuid(),
            createdAt: new Date().toISOString(),
        };


        setEvents([
            ...events,
            newEvent,
        ]);

    }


    function deleteEvent(id: string) {

        setEvents(
            events.filter(
                event => event.id !== id
            )
        );

    }


    return {
        events,
        addEvent,
        deleteEvent,
    };

}