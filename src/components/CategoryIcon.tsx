import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";
import { getCategoryInfo } from "../utils/categories";
import type { EventCategory } from "../types/Event";

// Local cache for fetched SVGs to avoid multiple requests
const svgCache: Record<string, string> = (() => {
    try {
        const stored = localStorage.getItem("chronicle_custom_icons");
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
})();

const pendingRequests: Record<string, Promise<string>> = {};

async function fetchIconSvg(query: string): Promise<string> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return "";
    if (svgCache[cleanQuery]) return svgCache[cleanQuery];

    if (cleanQuery in pendingRequests) {
        return pendingRequests[cleanQuery];
    }

    const promise = (async () => {
        try {
            // Step 1: Search for a matching lucide icon
            const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(cleanQuery)}&prefixes=lucide&limit=1`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();

            let iconName = "";
            if (searchData.icons && searchData.icons.length > 0) {
                iconName = searchData.icons[0]; // e.g. "lucide:chef-hat"
            } else {
                // Try a general search if no lucide icon matches
                const generalSearchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(cleanQuery)}&limit=1`;
                const generalRes = await fetch(generalSearchUrl);
                const generalData = await generalRes.json();
                if (generalData.icons && generalData.icons.length > 0) {
                    iconName = generalData.icons[0];
                }
            }

            if (!iconName) {
                throw new Error("No icon found");
            }

            // Step 2: Fetch the SVG content for the matched icon
            const [prefix, name] = iconName.split(":");
            const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg`;
            
            // Iconify SVG endpoint: if fetched directly as text, it returns raw SVG.
            const rawSvgRes = await fetch(svgUrl);
            const rawSvg = await rawSvgRes.text();
            
            if (rawSvg && rawSvg.startsWith("<svg")) {
                // Add fill="none" and stroke="currentColor" properties if they are missing or if we want to inherit styling
                const processedSvg = rawSvg
                    .replace(/width="[^"]*"/, 'width="100%"')
                    .replace(/height="[^"]*"/, 'height="100%"');
                
                svgCache[cleanQuery] = processedSvg;
                try {
                    localStorage.setItem("chronicle_custom_icons", JSON.stringify(svgCache));
                } catch (e) {
                    console.error("LocalStorage write failed", e);
                }
                return processedSvg;
            }
            throw new Error("Invalid SVG content");
        } catch (error) {
            console.warn(`Failed to fetch icon for: ${query}`, error);
            return "";
        }
    })();

    pendingRequests[cleanQuery] = promise;
    return promise;
}

interface CategoryIconProps {
    category: EventCategory;
    customCategory?: string;
    size?: number;
    className?: string;
}

export default function CategoryIcon({
    category,
    customCategory,
    size = 20,
    className = "",
}: CategoryIconProps) {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // If it's a standard category, render the local Lucide component
    const isStandard = category !== "other";
    const info = getCategoryInfo(category);
    const StandardIcon = info?.icon || CircleHelp;

    useEffect(() => {
        if (isStandard || !customCategory) {
            if (svgContent !== null) {
                Promise.resolve().then(() => setSvgContent(null));
            }
            return;
        }

        const cacheKey = customCategory.trim().toLowerCase();
        if (svgCache[cacheKey]) {
            if (svgContent !== svgCache[cacheKey]) {
                Promise.resolve().then(() => setSvgContent(svgCache[cacheKey]));
            }
            return;
        }

        Promise.resolve().then(() => setLoading(true));
        fetchIconSvg(customCategory).then((svg) => {
            setSvgContent(svg || null);
            setLoading(false);
        });
    }, [category, customCategory, isStandard, svgContent]);

    if (isStandard) {
        return <StandardIcon size={size} className={className} />;
    }

    if (svgContent) {
        return (
            <span
                className={`inline-block ${className}`}
                style={{
                    width: size,
                    height: size,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        );
    }

    // Fallback icon during loading or failure
    return (
        <StandardIcon
            size={size}
            className={`${className} ${loading ? "animate-pulse opacity-60" : ""}`}
        />
    );
}
