import { useCallback, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
    displayName: string;
    photoUrl: string;
}

// Supabase embeds user_metadata in the JWT which has a ~2 KB practical limit.
// Compress any base64 image down to a 200×200 JPEG at 60% quality before storing.
const MAX_PHOTO_DIMENSION = 200;
const PHOTO_QUALITY = 0.6;

async function compressPhoto(dataUrl: string): Promise<string> {
    // Only process actual base64 data URIs
    if (!dataUrl.startsWith("data:image")) return dataUrl;

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(
                MAX_PHOTO_DIMENSION / img.width,
                MAX_PHOTO_DIMENSION / img.height,
                1 // never upscale
            );
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", PHOTO_QUALITY));
        };
        img.onerror = () => resolve(dataUrl); // fallback: use as-is
        img.src = dataUrl;
    });
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile>({ displayName: "", photoUrl: "" });
    const [loading, setLoading] = useState(true);

    /** Re-reads the latest metadata from Supabase (bypasses stale JWT cache) */
    const loadProfile = useCallback(async () => {
        try {
            const { data: { user: freshUser }, error } = await supabase.auth.getUser();
            if (error) throw error;

            if (freshUser?.user_metadata) {
                const displayName = freshUser.user_metadata.display_name || "";
                const photoUrl = freshUser.user_metadata.photo_url || "";
                setProfile({ displayName, photoUrl });
            }
        } catch (e) {
            console.error("Failed to load user profile details", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile();
            } else {
                setLoading(false);
            }
        });

        // Listen for auth state changes (sign-in, sign-out, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                loadProfile();
            } else {
                setProfile({ displayName: "", photoUrl: "" });
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    async function updateProfile(displayName: string, photoUrl: string) {
        if (!user) return;
        try {
            // Compress photo before storing to stay within Supabase JWT metadata limits
            const safePhotoUrl = photoUrl ? await compressPhoto(photoUrl) : "";

            const { error } = await supabase.auth.updateUser({
                data: { display_name: displayName, photo_url: safePhotoUrl }
            });
            if (error) throw error;

            // Re-read from Supabase so we always reflect what was actually stored,
            // not just what we sent (guards against silent truncation / rejections).
            await loadProfile();
        } catch (e) {
            console.error("Failed to update profile", e);
            throw e;
        }
    }

    return {
        user,
        profile,
        loading,
        updateProfile,
        refreshProfile: loadProfile,
        signOut: () => supabase.auth.signOut(),
    };
}
