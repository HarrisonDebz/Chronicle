import { motion, AnimatePresence } from "framer-motion";
import { type FormEvent, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { CheckCircle, Eye, EyeOff, KeyRound, Mail, RefreshCw, User } from "lucide-react";

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
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(false);

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
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: email.trim(),
                    password: password.trim(),
                    options: {
                        emailRedirectTo: window.location.origin,
                        data: {
                            display_name: displayName.trim(),
                            photo_url: "",
                        }
                    }
                });
                if (signUpError) throw signUpError;
                // Supabase returns an empty identities array (instead of an error) when
                // email confirmation is on and the address is already registered.
                if (signUpData.user && signUpData.user.identities?.length === 0) {
                    throw new Error("An account with this email already exists. Please sign in instead.");
                }
                // Show the "check your email" screen instead of logging in immediately
                setAwaitingConfirmation(true);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password.trim(),
                });
                if (signInError) throw signInError;
                onSuccess();
            }
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
                        bg-[var(--modal-backdrop)]
                        px-4
                        backdrop-blur-md
                    "
                >
                    <AnimatePresence mode="wait">
                    {awaitingConfirmation ? (
                        /* ── Confirmation email sent screen ── */
                        <motion.div
                            key="confirm"
                            role="dialog"
                            aria-modal="true"
                            aria-live="polite"
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            className="glass-card w-full max-w-md rounded-2xl p-8 shadow-2xl text-center"
                        >
                            {/* Animated envelope / check icon */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", delay: 0.15, stiffness: 200 }}
                                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--future-strong)]/15 ring-2 ring-[var(--future-strong)]/30"
                            >
                                <Mail size={36} className="text-[var(--future-strong)]" />
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 260 }}
                                    className="absolute -mt-8 ml-8"
                                >
                                    <CheckCircle size={20} className="text-emerald-400" />
                                </motion.span>
                            </motion.div>

                            <h2 className="text-2xl font-bold text-[var(--text-main)]">Check your email</h2>

                            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                                A confirmation link has been sent to{" "}
                                <span className="font-semibold text-[var(--future)]">{email}</span>.
                                Click the link in the email to activate your account and sign in.
                            </p>

                            <p className="mt-2 text-xs text-[var(--text-muted)]/60">
                                Didn't receive it? Check your spam folder, or resend below.
                            </p>

                            {/* Resend button */}
                            <button
                                type="button"
                                disabled={resendCooldown}
                                onClick={async () => {
                                    setResendCooldown(true);
                                    await supabase.auth.resend({
                                        type: "signup",
                                        email: email.trim(),
                                        options: { emailRedirectTo: window.location.origin },
                                    });
                                    setTimeout(() => setResendCooldown(false), 30_000);
                                }}
                                className="
                                    orange-glow
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-[var(--future-strong)]
                                    px-6
                                    py-3
                                    font-bold
                                    text-[#2a1000]
                                    transition
                                    hover:brightness-110
                                    active:scale-95
                                    disabled:opacity-40
                                "
                            >
                                <RefreshCw size={16} className={resendCooldown ? "animate-spin" : ""} />
                                {resendCooldown ? "Email sent!" : "Resend confirmation email"}
                            </button>

                            {/* Back to sign-in link */}
                            <button
                                type="button"
                                onClick={() => {
                                    setAwaitingConfirmation(false);
                                    setIsSignUp(false);
                                    setPassword("");
                                    setError("");
                                }}
                                className="
                                    mt-4
                                    block
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
                                Back to Sign In
                            </button>
                        </motion.div>
                    ) : (
                    <motion.form
                        key="form"
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
                                            placeholder:text-[var(--placeholder-text)]
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
                    )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
