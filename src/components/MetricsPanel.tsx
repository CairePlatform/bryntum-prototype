import "./MetricsPanel.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useMemo } from "react";

import { Appointment } from "../lib/Appointment";
import { Doctor } from "../lib/Doctor";

export interface MetricsPanelProps {
  title: string;
  description: string;
  scheduler?: SchedulerPro;
  metrics?: {
    serviceHours: number;
    travelMinutes: number;
    waitingMinutes: number;
    utilization: number;
    pinnedVisits: number;
    unplanned: number;
  };
}

export function MetricsPanel({
  title,
  description,
  scheduler,
  metrics: propMetrics,
}: MetricsPanelProps) {
  // Calculate route metrics from scheduler if available
  const routeMetrics = useMemo(() => {
    if (!scheduler) return null;

    const resources = scheduler.resourceStore.records as Doctor[];
    let totalRouteSegments = 0;
    let totalRouteTime = 0;
    let routesWithTransport: Record<string, number> = {
      Bil: 0,
      Cykel: 0,
      Promenad: 0,
      Kollektivtrafik: 0,
    };

    resources.forEach((employee) => {
      const assignments = scheduler.assignmentStore.query(
        (assignment) => assignment.resourceId === employee.id,
      );

      if (assignments.length === 0) return;

      const events = assignments
        .map((assignment) => {
          const event = scheduler.eventStore.getById(
            assignment.eventId,
          ) as Appointment;
          return event;
        })
        .filter((event) => event != null)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

      if (events.length === 0) return;

      let previousEvent: Appointment | null = null;
      events.forEach((event) => {
        const appointment = event as Appointment;
        let travelMinutes = 0;

        if (previousEvent && previousEvent.postamble) {
          const postamble = previousEvent.postamble;
          if (typeof postamble === "object" && postamble.toMinutes) {
            travelMinutes = Math.round(postamble.toMinutes() || 0);
          } else if (typeof postamble === "number") {
            travelMinutes = Math.round(postamble);
          } else if (typeof postamble === "string") {
            const match = postamble.match(/(\d+)/);
            travelMinutes = match ? parseInt(match[1], 10) : 0;
          }
        } else if (appointment.preamble) {
          const preamble = appointment.preamble;
          if (typeof preamble === "object" && preamble.toMinutes) {
            travelMinutes = Math.round(preamble.toMinutes() || 0);
          } else if (typeof preamble === "number") {
            travelMinutes = Math.round(preamble);
          } else if (typeof preamble === "string") {
            const match = preamble.match(/(\d+)/);
            travelMinutes = match ? parseInt(match[1], 10) : 0;
          }
        }

        if (travelMinutes > 0) {
          totalRouteSegments++;
          totalRouteTime += travelMinutes;
          const transportMode = employee.transportMode || "Bil";
          if (routesWithTransport[transportMode] !== undefined) {
            routesWithTransport[transportMode]++;
          }
        }

        previousEvent = appointment;
      });

      // Last segment back to office
      if (previousEvent && previousEvent.postamble) {
        const postamble = previousEvent.postamble;
        let travelMinutes = 0;
        if (typeof postamble === "object" && postamble.toMinutes) {
          travelMinutes = Math.round(postamble.toMinutes() || 0);
        } else if (typeof postamble === "number") {
          travelMinutes = Math.round(postamble);
        } else if (typeof postamble === "string") {
          const match = postamble.match(/(\d+)/);
          travelMinutes = match ? parseInt(match[1], 10) : 0;
        }
        if (travelMinutes > 0) {
          totalRouteSegments++;
          totalRouteTime += travelMinutes;
          const transportMode = employee.transportMode || "Bil";
          if (routesWithTransport[transportMode] !== undefined) {
            routesWithTransport[transportMode]++;
          }
        }
      }
    });

    const averageRouteTime =
      totalRouteSegments > 0 ? totalRouteTime / totalRouteSegments : 0;

    return {
      totalRouteSegments,
      totalRouteTime,
      averageRouteTime,
      routesWithTransport,
    };
  }, [scheduler]);

  // Use provided metrics or calculate from scheduler
  const metrics = propMetrics || {
    serviceHours: 0,
    travelMinutes: routeMetrics?.totalRouteTime || 0,
    waitingMinutes: 0,
    utilization: 0,
    pinnedVisits: 0,
    unplanned: 0,
  };

  return (
    <div className="metrics-panel">
      <div className="metrics-header">
        <span className="label">SCENARIO</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">Servicetid</span>
          <span className="metric-value">
            {metrics.serviceHours.toFixed(1)} h
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Resor</span>
          <span className="metric-value">{metrics.travelMinutes} min</span>
        </div>
        <div className="metric">
          <span className="metric-label">Väntan</span>
          <span className="metric-value">{metrics.waitingMinutes} min</span>
        </div>
        <div className="metric">
          <span className="metric-label">Utnyttjande</span>
          <span className="metric-value">
            {Math.round(metrics.utilization * 100)} %
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Låsta besök</span>
          <span className="metric-value">
            {Math.round(metrics.pinnedVisits * 100)} %
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Oplanerade</span>
          <span className="metric-value">{metrics.unplanned} st</span>
        </div>
        {routeMetrics && (
          <>
            <div className="metric route-metric">
              <span className="metric-label">Ruttsegment</span>
              <span className="metric-value">
                {routeMetrics.totalRouteSegments} st
              </span>
            </div>
            <div className="metric route-metric">
              <span className="metric-label">Snitt restid/segment</span>
              <span className="metric-value">
                {routeMetrics.averageRouteTime.toFixed(1)} min
              </span>
            </div>
            <div className="metric route-metric transport-breakdown">
              <span className="metric-label">Transportfördelning</span>
              <div className="transport-stats">
                {Object.entries(routeMetrics.routesWithTransport)
                  .filter(([_, count]) => count > 0)
                  .map(([transport, count]) => {
                    const icons: Record<string, string> = {
                      Bil: "🚗",
                      Cykel: "🚴",
                      Promenad: "🚶",
                      Kollektivtrafik: "🚌",
                    };
                    return (
                      <div key={transport} className="transport-stat">
                        <span className="transport-icon">
                          {icons[transport] || "🚗"}
                        </span>
                        <span className="transport-count">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
