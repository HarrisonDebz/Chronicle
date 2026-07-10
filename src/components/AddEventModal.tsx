import { motion } from "framer-motion";

import {
    CalendarPlus,
    Pencil,
} from "lucide-react";

import type {
    ChronicleEvent,
    ChronicleEventInput,
} from "../types/Event";

import EventForm from "./EventForm";

interface Props {
    open: boolean;

    eventToEdit?: ChronicleEvent | null;

    onClose: () => void;

    onCreate: (
        event: ChronicleEventInput
    ) => void;

    onUpdate: (
        event: ChronicleEvent
    ) => void;
}

export default function AddEventModal({
    open,
    eventToEdit = null,
    onClose,
    onCreate,
    onUpdate,
}: Props) {
    if (!open) {
        return null;
    }

    const isEditing =
        Boolean(eventToEdit);

    function handleSubmit(
        input: ChronicleEventInput
    ) {
        if (eventToEdit) {
            onUpdate({
                ...eventToEdit,
                ...input,
            });
        } else {
            onCreate(input);
        }

        onClose();
    }

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
          sm:border
          sm:border-[var(--border-soft)]
          sm:shadow-2xl
        "
            >
                <div
                    className="
            relative
            h-16
            shrink-0
            border-b
            border-[var(--border-soft)]
            bg-gradient-to-r
            from-[var(--surface-card-high)]
            to-[var(--surface-card)]
            sm:h-20
          "
                >
                    <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
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
                text-[#2a1000]
              "
                        >
                            {isEditing ? (
                                <Pencil size={16} />
                            ) : (
                                <CalendarPlus size={16} />
                            )}

                            {isEditing
                                ? "Edit Event"
                                : "New Event"}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <EventForm
                        initialEvent={eventToEdit}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        submitLabel={
                            isEditing
                                ? "Save Changes"
                                : "Add Event"
                        }
                    />
                </div>
            </motion.div>
        </div>
    );
}