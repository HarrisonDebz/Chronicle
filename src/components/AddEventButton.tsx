import { Plus } from "lucide-react";

interface Props {
    onClick: () => void;
}

export default function AddEventButton({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="
        fixed
        bottom-6
        right-6
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-black
        text-white
        shadow-lg
        transition
        hover:scale-105
        active:scale-95
      "
            aria-label="Add new event"
        >
            <Plus size={28} />
        </button>
    );
}