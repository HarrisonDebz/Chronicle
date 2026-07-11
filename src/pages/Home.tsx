import {
    useMemo,
    useState,
    useEffect
} from "react";
import AddEventModal from "../components/AddEventModal";
import AppShell from "../components/AppShell";
import CalendarView from "../components/CalendarView";
import CategoryView from "../components/CategoryView";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import EventDetailsModal from "../components/EventDetailsModal";
import EventFilterBar from "../components/EventFilterBar";
import FilteredEmptyState from "../components/FilteredEmptyState";
import JourneyView from "../components/JourneyView";
import StatisticsView from "../components/StatisticsView";
import MemoriesTimeline from "../components/MemoriesTimeline";
import NamePromptModal from "../components/NamePromptModal";
import ProfileSettingsModal from "../components/ProfileSettingsModal";
import UpcomingSection from "../components/UpcomingSection";

import { useEvents } from "../hooks/useEvents";
import { useProfile } from "../hooks/useProfile";
import { useToast } from "../hooks/useToast";
import { useNotifications } from "../hooks/useNotifications";

import type { ChronicleEvent } from "../types/Event";
import type { EventFilterState } from "../types/Filters";
import type { AppView } from "../types/Navigation";

import {
    getMemoryEvents,
    getUpcomingEvents,
} from "../utils/eventFilters";

import {
    filterChronicleEvents,
} from "../utils/eventSearch";

const DEFAULT_FILTERS: EventFilterState = {
    query: "",
    view: "all",
    category: "all",
    dateRange: "anytime",
};

