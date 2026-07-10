import {
    type ReactNode,
    useState,
} from "react";

import type { AppView } from "../types/Navigation";

import MobileBottomNav from "./MobileBottomNav";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

interface Props {
    children: ReactNode;
    profileName: string;
    activeView: AppView;
    onAddEvent: () => void;
    onOpenProfile: () => void;

    onViewChange: (
        view: AppView
    ) => void;
}

export default function AppShell({
    children,
    profileName,
    activeView,
    onAddEvent,
    onOpenProfile,
    onViewChange,
}: Props) {
    const [
        sidebarCollapsed,
        setSidebarCollapsed,
    ] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text-main)]">
            <Sidebar
                collapsed={sidebarCollapsed}
                profileName={profileName}
                activeView={activeView}
                onToggle={() =>
                    setSidebarCollapsed(
                        (value) => !value
                    )
                }
                onAddEvent={onAddEvent}
                onOpenProfile={onOpenProfile}
                onViewChange={onViewChange}
            />

            <MobileHeader
                onAddEvent={onAddEvent}
                onOpenProfile={onOpenProfile}
            />

            <main
                className={`
          min-h-screen
          pb-28
          pt-24
          transition-all
          duration-300
          md:pb-12
          md:pt-12
          ${sidebarCollapsed
                        ? "md:ml-20"
                        : "md:ml-64"
                    }
        `}
            >
                <div className="mx-auto max-w-7xl px-4 md:px-10 xl:px-16">
                    {children}
                </div>
            </main>

            <MobileBottomNav
                activeView={activeView}
                onViewChange={onViewChange}
            />
        </div>
    );
}