import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { ChronicleEvent } from "../types/Event";

interface Props {
    event: ChronicleEvent | null;
    onClose: () => void;
    onConfirm: (id: string) => void;
}

export default function DeleteConfirmModal({
    event,
    onClose,
    onConfirm,
}: Props) {
    if (!event) return null;

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
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold">
                            Delete event?
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            This will permanently remove "{event.title}" from Chronicle.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100"
                        aria-label="Close confirmation"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border px-4 py-2 font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            onConfirm(event.id);
                            onClose();
                        }}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
}