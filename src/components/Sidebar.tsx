import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Plus,
    Settings,
    Tags,
    TimerReset,
    UserRound,
} from "lucide-react";

import { APP_VERSION } from "../config/app";

interface Props {
    collapsed: boolean;
    profileName: string;
    onToggle: () => void;
    onAddEvent: () => void;
    onOpenProfile: () => void;
}

const navItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        active: true,
        disabled: false,
    },
    {
        label: "Timeline",
        icon: TimerReset,
        active: false,
        disabled: true,
    },
    {
        label: "Statistics",
        icon: BarChart3,
        active: false,
        disabled: true,
    },
    {
        label: "Categories",
        icon: Tags,
        active: false,
        disabled: true,
    },
];

export default function Sidebar({
    collapsed,
    profileName,
    onToggle,
    onAddEvent,
    onOpenProfile,
}: Props) {
    return (
        <aside
            className={`
        fixed
        left-0
        top-0
        z-40
        hidden
        h-screen
        flex-col
        border-r
        border-[var(--border-soft)]
        bg-[var(--surface-low)]
        py-6
        transition-all
        duration-300
        md:flex
        ${collapsed
                    ? "w-20"
                    : "w-64"
                }
      `}
        >
            <div
                className={`
          mb-12
          flex
          items-start
          justify-between
          px-6
          ${collapsed
                        ? "justify-center"
                        : ""
                    }
        `}
            >
                {!collapsed && (
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--primary)]">
                            Chronicle
                        </h1>

                        <p className="text-sm font-medium text-[var(--text-muted)]">
                            Deep Indigo Edition
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onToggle}
                    className="
            rounded-lg
            p-2
            text-[var(--text-muted)]
            transition
            hover:bg-[var(--surface-card-high)]
            hover:text-[var(--primary)]
          "
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                </button>
            </div>

            <nav className="flex-1 space-y-2 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            type="button"
                            disabled={item.disabled}
                            className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-semibold
                transition
                ${item.active
                                    ? "border-r-4 border-[var(--primary)] bg-[var(--surface-card-high)] text-[var(--primary)]"
                                    : "text-[var(--text-muted)] hover:bg-[var(--surface-card-high)]"
                                }
                ${item.disabled
                                    ? "cursor-not-allowed opacity-75"
                                    : ""
                                }
                ${collapsed
                                    ? "justify-center px-0"
                                    : ""
                                }
              `}
                        >
                            <Icon size={21} />

                            {!collapsed && (
                                <>
                                    <span className="flex-1">
                                        {item.label}
                                    </span>

                                    {item.disabled && (
                                        <span
                                            className="
                        rounded-full
                        border
                        border-[var(--border-soft)]
                        px-2
                        py-0.5
                        text-[10px]
                        uppercase
                        tracking-wide
                        text-[var(--future)]
                      "
                                        >
                                            v2
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="space-y-3 px-4">
                <button
                    type="button"
                    onClick={onAddEvent}
                    className={`
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[var(--future-strong)]
            py-3
            font-semibold
            text-[#2a1000]
            shadow-lg
            shadow-orange-950/30
            transition
            hover:brightness-110
            active:scale-95
            ${collapsed
                            ? "px-0"
                            : "px-4"
                        }
          `}
                >
                    <Plus size={20} />

                    {!collapsed && (
                        <span>Add Event</span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onOpenProfile}
                    className={`
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-[var(--border-soft)]
            bg-[var(--surface-card)]
            p-3
            text-left
            transition
            hover:border-[var(--primary)]
            hover:bg-[var(--surface-card-high)]
            ${collapsed
                            ? "justify-center"
                            : ""
                        }
          `}
                >
                    <div
                        className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[rgba(192,193,255,0.12)]
              text-[var(--primary)]
            "
                    >
                        <UserRound size={18} />
                    </div>

                    {!collapsed && (
                        <>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[var(--text-main)]">
                                    {profileName || "Curator"}
                                </p>

                                <p className="text-xs text-[var(--text-muted)]">
                                    Profile settings
                                </p>
                            </div>

                            <Settings
                                size={17}
                                className="text-[var(--text-muted)]"
                            />
                        </>
                    )}
                </button>

                {!collapsed && (
                    <p className="text-center text-xs text-[var(--text-muted)]">
                        Chronicle v{APP_VERSION}
                    </p>
                )}
            </div>
        </aside>
    );
}