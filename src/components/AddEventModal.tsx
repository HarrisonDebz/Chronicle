import { X } from "lucide-react";
import { motion } from "framer-motion";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">
                            New Event
                        </h2>

                        <p className="text-sm text-gray-500">
                            Add a countdown or memory to Chronicle.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <EventForm
                    onSubmit={(event) => {
                        onSubmit(event);
                        onClose();
                    }}
                />
            </motion.div>
        </div>
    );
}