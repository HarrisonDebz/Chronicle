import type { ChronicleEvent } from "../types/Event";

export const demoEvents: ChronicleEvent[] = [
    {
        id: "1",
        title: "Graduation",
        description: "Finish university journey",
        type: "countdown",
        date: "2027-07-12",
        category: "education",
        recurring: false,
        createdAt: new Date().toISOString(),
    },

    {
        id: "2",
        title: "Started Programming",
        description: "First coding journey",
        type: "countup",
        date: "2021-05-01",
        category: "coding",
        recurring: false,
        createdAt: new Date().toISOString(),
    },

    {
        id: "3",
        title: "World Cup 2026",
        description: "Football's biggest stage",
        type: "countdown",
        date: "2026-06-11",
        category: "sports",
        recurring: false,
        createdAt: new Date().toISOString(),
    },
];