import {
    CalendarDays,
    ChevronDown,
    PlusCircle,
    Save,
    Tag,
    Bell,
} from "lucide-react";

import {
    type FormEvent,
    useState,
} from "react";

import type {
    ChronicleEvent,
    ChronicleEventInput,
    EventCategory,
    EventType,
    NotificationSetting,
} from "../types/Event";

interface Props {
    initialEvent?: ChronicleEvent | null;

    onSubmit: (
        event: ChronicleEventInput
    ) => void;

    onCancel: () => void;

    submitLabel?: string;
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

function getDateTimeInputValue(
    date?: string
) {
    if (!date) {
        return "";
    }

    if (date.length === 10) {
        return `${date}T00:00`;
    }

    return date.slice(0, 16);
}

export default function EventForm({
    initialEvent = null,
    onSubmit,
    onCancel,
    submitLabel = "Add Event",
}: Props) {
    const isEditing = Boolean(initialEvent);

    const [title, setTitle] = useState(
        initialEvent?.title ?? ""
    );

    const [description, setDescription] =
        useState(
            initialEvent?.description ?? ""
        );

    const [date, setDate] = useState(
        getDateTimeInputValue(
            initialEvent?.date
        )
    );

    const [type, setType] =
        useState<EventType>(
            initialEvent?.type ?? "countdown"
        );

    const [category, setCategory] =
        useState<EventCategory | "">(
            initialEvent?.category ?? ""
        );

    const [customCategory, setCustomCategory] =
        useState(
            initialEvent?.customCategory ?? ""
        );

    const [notifyBefore, setNotifyBefore] =
        useState<NotificationSetting>(
            initialEvent?.notifyBefore ?? "none"
        );

    const [error, setError] = useState("");

    function handleSubmit(
        event: FormEvent
    ) {
        event.preventDefault();

        if (!title.trim()) {
            setError("Event title is required.");
            return;
        }

        if (!category) {
            setError(
                "Please select a category."
            );
            return;
        }

        if (!date) {
            setError(
                "Date and time are required."
            );
            return;
        }

        onSubmit({
            title: title.trim(),

            description:
                description.trim() || undefined,

            date,
            type,
            category,

            customCategory:
                category === "other" && customCategory.trim()
                    ? customCategory.trim()
                    : undefined,

            recurring:
                initialEvent?.recurring ?? false,

            notifyBefore: type === "countup"
                ? (notifyBefore === "on-day" ? "on-day" : "none")
                : notifyBefore,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 sm:p-5 md:p-6"
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

            <div className="space-y-2">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                    Event Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label>
                        <input
                            type="radio"
                            name="event-type"
                            checked={
                                type === "countdown"
                            }
                            onChange={() =>
                                setType("countdown")
                            }
                            className="peer sr-only"
                        />

                        <div
                            className="
                cursor-pointer
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-3
                text-center
                font-semibold
                transition
                hover:border-[var(--primary)]
                peer-checked:border-[var(--primary)]
                peer-checked:bg-[rgba(192,193,255,0.12)]
                peer-checked:text-[var(--primary)]
                sm:p-4
              "
                        >
                            Countdown
                        </div>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="event-type"
                            checked={
                                type === "countup"
                            }
                            onChange={() =>
                                setType("countup")
                            }
                            className="peer sr-only"
                        />

                        <div
                            className="
                cursor-pointer
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface-low)]
                p-3
                text-center
                font-semibold
                transition
                hover:border-[var(--primary)]
                peer-checked:border-[var(--primary)]
                peer-checked:bg-[rgba(192,193,255,0.12)]
                peer-checked:text-[var(--primary)]
                sm:p-4
              "
                        >
                            Count Up
                        </div>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                    Event Title
                </label>

                <input
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="e.g. Graduation"
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

            <div className="space-y-2">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    placeholder="Optional note about this event"
                    rows={2}
                    className="
            w-full
            resize-none
            rounded-xl
            border
            border-[var(--border-strong)]
            bg-[var(--surface-low)]
            p-4
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
                <div className="space-y-2">
                    <div className="ml-1 flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                            Category
                        </label>
                    </div>

                    <div className="relative">
                        <select
                            value={category}
                            onChange={(event) => {
                                setCategory(
                                    event.target
                                        .value as EventCategory
                                );
                                if (event.target.value !== "other") {
                                    setCustomCategory("");
                                }
                            }}
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
                            <option
                                value=""
                                disabled
                            >
                                Select category
                            </option>

                            {categories.map(
                                (item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                )
                            )}
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

                    {category === "other" && (
                        <div className="relative mt-2">
                            <input
                                autoFocus
                                value={customCategory}
                                onChange={(e) =>
                                    setCustomCategory(
                                        e.target.value
                                    )
                                }
                                placeholder="Name your category…"
                                className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--primary)]/40
                    bg-[var(--surface-low)]
                    p-4
                    pl-11
                    text-[var(--text-main)]
                    outline-none
                    transition
                    placeholder:text-[rgba(199,196,215,0.32)]
                    focus:border-[var(--primary)]
                    focus:ring-2
                    focus:ring-[rgba(192,193,255,0.24)]
                "
                            />
                            <Tag
                                size={16}
                                className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[var(--primary)]
                "
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                        Date & Time
                    </label>

                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(event) =>
                                setDate(
                                    event.target.value
                                )
                            }
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

            <div className="space-y-2 border-t border-[var(--border-soft)] pt-4">
                {type === "countdown" ? (
                    <div className="space-y-2">
                        <label className="ml-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-soft)]">
                            <Bell size={14} className="text-[var(--primary)]" />
                            Remind Me Before Event
                        </label>
                        <div className="relative">
                            <select
                                value={notifyBefore}
                                onChange={(event) =>
                                    setNotifyBefore(event.target.value as NotificationSetting)
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
                                <option value="none">No reminder</option>
                                <option value="on-day">On the day (at 9:00 AM)</option>
                                <option value="1-day">1 day before</option>
                                <option value="1-hour">1 hour before</option>
                                <option value="15-min">15 minutes before</option>
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
                ) : (
                    <div className="flex items-center justify-between rounded-xl border border-[var(--border-strong)] bg-[var(--surface-low)] p-4 mt-2">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${notifyBefore === 'on-day' ? 'bg-green-500/10 text-green-400' : 'bg-[var(--surface-card-high)] text-[var(--text-muted)]'}`}>
                                <Bell size={18} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-[var(--text-main)]">Anniversary Reminder</p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    Notify me every year on this day
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotifyBefore(prev => prev === 'on-day' ? 'none' : 'on-day')}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition active:scale-95 ${
                                notifyBefore === 'on-day'
                                    ? 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30'
                                    : 'bg-[var(--surface-card-high)] border-[var(--border-strong)] text-[var(--text-muted)] hover:brightness-110'
                            }`}
                        >
                            {notifyBefore === 'on-day' ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center justify-end gap-3 pt-2 sm:flex-row">
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
            sm:w-auto
          "
                >
                    Cancel
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
            text-[#2a1000]
            transition
            hover:brightness-110
            active:scale-95
            sm:w-auto
          "
                >
                    {isEditing ? (
                        <Save size={19} />
                    ) : (
                        <PlusCircle size={19} />
                    )}

                    {submitLabel}
                </button>
            </div>
        </form>
    );
}