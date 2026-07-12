import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../config/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { ChronicleEvent, EventType, EventCategory } from "../types/Event";

interface SupabaseEvent {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    type: string;
    date: string;
    category: string;
    custom_category: string | null;
    recurring: boolean;
    created_at: string;
}

export function useSync(
    user: User | null,
    localEvents: ChronicleEvent[],
    setLocalEvents: (events: ChronicleEvent[]) => void
) {
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<string | null>(null);
    // Tracks whether the first sync has completed this session
    const hasInitialised = useRef(false);

    const performSync = useCallback(async (currentUser: User, eventsToSync: ChronicleEvent[]) => {
        if (syncing) return;
        setSyncing(true);
        try {
            // 1. Fetch remote events from Supabase
            const { data: remoteEvents, error: fetchError } = await supabase
                .from("events")
                .select("*");

            if (fetchError) throw fetchError;

            const remoteMap = new Map<string, SupabaseEvent>();
            (remoteEvents as SupabaseEvent[] | null)?.forEach((ev) => remoteMap.set(ev.id, ev));

            const localMap = new Map<string, ChronicleEvent>();
            eventsToSync.forEach((ev) => localMap.set(ev.id, ev));

            const toUpsert: SupabaseEvent[] = [];
            const toDeleteRemoteIds: string[] = [];
            const mergedEvents: ChronicleEvent[] = [];

            // Identify events to push to remote
            eventsToSync.forEach((localEv) => {
                const remoteEv = remoteMap.get(localEv.id);
                
                // If remote doesn't have it, or it is newer, we prepare to upload
                if (!remoteEv || new Date(localEv.createdAt) > new Date(remoteEv.created_at)) {
                    toUpsert.push({
                        id: localEv.id,
                        user_id: currentUser.id,
                        title: localEv.title,
                        description: localEv.description || null,
                        type: localEv.type,
                        date: localEv.date,
                        category: localEv.category,
                        custom_category: localEv.customCategory || null,
                        recurring: localEv.recurring,
                        created_at: localEv.createdAt,
                    });
                }
                mergedEvents.push(localEv);
            });

            // Identify remote events missing locally — these were deleted locally, so delete them from remote too.
            // We only propagate deletes after the first sync has initialised local state from remote.
            const hasEverSynced = hasInitialised.current;
            (remoteEvents as SupabaseEvent[] | null)?.forEach((remoteEv) => {
                if (!localMap.has(remoteEv.id)) {
                    if (hasEverSynced) {
                        // Local previously knew about this event and deleted it — propagate the delete.
                        toDeleteRemoteIds.push(remoteEv.id);
                    } else {
                        // First-ever sync: pull remote events that aren't local yet.
                        mergedEvents.push({
                            id: remoteEv.id,
                            title: remoteEv.title,
                            description: remoteEv.description || undefined,
                            type: remoteEv.type as EventType,
                            date: remoteEv.date,
                            category: remoteEv.category as EventCategory,
                            customCategory: remoteEv.custom_category || undefined,
                            recurring: remoteEv.recurring,
                            createdAt: remoteEv.created_at,
                        });
                    }
                }
            });

            // 2. Perform remote upsert
            if (toUpsert.length > 0) {
                const { error: upsertError } = await supabase
                    .from("events")
                    .upsert(toUpsert);
                if (upsertError) throw upsertError;
            }

            // 3. Propagate local deletes to remote
            if (toDeleteRemoteIds.length > 0) {
                const { error: deleteError } = await supabase
                    .from("events")
                    .delete()
                    .in("id", toDeleteRemoteIds);
                if (deleteError) throw deleteError;
            }

            // 4. Update local state
            setLocalEvents(mergedEvents);
            hasInitialised.current = true;
            
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSynced(timestamp);
        } catch (e) {
            console.error("Synchronization failed:", e);
        } finally {
            setSyncing(false);
        }
    }, [syncing, setLocalEvents]);

    // Trigger sync automatically when user logs in or local event count changes
    useEffect(() => {
        if (!user) return;
        Promise.resolve().then(() => {
            performSync(user, localEvents);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Force trigger manually
    const triggerSync = () => {
        if (user) {
            performSync(user, localEvents);
        }
    };

    return {
        syncing,
        lastSynced,
        triggerSync,
    };
}
