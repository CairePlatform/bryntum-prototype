import "./EmbeddedChart.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useMemo } from "react";

interface EmbeddedChartProps {
  scheduler?: SchedulerPro;
  type?: "capacity" | "demand" | "utilization";
}

export function EmbeddedChart({
  scheduler,
  type = "capacity",
}: EmbeddedChartProps) {
  // Calculate chart data from scheduler
  const chartData = useMemo(() => {
    if (
      !scheduler ||
      !scheduler.resourceStore ||
      !scheduler.eventStore ||
      !scheduler.resourceStore.records ||
      !scheduler.eventStore.records
    ) {
      return null;
    }

    const resources = scheduler.resourceStore.records;
    const events = scheduler.eventStore.records;
    const timeSlots: Array<{
      time: string;
      capacity: number;
      demand: number;
      utilization: number;
    }> = [];

    // Group by hour
    const startDate = scheduler.startDate;
    const endDate = scheduler.endDate;
    const hours = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
    );

    for (let i = 0; i < hours; i++) {
      const slotStart = new Date(startDate.getTime() + i * 60 * 60 * 1000);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

      // Calculate capacity (available employees)
      const availableResources = resources.filter((resource) => {
        const calendar = resource.calendar;
        return calendar?.isWorkingTime(slotStart, slotEnd);
      }).length;

      // Calculate demand (events in this time slot)
      const eventsInSlot = events.filter((event) => {
        try {
          return (
            event.startDate < slotEnd &&
            event.endDate > slotStart &&
            (event.assignments?.length > 0 || event.resources?.length > 0)
          );
        } catch {
          return false;
        }
      }).length;

      // For utilization, use actual assigned events, not just events in slot
      const assignedEventsInSlot = events.filter((event) => {
        try {
          return (
            event.startDate < slotEnd &&
            event.endDate > slotStart &&
            event.assignments?.length > 0
          );
        } catch {
          return false;
        }
      }).length;

      const utilization =
        availableResources > 0
          ? Math.round((assignedEventsInSlot / availableResources) * 100)
          : 0;

      timeSlots.push({
        time: slotStart.toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        capacity: availableResources,
        demand: eventsInSlot,
        utilization,
      });
    }

    return timeSlots;
  }, [scheduler]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="embedded-chart">
        <div className="chart-empty">Ingen data att visa</div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.capacity, d.demand)),
  );

  // Calculate Y-axis scale values (0 to max, displayed top to bottom)
  const yAxisSteps = 5;
  const yAxisValues: number[] = [];
  for (let i = yAxisSteps; i >= 0; i--) {
    yAxisValues.push(Math.round((maxValue / yAxisSteps) * i));
  }

  return (
    <div className="embedded-chart">
      <div className="chart-header">
        <h4>
          {type === "capacity"
            ? "Kapacitet"
            : type === "demand"
              ? "Efterfrågan"
              : "Utnyttjande"}
        </h4>
      </div>
      <div className="chart-content">
        <div className="chart-y-axis">
          {yAxisValues.map((value, idx) => (
            <div key={idx} className="y-axis-label">
              {value}
            </div>
          ))}
        </div>
        <div className="chart-bars">
          {chartData.map((slot, index) => (
            <div key={index} className="chart-bar-container">
              <div className="chart-bar-wrapper">
                {type === "capacity" && (
                  <div
                    className="chart-bar capacity"
                    style={{
                      height: `${(slot.capacity / maxValue) * 100}%`,
                    }}
                    title={`${slot.capacity} tillgängliga`}
                  />
                )}
                {type === "demand" && (
                  <div
                    className="chart-bar demand"
                    style={{
                      height: `${(slot.demand / maxValue) * 100}%`,
                    }}
                    title={`${slot.demand} besök`}
                  />
                )}
                {type === "utilization" && (
                  <div
                    className="chart-bar utilization"
                    style={{
                      height: `${Math.min(slot.utilization, 100)}%`,
                      backgroundColor:
                        slot.utilization > 90
                          ? "#dc2626"
                          : slot.utilization > 75
                            ? "#f59e0b"
                            : "#10b981",
                    }}
                    title={`${slot.utilization}% utnyttjande`}
                  />
                )}
              </div>
              {index % 6 === 0 && (
                <div className="chart-label">{slot.time}</div>
              )}
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span
              className="legend-color"
              style={{
                backgroundColor:
                  type === "capacity"
                    ? "#3b82f6"
                    : type === "demand"
                      ? "#8b5cf6"
                      : "#10b981",
              }}
            />
            <span>
              {type === "capacity"
                ? "Tillgänglig kapacitet"
                : type === "demand"
                  ? "Efterfrågan (besök)"
                  : "Utnyttjande %"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
