import {
    BarChart3,
    LayoutDashboard,
    Tags,
    TimerReset,
} from "lucide-react";

const navItems = [
    {
        label: "Home",
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
        label: "Stats",
        icon: BarChart3,
        active: false,
        disabled: true,
    },
    {
        label: "Cats",
        icon: Tags,
        active: false,
        disabled: true,
    },
];

export default function MobileBottomNav() {
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
        px-3
        py-2
        md:hidden
      "
        >
            {navItems.map((item) => {
                const Icon = item.icon;

                return (
                    <button
                        key={item.label}
                        disabled={item.disabled}
                        className={`
              relative
              flex
              min-w-16
              flex-col
              items-center
              justify-center
              rounded-xl
              px-3
              py-1.5
              text-xs
              font-semibold
              transition
              ${item.active
                                ? "bg-[var(--primary-strong)] text-white"
                                : "text-[var(--text-muted)]"
                            }
              ${item.disabled
                                ? "cursor-not-allowed opacity-70"
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