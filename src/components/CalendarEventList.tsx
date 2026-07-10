import {
    CalendarClock,
    CheckCircle2,
    Clock3,
} from "lucide-react";

import {
    format,
    parseISO,
} from "date-fns";

import type { ChronicleEvent } from "../types/Event";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    isCompletedEvent,
} from "../utils/eventStatus";

interface Props {
    selectedDay: Date;
    events: ChronicleEvent[];
    onView: (
        event: ChronicleEvent
    ) => void;
}

export default function CalendarEventList({
    selectedDay,
    events,
    onView,
}: Props) {
    return (
        <aside
            className="
        glass-card
        rounded-2xl
        p-5
        lg:sticky
        lg:top-8
        lg:h-fit
      "
        >
            <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                    Selected Date
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[var(--text-main)]">
                    {format(
                        selectedDay,
                        "EEEE, MMMM d"
                    )}
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {events.length}{" "}
                    {events.length === 1
                        ? "event"
                        : "events"}
                </p>
            </div>

            {events.length === 0 ? (
                <div
                    className="
            rounded-xl
            border
            border-dashed
            border-[var(--border-strong)]
            bg-[var(--surface-low)]
            p-6
            text-center
          "
                >
                    <CalendarClock
                        size={28}
                        className="mx-auto text-[var(--text-muted)]"
                    />

                    <p className="mt-3 font-semibold text-[var(--text-main)]">
                        Nothing recorded
                    </p>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        This day has no events in your Chronicle.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {events.map((event) => {
                        const completed =
                            isCompletedEvent(event);

                        const category =
                            getCategoryInfo(
                                event.category
                            );

                        const Icon = category.icon;

                        return (
                            <button
                                key={event.id}
                                type="button"
                                onClick={() =>
                                    onView(event)
                                }
                                className="
                  group
                  w-full
                  rounded-xl
                  border
                  border-[var(--border-soft)]
                  bg-[var(--surface-low)]
                  p-4
                  text-left
                  transition
                  hover:border-[var(--primary)]
                  hover:bg-[var(--surface-card-high)]
                "
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`
                      flex
                      h-10
                      w-10
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
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-bold text-[var(--text-main)]">
                                            {event.title}
                                        </h3>

                                        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                            <Clock3 size={13} />

                                            <span>
                                                {format(
                                                    parseISO(
                                                        event.date
                                                    ),
                                                    "HH:mm"
                                                )}
                                            </span>

                                            <span>•</span>

                                            <span>
                                                {category.label}
                                            </span>
                                        </div>
                                    </div>

                                    {completed && (
                                        <CheckCircle2
                                            size={18}
                                            className="shrink-0 text-[var(--memory)]"
                                        />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </aside>
    );
}