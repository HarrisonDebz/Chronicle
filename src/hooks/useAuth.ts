import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
    displayName: string;
    photoUrl: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile>({ displayName: "", photoUrl: "" });
    const [loading, setLoading] = useState(true);

    async function loadProfile() {
        try {
            // First load from localStorage to be offline-first
            const localName = localStorage.getItem("chronicle_profile_name") || "";
            const localPhoto = localStorage.getItem("chronicle_profile_photo") || "";
            
            setProfile({ displayName: localName, photoUrl: localPhoto });

            // Fetch from user metadata or profile table if available (metadata is easiest for simple accounts)
            const { data: { user: updatedUser }, error } = await supabase.auth.getUser();
            if (error) throw error;

            if (updatedUser?.user_metadata) {
                const displayName = updatedUser.user_metadata.display_name || "";
                const photoUrl = updatedUser.user_metadata.photo_url || "";
                const newProfile = { displayName, photoUrl };
                
                setProfile(newProfile);
                localStorage.setItem("chronicle_profile_name", displayName);
                localStorage.setItem("chronicle_profile_photo", photoUrl);
            }
        } catch (e) {
            console.error("Failed to load user profile details", e);
        } finally {
            setLoading(false);
        }
    }

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

        // Listen for auth changes
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
    }, []);

    async function updateProfile(displayName: string, photoUrl: string) {
        if (!user) return;
        try {
            const { error } = await supabase.auth.updateUser({
                data: { display_name: displayName, photo_url: photoUrl }
            });
            if (error) throw error;

            setProfile({ displayName, photoUrl });
            localStorage.setItem("chronicle_profile_name", displayName);
            localStorage.setItem("chronicle_profile_photo", photoUrl);
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
        signOut: () => supabase.auth.signOut(),
    };
}
