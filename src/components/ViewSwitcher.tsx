import "./ViewSwitcher.scss";

import React from "react";

export type ViewMode = "timeline" | "map";

interface ViewSwitcherProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="view-switcher">
      <button
        className={activeView === "timeline" ? "active" : ""}
        onClick={() => onViewChange("timeline")}
        title="Tidslinje-vy med medarbetare och besök"
      >
        <span className="icon">📅</span>
        <span className="text">Schema</span>
      </button>
      <button
        className={activeView === "map" ? "active" : ""}
        onClick={() => onViewChange("map")}
        title="Kartvy med rutter och resor"
      >
        <span className="icon">🗺️</span>
        <span className="text">Karta</span>
      </button>
    </div>
  );
}
