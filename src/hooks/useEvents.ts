import { useLocalStorage } from "./useLocalStorage";
import type { ChronicleEvent } from "../types/Event";
import { v4 as uuid } from "uuid";


export function useEvents() {

    const [events, setEvents] =
        useLocalStorage<ChronicleEvent[]>(
            "chronicle-events",
            []
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