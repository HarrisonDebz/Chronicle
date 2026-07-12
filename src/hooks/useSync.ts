import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../config/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { ChronicleEvent, EventType, EventCategory } from "../types/Event";

const STORAGE_KEY = "chronicle_events";

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

function readLocalEvents(): ChronicleEvent[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ChronicleEvent[]) : [];
    } catch {
        return [];
    }
}

export function useSync(
    user: User | null,
    _localEvents: ChronicleEvent[],
    setLocalEvents: (events: ChronicleEvent[]) => void
) {
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<string | null>(() =>
        localStorage.getItem("chronicle_last_synced")
    );
    // Tracks whether the first sync has completed this session
    const hasInitialised = useRef(false);
    const syncingRef = useRef(false);

    const performSync = useCallback(async (currentUser: User) => {
        if (syncingRef.current) return;
        syncingRef.current = true;
        setSyncing(true);

        // Always read the freshest local events at call time, not from stale closure
        const eventsToSync = readLocalEvents();

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

            // Push local events to remote where remote is missing or stale
            eventsToSync.forEach((localEv) => {
                const remoteEv = remoteMap.get(localEv.id);
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

            // Pull remote events that aren't local, or propagate local deletes after first sync
            const hasEverSynced = hasInitialised.current;
            (remoteEvents as SupabaseEvent[] | null)?.forEach((remoteEv) => {
                if (!localMap.has(remoteEv.id)) {
                    if (hasEverSynced) {
                        // Local previously knew about this — propagate the delete
                        toDeleteRemoteIds.push(remoteEv.id);
                    } else {
                        // First sync: pull events that exist remotely but not locally
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

            // 2. Upsert to remote
            if (toUpsert.length > 0) {
                const { error: upsertError } = await supabase
                    .from("events")
                    .upsert(toUpsert);
                if (upsertError) throw upsertError;
            }

            // 3. Delete remotely what was deleted locally
            if (toDeleteRemoteIds.length > 0) {
                const { error: deleteError } = await supabase
                    .from("events")
                    .delete()
                    .in("id", toDeleteRemoteIds);
                if (deleteError) throw deleteError;
            }

            // 4. Update local state only if the merged list differs from what's already stored
            const currentLocal = readLocalEvents();
            const mergedIds = new Set(mergedEvents.map((e) => e.id));
            const currentIds = new Set(currentLocal.map((e) => e.id));
            const changed =
                mergedEvents.length !== currentLocal.length ||
                [...mergedIds].some((id) => !currentIds.has(id));

            if (changed) {
                setLocalEvents(mergedEvents);
            }

            hasInitialised.current = true;
            const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            setLastSynced(timestamp);
            localStorage.setItem("chronicle_last_synced", timestamp);
        } catch (e) {
            console.error("Synchronization failed:", e);
        } finally {
            syncingRef.current = false;
            setSyncing(false);
        }
    }, [setLocalEvents]);

    // Trigger sync when user logs in
    useEffect(() => {
        if (!user) return;
        Promise.resolve().then(() => {
            performSync(user);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Force trigger manually
    const triggerSync = () => {
        if (user) performSync(user);
    };

    return {
        syncing,
        lastSynced,
        triggerSync,
    };
}
