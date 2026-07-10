import {
    useEffect,
    useState,
} from "react";

export function useNow(
    refreshInterval = 60_000
) {
    const [now, setNow] = useState(
        () => new Date()
    );

    useEffect(() => {
        const intervalId =
            window.setInterval(() => {
                setNow(new Date());
            }, refreshInterval);

        return () => {
            window.clearInterval(
                intervalId
            );
        };
    }, [refreshInterval]);

    return now;
}