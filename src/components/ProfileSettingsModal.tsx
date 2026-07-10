import { motion } from "framer-motion";
import {
    RotateCcw,
    Save,
    UserRound,
} from "lucide-react";

import {
    type FormEvent,
    useState,
} from "react";

import { APP_VERSION } from "../config/app";

interface Props {
    open: boolean;
    currentName: string;
    onClose: () => void;
    onSave: (name: string) => void;
    onReset: () => void;
}

export default function ProfileSettingsModal({
    open,
    currentName,
    onClose,
    onSave,
    onReset,
}: Props) {
    const [name, setName] = useState(currentName);
    const [error, setError] = useState("");


    if (!open) {
        return null;
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Your display name cannot be empty.");
            return;
        }

        onSave(name);
        onClose();
    }

    function handleReset() {
        onReset();
        onClose();
    }

    return (
        <div
            className="
        fixed
        inset-0
        z-[120]
        flex
        items-center
        justify-center
        bg-[rgba(6,14,32,0.84)]
        px-4
        py-8
        backdrop-blur-md
      "
        >
            <motion.form
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
            flex
            items-center
            gap-4
            border-b
            border-[var(--border-soft)]
            bg-gradient-to-r
            from-[var(--surface-card-high)]
            to-[var(--surface-card)]
            p-6
          "
                >
                    <div
                        className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-[rgba(192,193,255,0.12)]
              text-[var(--primary)]
            "
                    >
                        <UserRound size={25} />
                    </div>

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
                </header>

                <div className="p-6">
                    {error && (
                        <div
                            className="
                mb-5
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

                    <div className="space-y-2">
                        <label
                            className="
                ml-1
                block
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-[var(--text-soft)]
              "
                        >
                            Display Name
                        </label>

                        <input
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="What should Chronicle call you?"
                            autoFocus
                            className="
                w-full
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-4
                text-lg
                font-semibold
                text-[var(--text-main)]
                outline-none
                transition
                placeholder:text-[rgba(199,196,215,0.32)]
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[rgba(192,193,255,0.24)]
              "
                        />
                    </div>

                    <div
                        className="
              mt-5
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-[var(--border-soft)]
              bg-[var(--surface-low)]
              p-4
            "
                    >
                        <div>
                            <p
                                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-[var(--text-muted)]
                "
                            >
                                Chronicle Version
                            </p>

                            <p className="mt-1 font-semibold text-[var(--text-main)]">
                                v{APP_VERSION}
                            </p>
                        </div>

                        <span
                            className="
                rounded-full
                border
                border-orange-300/20
                bg-orange-400/10
                px-3
                py-1
                text-xs
                font-bold
                text-[var(--future)]
              "
                        >
                            Active
                        </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                        Your display name is saved locally in this browser and is used for
                        the dashboard greeting.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              px-5
              py-3
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
        </div>
    );
}