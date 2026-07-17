import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../config/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { ChronicleEvent, EventType, EventCategory, NotificationSetting } from "../types/Event";

const STORAGE_KEY = "chronicle_events";
// Durable set of IDs that were present the last time we synced.
// Used to distinguish "remote event I haven't downloaded yet" from
// "event I deleted locally and want to propagate to the server".
const SYNCED_IDS_KEY = "chronicle_synced_ids";

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
    notify_before: string | null;
    created_at: string;
    updated_at: string | null;
}

function readLocalEvents(): ChronicleEvent[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ChronicleEvent[]) : [];
    } catch {
        return [];
    }
}

/** The set of event IDs that were confirmed synced in the previous session */
function readSyncedIds(): Set<string> {
    try {
        const raw = localStorage.getItem(SYNCED_IDS_KEY);
        return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
        return new Set();
    }
}

function writeSyncedIds(ids: Set<string>) {
    localStorage.setItem(SYNCED_IDS_KEY, JSON.stringify([...ids]));
}

/** Returns whichever ISO string is later, falling back gracefully */
function latestTimestamp(...timestamps: (string | null | undefined)[]): Date {
    let best = new Date(0);
    for (const ts of timestamps) {
        if (!ts) continue;
        const d = new Date(ts);
        if (!isNaN(d.getTime()) && d > best) best = d;
    }
    return best;
}

export function useSync(
    user: User | null,
    setLocalEvents: (events: ChronicleEvent[]) => void
) {
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<string | null>(() =>
        localStorage.getItem("chronicle_last_synced")
    );
    const syncingRef = useRef(false);

    const performSync = useCallback(async (currentUser: User) => {
        if (syncingRef.current) return;
        syncingRef.current = true;
        setSyncing(true);

        // Always read the freshest local events and the durable synced-IDs set
        const eventsToSync = readLocalEvents();
        const previouslySyncedIds = readSyncedIds();

        try {
            // 1. Fetch all remote events for this user
            const { data: remoteEvents, error: fetchError } = await supabase
                .from("events")
                .select("*");

            if (fetchError) throw fetchError;

            const remoteMap = new Map<string, SupabaseEvent>();
            (remoteEvents as SupabaseEvent[] | null)?.forEach((ev) =>
                remoteMap.set(ev.id, ev)
            );

            const localMap = new Map<string, ChronicleEvent>();
            eventsToSync.forEach((ev) => localMap.set(ev.id, ev));

            const toUpsert: SupabaseEvent[] = [];
            const toDeleteRemoteIds: string[] = [];
            const mergedEvents: ChronicleEvent[] = [];

            // ── Pass 1: Walk local events ────────────────────────────────────
            eventsToSync.forEach((localEv) => {
                const remoteEv = remoteMap.get(localEv.id);

                if (!remoteEv) {
                    // Not on server yet — push it up
                    toUpsert.push(toSupabaseRow(localEv, currentUser.id));
                    mergedEvents.push(localEv);
                    return;
                }

                // Conflict resolution: compare the most-recent timestamp on each side
                const localTime = latestTimestamp(localEv.updatedAt, localEv.createdAt);
                const remoteTime = latestTimestamp(remoteEv.updated_at, remoteEv.created_at);

                if (localTime >= remoteTime) {
                    // Local is newer (or same) — push local version up
                    toUpsert.push(toSupabaseRow(localEv, currentUser.id));
                    mergedEvents.push(localEv);
                } else {
                    // Remote is newer — pull remote version down
                    mergedEvents.push(toLocalEvent(remoteEv));
                }
            });

            // ── Pass 2: Walk remote events ───────────────────────────────────
            (remoteEvents as SupabaseEvent[] | null)?.forEach((remoteEv) => {
                if (localMap.has(remoteEv.id)) return; // already handled above

                if (previouslySyncedIds.has(remoteEv.id)) {
                    // This ID was in our last known synced set but is now missing
                    // locally → the user deleted it on this device. Propagate delete.
                    toDeleteRemoteIds.push(remoteEv.id);
                } else {
                    // Brand-new remote event (e.g. added on another device, or
                    // first-time sign-in on this device). Pull it down.
                    mergedEvents.push(toLocalEvent(remoteEv));
                }
            });

            // ── 2. Upsert local-wins events to remote ────────────────────────
            if (toUpsert.length > 0) {
                const { error: upsertError } = await supabase
                    .from("events")
                    .upsert(toUpsert);
                if (upsertError) throw upsertError;
            }

            // ── 3. Propagate local deletes to remote ─────────────────────────
            if (toDeleteRemoteIds.length > 0) {
                const { error: deleteError } = await supabase
                    .from("events")
                    .delete()
                    .in("id", toDeleteRemoteIds);
                if (deleteError) throw deleteError;
            }

            // ── 4. Update local state only when the merged list actually differs
            const currentLocal = readLocalEvents();
            const mergedIds = new Set(mergedEvents.map((e) => e.id));
            const currentIds = new Set(currentLocal.map((e) => e.id));
            const changed =
                mergedEvents.length !== currentLocal.length ||
                [...mergedIds].some((id) => !currentIds.has(id)) ||
                mergedEvents.some((me) => {
                    const local = currentLocal.find((l) => l.id === me.id);
                    return local?.updatedAt !== me.updatedAt;
                });

            if (changed) {
                setLocalEvents(mergedEvents);
            }

            // ── 5. Persist the durable synced-IDs set for next session ────────
            writeSyncedIds(mergedIds);

            const timestamp = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            setLastSynced(timestamp);
            localStorage.setItem("chronicle_last_synced", timestamp);
        } catch (e) {
            console.error("Synchronization failed:", e);
        } finally {
            syncingRef.current = false;
            setSyncing(false);
        }
    }, [setLocalEvents]);

    // Trigger sync when the user logs in
    useEffect(() => {
        if (!user) return;
        Promise.resolve().then(() => {
            performSync(user);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Re-sync whenever the tab becomes visible again (covers returning from
    // another tab, waking the screen, etc.)
    useEffect(() => {
        if (!user) return;

        function handleVisibilityChange() {
            if (document.visibilityState === "visible" && user) {
                performSync(user);
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [user, performSync]);

    // Manual trigger
    const triggerSync = () => {
        if (user) performSync(user);
    };

    return {
        syncing,
        lastSynced,
        triggerSync,
    };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSupabaseRow(ev: ChronicleEvent, userId: string): SupabaseEvent {
    return {
        id: ev.id,
        user_id: userId,
        title: ev.title,
        description: ev.description || null,
        type: ev.type,
        date: ev.date,
        category: ev.category,
        custom_category: ev.customCategory || null,
        recurring: ev.recurring,
        notify_before: ev.notifyBefore || null,
        created_at: ev.createdAt,
        updated_at: ev.updatedAt ?? ev.createdAt,
    };
}

function toLocalEvent(remote: SupabaseEvent): ChronicleEvent {
    return {
        id: remote.id,
        title: remote.title,
        description: remote.description || undefined,
        type: remote.type as EventType,
        date: remote.date,
        category: remote.category as EventCategory,
        customCategory: remote.custom_category || undefined,
        recurring: remote.recurring,
        notifyBefore: (remote.notify_before as NotificationSetting) || undefined,
        createdAt: remote.created_at,
        updatedAt: remote.updated_at ?? remote.created_at,
    };
}
