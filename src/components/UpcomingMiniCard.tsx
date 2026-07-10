import { Trash2 } from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    formatEventDate,
} from "../utils/eventDisplay";

import {
    getProgress,
} from "../utils/progress";

interface Props {
    event: ChronicleEvent;
    onDeleteRequest: (event: ChronicleEvent) => void;
}

export default function UpcomingMiniCard({
    event,
    onDeleteRequest,
}: Props) {
    const category = getCategoryInfo(event.category);

    const Icon = category.icon;

    const progress = getProgress(event);

    return (
        <article
            className="
        glass-card
        rounded-2xl
        border-t-2
        border-orange-300/40
        p-6
        transition
        hover:border-[var(--future)]
        hover:bg-[rgba(23,31,51,0.9)]
      "
        >
            <div className="mb-8 flex items-start justify-between">
                <div
                    className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-orange-400/10
            text-[var(--future)]
          "
                >
                    <Icon size={22} />
                </div>

                <span
                    className="
            rounded-lg
            bg-[var(--surface-card-high)]
            px-3
            py-1
            text-xs
            font-bold
            text-[var(--text-muted)]
          "
                >
                    {formatEventDate(event.date)}
                </span>
            </div>

            <h3 className="mb-2 text-2xl font-bold">
                {event.title}
            </h3>

            <p className="min-h-12 text-sm text-[var(--text-muted)]">
                {event.description || category.label}
            </p>

            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-card-high)]">
                <div
                    className="h-full rounded-full bg-[var(--future)]"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>

            <button
                type="button"
                onClick={() => onDeleteRequest(event)}
                className="
          mt-5
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-red-300
          opacity-75
          transition
          hover:opacity-100
        "
            >
                <Trash2 size={15} />
                Delete
            </button>
        </article>
    );
}