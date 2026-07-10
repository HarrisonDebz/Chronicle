import { useState } from "react";

import AddEventButton from "../components/AddEventButton";
import AddEventModal from "../components/AddEventModal";
import AppShell from "../components/AppShell";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import MemoriesTimeline from "../components/MemoriesTimeline";
import NamePromptModal from "../components/NamePromptModal";
import UpcomingSection from "../components/UpcomingSection";

import { useEvents } from "../hooks/useEvents";
import { useProfile } from "../hooks/useProfile";

import {
    getMemoryEvents,
    getUpcomingEvents,
} from "../utils/eventFilters";

import type { ChronicleEvent } from "../types/Event";

export default function Home() {
    const {
        events,
        addEvent,
        deleteEvent,
    } = useEvents();

    const {
        profileName,
        saveProfileName,
    } = useProfile();

    const [open, setOpen] = useState(false);

    const [eventToDelete, setEventToDelete] =
        useState<ChronicleEvent | null>(null);

    const upcomingEvents = getUpcomingEvents(events);

    const memoryEvents = getMemoryEvents(events);

    const today = new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    return (
        <AppShell onAddEvent={() => setOpen(true)}>
            <section className="mb-12">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--future)]">
                            Dashboard
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)] md:text-5xl">
                            Hello, {profileName || "Curator"}.
                        </h1>

                        <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
                            You have{" "}
                            <span className="font-bold text-[var(--future)]">
                                {upcomingEvents.length}
                            </span>{" "}
                            upcoming events and{" "}
                            <span className="font-bold text-[var(--memory)]">
                                {memoryEvents.length}
                            </span>{" "}
                            memories in your chronicle.
                        </p>
                    </div>

                    <div
                        className="
              w-fit
              rounded-xl
              border
              border-[var(--border-soft)]
              bg-[var(--surface-card)]
              px-4
              py-3
              text-sm
              font-semibold
              text-[var(--text-muted)]
            "
                    >
                        {today}
                    </div>
                </div>
            </section>

            {events.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <UpcomingSection
                        events={upcomingEvents}
                        onDeleteRequest={setEventToDelete}
                    />

                    <MemoriesTimeline
                        events={memoryEvents}
                        onDeleteRequest={setEventToDelete}
                    />
                </div>
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

            <NamePromptModal
                open={!profileName}
                onSave={saveProfileName}
            />
        </AppShell>
    );
}