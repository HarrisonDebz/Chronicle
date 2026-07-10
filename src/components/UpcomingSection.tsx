import { Sparkles } from "lucide-react";

import type { ChronicleEvent } from "../types/Event";

import FeaturedUpcomingCard from "./FeaturedUpcomingCard";
import UpcomingMiniCard from "./UpcomingMiniCard";

interface Props {
    events: ChronicleEvent[];

    onView: (
        event: ChronicleEvent
    ) => void;

    onDeleteRequest: (
        event: ChronicleEvent
    ) => void;
}

export default function UpcomingSection({
    events,
    onView,
    onDeleteRequest,
}: Props) {
    const [
        featuredEvent,
        ...secondaryEvents
    ] = events;

    return (
        <section className="flex flex-col gap-6 lg:col-span-8">
            <div className="flex items-center justify-between">
                <h2
                    className="
            flex
            items-center
            gap-2
            text-2xl
            font-bold
            text-[var(--future)]
          "
                >
                    <Sparkles size={24} />
                    Coming Up
                </h2>
            </div>

            {featuredEvent ? (
                <>
                    <FeaturedUpcomingCard
                        event={featuredEvent}
                        onView={onView}
                        onDeleteRequest={
                            onDeleteRequest
                        }
                    />

                    {secondaryEvents.length >
                        0 && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {secondaryEvents.map(
                                    (event) => (
                                        <UpcomingMiniCard
                                            key={event.id}
                                            event={event}
                                            onDeleteRequest={
                                                onDeleteRequest
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                </>
            ) : (
                <div
                    className="
            glass-card
            rounded-2xl
            p-8
            text-center
            text-[var(--text-muted)]
          "
                >
                    No upcoming events. Add a
                    countdown to start tracking
                    the future.
                </div>
            )}
        </section>
    );
}