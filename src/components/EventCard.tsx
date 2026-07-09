import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import {
    getDaysRemaining,
    getElapsedTime,
} from "../utils/date";

import {
    getCategoryInfo,
} from "../utils/categories";

import {
    getProgress,
} from "../utils/progress";

import {
    isCompletedEvent,
    isUpcomingCountdown,
} from "../utils/eventStatus";

interface Props {
    event: ChronicleEvent;
    onDeleteRequest: (event: ChronicleEvent) => void;
}

export default function EventCard({
    event,
    onDeleteRequest,
}: Props) {
    const category = getCategoryInfo(event.category);

    const Icon = category.icon;

    const completed = isCompletedEvent(event);

    const upcoming = isUpcomingCountdown(event);

    const progress = getProgress(event);

    const time = upcoming
        ? `${getDaysRemaining(event.date)} days left`
        : event.type === "countup"
            ? getElapsedTime(event.date)
            : `Completed ${getElapsedTime(event.date)}`;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
      "
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Icon size={22} />

                    <div>
                        <h2 className="text-xl font-semibold">
                            {event.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {category.label}
                        </p>
                    </div>
                </div>

                {completed && (
                    <div
                        className="
              flex
              items-center
              gap-1
              rounded-full
              bg-green-50
              px-2
              py-1
              text-xs
              font-medium
              text-green-700
            "
                    >
                        <CheckCircle2 size={14} />
                        Done
                    </div>
                )}
            </div>

            <p className="mt-5 text-3xl font-bold">
                {time}
            </p>

            {event.description && (
                <p className="mt-2 text-sm text-gray-500">
                    {event.description}
                </p>
            )}

            <div className="mt-4">
                <div
                    className="
            h-2
            rounded-full
            bg-gray-200
          "
                >
                    <div
                        className={`
              h-full
              rounded-full
              ${completed
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }
            `}
                        style={{
                            width: `${completed ? 100 : Math.max(progress, 6)}%`,
                        }}
                    />
                </div>
            </div>

            <button
                onClick={() => onDeleteRequest(event)}
                className="
          mt-5
          text-sm
          text-red-500
        "
            >
                Delete
            </button>
        </motion.div>
    );
}