import { motion } from "framer-motion";

import {
    Check,
    ChevronRight,
} from "lucide-react";

import type {
    ChronicleEvent,
} from "../types/Event";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    formatJourneyCountdown,
    formatJourneyMemoryDate,
} from "../utils/journey";

import {
    getProgress,
} from "../utils/progress";

interface Props {
    event: ChronicleEvent;
    mode: "upcoming" | "memory";
    now: Date;

    onView: (
        event: ChronicleEvent
    ) => void;
}

export default function JourneyEventCard({
    event,
    mode,
    now,
    onView,
}: Props) {
    const isMemory =
        mode === "memory";

    const category =
        getCategoryInfo(
            event.category
        );

    const Icon = category.icon;

    const progress =
        getProgress(event);

    return (
        <div
            className="
        relative
        pl-12
        sm:pl-20
      "
        >
            <div
                className={`
          absolute
          left-[3px]
          top-6
          z-10
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          border-2
          bg-[var(--surface-card)]
          sm:left-[19px]
          ${isMemory
                        ? "border-[var(--memory)] shadow-[0_0_14px_rgba(74,222,128,0.2)]"
                        : "border-[var(--future)] shadow-[0_0_14px_rgba(249,115,22,0.22)]"
                    }
        `}
            >
                {isMemory ? (
                    <Check
                        size={14}
                        strokeWidth={3}
                        className="text-[var(--memory)]"
                    />
                ) : (
                    <span className="h-2 w-2 rounded-full bg-[var(--future)]" />
                )}
            </div>

            <motion.button
                type="button"
                onClick={() =>
                    onView(event)
                }
                initial={{
                    opacity: 0,
                    y: 18,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                whileTap={{
                    scale: 0.99,
                }}
                className={`
          glass-card
          group
          w-full
          rounded-2xl
          border
          p-5
          text-left
          transition
          sm:p-6
          ${isMemory
                        ? "border-[var(--border-soft)] hover:border-emerald-300/50"
                        : "border-orange-300/30 hover:border-orange-300/60"
                    }
        `}
            >
                <div
                    className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <Icon
                            size={22}
                            className={
                                isMemory
                                    ? "shrink-0 text-[var(--memory)]"
                                    : "shrink-0 text-[var(--future)]"
                            }
                        />

                        <div className="min-w-0">
                            <h2
                                className="
                  break-words
                  text-xl
                  font-bold
                  text-[var(--text-main)]
                  sm:text-2xl
                "
                            >
                                {event.title}
                            </h2>

                            <p className="mt-1 text-xs font-semibold text-[var(--text-muted)]">
                                {category.label}
                            </p>
                        </div>
                    </div>

                    <div
                        className="
              flex
              shrink-0
              items-center
              justify-between
              gap-4
              sm:block
              sm:text-right
            "
                    >
                        <div>
                            <p
                                className={`
                  font-mono
                  text-lg
                  font-semibold
                  tracking-wide
                  sm:text-xl
                  ${isMemory
                                        ? "text-[var(--text-muted)]"
                                        : "text-[var(--future)]"
                                    }
                `}
                            >
                                {isMemory
                                    ? formatJourneyMemoryDate(
                                        event.date
                                    )
                                    : formatJourneyCountdown(
                                        event.date,
                                        now
                                    )}
                            </p>

                            <p
                                className={`
                  mt-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  ${isMemory
                                        ? "text-[var(--memory)]"
                                        : "text-[var(--text-muted)]"
                                    }
                `}
                            >
                                {isMemory
                                    ? "Completed"
                                    : "Days : Hours : Minutes"}
                            </p>
                        </div>

                        <ChevronRight
                            size={19}
                            className="
                text-[var(--text-muted)]
                transition
                group-hover:translate-x-1
                group-hover:text-[var(--primary)]
                sm:hidden
              "
                        />
                    </div>
                </div>

                <p
                    className="
            mt-5
            leading-relaxed
            text-[var(--text-muted)]
          "
                >
                    {event.description ||
                        `A ${category.label.toLowerCase()} event in your Chronicle.`}
                </p>

                <div
                    className="
            mt-6
            h-2
            w-full
            overflow-hidden
            rounded-full
            bg-[var(--surface-card-high)]
          "
                >
                    <div
                        className={`
              h-full
              rounded-full
              ${isMemory
                                ? "bg-[var(--memory)]"
                                : "bg-[var(--future)]"
                            }
            `}
                        style={{
                            width: `${isMemory
                                    ? 100
                                    : progress
                                }%`,
                        }}
                    />
                </div>
            </motion.button>
        </div>
    );
}