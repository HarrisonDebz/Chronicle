import { motion } from "framer-motion";
import { CalendarPlus, Info } from "lucide-react";

import EventForm from "./EventForm";

import type { ChronicleEvent } from "../types/Event";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        event: Omit<ChronicleEvent, "id" | "createdAt">
    ) => void;
}

export default function AddEventModal({
    open,
    onClose,
    onSubmit,
}: Props) {
    if (!open) return null;

    return (
        <div
            className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-[rgba(6,14,32,0.82)]
            backdrop-blur-md
            sm:items-center
            sm:px-4
            sm:py-8
        "
        >
            <motion.div
                initial={{
                    opacity: 0,
                    y: 24,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="
                    flex
                    h-[100dvh]
                    w-full
                    flex-col
                    overflow-hidden
                    bg-[var(--surface-card)]
                    sm:h-auto
                    sm:max-h-[90dvh]
                    sm:max-w-2xl
                    sm:rounded-2xl
                "
            >
                <div
                    className="
            glass-card
            overflow-hidden
            rounded-2xl
            shadow-2xl
          "
                >
                    <div
                        className="
              relative
              h-20
              border-b
              border-[var(--border-soft)]
              bg-gradient-to-r
              from-[var(--surface-card-high)]
              to-[var(--surface-card)]
            "
                    >

                        <div
                            className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_50%_120%,rgba(192,193,255,0.22),transparent)]
                opacity-50
              "
                        />

                        <div className="absolute bottom-4 left-5">
                            <span
                                className="
                  orange-glow
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--future-strong)]
                  px-4
                  py-2
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#2a1000]
                "
                            >
                                <CalendarPlus size={16} />
                                New Event
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <EventForm
                            onSubmit={(event) => {
                                onSubmit(event);
                                onClose();
                            }}
                            onCancel={onClose}
                        />
                    </div>

                    <div
                        className="
            mt-4
            flex
            items-start
            gap-4
            rounded-2xl
            border
            border-[var(--border-soft)]
            bg-[rgba(6,14,32,0.52)]
            p-4
          "
                    >
                        <Info
                            size={22}
                            className="mt-0.5 text-[var(--primary)]"
                        />

                        <div>
                            <p className="mb-1 font-bold text-[var(--text-main)]">
                                Timeline Integrity
                            </p>

                            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                                Countdowns for future events will display an orange remaining-time bar.
                                Count Up events and memories will display a full green progress bar
                                with a completion badge.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}