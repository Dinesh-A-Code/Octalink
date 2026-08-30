"use client";

import { useRef } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);

  const handle = () => {
    const r = ref.current?.getBoundingClientRect();
    toggleTheme(
      r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined,
    );
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="group relative grid h-10 w-10 place-items-center rounded-sharp border border-line text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-500 ease-out-expo group-hover:rotate-45"
      >
        <circle
          cx="8"
          cy="8"
          r="3.4"
          stroke="currentColor"
          strokeWidth="1.2"
          fill={theme === "dark" ? "none" : "currentColor"}
        />
        {theme === "light" ? (
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <path d="M8 .8v1.9M8 13.3v1.9M15.2 8h-1.9M2.7 8H.8M13.1 13.1l-1.4-1.4M4.3 4.3 2.9 2.9M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4" />
          </g>
        ) : (
          <path
            d="M11.4 9.6A4.2 4.2 0 0 1 6.4 4.6a4.4 4.4 0 1 0 5 5Z"
            fill="currentColor"
          />
        )}
      </svg>
    </button>
  );
}
