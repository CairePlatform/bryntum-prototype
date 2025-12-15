import "./ScheduleStatus.scss";

export type ScheduleStatusType =
  | "empty"
  | "unplanned"
  | "baseline"
  | "revision";

export interface ScheduleStatusProps {
  status: ScheduleStatusType;
  revisionNumber?: number;
  baselineSource?: "slinga" | "carefox" | "manual";
}

export function ScheduleStatus({
  status,
  revisionNumber,
  baselineSource,
}: ScheduleStatusProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case "empty":
        return {
          icon: "📭",
          label: "Ingen data",
          description: "Import behövs",
          color: "#9ca3af",
        };
      case "unplanned":
        return {
          icon: "📋",
          label: "Oplanerad",
          description: "Alla besök otilldelade",
          color: "#f59e0b",
        };
      case "baseline": {
        const sourceText =
          baselineSource === "slinga"
            ? "Slinga-mall"
            : baselineSource === "carefox"
              ? "Carefox"
              : "Manuell";
        return {
          icon: "📊",
          label: `Baseline (${sourceText})`,
          description: "Importerad extern plan",
          color: "#3b82f6",
        };
      }
      case "revision":
        return {
          icon: "✏️",
          label: `Revision ${revisionNumber || 1}`,
          description: "Manuellt redigerad eller AI-optimerad",
          color: "#8b5cf6",
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="schedule-status">
      <div className="status-indicator" style={{ borderColor: display.color }}>
        <span className="status-icon">{display.icon}</span>
        <div className="status-text">
          <div className="status-label" style={{ color: display.color }}>
            {display.label}
          </div>
          <div className="status-description">{display.description}</div>
        </div>
      </div>
      <div className="status-flow">
        <div
          className={`flow-step ${status === "empty" ? "active" : "completed"}`}
        >
          <span className="step-number">1</span>
          <span className="step-label">Import</span>
        </div>
        <div className="flow-arrow">→</div>
        <div
          className={`flow-step ${status === "baseline" ? "active" : status === "revision" ? "completed" : ""}`}
        >
          <span className="step-number">2</span>
          <span className="step-label">Baseline</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className={`flow-step ${status === "revision" ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Revideringar</span>
        </div>
      </div>
    </div>
  );
}
