import EventCard from "./EventCard";
import type { ChronicleEvent } from "../types/Event";


interface Props {
  title: string;
  events: ChronicleEvent[];
  onDeleteRequest: (event: ChronicleEvent) => void;
}


export default function EventSection({
  title,
  events,
  onDeleteRequest,
}: Props) {

  if (events.length === 0) return null;


  return (
    <section className="mb-10">

      <h2 className="text-2xl font-bold mb-5">
        {title}
      </h2>


      <div className="grid gap-5 md:grid-cols-2">

        {
          events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDeleteRequest={onDeleteRequest}
            />
          ))
        }

      </div>

    </section>
  );
}