import { CalendarDays, ChevronDown, PlusCircle } from "lucide-react";
import { type FormEvent, useState } from "react";

import type {
    ChronicleEvent,
    EventCategory,
    EventType,
} from "../types/Event";

interface Props {
    onSubmit: (
        event: Omit<ChronicleEvent, "id" | "createdAt">
    ) => void;
    onCancel: () => void;
}

const categories: {
    label: string;
    value: EventCategory;
}[] = [
        { label: "Birthday", value: "birthday" },
        { label: "Relationship", value: "relationship" },
        { label: "Education", value: "education" },
        { label: "Coding", value: "coding" },
        { label: "Sports", value: "sports" },
        { label: "Holiday", value: "holiday" },
        { label: "Goal", value: "goal" },
        { label: "Other", value: "other" },
    ];

export default function EventForm({
    onSubmit,
    onCancel,
}: Props) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] =
        useState<EventType>("countdown");
    const [category, setCategory] =
        useState<EventCategory | "">("");
    const [error, setError] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Event title is required.");
            return;
        }

        if (!category) {
            setError("Please select a category.");
            return;
        }

        if (!date) {
            setError("Date and time are required.");
            return;
        }

        onSubmit({
            title: title.trim(),
            date,
            type,
            category,
            recurring: false,
        });

        setTitle("");
        setDate("");
        setType("countdown");
        setCategory("");
        setError("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5 md:p-6"
        >
            {error && (
                <div
                    className="
            rounded-xl
            border
            border-red-400/30
            bg-red-500/10
            px-4
            py-3
            text-sm
            font-semibold
            text-red-200
          "
                >
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                    Event Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label>
                        <input
                            type="radio"
                            name="event-type"
                            checked={type === "countdown"}
                            onChange={() => setType("countdown")}
                            className="peer sr-only"
                        />

                        <div
                            className="
                cursor-pointer
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-4
                text-center
                font-semibold
                transition
                hover:border-[var(--primary)]
                peer-checked:border-[var(--primary)]
                peer-checked:bg-[rgba(192,193,255,0.12)]
                peer-checked:text-[var(--primary)]
              "
                        >
                            Countdown
                        </div>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="event-type"
                            checked={type === "countup"}
                            onChange={() => setType("countup")}
                            className="peer sr-only"
                        />

                        <div
                            className="
                cursor-pointer
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-4
                text-center
                font-semibold
                transition
                hover:border-[var(--primary)]
                peer-checked:border-[var(--primary)]
                peer-checked:bg-[rgba(192,193,255,0.12)]
                peer-checked:text-[var(--primary)]
              "
                        >
                            Count Up
                        </div>
                    </label>
                </div>
            </div>

            <div className="space-y-3">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                    Event Title
                </label>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Graduation, First GitHub commit"
                    className="
            w-full
            rounded-xl
            border
            border-[var(--border-strong)]
            bg-[var(--surface-low)]
            p-4
            text-lg
            font-semibold
            text-[var(--text-main)]
            outline-none
            transition
            placeholder:text-[rgba(199,196,215,0.32)]
            focus:border-[var(--primary)]
            focus:ring-2
            focus:ring-[rgba(192,193,255,0.24)]
          "
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                    <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                        Category
                    </label>

                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value as EventCategory)
                            }
                            className="
                w-full
                appearance-none
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-4
                text-[var(--text-main)]
                outline-none
                transition
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[rgba(192,193,255,0.24)]
              "
                        >
                            <option value="" disabled>
                                Select category
                            </option>

                            {categories.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={20}
                            className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[var(--text-muted)]
              "
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                        Date & Time
                    </label>

                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="
                w-full
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-4
                pr-12
                text-[var(--text-main)]
                outline-none
                transition
                [color-scheme:dark]
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[rgba(192,193,255,0.24)]
              "
                        />

                        <CalendarDays
                            size={20}
                            className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[var(--text-muted)]
              "
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-end gap-3 pt-2 md:flex-row">
                <button
                    type="button"
                    onClick={onCancel}
                    className="
            w-full
            rounded-xl
            px-6
            py-3
            font-semibold
            text-[var(--text-muted)]
            transition
            hover:bg-[var(--surface-card-high)]
            md:w-auto
          "
                >
                    Discard
                </button>

                <button
                    type="submit"
                    className="
            orange-glow
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[var(--future-strong)]
            px-8
            py-3
            font-bold
            uppercase
            tracking-wide
            text-[#2a1000]
            transition
            hover:brightness-110
            active:scale-95
            md:w-auto
          "
                >
                    <PlusCircle size={19} />
                    Add Event
                </button>
            </div>
        </form>
    );
}