import { Plus } from "lucide-react";

interface Props {
    onClick: () => void;
}

export default function AddEventButton({
    onClick,
}: Props) {
    return (
        <button
            onClick={onClick}
            className="
        fixed
        bottom-24
        right-6
        z-40
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        bg-[var(--future)]
        text-white
        shadow-[0_0_28px_rgba(249,115,22,0.45)]
        transition
        hover:scale-105
        active:scale-95
        md:bottom-20
        md:right-20
      "
            aria-label="Add new event"
        >
            <Plus size={28} />
        </button>
    );
}