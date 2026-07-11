import {
    Plus,
    UserRound,
} from "lucide-react";

interface Props {
    onAddEvent: () => void;
    onOpenProfile: () => void;
}

export default function MobileHeader({
    onAddEvent,
    onOpenProfile,
}: Props) {
    return (
        <header
            className="
        fixed
        left-0
        right-0
        top-0
        z-50
        flex
        h-16
        items-center
        justify-between
        border-b
        border-[var(--border-soft)]
        bg-[rgba(11,19,38,0.84)]
        px-4
        backdrop-blur-md
        md:hidden
      "
        >
            <div className="flex items-center gap-3">
                <img
                    src="/app-icon.jpg"
                    alt="Chronicle"
                    className="h-9 w-9 rounded-xl object-cover shadow-lg"
                />

                <div>
                    <h1 className="text-xl font-bold text-[var(--primary)]">
                        Chronicle
                    </h1>

                    <p className="text-xs text-[var(--text-muted)]">
                        Deep Indigo
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onOpenProfile}
                    className="
            rounded-full
            border
            border-[var(--border-soft)]
            bg-[var(--surface-card)]
            p-2
            text-[var(--primary)]
            transition
            active:scale-95
          "
                    aria-label="Open profile settings"
                >
                    <UserRound size={20} />
                </button>

                <button
                    type="button"
                    onClick={onAddEvent}
                    className="
            rounded-full
            bg-[var(--future-strong)]
            p-2
            text-[#2a1000]
            shadow-lg
            shadow-orange-950/30
            transition
            active:scale-95
          "
                    aria-label="Add event"
                >
                    <Plus size={20} />
                </button>
            </div>
        </header>
    );
}