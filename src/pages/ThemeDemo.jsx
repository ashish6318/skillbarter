import React from "react";
import ThemeToggle from "../components/Common/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const ThemeDemo = () => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Theme Toggle Demo
          </h1>
          <p
            className="text-lg mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Current theme:{" "}
            <span
              className="font-bold"
              style={{ color: "var(--accent-primary)" }}
            >
              {theme} mode
            </span>
          </p>
          <ThemeToggle className="mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sample Card */}
          <div
            className="p-6 rounded-xl border transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Sample Card
            </h3>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              This is a sample card that adapts to the current theme. Notice how
              all colors change smoothly.
            </p>
            <button
              className="px-4 py-2 rounded-lg transition-all duration-200 font-medium"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "white",
              }}
            >
              Sample Button
            </button>
          </div>

          {/* Color Palette Preview */}
          <div
            className="p-6 rounded-xl border transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Color Palette
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                ></div>
                <span style={{ color: "var(--text-secondary)" }}>
                  Primary Background
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                ></div>
                <span style={{ color: "var(--text-secondary)" }}>
                  Secondary Background
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                ></div>
                <span style={{ color: "var(--text-secondary)" }}>
                  Accent Color
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-8 p-4 rounded-lg border text-center"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <p style={{ color: "var(--text-muted)" }}>
            🎨 The theme toggle is now restored and working! Toggle the theme
            using the button in the navbar or above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
