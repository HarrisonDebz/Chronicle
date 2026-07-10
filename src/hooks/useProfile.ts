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

    function resetProfileName() {
        setProfileName("");
    }

    return {
        profileName,
        saveProfileName,
        resetProfileName,
    };
}