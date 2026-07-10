import { motion } from "framer-motion";
import {
    CalendarClock,
    Trash2,
} from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    formatEventDateLong,
    getDaysLeftLabel,
} from "../utils/eventDisplay";

import {
    getProgress,
} from "../utils/progress";

interface Props {
    event: ChronicleEvent;

    onView: (
        event: ChronicleEvent
    ) => void;

    onDeleteRequest: (
        event: ChronicleEvent
    ) => void;
}

export default function FeaturedUpcomingCard({
    event,
    onView,
    onDeleteRequest,
}: Props) {
    const category = getCategoryInfo(event.category);

    const Icon = category.icon;

    const progress = getProgress(event);

    return (
        <motion.article
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
        future-glow
        glass-card
        relative
        overflow-hidden
        rounded-2xl
        border-t-2
        border-[var(--future)]
        p-6
      "
        >
            <div
                className="
                mb-4
                inline-flex
                w-fit
                rounded-full
                border
                border-orange-300/30
                bg-orange-400/10
                px-4
                py-1.5
                text-xs
                font-bold
                text-[var(--future)]
                md:absolute
                md:right-6
                md:top-6
                md:mb-0
                "
            >
                {getDaysLeftLabel(event.date)}
            </div>

            <div className="relative z-10 max-w-xl md:pr-40">
                <span
                    className="
            mb-2
            block
            text-sm
            font-bold
            uppercase
            tracking-[0.22em]
            text-[var(--future)]
          "
                >
                    Milestone Event
                </span>

                <div className="mb-5 flex items-center gap-3">
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
                        <Icon size={24} />
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {event.title}
                        </h2>

                        <p className="text-sm font-medium text-[var(--text-muted)]">
                            {category.label}
                        </p>
                    </div>
                </div>

                <div
                    className="
            mb-8
            flex
            flex-wrap
            items-center
            gap-5
            text-[var(--text-muted)]
          "
                >
                    <div className="flex items-center gap-2">
                        <CalendarClock size={18} />

                        <span className="font-semibold">
                            {formatEventDateLong(event.date)}
                        </span>
                    </div>
                </div>

                {event.description && (
                    <p className="mb-8 max-w-2xl text-[var(--text-soft)]">
                        {event.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => onView(event)}
                        className="
                            rounded-xl
                            bg-[var(--future)]
                            px-8
                            py-3
                            font-bold
                            text-[#2a1000]
                            transition
                            hover:brightness-110
                            active:scale-95
                        "
                    >
                        View Event
                    </button>

                    <button
                        type="button"
                        onClick={() => onDeleteRequest(event)}
                        className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[var(--border-strong)]
              px-6
              py-3
              font-bold
              text-[var(--text-main)]
              transition
              hover:border-red-400/60
              hover:text-red-300
            "
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>

                <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-card-high)]">
                    <div
                        className="h-full rounded-full bg-[var(--future)]"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <div
                className="
          absolute
          -bottom-20
          -right-20
          h-72
          w-72
          rounded-full
          bg-orange-500/10
          blur-[90px]
        "
            />
        </motion.article>
    );
}