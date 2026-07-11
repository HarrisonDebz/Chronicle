import { motion, AnimatePresence } from "framer-motion";
import { type FormEvent, useState } from "react";

interface Props {
    open: boolean;
    onSave: (name: string) => void;
}

export default function NamePromptModal({
    open,
    onSave,
}: Props) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Enter a name first.");
            return;
        }

        onSave(name);
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
                        bg-[rgba(6,14,32,0.86)]
                        px-4
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
                rounded-2xl
                p-6
                shadow-2xl
                "
                    >
                        <div
                            className="
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    overflow-hidden
                    shadow-xl
                "
                        >
                            <img
                                src="/app-icon.png"
                                alt="Chronicle"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <p
                            className="
                    mb-2
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-[var(--future)]
                "
                        >
                            Welcome to Chronicle
                        </p>

                        <h2 className="text-2xl font-bold text-[var(--text-main)]">
                            What should Chronicle call you?
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                            This keeps the dashboard personal. Your name is saved locally on this
                            browser only.
                        </p>

                        {error && (
                            <p
                                className="
                    mt-4
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
                            </p>
                        )}

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Steezy"
                            autoFocus
                            className="
                    mt-5
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

                        <button
                            type="submit"
                            className="
                    orange-glow
                    mt-5
                    w-full
                    rounded-xl
                    bg-[var(--future-strong)]
                    px-6
                    py-3
                    font-bold
                    text-[#2a1000]
                    transition
                    hover:brightness-110
                    active:scale-95
                "
                        >
                            Continue
                        </button>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}