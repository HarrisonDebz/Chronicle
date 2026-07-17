import {
    BarChart3,
    CheckCircle2,
    Clock,
} from "lucide-react";

import type { ChronicleEvent, EventCategory } from "../types/Event";

import { CATEGORY_COLORS, getCategoryInfo } from "../utils/categories";
import { formatMemoryDate } from "../utils/eventDisplay";
import { getProgress } from "../utils/progress";
import {
    formatDaysAgo,
    getCategoryDistribution,
    getCompletionStats,
    getLongestMemory,
    getSoonestMilestone,
} from "../utils/statistics";

import { useNow } from "../hooks/useNow";


function liveCountdown(date: string, now: Date) {
    const target = new Date(date).getTime();
    const diff = Math.max(target - now.getTime(), 0);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
    };
}

// ─── Donut chart ──────────────────────────────────────────────────────────────

interface DonutProps {
    segments: { value: number; color: string }[];
    total: number;
    size?: number;
    thickness?: number;
}

function DonutChart({
    segments,
    total,
    size = 140,
    thickness = 22,
}: DonutProps) {
    const r = (size - thickness) / 2;
    const circumference = 2 * Math.PI * r;
    const cx = size / 2;
    const cy = size / 2;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: "rotate(-90deg)" }}
        >
            {/* Track */}
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--surface-card-high)"
                strokeWidth={thickness}
            />

            {segments
                .map((seg, i) => {
                    const cumulativeOffset = segments
                        .slice(0, i)
                        .reduce((sum, s) => sum + s.value, 0);

                    const dash =
                        (seg.value / 100) * circumference;
                    const gap = circumference - dash;
                    const rotateOffset =
                        (cumulativeOffset / 100) *
                        circumference;

                    return (
                        <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={thickness}
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={-rotateOffset}
                            strokeLinecap="butt"
                        />
                    );
                })}

            {/* Inner label — rotate back so text is upright */}
            <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    transform: `rotate(90deg)`,
                    transformOrigin: `${cx}px ${cy}px`,
                    fill: "var(--text-main)",
                    fontSize: "26px",
                    fontWeight: "800",
                    fontFamily: "inherit",
                }}
            >
                {total}
            </text>
            <text
                x={cx}
                y={cy + 20}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    transform: `rotate(90deg)`,
                    transformOrigin: `${cx}px ${cy}px`,
                    fill: "var(--text-muted)",
                    fontSize: "11px",
                    fontWeight: "600",
                    fontFamily: "inherit",
                }}
            >
                Events
            </text>
        </svg>
    );
}

// ─── Card: Soonest Milestone ──────────────────────────────────────────────────

