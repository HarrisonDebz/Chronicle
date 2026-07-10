import {
    RotateCcw,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import type {
    EventCategoryFilter,
    EventDateFilter,
    EventFilterState,
    EventViewFilter,
} from "../types/Filters";

interface Props {
    filters: EventFilterState;
    resultCount: number;

    onChange: (
        filters: EventFilterState
    ) => void;

    onClear: () => void;
}

const categories: {
    label: string;
    value: EventCategoryFilter;
}[] = [
        {
            label: "All categories",
            value: "all",
        },
        {
            label: "Birthday",
            value: "birthday",
        },
        {
            label: "Relationship",
            value: "relationship",
        },
        {
            label: "Education",
            value: "education",
        },
        {
            label: "Coding",
            value: "coding",
        },
        {
            label: "Sports",
            value: "sports",
        },
        {
            label: "Holiday",
            value: "holiday",
        },
        {
            label: "Goal",
            value: "goal",
        },
        {
            label: "Other",
            value: "other",
        },
    ];

const selectClass = `
  w-full
  rounded-xl
  border
  border-[var(--border-soft)]
  bg-[var(--surface-low)]
  px-4
  py-3
  text-sm
  font-semibold
  text-[var(--text-main)]
  outline-none
  transition
  focus:border-[var(--primary)]
  focus:ring-2
  focus:ring-[rgba(192,193,255,0.18)]
`;

export default function EventFilterBar({
    filters,
    resultCount,
    onChange,
    onClear,
}: Props) {
    const hasActiveFilters =
        Boolean(filters.query.trim()) ||
        filters.view !== "all" ||
        filters.category !== "all" ||
        filters.dateRange !== "anytime";

    function updateFilter<
        Key extends keyof EventFilterState,
    >(
        key: Key,
        value: EventFilterState[Key]
    ) {
        onChange({
            ...filters,
            [key]: value,
        });
    }

    return (
        <section
            className="
        glass-card
        mb-8
        rounded-2xl
        p-4
        md:p-5
      "
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal
                        size={19}
                        className="text-[var(--primary)]"
                    />

                    <h2 className="font-bold text-[var(--text-main)]">
                        Find events
                    </h2>
                </div>

                <span
                    className="
            rounded-full
            border
            border-[var(--border-soft)]
            bg-[var(--surface-low)]
            px-3
            py-1
            text-xs
            font-bold
            text-[var(--text-muted)]
          "
                >
                    {resultCount}{" "}
                    {resultCount === 1
                        ? "result"
                        : "results"}
                </span>
            </div>

            <div
                className="
          grid
          grid-cols-1
          gap-3
          md:grid-cols-2
          xl:grid-cols-[minmax(240px,1.8fr)_1fr_1fr_1fr_auto]
        "
            >
                <div className="relative">
                    <Search
                        size={18}
                        className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[var(--text-muted)]
            "
                    />

                    <input
                        type="search"
                        value={filters.query}
                        onChange={(event) =>
                            updateFilter(
                                "query",
                                event.target.value
                            )
                        }
                        placeholder="Search your chronicle..."
                        className="
              w-full
              rounded-xl
              border
              border-[var(--border-soft)]
              bg-[var(--surface-low)]
              py-3
              pl-11
              pr-4
              text-sm
              text-[var(--text-main)]
              outline-none
              transition
              placeholder:text-[var(--text-muted)]
              focus:border-[var(--primary)]
              focus:ring-2
              focus:ring-[rgba(192,193,255,0.18)]
            "
                    />
                </div>

                <select
                    value={filters.view}
                    onChange={(event) =>
                        updateFilter(
                            "view",
                            event.target
                                .value as EventViewFilter
                        )
                    }
                    className={selectClass}
                    aria-label="Filter by event type"
                >
                    <option value="all">
                        All events
                    </option>

                    <option value="upcoming">
                        Upcoming
                    </option>

                    <option value="memories">
                        Memories
                    </option>
                </select>

                <select
                    value={filters.category}
                    onChange={(event) =>
                        updateFilter(
                            "category",
                            event.target
                                .value as EventCategoryFilter
                        )
                    }
                    className={selectClass}
                    aria-label="Filter by category"
                >
                    {categories.map((category) => (
                        <option
                            key={category.value}
                            value={category.value}
                        >
                            {category.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.dateRange}
                    onChange={(event) =>
                        updateFilter(
                            "dateRange",
                            event.target
                                .value as EventDateFilter
                        )
                    }
                    className={selectClass}
                    aria-label="Filter by date"
                >
                    <option value="anytime">
                        Any time
                    </option>

                    <option value="week">
                        This week
                    </option>

                    <option value="month">
                        This month
                    </option>

                    <option value="year">
                        This year
                    </option>
                </select>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasActiveFilters}
                    className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[var(--border-soft)]
            px-4
            py-3
            text-sm
            font-semibold
            text-[var(--text-muted)]
            transition
            hover:border-[var(--primary)]
            hover:bg-[var(--surface-card-high)]
            hover:text-[var(--primary)]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
                >
                    <RotateCcw size={17} />
                    Clear
                </button>
            </div>
        </section>
    );
}