import type { ChronicleEvent } from "../types/Event";
import {
    getDaysRemaining,
    getElapsedTime,
} from "../utils/date";


interface Props {
    event: ChronicleEvent;
}


export default function EventCard({ event }: Props) {

    const time =
        event.type === "countdown"
            ? `${getDaysRemaining(event.date)} days left`
            : getElapsedTime(event.date);


    return (
        <div className="rounded-xl border p-5 shadow-sm">

            <h2 className="text-xl font-semibold">
                {event.title}
            </h2>

            <p className="text-gray-500">
                {event.category}
            </p>

            <p className="mt-4 text-2xl font-bold">
                {time}
            </p>

        </div>
    );
}