import { motion, AnimatePresence } from "framer-motion";
import {
    RotateCcw,
    Save,
    UserRound,
    Bell,
    BellRing,
    Cloud,
    CloudRain,
    LogOut,
    UserPlus,
    RefreshCw
} from "lucide-react";

import {
    type FormEvent,
    useRef,
    useState,
} from "react";

import { APP_VERSION } from "../config/app";
import { useNotifications } from "../hooks/useNotifications";
import type { User } from "@supabase/supabase-js";

interface Props {
    open: boolean;
    currentName: string;
    currentPhotoUrl: string;
    user: User | null;
    syncing: boolean;
    lastSynced: string | null;
    onClose: () => void;
    onSave: (name: string, photoUrl: string) => Promise<void>;
    onReset: () => void;
    onSignOut: () => void;
    onOpenAuth: () => void;
    triggerSync: () => void;
}


export default function ProfileSettingsModal({
    open,
    currentName,
    currentPhotoUrl,
    user,
    syncing,
    lastSynced,
    onClose,
    onSave,
    onReset,
    onSignOut,
    onOpenAuth,
    triggerSync,
}: Props) {
    const [name, setName] = useState(currentName);
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { permission, requestPermission } = useNotifications();

    function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoUrl(reader.result as string);
        reader.readAsDataURL(file);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Your display name cannot be empty.");
            return;
        }

        try {
            await onSave(name.trim(), photoUrl.trim());
            onClose();
        } catch (e) {
            const message =
                e instanceof Error
                    ? e.message
                    : "Failed to save profile. Please try again.";
            setError(message);
        }
    }

    function handleReset() {
        onReset();
        onClose();
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="
                        fixed
                        inset-0
                        z-[120]
                        flex
                        items-center
                        justify-center
                        bg-[var(--modal-backdrop)]
                        px-4
                        py-8
                        backdrop-blur-md
                    "
                >
                    <motion.form
                        role="dialog"
                        aria-modal="true"
                        onSubmit={handleSubmit}
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20,
                        }}
                        className="
                glass-card
                w-full
                max-w-md
                overflow-hidden
                rounded-2xl
                shadow-2xl
                "
                    >
                        <header
                            className="
                    border-b
                    border-[var(--border-soft)]
                    bg-gradient-to-r
                    from-[var(--surface-card-high)]
                    to-[var(--surface-card)]
                    p-6
                "
                        >
                            <div className="flex items-center gap-4">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={name}
                                        className="h-14 w-14 rounded-2xl object-cover border-2 border-[var(--primary)] shadow-lg"
                                    />
                                ) : (
                                    <div
                                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[var(--overlay-primary)]
                            text-[var(--primary)]
                            "
                                    >
                                        <UserRound size={28} />
                                    </div>
                                )}

                                <div>
                                    <p
                                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-[var(--primary)]
                        "
                                    >
                                        Profile
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold text-[var(--text-main)]">
                                        Personal settings
                                    </h2>
                                </div>
                            </div>
                        </header>

                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                            {error && (
                                <div
                                    className="
                        rounded-xl
                        border
                        border-red-400/30
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-200
                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* Display Name */}
                            <div className="space-y-2">
                                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                                    Display Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="What should Chronicle call you?"
                                    className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--border-strong)]
                        bg-[var(--surface-low)]
                        p-4
                        text-base
                        font-semibold
                        text-[var(--text-main)]
                        outline-none
                        transition
                        placeholder:text-[var(--placeholder-text)]
                        focus:border-[var(--primary)]
                    "
                                />
                            </div>

                            {/* Profile Picture */}
                            <div className="space-y-2">
                                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                                    Profile Photo
                                </label>

                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt="Profile"
                                                className="h-full w-full rounded-2xl object-cover border-2 border-[var(--primary)]"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--overlay-primary)] text-[var(--primary)]">
                                                <UserRound size={28} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-low)] px-4 py-2.5 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--surface-card-high)] transition active:scale-95"
                                        >
                                            Upload Photo
                                        </button>
                                        {photoUrl && (
                                            <button
                                                type="button"
                                                onClick={() => setPhotoUrl("")}
                                                className="w-full rounded-xl px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 transition"
                                            >
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Supabase Account & Sync Section */}
                            <div className="space-y-2">
                                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                                    Cloud Sync & Accounts
                                </label>

                                {user ? (
                                    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-low)] p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-green-400">
                                                <Cloud size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wide">Connected</span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={triggerSync}
                                                disabled={syncing}
                                                className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline disabled:opacity-50"
                                            >
                                                <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
                                                Sync Now
                                            </button>
                                        </div>

                                        <div className="text-xs text-[var(--text-muted)] space-y-1">
                                            <p>Account: <strong className="text-[var(--text-main)]">{user.email}</strong></p>
                                            <p>Last Sync: <strong className="text-[var(--text-main)]">{lastSynced || "Just now"}</strong></p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSignOut();
                                                onClose();
                                            }}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm font-bold text-red-300 hover:bg-red-500/20 transition"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-low)] p-4 space-y-3">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                            <CloudRain size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wide">Offline Local Storage</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            Log in to synchronize your milestones and settings securely in the cloud.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                onOpenAuth();
                                            }}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] p-3 text-sm font-bold text-white hover:brightness-110 active:scale-95 transition"
                                        >
                                            <UserPlus size={16} />
                                            Connect Account
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Setting */}
                            <div className="space-y-2">
                                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                                    Notifications
                                </label>
                                <div className="flex items-center justify-between rounded-xl border border-[var(--border-strong)] bg-[var(--surface-low)] p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${permission === 'granted' ? 'bg-green-500/10 text-green-400' : 'bg-[var(--surface-card-high)] text-[var(--text-muted)]'}`}>
                                            {permission === 'granted' ? <BellRing size={20} /> : <Bell size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[var(--text-main)]">Desktop Notifications</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                                {permission === 'granted' ? 'Enabled for reminders' : 'Stay updated on events'}
                                            </p>
                                        </div>
                                    </div>
                                    {permission !== 'granted' && (
                                        <button
                                            type="button"
                                            onClick={requestPermission}
                                            className="px-3 py-1.5 text-xs font-bold bg-[var(--primary-strong)] text-white rounded-lg hover:brightness-110 active:scale-95 transition"
                                        >
                                            Enable
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Version Info */}
                            <div className="flex items-center justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--surface-low)] p-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                                        Chronicle Version
                                    </p>
                                    <p className="mt-1 font-semibold text-[var(--text-main)]">
                                        v{APP_VERSION}
                                    </p>
                                </div>
                                <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-bold text-[var(--future)]">
                                    Active
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="
                        flex-1
                        rounded-xl
                        border
                        border-[var(--border-strong)]
                        px-5
                        py-3
                        font-semibold
                        text-[var(--text-main)]
                        transition
                        hover:bg-[var(--surface-card-high)]
                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[var(--primary-strong)]
                        px-5
                        py-3
                        font-bold
                        text-white
                        transition
                        hover:brightness-110
                        active:scale-95
                    "
                                >
                                    <Save size={18} />
                                    Save
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    text-red-300
                    transition
                    hover:bg-red-500/10
                    "
                            >
                                <RotateCcw size={17} />
                                Reset display name
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}