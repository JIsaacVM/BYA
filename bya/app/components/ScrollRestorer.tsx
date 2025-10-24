"use client";

import { useEffect } from "react";

export default function ScrollRestorer() {
    useEffect(() => {
        try {
            const key = `scroll-pos:${location.pathname}`;
            const saved = sessionStorage.getItem(key);
            if (saved) {
                const y = parseFloat(saved);
                if (!Number.isNaN(y)) {
                    requestAnimationFrame(() => window.scrollTo({ top: y }));
                }
            }
        } catch {
            // sessionStorage not available
        }

        const savePosition = () => {
            try {
                const key = `scroll-pos:${location.pathname}`;
                sessionStorage.setItem(key, String(window.scrollY));
            } catch {
                // noop
            }
        };

        const onVisibility = () => {
            if (document.visibilityState === "hidden") savePosition();
        };

        window.addEventListener("beforeunload", savePosition);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            window.removeEventListener("beforeunload", savePosition);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return null;
}
