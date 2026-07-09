import { useLocalStorage } from "./useLocalStorage";
import type { ChronicleEvent } from "../types/Event";
import { demoEvents } from "../data/demoEvents";


export function useEvents() {

    const [events, setEvents] =
        useLocalStorage<ChronicleEvent[]>(
            "chronicle-events",
            demoEvents
        );


    function addEvent(event: ChronicleEvent) {

        setEvents([
            ...events,
            event,
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