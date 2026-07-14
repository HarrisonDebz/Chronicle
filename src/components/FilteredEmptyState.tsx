import {
    RotateCcw,
    SearchX,
} from "lucide-react";

interface Props {
    onClear: () => void;
}

export default function FilteredEmptyState({
    onClear,
}: Props) {
    return (
        <section
            className="
        glass-card
        rounded-2xl
        border
        border-[var(--border-soft)]
        p-8
        text-center
        md:p-12
      "
        >
            <div
                className="
          mx-auto
          mb-5
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-[var(--overlay-primary)]
          text-[var(--primary)]
        "
            >
                <SearchX size={28} />
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-main)]">
                No matching events
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                Nothing in your Chronicle matches
                the current search and filter
                combination.
            </p>

            <button
                type="button"
                onClick={onClear}
                className="
          mt-6
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[var(--primary-strong)]
          px-5
          py-3
          font-bold
          text-white
          transition
          hover:brightness-110
          active:scale-95
        "
            >
                <RotateCcw size={17} />
                Clear filters
            </button>
        </section>
    );
}