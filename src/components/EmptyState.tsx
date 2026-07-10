import {
    CalendarPlus,
    Clock3,
    Sparkles,
} from "lucide-react";

export default function EmptyState() {
    return (
        <section
            className="
        glass-card
        relative
        overflow-hidden
        rounded-2xl
        border-t-2
        border-[var(--future)]
        p-8
        text-center
        future-glow
      "
        >
            <div
                className="
          mx-auto
          mb-6
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-orange-400/10
          text-[var(--future)]
        "
            >
                <CalendarPlus size={34} />
            </div>

            <p
                className="
          mb-2
          text-sm
          font-bold
          uppercase
          tracking-[0.24em]
          text-[var(--future)]
        "
            >
                Empty Chronicle
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
                No events yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-[var(--text-muted)]">
                Create your first countdown or memory. Upcoming events will live in
                Coming Up, while completed countdowns and count-up events become
                Memories.
            </p>

            <div
                className="
          mx-auto
          mt-8
          grid
          max-w-2xl
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
            >
                <div
                    className="
            rounded-2xl
            border
            border-orange-300/20
            bg-[var(--surface-low)]
            p-5
            text-left
          "
                >
                    <div className="mb-3 flex items-center gap-3 text-[var(--future)]">
                        <Clock3 size={20} />

                        <h3 className="font-bold">
                            Countdown
                        </h3>
                    </div>

                    <p className="text-sm text-[var(--text-muted)]">
                        Track future events like exams, releases, birthdays, and deadlines.
                    </p>
                </div>

                <div
                    className="
            rounded-2xl
            border
            border-emerald-300/20
            bg-[var(--surface-low)]
            p-5
            text-left
          "
                >
                    <div className="mb-3 flex items-center gap-3 text-[var(--memory)]">
                        <Sparkles size={20} />

                        <h3 className="font-bold">
                            Memory
                        </h3>
                    </div>

                    <p className="text-sm text-[var(--text-muted)]">
                        Count up from milestones like your first commit, anniversary, or
                        started-coding date.
                    </p>
                </div>
            </div>

            <div
                className="
          absolute
          -bottom-24
          -right-24
          h-72
          w-72
          rounded-full
          bg-orange-500/10
          blur-[90px]
        "
            />
        </section>
    );
}