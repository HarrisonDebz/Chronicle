import {
    CheckCircle2,
    Trash2,
} from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    formatMemoryDate,
} from "../utils/eventDisplay";

interface Props {
    event: ChronicleEvent;
    faded?: boolean;
    onDeleteRequest: (event: ChronicleEvent) => void;
}

export default function MemoryTimelineItem({
    event,
    faded = false,
    onDeleteRequest,
}: Props) {
    const category = getCategoryInfo(event.category);

    const Icon = category.icon;

    return (
        <article
            className={`
        group
        relative
        cursor-default
        py-1
        pl-12
        transition
        ${faded
                    ? "opacity-70 hover:opacity-100"
                    : "opacity-95 hover:opacity-100"
                }
      `}
        >
            <div
                className="
          absolute
          left-0
          top-1/2
          z-10
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border-2
          border-[var(--memory)]
          bg-[var(--surface-card)]
          text-[var(--memory)]
          shadow-[0_0_12px_rgba(34,197,94,0.18)]
        "
            >
                <Icon size={18} />
            </div>

            <div
                className="
          rounded-xl
          border
          border-emerald-300/20
          bg-[var(--surface-low)]
          p-4
          transition
          group-hover:border-emerald-300/40
        "
            >
                <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                        {formatMemoryDate(event.date)}
                    </span>

                    <span
                        className="
              inline-flex
              items-center
              gap-1
              rounded-md
              bg-emerald-300/10
              px-2
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-[var(--memory)]
            "
                    >
                        <CheckCircle2 size={12} />
                        Completed
                    </span>
                </div>

                <h3 className="font-bold text-[var(--text-main)]">
                    {event.title}
                </h3>

                {event.description && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {event.description}
                    </p>
                )}

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-card-high)]">
                    <div className="h-full w-full rounded-full bg-[var(--memory)]" />
                </div>

                <button
                    type="button"
                    onClick={() => onDeleteRequest(event)}
                    className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                    text-red-300
                    opacity-100
                    transition
                    md:opacity-0
                    md:group-hover:opacity-100
                "
                >
                    <Trash2 size={13} />
                    Delete
                </button>
            </div>
        </article>
    );
}