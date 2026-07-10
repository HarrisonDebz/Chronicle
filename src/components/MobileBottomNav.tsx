import {
    BarChart3,
    CalendarDays,
    LayoutDashboard,
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
        label: "Calendar",
        icon: CalendarDays,
        view: "calendar" as AppView,
        disabled: false,
    },
    {
        label: "Journey",
        icon: TimerReset,
        view: null,
        disabled: true,
    },
    {
        label: "Stats",
        icon: BarChart3,
        view: null,
        disabled: true,
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
              min-w-16
              flex-col
              items-center
              justify-center
              rounded-xl
              px-2
              py-1.5
              text-xs
              font-semibold
              transition
              ${active
                                ? "bg-[var(--primary-strong)] text-white"
                                : "text-[var(--text-muted)]"
                            }
              ${item.disabled
                                ? "cursor-not-allowed opacity-65"
                                : ""
                            }
            `}
                    >
                        <Icon size={20} />

                        <span>{item.label}</span>

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