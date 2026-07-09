import { useState } from "react";
import type {
    EventCategory,
    EventType,
    ChronicleEvent,
} from "../types/Event";

interface Props {
    onSubmit: (
        event: Omit<ChronicleEvent, "id" | "createdAt">
    ) => void;
}

export default function EventForm({ onSubmit }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<EventType>("countdown");
    const [category, setCategory] = useState<EventCategory>("other");
    const [recurring, setRecurring] = useState(false);

    const [error, setError] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!date) {
            setError("Date is required.");
            return;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            date,
            type,
            category,
            recurring,
        });

        setTitle("");
        setDescription("");
        setDate("");
        setType("countdown");
        setCategory("other");
        setRecurring(false);
        setError("");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Title
                </label>

                <input
                    placeholder="Graduation, World Cup, Anniversary..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Description
                </label>

                <textarea
                    placeholder="Optional note..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-20 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Date
                </label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Type
                </label>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                >
                    <option value="countdown">Countdown</option>
                    <option value="countup">Count Up</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Category
                </label>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                >
                    <option value="birthday">Birthday</option>
                    <option value="relationship">Relationship</option>
                    <option value="education">Education</option>
                    <option value="coding">Coding</option>
                    <option value="sports">Sports</option>
                    <option value="holiday">Holiday</option>
                    <option value="goal">Goal</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                />

                Recurring event
            </label>

            <button
                type="submit"
                className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white"
            >
                Create Event
            </button>
        </form>
    );
}