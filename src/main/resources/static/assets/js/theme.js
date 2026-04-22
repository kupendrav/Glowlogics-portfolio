(() => {
    const STORAGE_KEYS = {
        theme: "portfolio_theme",
        accent: "portfolio_accent",
        accentRgb: "portfolio_accent_rgb"
    };

    const THEME_ICONS = {
        light: `
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="4.3"></circle>
                <path d="M12 2v2.4M12 19.6V22M4.93 4.93l1.7 1.7M17.37 17.37l1.7 1.7M2 12h2.4M19.6 12H22M4.93 19.07l1.7-1.7M17.37 6.63l1.7-1.7"></path>
            </svg>
        `,
        dark: `
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a7.1 7.1 0 0 0 10.2 10.2z"></path>
            </svg>
        `
    };

    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;
        const toggle = document.getElementById("theme-toggle");
        if (toggle) {
            toggle.innerHTML = theme === "dark" ? THEME_ICONS.dark : THEME_ICONS.light;
            toggle.setAttribute(
                "aria-label",
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    };

    const applyAccent = (accent, rgb) => {
        if (!accent || !rgb) {
            return;
        }
        document.documentElement.style.setProperty("--accent", accent);
        document.documentElement.style.setProperty("--accent-rgb", rgb);
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "light";
        const savedAccent = localStorage.getItem(STORAGE_KEYS.accent);
        const savedAccentRgb = localStorage.getItem(STORAGE_KEYS.accentRgb);

        applyTheme(savedTheme);
        applyAccent(savedAccent, savedAccentRgb);

        const toggle = document.getElementById("theme-toggle");
        if (toggle) {
            toggle.addEventListener("click", () => {
                const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
                applyTheme(nextTheme);
                localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
            });
        }

        document.querySelectorAll(".swatch").forEach((button) => {
            button.addEventListener("click", () => {
                const accent = button.dataset.accent;
                const rgb = button.dataset.rgb;
                applyAccent(accent, rgb);
                localStorage.setItem(STORAGE_KEYS.accent, accent);
                localStorage.setItem(STORAGE_KEYS.accentRgb, rgb);
            });
        });
    };

    window.ThemeManager = {
        initTheme
    };
})();
