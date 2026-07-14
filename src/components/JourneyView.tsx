import {
    History,
    Map,
    Radio,
} from "lucide-react";

import type {
    ChronicleEvent,
} from "../types/Event";

import {
    getMemoryEvents,
    getUpcomingEvents,
} from "../utils/eventFilters";

import { useNow } from "../hooks/useNow";

import JourneyEventCard from "./JourneyEventCard";

interface Props {
    events: ChronicleEvent[];

    onView: (
        event: ChronicleEvent
    ) => void;
}

export default function JourneyView({
    events,
    onView,
}: Props) {
    const now = useNow();

    const upcomingEvents =
        getUpcomingEvents(events);

    const memoryEvents =
        getMemoryEvents(events);

    if (events.length === 0) {
        return (
            <section
                className="
          glass-card
          mx-auto
          max-w-3xl
          rounded-2xl
          p-8
          text-center
          md:p-12
        "
            >
                <div
                    className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[var(--overlay-primary)]
            text-[var(--primary)]
          "
                >
                    <Map size={32} />
                </div>

                <h1 className="mt-5 text-3xl font-bold text-[var(--text-main)]">
                    Your journey begins here
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-[var(--text-muted)]">
                    Add an upcoming event or meaningful memory and Chronicle will place it on your personal timeline.
                </p>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-4xl">
            <header className="mb-10">
                <div className="flex items-center gap-3">
                    <History
                        size={28}
                        className="text-[var(--primary)]"
                    />

                    <h1
                        className="
              text-3xl
              font-bold
              tracking-tight
              text-[var(--text-main)]
              md:text-4xl
            "
                    >
                        Your Journey
                    </h1>
                </div>

                <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
                    The moments ahead, the point where you stand, and the memories that brought you here.
                </p>
            </header>

            <div className="relative">
                <div
                    className="
            absolute
            bottom-6
            left-[14px]
            top-6
            w-[2px]
            bg-gradient-to-b
            from-[var(--future)]
            via-[var(--primary)]
            to-[var(--memory)]
            opacity-60
            sm:left-[30px]
          "
                />

                <div className="space-y-10 sm:space-y-14">
                    {upcomingEvents.map(
                        (event) => (
                            <JourneyEventCard
                                key={event.id}
                                event={event}
                                mode="upcoming"
                                now={now}
                                onView={onView}
                            />
                        )
                    )}

                    <div
                        className="
              relative
              py-3
              pl-12
              sm:pl-20
            "
                    >
                        <div
                            className="
                absolute
                left-[-3px]
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-xl
                border-2
                border-[var(--primary)]
                bg-[var(--surface-card)]
                text-[var(--primary)]
                sm:left-[13px]
              "
                        >
                            <Radio size={19} />
                        </div>

                        <div
                            className="
                flex
                items-center
                gap-4
              "
                        >
                            <div className="w-full border-t border-dashed border-[var(--border-strong)]" />

                            <span
                                className="
                  shrink-0
                  rounded-full
                  border
                  border-[var(--border-soft)]
                  bg-[var(--surface-card)]
                  px-3
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--primary)]
                "
                            >
                                Present
                            </span>
                        </div>
                    </div>

                    {memoryEvents.map(
                        (event) => (
                            <JourneyEventCard
                                key={event.id}
                                event={event}
                                mode="memory"
                                now={now}
                                onView={onView}
                            />
                        )
                    )}
                </div>
            </div>
        </section>
    );
}