export default function Home() {
    const {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
    } = useEvents();

    const {
        profileName,
        saveProfileName,
        resetProfileName,
    } = useProfile();

    const { addToast } = useToast();
    const { sendNotification, permission } = useNotifications();

    const [activeView, setActiveView] =
        useState<AppView>("dashboard");

    const [
        selectedCalendarDay,
        setSelectedCalendarDay,
    ] = useState<Date>(new Date());

    const [notifiedEventIds, setNotifiedEventIds] = useState<Set<string>>(new Set());

    // Notification check interval
    useEffect(() => {
        if (permission !== 'granted' || events.length === 0) return;

        const checkUpcomingEvents = () => {
            const now = new Date();

            events.forEach(event => {
                if (notifiedEventIds.has(event.id)) return;

                const eventDate = new Date(event.date);
                const timeDiff = eventDate.getTime() - now.getTime();

                // If it's a countdown and starts within 24h but is still in the future
                if (event.type === 'countdown' && timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
                    sendNotification(`Upcoming: ${event.title}`, {
                        body: `Starts in less than 24 hours.`,
                    });
                    setNotifiedEventIds(prev => new Set(prev).add(event.id));
                }
            });
        };

        checkUpcomingEvents();
        const intervalId = setInterval(checkUpcomingEvents, 60 * 60 * 1000); // Check every hour

        return () => clearInterval(intervalId);
    }, [events, permission, notifiedEventIds, sendNotification]);


    const [filters, setFilters] =
        useState<EventFilterState>(
            DEFAULT_FILTERS
        );

    const [
        eventFormOpen,
        setEventFormOpen,
    ] = useState(false);

    const [
        profileSettingsOpen,
        setProfileSettingsOpen,
    ] = useState(false);

    const [
        selectedEvent,
        setSelectedEvent,
    ] =
        useState<ChronicleEvent | null>(
            null
        );

    const [
        eventToEdit,
        setEventToEdit,
    ] =
        useState<ChronicleEvent | null>(
            null
        );

    const [
        eventToDelete,
        setEventToDelete,
    ] =
        useState<ChronicleEvent | null>(
            null
        );

    const totalUpcomingEvents =
        getUpcomingEvents(events);

    const totalMemoryEvents =
        getMemoryEvents(events);

    const filteredEvents = useMemo(
        () =>
            filterChronicleEvents(
                events,
                filters
            ),
        [events, filters]
    );

    const upcomingEvents =
        getUpcomingEvents(
            filteredEvents
        );

    const memoryEvents =
        getMemoryEvents(
            filteredEvents
        );

    const showUpcoming =
        filters.view !== "memories";

    const showMemories =
        filters.view !== "upcoming";

    const showingSingleSection =
        showUpcoming !== showMemories;

    const today =
        new Intl.DateTimeFormat("en", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date());

    function clearFilters() {
        setFilters(DEFAULT_FILTERS);
    }

    function openCreateEvent() {
        setEventToEdit(null);
        setEventFormOpen(true);
    }

    function openEditEvent(
        event: ChronicleEvent
    ) {
        setSelectedEvent(null);
        setEventToEdit(event);
        setEventFormOpen(true);
    }

    function closeEventForm() {
        setEventFormOpen(false);
        setEventToEdit(null);
    }

    function requestDeleteFromDetails(
        event: ChronicleEvent
    ) {
        setSelectedEvent(null);
        setEventToDelete(event);
    }

    return (
        <AppShell
            profileName={profileName}
            activeView={activeView}
            onViewChange={setActiveView}
            onAddEvent={openCreateEvent}
            onOpenProfile={() =>
                setProfileSettingsOpen(true)
            }
        >
            {activeView === "dashboard" ? (
                <>
                    <section className="mb-10">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--future)]">
                                    Dashboard
                                </p>

                                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)] md:text-5xl">
                                    Hello,{" "}
                                    {profileName ||
                                        "Curator"}
                                    .
                                </h1>

                                <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
                                    You have{" "}
                                    <span className="font-bold text-[var(--future)]">
                                        {
                                            totalUpcomingEvents.length
                                        }
                                    </span>{" "}
                                    upcoming events and{" "}
                                    <span className="font-bold text-[var(--memory)]">
                                        {
                                            totalMemoryEvents.length
                                        }
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

                    {events.length > 0 && (
                        <EventFilterBar
                            filters={filters}
                            resultCount={
                                filteredEvents.length
                            }
                            onChange={setFilters}
                            onClear={clearFilters}
                        />
                    )}

                    {events.length === 0 ? (
                        <EmptyState />
                    ) : filteredEvents.length ===
                        0 ? (
                        <FilteredEmptyState
                            onClear={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {showUpcoming && (
                                <div
                                    className={
                                        showingSingleSection
                                            ? "lg:col-span-12"
                                            : "contents"
                                    }
                                >
                                    <UpcomingSection
                                        events={
                                            upcomingEvents
                                        }
                                        onView={
                                            setSelectedEvent
                                        }
                                        onDeleteRequest={
                                            setEventToDelete
                                        }
                                    />
                                </div>
                            )}

                            {showMemories && (
                                <div
                                    className={
                                        showingSingleSection
                                            ? "lg:col-span-12"
                                            : "contents"
                                    }
                                >
                                    <MemoriesTimeline
                                        events={
                                            memoryEvents
                                        }
                                        onDeleteRequest={
                                            setEventToDelete
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : activeView === "calendar" ? (
                <CalendarView
                    events={events}
                    onView={setSelectedEvent}
                    selectedDay={selectedCalendarDay}
                    onSelectDay={setSelectedCalendarDay}
                />
            ) : activeView === "journey" ? (
                <JourneyView
                    events={events}
                    onView={setSelectedEvent}
                />
            ) : activeView === "statistics" ? (
                <StatisticsView events={events} />
            ) : (
                <CategoryView
                    events={events}
                    onView={setSelectedEvent}
                />
            )}

            <EventDetailsModal
                event={selectedEvent}
                onClose={() =>
                    setSelectedEvent(null)
                }
                onEdit={openEditEvent}
                onDeleteRequest={
                    requestDeleteFromDetails
                }
            />

            <AddEventModal
                open={eventFormOpen}
                eventToEdit={eventToEdit}
                onClose={closeEventForm}
                onCreate={(eventInput) => {
                    addEvent(eventInput);
                    addToast(`Successfully created "${eventInput.title}"!`, 'success');
                }}
                onUpdate={(eventInput) => {
                    updateEvent(eventInput);
                    addToast(`Updated "${eventInput.title}"`, 'success');
                }}
            />

            <DeleteConfirmModal
                event={eventToDelete}
                onClose={() =>
                    setEventToDelete(null)
                }
                onConfirm={deleteEvent}
            />

            <ProfileSettingsModal
                open={profileSettingsOpen}
                currentName={profileName}
                onClose={() =>
                    setProfileSettingsOpen(false)
                }
                onSave={saveProfileName}
                onReset={resetProfileName}
            />

            <NamePromptModal
                open={
                    !profileName &&
                    !profileSettingsOpen
                }
                onSave={saveProfileName}
            />
        </AppShell>
    );
}