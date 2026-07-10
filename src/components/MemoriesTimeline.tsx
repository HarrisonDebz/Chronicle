import { History } from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import MemoryTimelineItem from "./MemoryTimelineItem";

interface Props {
    events: ChronicleEvent[];
    onDeleteRequest: (event: ChronicleEvent) => void;
}

export default function MemoriesTimeline({
    events,
    onDeleteRequest,
}: Props) {
    return (
        <section className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex items-center justify-between">
                <h2
                    className="
            flex
            items-center
            gap-2
            text-2xl
            font-bold
            text-[var(--memory)]
          "
                >
                    <History size={24} />
                    Memories
                </h2>
            </div>

            {events.length > 0 ? (
                <div
                    className="
            relative
            flex
            flex-col
            gap-3
            before:absolute
            before:bottom-4
            before:left-[19px]
            before:top-4
            before:w-[2px]
            before:bg-[var(--border-soft)]
          "
                >
                    {events.map((event, index) => (
                        <MemoryTimelineItem
                            key={event.id}
                            event={event}
                            faded={index > 0}
                            onDeleteRequest={onDeleteRequest}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="
            glass-card
            rounded-2xl
            p-6
            text-sm
            text-[var(--text-muted)]
          "
                >
                    No memories yet. Completed countdowns and count-up events will live here.
                </div>
            )}
        </section>
    );
}