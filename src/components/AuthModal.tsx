import { motion, AnimatePresence } from "framer-motion";
import { type FormEvent, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";

interface Props {
    open: boolean;
    onSuccess: () => void;
}

export default function AuthModal({
    open,
    onSuccess,
}: Props) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            setLoading(false);
            return;
        }

        if (isSignUp && !displayName.trim()) {
            setError("Please enter a name first.");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: email.trim(),
                    password: password.trim(),
                    options: {
                        data: {
                            display_name: displayName.trim(),
                            photo_url: "",
                        }
                    }
                });
                if (signUpError) throw signUpError;
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password.trim(),
                });
                if (signInError) throw signInError;
            }
            onSuccess();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An error occurred during authentication.";
            setError(message);
        } finally {
            setLoading(false);
        }
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
                            {isSignUp ? "Create your Chronicle Account" : "Access your Chronicle"}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                            {isSignUp 
                                ? "Register to synchronize your events and memories across devices automatically." 
                                : "Sign in to access and synchronize your events."}
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

                        <div className="mt-5 space-y-4">
                            {isSignUp && (
                                <div className="relative">
                                    <input
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Display Name"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-[var(--border-strong)]
                                            bg-[var(--surface-low)]
                                            p-4
                                            pl-11
                                            text-base
                                            font-semibold
                                            text-[var(--text-main)]
                                            outline-none
                                            transition
                                            placeholder:text-[rgba(199,196,215,0.32)]
                                            focus:border-[var(--primary)]
                                        "
                                    />
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-[var(--border-strong)]
                                        bg-[var(--surface-low)]
                                        p-4
                                        pl-11
                                        text-base
                                        font-semibold
                                        text-[var(--text-main)]
                                        outline-none
                                        transition
                                        placeholder:text-[rgba(199,196,215,0.32)]
                                        focus:border-[var(--primary)]
                                    "
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-[var(--border-strong)]
                                        bg-[var(--surface-low)]
                                        p-4
                                        pl-11
                                        pr-12
                                        text-base
                                        font-semibold
                                        text-[var(--text-main)]
                                        outline-none
                                        transition
                                        placeholder:text-[rgba(199,196,215,0.32)]
                                        focus:border-[var(--primary)]
                                    "
                                />
                                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
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
                    disabled:opacity-50
                "
                        >
                            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="
                                mt-4
                                w-full
                                text-center
                                text-sm
                                font-semibold
                                text-[var(--primary)]
                                opacity-80
                                transition
                                hover:opacity-100
                            "
                        >
                            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                        </button>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
