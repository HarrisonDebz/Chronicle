import { motion } from "framer-motion";

import {
    CalendarClock,
    Pencil,
    Trash2,
} from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    formatEventDateTime,
    getDaysLeftLabel,
} from "../utils/eventDisplay";

import {
    isCompletedEvent,
} from "../utils/eventStatus";

interface Props {
    event: ChronicleEvent | null;

    onClose: () => void;

    onEdit: (
        event: ChronicleEvent
    ) => void;

    onDeleteRequest: (
        event: ChronicleEvent
    ) => void;
}

export default function EventDetailsModal({
    event,
    onClose,
    onEdit,
    onDeleteRequest,
}: Props) {
    if (!event) {
        return null;
    }

    const category =
        getCategoryInfo(event.category);

    const Icon = category.icon;

    const completed =
        isCompletedEvent(event);

    return (
        <div
            className="
        fixed
        inset-0
        z-[105]
        flex
        items-center
        justify-center
        bg-[rgba(6,14,32,0.84)]
        px-4
        py-8
        backdrop-blur-md
      "
        >
            <motion.article
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
          max-w-xl
          overflow-hidden
          rounded-2xl
          shadow-2xl
        "
            >
                <header
                    className="
            border-b
            border-[var(--border-soft)]
            bg-gradient-to-r
            from-[var(--surface-card-high)]
            to-[var(--surface-card)]
            p-6
          "
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${completed
                                    ? "bg-emerald-400/10 text-[var(--memory)]"
                                    : "bg-orange-400/10 text-[var(--future)]"
                                }
              `}
                        >
                            <Icon size={25} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <span
                                className={`
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  ${completed
                                        ? "text-[var(--memory)]"
                                        : "text-[var(--future)]"
                                    }
                `}
                            >
                                {completed
                                    ? "Memory"
                                    : getDaysLeftLabel(
                                        event.date
                                    )}
                            </span>

                            <h2 className="mt-2 break-words text-2xl font-bold text-[var(--text-main)]">
                                {event.title}
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-[var(--text-muted)]">
                                {category.label}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <div
                        className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[var(--border-soft)]
              bg-[var(--surface-low)]
              p-4
            "
                    >
                        <CalendarClock
                            size={20}
                            className="text-[var(--primary)]"
                        />

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                                Event Date
                            </p>

                            <p className="mt-1 font-semibold text-[var(--text-main)]">
                                {formatEventDateTime(
                                    event.date
                                )}
                            </p>
                        </div>
                    </div>

                    {event.description && (
                        <div className="mt-5">
                            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                                Description
                            </p>

                            <p className="mt-2 leading-relaxed text-[var(--text-soft)]">
                                {event.description}
                            </p>
                        </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-4">
                        <div
                            className="
                rounded-xl
                border
                border-[var(--border-soft)]
                bg-[var(--surface-low)]
                p-4
              "
                        >
                            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                                Type
                            </p>

                            <p className="mt-1 font-semibold text-[var(--text-main)]">
                                {event.type === "countdown"
                                    ? "Countdown"
                                    : "Count Up"}
                            </p>
                        </div>

                        <div
                            className="
                rounded-xl
                border
                border-[var(--border-soft)]
                bg-[var(--surface-low)]
                p-4
              "
                        >
                            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                                Status
                            </p>

                            <p
                                className={`
                  mt-1
                  font-semibold
                  ${completed
                                        ? "text-[var(--memory)]"
                                        : "text-[var(--future)]"
                                    }
                `}
                            >
                                {completed
                                    ? "Completed"
                                    : "Upcoming"}
                            </p>
                        </div>
                    </div>

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
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onEdit(event)
                            }
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
                            <Pencil size={17} />
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onDeleteRequest(event)
                            }
                            className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-500
                px-5
                py-3
                font-bold
                text-white
                transition
                hover:brightness-110
                active:scale-95
              "
                        >
                            <Trash2 size={17} />
                            Delete
                        </button>
                    </div>
                </div>
            </motion.article>
        </div>
    );
}