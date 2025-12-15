import "./TreeSummaryHeatmap.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useMemo } from "react";

interface TreeSummaryHeatmapProps {
  scheduler?: SchedulerPro;
}

export function TreeSummaryHeatmap({ scheduler }: TreeSummaryHeatmapProps) {
  // Calculate heatmap data grouped by employee/service area
  const heatmapData = useMemo(() => {
    if (
      !scheduler ||
      !scheduler.resourceStore ||
      !scheduler.eventStore ||
      !scheduler.assignmentStore ||
      !scheduler.resourceStore.records ||
      !scheduler.eventStore.records
    ) {
      return null;
    }

    const resources = scheduler.resourceStore.records;
    const events = scheduler.eventStore.records;
    const startDate = scheduler.startDate;
    const endDate = scheduler.endDate;

    // Group events by resource and time slot
    const resourceData = resources.map((resource) => {
      const assignments = scheduler.assignmentStore.query(
        (assignment) => assignment.resourceId === resource.id,
      );

      const resourceEvents = assignments
        .map((assignment) => {
          const event = scheduler.eventStore.getById(assignment.eventId);
          return event;
        })
        .filter((event) => event != null);

      // Calculate visit density per hour
      const hours = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
      );
      const density = new Array(hours).fill(0);

      resourceEvents.forEach((event) => {
        const eventStart = event.startDate.getTime();
        const eventEnd = event.endDate.getTime();
        const slotStart = startDate.getTime();

        for (let i = 0; i < hours; i++) {
          const slotStartTime = slotStart + i * 60 * 60 * 1000;
          const slotEndTime = slotStartTime + 60 * 60 * 1000;

          if (eventStart < slotEndTime && eventEnd > slotStartTime) {
            density[i]++;
          }
        }
      });

      return {
        resourceId: resource.id,
        resourceName: (resource as any).name || `Resource ${resource.id}`,
        density,
        totalVisits: resourceEvents.length,
      };
    });

    return resourceData;
  }, [scheduler]);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="tree-summary-heatmap">
        <div className="heatmap-empty">Ingen data att visa</div>
      </div>
    );
  }

  const maxDensity = Math.max(
    ...heatmapData.map((r) => Math.max(...r.density)),
  );

  const getHeatColor = (value: number, max: number) => {
    if (max === 0) return "#f3f4f6";
    const intensity = value / max;
    if (intensity === 0) return "#f9fafb";
    if (intensity < 0.25) return "#dbeafe"; // Light blue
    if (intensity < 0.5) return "#93c5fd"; // Medium blue
    if (intensity < 0.75) return "#60a5fa"; // Dark blue
    return "#3b82f6"; // Darkest blue
  };

  const hours = heatmapData[0]?.density.length || 0;
  const hourLabels: string[] = [];
  const startDate = scheduler?.startDate;
  if (startDate) {
    for (let i = 0; i < hours; i++) {
      const hour = new Date(
        startDate.getTime() + i * 60 * 60 * 1000,
      ).getHours();
      if (i % 2 === 0) {
        hourLabels.push(`${hour.toString().padStart(2, "0")}:00`);
      } else {
        hourLabels.push("");
      }
    }
  }

  return (
    <div className="tree-summary-heatmap">
      <div className="heatmap-header">
        <h4>Besöksdensitet per Medarbetare</h4>
        <div className="heatmap-legend">
          <span className="legend-label">Låg</span>
          <div className="legend-gradient">
            <div className="legend-color" style={{ background: "#f9fafb" }} />
            <div className="legend-color" style={{ background: "#dbeafe" }} />
            <div className="legend-color" style={{ background: "#93c5fd" }} />
            <div className="legend-color" style={{ background: "#60a5fa" }} />
            <div className="legend-color" style={{ background: "#3b82f6" }} />
          </div>
          <span className="legend-label">Hög</span>
        </div>
      </div>
      <div className="heatmap-content">
        <div className="heatmap-grid">
          <div className="heatmap-row header">
            <div className="heatmap-cell resource-header">Medarbetare</div>
            {hourLabels.map((label, idx) => (
              <div key={idx} className="heatmap-cell time-header">
                {label}
              </div>
            ))}
            <div className="heatmap-cell total-header">Totalt</div>
          </div>
          {heatmapData.map((resource, rowIndex) => (
            <div
              key={resource.resourceId}
              className="heatmap-row"
              data-row-index={rowIndex}
            >
              <div
                className="heatmap-cell resource-name"
                title={`${resource.resourceName} - ${resource.totalVisits} totala besök`}
              >
                <span className="employee-name">{resource.resourceName}</span>
                <span className="employee-visit-count">
                  ({resource.totalVisits})
                </span>
              </div>
              {resource.density.map((value, idx) => (
                <div
                  key={idx}
                  className="heatmap-cell density-cell"
                  style={{
                    backgroundColor: getHeatColor(value, maxDensity),
                    color: value > maxDensity * 0.5 ? "white" : "#374151",
                  }}
                  title={`${value} besök kl ${hourLabels[idx] || idx}:00`}
                >
                  {value > 0 ? value : ""}
                </div>
              ))}
              <div className="heatmap-cell total-cell">
                {resource.totalVisits}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
