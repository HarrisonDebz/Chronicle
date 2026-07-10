import { motion } from "framer-motion";
import {
    AlertTriangle,
    Trash2,
} from "lucide-react";

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
        <div
            className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-[rgba(6,14,32,0.82)]
        px-4
        backdrop-blur-md
      "
        >
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                className="
          glass-card
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          shadow-2xl
        "
            >
                <div
                    className="
            flex
            items-start
            border-b
            border-[var(--border-soft)]
            bg-gradient-to-r
            from-[var(--surface-card-high)]
            to-[var(--surface-card)]
            p-5
          "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-red-400/30
                bg-red-500/10
                text-red-300
              "
                        >
                            <AlertTriangle size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-main)]">
                                Delete event?
                            </h2>

                            <p className="text-sm text-[var(--text-muted)]">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="p-5">
                    <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                        You are about to permanently remove{" "}
                        <span className="font-bold text-[var(--text-main)]">
                            {event.title}
                        </span>{" "}
                        from Chronicle.
                    </p>

                    <div
                        className="
              mt-5
              rounded-xl
              border
              border-[var(--border-soft)]
              bg-[var(--surface-low)]
              p-4
            "
                    >
                        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                            Event Type
                        </p>

                        <p className="mt-1 font-semibold capitalize text-[var(--text-main)]">
                            {event.type}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                flex-1
                rounded-xl
                border
                border-[var(--border-strong)]
                px-5
                py-3
                font-semibold
                text-[var(--text-main)]
                transition
                hover:bg-[var(--surface-card-high)]
              "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onConfirm(event.id);
                                onClose();
                            }}
                            className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-500
                px-5
                py-3
                font-bold
                text-white
                transition
                hover:brightness-110
                active:scale-95
              "
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}