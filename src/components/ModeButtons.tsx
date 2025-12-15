import "./ModeButtons.scss";

import React from "react";

export type AppMode = "timeline" | "map" | "comparison" | "analysis" | "charts";

interface ModeButtonsProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeButtons({ activeMode, onModeChange }: ModeButtonsProps) {
  const modes: Array<{
    id: AppMode;
    icon: string;
    label: string;
    description: string;
  }> = [
    {
      id: "timeline",
      icon: "📅",
      label: "Schema",
      description: "Tidslinje med medarbetare och besök",
    },
    {
      id: "map",
      icon: "🗺️",
      label: "Karta",
      description: "Geografisk vy med rutter",
    },
    {
      id: "comparison",
      icon: "🔀",
      label: "Jämför",
      description: "Jämför Original vs Optimerad",
    },
    {
      id: "analysis",
      icon: "📊",
      label: "Analys",
      description: "Kapacitet och efterfrågan",
    },
    {
      id: "charts",
      icon: "📈",
      label: "Diagram",
      description: "Skapa anpassade diagram",
    },
  ];

  return (
    <div className="mode-buttons">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`mode-button ${activeMode === mode.id ? "active" : ""}`}
          onClick={() => onModeChange(mode.id)}
          title={mode.description}
        >
          <span className="icon">{mode.icon}</span>
          <span className="label">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
