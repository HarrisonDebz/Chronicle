import { useState } from "react";
import { motion } from "framer-motion";

import { Tags } from "lucide-react";

import type {
    ChronicleEvent,
    EventCategory,
} from "../types/Event";

import { getCategoryInfo } from "../utils/categories";
import { formatMemoryDate } from "../utils/eventDisplay";

// ─── Colour palette (matches StatisticsView) ─────────────────────────────────

const CATEGORY_COLORS: Record<EventCategory, string> = {
    birthday: "#c0c1ff",
    relationship: "#ff9f68",
    education: "#9fd3c7",
    coding: "#7dd3fc",
    sports: "#fde68a",
    holiday: "#f9a8d4",
    goal: "#a5b4fc",
    other: "#94a3b8",
};

// ─── Ordered list so the grid is always consistent ───────────────────────────

const CATEGORY_ORDER: EventCategory[] = [
    "birthday",
    "relationship",
    "education",
    "coding",
    "sports",
    "holiday",
    "goal",
    "other",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUpcoming(event: ChronicleEvent) {
    return new Date(event.date) >= new Date();
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(dateStr));
}

// ─── Single event row inside a category bucket ───────────────────────────────

function EventRow({
    event,
    onView,
}: {
    event: ChronicleEvent;
    onView: (e: ChronicleEvent) => void;
}) {
    const upcoming = isUpcoming(event);

    return (
        <button
            type="button"
            onClick={() => onView(event)}
            className="
                group
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                border
                border-transparent
                px-4
                py-3
                text-left
                transition
                hover:border-[var(--border-soft)]
                hover:bg-[var(--surface-card-high)]
            "
        >
            {/* Status dot */}
            <span
                className="
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    transition
                "
                style={{
                    backgroundColor: upcoming
                        ? "var(--future)"
                        : "var(--memory)",
                }}
            />

            {/* Title + description */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                    {event.title}
                </p>

                {event.description && (
                    <p className="truncate text-xs text-[var(--text-muted)]">
                        {event.description}
                    </p>
                )}
            </div>

            {/* Date pill */}
            <span
                className="
                    shrink-0
                    rounded-full
                    border
                    px-2.5
                    py-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                "
                style={{
                    borderColor: upcoming
                        ? "rgba(255,159,104,0.3)"
                        : "rgba(159,211,199,0.3)",
                    color: upcoming
                        ? "var(--future)"
                        : "var(--memory)",
                }}
            >
                {upcoming
                    ? formatDate(event.date)
                    : formatMemoryDate(event.date)}
            </span>
        </button>
    );
}

// ─── Category bucket card ─────────────────────────────────────────────────────

function CategoryCard({
    category,
    events,
    active,
    onSelect,
    onView,
}: {
    category: EventCategory;
    events: ChronicleEvent[];
    active: boolean;
    onSelect: (cat: EventCategory) => void;
    onView: (e: ChronicleEvent) => void;
}) {
    const { icon: Icon, label } = getCategoryInfo(category);
    const color = CATEGORY_COLORS[category];

    const upcomingCount = events.filter(isUpcoming).length;
    const memoryCount = events.length - upcomingCount;

    return (
        <article
            className="
                glass-card
                flex
                flex-col
                gap-0
                overflow-hidden
                rounded-2xl
                transition-all
                duration-200
            "
            style={{
                borderTop: `3px solid ${color}`,
                opacity: events.length === 0 ? 0.45 : 1,
            }}
        >
            {/* Card header — always visible, acts as toggle */}
            <button
                type="button"
                onClick={() =>
                    events.length > 0 && onSelect(category)
                }
                disabled={events.length === 0}
                className="
                    flex
                    w-full
                    items-center
                    gap-4
                    p-5
                    text-left
                    transition
                    hover:bg-[var(--surface-card-high)]
                    disabled:cursor-default
                    disabled:hover:bg-transparent
                "
            >
                {/* Icon */}
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                    "
                    style={{
                        backgroundColor: `${color}18`,
                        color,
                    }}
                >
                    <Icon size={22} />
                </div>

                {/* Label + counts */}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--text-main)]">
                        {label}
                    </p>

                    {events.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)]">
                            No events yet
                        </p>
                    ) : (
                        <p className="text-xs text-[var(--text-muted)]">
                            {upcomingCount > 0 && (
                                <span className="text-[var(--future)]">
                                    {upcomingCount} upcoming
                                </span>
                            )}
                            {upcomingCount > 0 &&
                                memoryCount > 0 && (
                                    <span className="mx-1 opacity-40">
                                        ·
                                    </span>
                                )}
                            {memoryCount > 0 && (
                                <span className="text-[var(--memory)]">
                                    {memoryCount}{" "}
                                    {memoryCount === 1
                                        ? "memory"
                                        : "memories"}
                                </span>
                            )}
                        </p>
                    )}
                </div>

                {/* Count badge */}
                <span
                    className="
                        shrink-0
                        rounded-full
                        px-2.5
                        py-0.5
                        text-xs
                        font-bold
                    "
                    style={{
                        backgroundColor: `${color}22`,
                        color,
                    }}
                >
                    {events.length}
                </span>

                {/* Expand chevron */}
                {events.length > 0 && (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="shrink-0 text-[var(--text-muted)] transition-transform duration-200"
                        style={{
                            transform: active
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                        }}
                    >
                        <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </button>

            {/* Expanded event list */}
            {active && events.length > 0 && (
                <div
                    className="
                        flex
                        flex-col
                        gap-1
                        border-t
                        border-[var(--border-soft)]
                        px-3
                        pb-3
                        pt-2
                    "
                >
                    {events.map((ev) => (
                        <EventRow
                            key={ev.id}
                            event={ev}
                            onView={onView}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

// ─── Summary bar at the top ───────────────────────────────────────────────────

function SummaryBar({
    events,
}: {
    events: ChronicleEvent[];
}) {
    const counts = CATEGORY_ORDER.map((cat) => ({
        cat,
        pct:
            events.length === 0
                ? 0
                : (events.filter((e) => e.category === cat)
                    .length /
                    events.length) *
                100,
    }));

    return (
        <div className="glass-card rounded-2xl p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Category Breakdown
            </p>

            {/* Stacked bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full">
                {counts
                    .filter((c) => c.pct > 0)
                    .map(({ cat, pct }) => (
                        <div
                            key={cat}
                            title={`${getCategoryInfo(cat).label}: ${Math.round(pct)}%`}
                            style={{
                                width: `${pct}%`,
                                backgroundColor:
                                    CATEGORY_COLORS[cat],
                            }}
                        />
                    ))}
                {events.length === 0 && (
                    <div className="h-full w-full rounded-full bg-[var(--surface-card-high)]" />
                )}
            </div>

            {/* Legend pills */}
            <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_ORDER.filter((cat) =>
                    events.some((e) => e.category === cat)
                ).map((cat) => {
                    const count = events.filter(
                        (e) => e.category === cat
                    ).length;
                    const pct =
                        events.length === 0
                            ? 0
                            : Math.round(
                                (count / events.length) * 100
                            );
                    const { label } = getCategoryInfo(cat);
                    const color = CATEGORY_COLORS[cat];

                    return (
                        <span
                            key={cat}
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-3
                                py-1
                                text-xs
                                font-semibold
                            "
                            style={{
                                borderColor: `${color}40`,
                                color,
                                backgroundColor: `${color}12`,
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                    backgroundColor: color,
                                }}
                            />
                            {label} · {pct}%
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function CategoriesEmptyState() {
    return (
        <div
            className="
                glass-card
                mx-auto
                max-w-lg
                rounded-2xl
                p-10
                text-center
            "
        >
            <div
                className="
                    mx-auto
                    mb-5
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
                <Tags size={32} />
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-main)]">
                No events yet
            </h2>

            <p className="mt-3 text-[var(--text-muted)]">
                Add events and they will be organised here by
                category automatically.
            </p>
        </div>
    );
}

// ─── Main view ────────────────────────────────────────────────────────────────

interface Props {
    events: ChronicleEvent[];
    onView: (event: ChronicleEvent) => void;
}

export default function CategoryView({
    events,
    onView,
}: Props) {
    const [activeCategory, setActiveCategory] =
        useState<EventCategory | null>(null);

    function toggleCategory(cat: EventCategory) {
        setActiveCategory((prev) =>
            prev === cat ? null : cat
        );
    }

    // Group events by category
    const byCategory = CATEGORY_ORDER.map((cat) => ({
        category: cat,
        events: events.filter((e) => e.category === cat),
    }));

    return (
        <section className="mx-auto max-w-5xl">
            {/* Page header */}
            <header className="mb-10">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
                    Categories
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)] md:text-5xl">
                    Browse by Category
                </h1>

                <p className="mt-3 text-lg text-[var(--text-muted)]">
                    All your events, neatly sorted by what matters
                    most.
                </p>
            </header>

            {events.length === 0 ? (
                <CategoriesEmptyState />
            ) : (
                <div className="flex flex-col gap-5">
                    {/* Summary bar */}
                    <SummaryBar events={events} />

                    {/* Category grid */}
                    <motion.div 
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                        {byCategory.map(
                            ({ category, events: evs }) => (
                                <motion.div key={category} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                                    <CategoryCard
                                        category={category}
                                        events={evs}
                                        active={
                                            activeCategory ===
                                            category
                                        }
                                        onSelect={toggleCategory}
                                        onView={onView}
                                    />
                                </motion.div>
                            )
                        )}
                    </motion.div>
                </div>
            )}
        </section>
    );
}