function SoonestMilestoneCard({
    event,
    now,
}: {
    event: ChronicleEvent;
    now: Date;
}) {
    const cat = getCategoryInfo(event.category);
    const Icon = cat.icon;
    const progress = getProgress(event);
    const { days, hours, mins } = liveCountdown(
        event.date,
        now
    );

    return (
        <article
            className="
                glass-card
                future-glow
                relative
                overflow-hidden
                rounded-2xl
                border-t-2
                border-[var(--future)]
                p-6
                flex
                flex-col
                gap-5
            "
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-orange-400/10
                            text-[var(--future)]
                        "
                    >
                        <Icon size={20} />
                    </div>

                    <span className="text-sm font-bold text-[var(--text-main)]">
                        Soonest Milestone
                    </span>
                </div>

                <span
                    className="
                        shrink-0
                        rounded-full
                        border
                        border-orange-400/30
                        bg-orange-400/10
                        px-3
                        py-0.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-[var(--future)]
                    "
                >
                    Priority
                </span>
            </div>

            {/* Title */}
            <div>
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--text-main)]">
                    {event.title}
                </h2>

                {event.description && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {event.description}
                    </p>
                )}
            </div>

            {/* Countdown */}
            <div className="flex items-end gap-4">
                {[
                    { value: days, label: "Days" },
                    { value: hours, label: "Hours" },
                    { value: mins, label: "Mins" },
                ].map(({ value, label }, i) => (
                    <div key={label} className="flex items-end gap-4">
                        {i > 0 && (
                            <span className="mb-4 text-xl font-bold text-[var(--border-strong)]">
                                :
                            </span>
                        )}
                        <div>
                            <p className="text-5xl font-extrabold tabular-nums leading-none tracking-tight text-[var(--text-main)]">
                                {value}
                            </p>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                {label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress */}
            <div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-card-high)]">
                    <div
                        className="h-full rounded-full bg-[var(--future)] transition-all duration-700"
                        style={{ width: `${100 - progress}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {Math.round(100 - progress)}% of temporal journey completed
                </p>
            </div>

            {/* Ambient glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-16
                    -right-16
                    h-56
                    w-56
                    rounded-full
                    bg-orange-500/10
                    blur-[70px]
                "
            />
        </article>
    );
}

// ─── Card: Longest Memory ─────────────────────────────────────────────────────

function LongestMemoryCard({
    event,
}: {
    event: ChronicleEvent;
}) {
    const cat = getCategoryInfo(event.category);
    const Icon = cat.icon;
    const daysAgo = formatDaysAgo(event.date);
    const monthYear = formatMemoryDate(event.date);

    return (
        <article
            className="
                glass-card
                memory-glow
                relative
                overflow-hidden
                rounded-2xl
                border-t-2
                border-[var(--memory)]
                p-6
                flex
                flex-col
                gap-5
            "
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[rgba(159,211,199,0.12)]
                        text-[var(--memory)]
                    "
                >
                    <Icon size={20} />
                </div>

                <span className="text-sm font-bold text-[var(--text-main)]">
                    Longest Memory
                </span>
            </div>

            {/* Title */}
            <div>
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[var(--text-main)]">
                    {event.title}
                </h2>

                {event.description && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {event.description}
                    </p>
                )}
            </div>

            {/* Days ago */}
            <div
                className="
                    rounded-xl
                    border
                    border-[var(--border-soft)]
                    bg-[var(--surface-card-high)]
                    px-5
                    py-4
                "
            >
                <p className="text-4xl font-extrabold tabular-nums text-[var(--text-main)]">
                    {daysAgo.toLocaleString()}
                    <span className="ml-2 text-sm font-semibold text-[var(--text-muted)]">
                        Days Ago
                    </span>
                </p>
            </div>

            {/* Verified footer */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--memory)]">
                <CheckCircle2 size={14} />
                <span>Verified Achievement • {monthYear}</span>
            </div>

            {/* Ambient glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-16
                    -right-16
                    h-56
                    w-56
                    rounded-full
                    bg-emerald-500/8
                    blur-[70px]
                "
            />
        </article>
    );
}

// ─── Card: Category Distribution ─────────────────────────────────────────────

function CategoryDistributionCard({
    events,
}: {
    events: ChronicleEvent[];
}) {
    const stats = getCategoryDistribution(events);

    const segments = stats.map((s) => ({
        value: s.percentage,
        color: CATEGORY_COLORS[s.category],
    }));

    return (
        <article
            className="
                glass-card
                rounded-2xl
                p-6
                flex
                flex-col
                gap-6
            "
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--overlay-primary)]
                        text-[var(--primary)]
                    "
                >
                    <BarChart3 size={20} />
                </div>

                <span className="text-sm font-bold text-[var(--text-main)]">
                    Category Distribution
                </span>
            </div>

            {/* Chart + legend */}
            <div className="flex flex-col items-center gap-8 sm:flex-row">
                {/* Donut */}
                <div className="shrink-0">
                    <DonutChart
                        segments={segments}
                        total={events.length}
                        size={150}
                        thickness={24}
                    />
                </div>

                {/* Legend */}
                <div className="flex w-full flex-col gap-3">
                    {stats.map((s) => {
                        const { label } = getCategoryInfo(
                            s.category
                        );
                        const color =
                            CATEGORY_COLORS[s.category];

                        return (
                            <div
                                key={s.category}
                                className="flex items-center gap-3"
                            >
                                <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor:
                                            color,
                                    }}
                                />

                                <span className="flex-1 text-sm font-medium text-[var(--text-soft)]">
                                    {label}
                                </span>

                                <span className="text-sm font-bold text-[var(--text-main)]">
                                    {s.percentage}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </article>
    );
}

// ─── Card: Completion ─────────────────────────────────────────────────────────

function CompletionCard({
    events,
}: {
    events: ChronicleEvent[];
}) {
    const { upcomingCount, completedCount, overallRate } =
        getCompletionStats(events);

    const upcomingPct =
        events.length === 0
            ? 0
            : Math.round((upcomingCount / events.length) * 100);

    const completedPct =
        events.length === 0
            ? 0
            : Math.round(
                  (completedCount / events.length) * 100
              );

    return (
        <article
            className="
                glass-card
                rounded-2xl
                p-6
                flex
                flex-col
                gap-6
            "
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--overlay-primary)]
                        text-[var(--primary)]
                    "
                >
                    <Clock size={20} />
                </div>

                <span className="text-sm font-bold text-[var(--text-main)]">
                    Completion
                </span>
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-4">
                {/* Upcoming */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-[var(--future)]">
                            <span className="inline-block h-2 w-2 rounded-full bg-[var(--future)]" />
                            Upcoming Countdowns
                        </span>
                        <span className="text-[var(--text-main)]">
                            {upcomingCount}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-card-high)]">
                        <div
                            className="h-full rounded-full bg-[var(--future)] transition-all duration-700"
                            style={{ width: `${upcomingPct}%` }}
                        />
                    </div>
                </div>

                {/* Completed */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-[var(--memory)]">
                            <CheckCircle2 size={13} />
                            Completed Memories
                        </span>
                        <span className="text-[var(--text-main)]">
                            {completedCount}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-card-high)]">
                        <div
                            className="h-full rounded-full bg-[var(--memory)] transition-all duration-700"
                            style={{ width: `${completedPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Overall rate */}
            <div
                className="
                    rounded-xl
                    border
                    border-[var(--border-soft)]
                    bg-[var(--surface-card-high)]
                    px-5
                    py-4
                    text-center
                "
            >
                <p className="text-5xl font-extrabold tabular-nums text-[var(--primary)]">
                    {overallRate}%
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Overall Completion Rate
                </p>
            </div>
        </article>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function InsightsEmptyState() {
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
                <BarChart3 size={32} />
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-main)]">
                No data yet
            </h2>

            <p className="mt-3 text-[var(--text-muted)]">
                Add some events and your insights will appear here.
            </p>
        </div>
    );
}

