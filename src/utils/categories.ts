import type React from "react";
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

/** Colour associated with each category (shared by Statistics and Categories views). */
export const CATEGORY_COLORS: Record<EventCategory, string> = {
    birthday: "#c0c1ff",
    relationship: "#ff9f68",
    education: "#9fd3c7",
    coding: "#7dd3fc",
    sports: "#fde68a",
    holiday: "#f9a8d4",
    goal: "#a5b4fc",
    other: "#94a3b8",
};

/** Category metadata: icon component + human-readable label. */
const CATEGORY_INFO: Record<
    EventCategory,
    { icon: React.FC<{ size?: number; className?: string }>; label: string }
> = {
    birthday: { icon: Cake, label: "Birthday" },
    relationship: { icon: Heart, label: "Relationship" },
    education: { icon: GraduationCap, label: "Education" },
    coding: { icon: Code2, label: "Coding" },
    sports: { icon: Trophy, label: "Sports" },
    holiday: { icon: CalendarDays, label: "Holiday" },
    goal: { icon: Target, label: "Goal" },
    other: { icon: CircleHelp, label: "Other" },
};

export function getCategoryInfo(category: EventCategory) {
    return CATEGORY_INFO[category];
}