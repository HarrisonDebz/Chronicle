import EventCard from "../components/EventCard";
import { demoEvents } from "../data/demoEvents";


export default function Home() {

    return (
        <main className="min-h-screen p-8">

            <h1 className="text-4xl font-bold mb-8">
                Chronicle
            </h1>


            <div className="grid gap-5 md:grid-cols-2">

                {
                    demoEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                        />
                    ))
                }

            </div>

        </main>
    );
}