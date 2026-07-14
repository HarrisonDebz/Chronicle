import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Retrieve persisted theme or check system preferences
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }
        
        // Fallback to dark mode as default, but check prefers-color-scheme light
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        return prefersLight ? "light" : "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("light");
            root.classList.remove("dark");
        } else {
            root.classList.add("dark");
            root.classList.remove("light");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));
    }

    function setTheme(newTheme: Theme) {
        setThemeState(newTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
