import {
    type ReactNode,
    useState,
} from "react";

import MobileBottomNav from "./MobileBottomNav";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

interface Props {
    children: ReactNode;
    profileName: string;
    onAddEvent: () => void;
    onOpenProfile: () => void;
}

export default function AppShell({
    children,
    profileName,
    onAddEvent,
    onOpenProfile,
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
                onToggle={() =>
                    setSidebarCollapsed(
                        (value) => !value
                    )
                }
                onAddEvent={onAddEvent}
                onOpenProfile={onOpenProfile}
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
                <div className="mx-auto max-w-7xl px-4 md:px-16">
                    {children}
                </div>
            </main>

            <MobileBottomNav />
        </div>
    );
}