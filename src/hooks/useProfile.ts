import { useLocalStorage } from "./useLocalStorage";

export function useProfile() {
    const [profileName, setProfileName] =
        useLocalStorage<string>(
            "chronicle-profile-name",
            ""
        );

    function saveProfileName(name: string) {
        setProfileName(name.trim());
    }

    return {
        profileName,
        saveProfileName,
    };
}