import { useEffect, useRef } from "react";
import { fetchTournaments } from "../services/sheetsApi";

export function useMatchPolling() {
    const knownMatchIds = useRef(new Set());
    const isFirstLoad = useRef(true);

    useEffect(() => {
        async function checkMatches() {
            try {
                const matches = await fetchTournaments();

                // On first load, just save the IDs
                if (isFirstLoad.current) {
                    matches.forEach(m => knownMatchIds.current.add(String(m.id)));
                    isFirstLoad.current = false;
                    return;
                }

                // Check for new matches
                const newMatches = matches.filter(m => !knownMatchIds.current.has(String(m.id)));

                if (newMatches.length > 0) {
                    // Add new IDs to known set
                    newMatches.forEach(m => knownMatchIds.current.add(String(m.id)));

                    // Notify user
                    const title = "New Tournament Added! 🔥";
                    const body = `Check out: ${newMatches[0].title} (${newMatches[0].mode})`;

                    if (Notification.permission === "granted") {
                        new Notification(title, { body, icon: "/vite.svg" });
                    } else {
                        alert(`${title}\n${body}`);
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }

        // Initial check
        checkMatches();

        // Poll every 60 seconds
        const interval = setInterval(checkMatches, 60000);

        return () => clearInterval(interval);
    }, []);
}
