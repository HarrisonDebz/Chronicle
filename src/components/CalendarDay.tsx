import {
    format,
    isSameDay,
    isSameMonth,
} from "date-fns";

import type { ChronicleEvent } from "../types/Event";

import {
    isCompletedEvent,
} from "../utils/eventStatus";

interface Props {
    day: Date;
    currentMonth: Date;
    selectedDay: Date;
    events: ChronicleEvent[];
    onSelect: (day: Date) => void;
}

export default function CalendarDay({
    day,
    currentMonth,
    selectedDay,
    events,
    onSelect,
}: Props) {
    const belongsToMonth =
        isSameMonth(day, currentMonth);

    const selected =
        isSameDay(day, selectedDay);

    const today =
        isSameDay(day, new Date());

    const visibleEvents =
        events.slice(0, 3);

    const hiddenEventCount =
        events.length - visibleEvents.length;

    return (
        <button
            type="button"
            aria-label={`Select date ${format(day, "MMMM d, yyyy")}. ${events.length} events`}
            onClick={() => onSelect(day)}
            className={`
        relative
        min-h-24
        border-b
        border-r
        border-[var(--border-soft)]
        p-2
        text-left
        transition
        sm:min-h-28
        sm:p-3
        ${belongsToMonth
                    ? "bg-[var(--calendar-day-active)]"
                    : "bg-[var(--calendar-day-inactive)] opacity-45"
                }
        ${selected
                    ? "z-10 ring-2 ring-inset ring-[var(--primary)]"
                    : "hover:bg-[var(--surface-card-high)]"
                }
      `}
        >
            <div className="flex items-center justify-between">
                <span
                    className={`
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            text-sm
            font-bold
            ${today
                            ? "bg-[var(--primary-strong)] text-white"
                            : "text-[var(--text-main)]"
                        }
          `}
                >
                    {format(day, "d")}
                </span>

                {events.length > 0 && (
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">
                        {events.length}
                    </span>
                )}
            </div>

            <div className="mt-2 space-y-1">
                {visibleEvents.map((event) => {
                    const completed =
                        isCompletedEvent(event);

                    return (
                        <div
                            key={event.id}
                            className={`
                truncate
                rounded-md
                px-1.5
                py-1
                text-[10px]
                font-semibold
                sm:text-xs
                ${completed
                                    ? "bg-emerald-400/10 text-[var(--memory)]"
                                    : "bg-orange-400/10 text-[var(--future)]"
                                }
              `}
                        >
                            {event.title}
                        </div>
                    );
                })}

                {hiddenEventCount > 0 && (
                    <p className="text-[10px] font-semibold text-[var(--text-muted)]">
                        +{hiddenEventCount} more
                    </p>
                )}
            </div>
        </button>
    );
}