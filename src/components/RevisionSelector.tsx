import "./RevisionSelector.scss";

import { useState } from "react";

export interface Revision {
  id: string;
  number: number;
  type: "baseline" | "manual_edit" | "ai_optimized";
  source?: "carefox" | "slinga" | "manual";
  createdBy?: string;
  createdAt: string;
  description?: string;
}

export interface RevisionSelectorProps {
  currentRevision: Revision;
  revisions: Revision[];
  onRevisionChange: (revisionId: string) => void;
  onSave: () => void;
  onOptimize: () => void;
  onCompare: () => void;
  hasUnsavedChanges?: boolean;
  isOptimizing?: boolean;
  optimizationProgress?: number;
}

export function RevisionSelector({
  currentRevision,
  revisions,
  onRevisionChange,
  onSave,
  onOptimize,
  onCompare,
  hasUnsavedChanges = false,
  isOptimizing = false,
  optimizationProgress = 0,
}: RevisionSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getRevisionLabel = (revision: Revision) => {
    const typeLabels = {
      baseline:
        revision.source === "carefox"
          ? "Baseline (Carefox)"
          : revision.source === "slinga"
            ? "Baseline (Slinga)"
            : "Baseline (Manuell)",
      manual_edit: revision.createdBy
        ? `Manuellt (${revision.createdBy})`
        : "Manuellt redigerad",
      ai_optimized: "AI-optimerad",
    };
    return `Rev ${revision.number} - ${typeLabels[revision.type]}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="revision-selector-container">
      {isOptimizing ? (
        <div className="optimization-progress">
          <div className="progress-header">
            <span className="progress-icon">⏳</span>
            <span className="progress-text">
              Optimerar Revision {currentRevision.number + 1}...
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${optimizationProgress}%` }}
            ></div>
          </div>
          <div className="progress-info">
            {optimizationProgress}% (
            {Math.ceil((100 - optimizationProgress) / 10)} min kvar)
          </div>
        </div>
      ) : (
        <>
          <div className="revision-dropdown">
            <label className="revision-label">Revision:</label>
            <div
              className="dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="current-revision">
                {getRevisionLabel(currentRevision)}
                {hasUnsavedChanges && (
                  <span className="unsaved-indicator">• Osparad</span>
                )}
              </span>
              <i
                className={`fa fa-chevron-${isDropdownOpen ? "up" : "down"}`}
              ></i>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className={`dropdown-item ${rev.id === currentRevision.id ? "active" : ""}`}
                    onClick={() => {
                      onRevisionChange(rev.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="revision-name">
                      {getRevisionLabel(rev)}
                    </span>
                    <span className="revision-time">
                      {formatTime(rev.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button
              className="btn-save"
              onClick={onSave}
              disabled={!hasUnsavedChanges}
              title={
                hasUnsavedChanges
                  ? "Spara ändringar som ny revision"
                  : "Inga ändringar att spara"
              }
            >
              <i className="fa fa-save"></i>
              Spara
            </button>
            <button
              className="btn-optimize"
              onClick={onOptimize}
              title="Optimera med Timefold AI"
            >
              <i className="fa fa-magic"></i>
              Optimera
            </button>
            <button
              className="btn-compare"
              onClick={onCompare}
              disabled={revisions.length < 2}
              title="Jämför revisioner"
            >
              <i className="fa fa-exchange-alt"></i>
              Jämför ({revisions.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
