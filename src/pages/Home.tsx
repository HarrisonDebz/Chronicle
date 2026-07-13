import {
    useMemo,
    useState,
    useEffect
} from "react";
import AddEventModal from "../components/AddEventModal";
import AppShell from "../components/AppShell";
import CategoryView from "../components/CategoryView";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import EventDetailsModal from "../components/EventDetailsModal";
import EventFilterBar from "../components/EventFilterBar";
import FilteredEmptyState from "../components/FilteredEmptyState";
import JourneyView from "../components/JourneyView";
import StatisticsView from "../components/StatisticsView";
import MemoriesTimeline from "../components/MemoriesTimeline";
import AuthModal from "../components/AuthModal";
import ProfileSettingsModal from "../components/ProfileSettingsModal";
import UpcomingSection from "../components/UpcomingSection";

import { useEvents } from "../hooks/useEvents";
import { useAuth } from "../hooks/useAuth";
import { useSync } from "../hooks/useSync";
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
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
    } = useEvents();

    const {
        user,
        profile,
        loading: authLoading,
        updateProfile,
        signOut,
    } = useAuth();

    const {
        syncing,
        lastSynced,
        triggerSync,
    } = useSync(user, events, setEvents);

    const [authModalOpen, setAuthModalOpen] = useState(false);

    const { addToast } = useToast();
    const { scheduleNotifications } = useNotifications();

    const [activeView, setActiveView] =
        useState<AppView>("dashboard");

    // Schedule and sync notifications
    useEffect(() => {
        scheduleNotifications(events);
    }, [events, scheduleNotifications]);


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
            profileName={profile.displayName}
            profilePhotoUrl={profile.photoUrl}
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
                                    {profile.displayName ||
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
                key={profileSettingsOpen ? `open-${profile.displayName}-${profile.photoUrl}` : "closed"}
                open={profileSettingsOpen}
                currentName={profile.displayName}
                currentPhotoUrl={profile.photoUrl}
                user={user}
                syncing={syncing}
                lastSynced={lastSynced}
                onClose={() =>
                    setProfileSettingsOpen(false)
                }
                onSave={updateProfile}
                onReset={() => updateProfile("", "")}
                onSignOut={signOut}
                onOpenAuth={() => setAuthModalOpen(true)}
                triggerSync={triggerSync}
            />

            <AuthModal
                open={
                    authModalOpen ||
                    (!authLoading && !profile.displayName && !profileSettingsOpen)
                }
                onSuccess={() => setAuthModalOpen(false)}
            />
        </AppShell>
    );
}