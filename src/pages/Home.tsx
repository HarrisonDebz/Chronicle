import { useState } from "react";

import AddEventButton from "../components/AddEventButton";
import AddEventModal from "../components/AddEventModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import EventSection from "../components/EventSection";

import { useEvents } from "../hooks/useEvents";

import {
    getUpcomingEvents,
    getMemoryEvents,
} from "../utils/eventFilters";

import type { ChronicleEvent } from "../types/Event";

export default function Home() {
    const {
        events,
        addEvent,
        deleteEvent,
    } = useEvents();

    const [open, setOpen] = useState(false);

    const [eventToDelete, setEventToDelete] =
        useState<ChronicleEvent | null>(null);

    const upcomingEvents = getUpcomingEvents(events);

    const memoryEvents = getMemoryEvents(events);

    return (
        <main className="min-h-screen p-8">
            <h1 className="mb-8 text-4xl font-bold">
                Chronicle
            </h1>

            {events.length > 0 ? (
                <>
                    <EventSection
                        title="Upcoming"
                        events={upcomingEvents}
                        onDeleteRequest={setEventToDelete}
                    />

                    <EventSection
                        title="Memories"
                        events={memoryEvents}
                        onDeleteRequest={setEventToDelete}
                    />
                </>
            ) : (
                <EmptyState />
            )}

            <AddEventButton
                onClick={() => setOpen(true)}
            />

            <AddEventModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={addEvent}
            />

            <DeleteConfirmModal
                event={eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={deleteEvent}
            />
        </main>
    );
}