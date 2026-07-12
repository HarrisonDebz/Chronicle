import { motion } from "framer-motion";
import {
    BarChart3,
    LayoutDashboard,
    Tags,
    TimerReset,
} from "lucide-react";

import type { AppView } from "../types/Navigation";

interface Props {
    activeView: AppView;

    onViewChange: (
        view: AppView
    ) => void;
}

const navItems = [
    {
        label: "Home",
        icon: LayoutDashboard,
        view: "dashboard" as AppView,
        disabled: false,
    },
    {
        label: "Journey",
        icon: TimerReset,
        view: "journey" as AppView,
        disabled: false,
    },
    {
        label: "Stats",
        icon: BarChart3,
        view: "statistics" as AppView,
        disabled: false,
    },
    {
        label: "Categories",
        icon: Tags,
        view: "categories" as AppView,
        disabled: false,
    },
];

export default function MobileBottomNav({
    activeView,
    onViewChange,
}: Props) {
    return (
        <nav
            className="
        fixed
        bottom-0
        left-0
        z-50
        flex
        w-full
        justify-around
        border-t
        border-[var(--border-soft)]
        bg-[var(--surface-low)]
        px-2
        py-2
        pb-[env(safe-area-inset-bottom)]
        md:hidden
      "
        >
            {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                    item.view === activeView;

                return (
                    <button
                        key={item.label}
                        type="button"
                        disabled={item.disabled}
                        onClick={() => {
                            if (item.view) {
                                onViewChange(
                                    item.view
                                );
                            }
                        }}
                        className={`
              relative
              flex
              flex-1
              flex-col
              items-center
              justify-center
              rounded-xl
              px-2
              py-3
              text-[10px]
              font-semibold
              transition
              ${active
                                ? "text-[var(--primary)]"
                                : "text-[var(--text-muted)] hover:text-[var(--text-soft)]"
                            }
              ${item.disabled
                                ? "cursor-not-allowed opacity-65"
                                : ""
                            }
            `}
                    >
                        {active && (
                            <motion.div
                                layoutId="mobileNavActiveBg"
                                className="absolute inset-0 rounded-xl bg-[rgba(192,193,255,0.1)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex flex-col items-center gap-1">
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </span>

                        {item.disabled && (
                            <span
                                className="
                  absolute
                  -right-1
                  -top-1
                  rounded-full
                  bg-[var(--surface-card-high)]
                  px-1.5
                  text-[9px]
                  uppercase
                  text-[var(--future)]
                "
                            >
                                v2
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
}