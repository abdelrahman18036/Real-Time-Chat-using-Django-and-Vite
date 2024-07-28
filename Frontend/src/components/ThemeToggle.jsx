// ThemeToggle.jsx
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="p-2 rounded bg-purple text-light">
            Toggle Theme to {theme === "dark" ? "Light" : "Dark"}
        </button>
    );
};

export default ThemeToggle;
