import "./EventLegend.scss";

import { useState } from "react";

export function EventLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`event-legend ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="legend-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="legend-title">
          <i className="fa fa-info-circle"></i>
          Symbolförklaring
        </span>
        <i className={`fa fa-chevron-${isExpanded ? "up" : "down"}`}></i>
      </div>
      {isExpanded && (
        <div className="legend-content">
          <div className="legend-section">
            <h4>Besökstyper</h4>
            <div className="legend-item">
              <div className="legend-example event-sample mandatory">
                <i className="fa fa-hand-holding-medical"></i>
                Besök
              </div>
              <span>Obligatoriskt besök</span>
            </div>
            <div className="legend-item">
              <div className="legend-example event-sample movable">
                <i className="fa fa-clock"></i>
                Besök
              </div>
              <span>Rörligt besök (flexibel tid)</span>
            </div>
            <div className="legend-item">
              <div className="legend-example event-sample priority-high">
                <i className="fa fa-exclamation-triangle"></i>
                Besök
              </div>
              <span>Hög prioritet</span>
            </div>
            <div className="legend-item">
              <div className="legend-example event-sample priority-urgent">
                <i className="fa fa-ambulance"></i>
                Besök
              </div>
              <span>Akut besök</span>
            </div>
          </div>

          <div className="legend-section">
            <h4>Ikoner</h4>
            <div className="legend-item">
              <i className="fa fa-lock" style={{ color: "#dc2626" }}></i>
              <span>Låst besök (pinned)</span>
            </div>
            <div className="legend-item">
              <i className="fa fa-car" style={{ color: "#3b82f6" }}></i>
              <span>Restid (travel time)</span>
            </div>
            <div className="legend-item">
              <i className="fa fa-coffee" style={{ color: "#92400e" }}></i>
              <span>Paus (lunch break)</span>
            </div>
          </div>

          <div className="legend-section">
            <h4>Färgkoder</h4>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#3b82f6" }}
              ></div>
              <span>Standard besök</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span>Tilldelat besök</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#f59e0b" }}
              ></div>
              <span>Pauser & restid</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#dc2626" }}
              ></div>
              <span>Hög prioritet / Akut</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#9ca3af", opacity: 0.5 }}
              ></div>
              <span>Oplanerat besök</span>
            </div>
          </div>

          <div className="legend-section">
            <h4>Transport</h4>
            <div className="legend-item">
              <span style={{ fontSize: "18px" }}>🚗</span>
              <span>Bil</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: "18px" }}>🚴</span>
              <span>Cykel</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: "18px" }}>🚶</span>
              <span>Promenad</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: "18px" }}>🚌</span>
              <span>Kollektivtrafik</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
