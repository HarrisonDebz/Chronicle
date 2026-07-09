import {
    Cake,
    Heart,
    GraduationCap,
    Code2,
    Trophy,
    CalendarDays,
    Target,
    CircleHelp,
} from "lucide-react";

import type { EventCategory } from "../types/Event";


export function getCategoryInfo(
    category: EventCategory
) {

    const categories = {
        birthday: {
            icon: Cake,
            label: "Birthday",
        },

        relationship: {
            icon: Heart,
            label: "Relationship",
        },

        education: {
            icon: GraduationCap,
            label: "Education",
        },

        coding: {
            icon: Code2,
            label: "Coding",
        },

        sports: {
            icon: Trophy,
            label: "Sports",
        },

        holiday: {
            icon: CalendarDays,
            label: "Holiday",
        },

        goal: {
            icon: Target,
            label: "Goal",
        },

        other: {
            icon: CircleHelp,
            label: "Other",
        },
    };


    return categories[category];
}