// ─── Main view ────────────────────────────────────────────────────────────────

interface Props {
    events: ChronicleEvent[];
}

export default function StatisticsView({ events }: Props) {
    const now = useNow();

    const soonestMilestone = getSoonestMilestone(events);
    const longestMemory = getLongestMemory(events);

    return (
        <section className="mx-auto max-w-5xl">
            {/* Page header */}
            <header className="mb-10">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
                    Statistics
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)] md:text-5xl">
                    Insights
                </h1>

                <p className="mt-3 text-lg text-[var(--text-muted)]">
                    Refining your perspective on time and achievements.
                </p>
            </header>

            {events.length === 0 ? (
                <InsightsEmptyState />
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Row 1 */}
                    {soonestMilestone ? (
                        <SoonestMilestoneCard
                            event={soonestMilestone}
                            now={now}
                        />
                    ) : (
                        <div
                            className="
                                glass-card
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                rounded-2xl
                                p-6
                                text-center
                                text-[var(--text-muted)]
                            "
                        >
                            <Clock size={28} className="opacity-40" />
                            <p className="text-sm font-medium">
                                No upcoming milestones
                            </p>
                        </div>
                    )}

                    {longestMemory ? (
                        <LongestMemoryCard
                            event={longestMemory}
                        />
                    ) : (
                        <div
                            className="
                                glass-card
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                rounded-2xl
                                p-6
                                text-center
                                text-[var(--text-muted)]
                            "
                        >
                            <CheckCircle2
                                size={28}
                                className="opacity-40"
                            />
                            <p className="text-sm font-medium">
                                No memories recorded yet
                            </p>
                        </div>
                    )}

                    {/* Row 2 */}
                    <CategoryDistributionCard events={events} />
                    <CompletionCard events={events} />
                </div>
            )}
        </section>
    );
}
