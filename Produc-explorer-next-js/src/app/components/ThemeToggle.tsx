"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      title="Toggle Theme"
    >
      {theme === "dark" ? (
        <LightModeIcon className="text-yellow-400" />
      ) : (
        <DarkModeIcon className="text-gray-600" />
      )}
    </button>
  );
}
