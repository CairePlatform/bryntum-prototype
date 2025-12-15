import "./RouteSummary.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useMemo } from "react";

import { Appointment } from "../lib/Appointment";
import { Doctor } from "../lib/Doctor";

export interface RouteSegment {
  from: string;
  to: string;
  minutes: number;
  transportMode: string;
  employeeName: string;
  employeeId: number;
}

export interface RouteSummaryProps {
  scheduler?: SchedulerPro;
  routes?: RouteSegment[];
}

export function RouteSummary({
  scheduler,
  routes: propRoutes,
}: RouteSummaryProps) {
  // Extract actual route data from scheduler if available
  const routes = useMemo(() => {
    // If routes provided as prop, use them (for API integration later)
    if (propRoutes && propRoutes.length > 0) {
      return propRoutes;
    }

    // Otherwise, extract from scheduler
    if (!scheduler) {
      return [];
    }

    const routeSegments: RouteSegment[] = [];
    const resources = scheduler.resourceStore.records as Doctor[];

    // For each employee, build their route
    resources.forEach((employee) => {
      // Get all assigned events for this employee, sorted by start time
      const assignments = scheduler.assignmentStore.query(
        (assignment) => assignment.resourceId === employee.id,
      );

      if (assignments.length === 0) return;

      // Get events and sort by start time
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

      // Build route segments from events
      // First segment: Office/Start -> First visit (using preamble/postamble from previous or default)
      let previousLocation = "Kontor";
      let previousEvent: Appointment | null = null;

      events.forEach((event, index) => {
        const appointment = event as Appointment;
        const patientName = appointment.patient || appointment.name;

        // Calculate travel time
        // Use postamble from previous event, or preamble from current event
        let travelMinutes = 0;
        if (previousEvent && previousEvent.postamble) {
          // Travel time after previous visit
          // Handle Duration object or number/string
          const postamble = previousEvent.postamble;
          if (typeof postamble === "object" && postamble.toMinutes) {
            travelMinutes = Math.round(postamble.toMinutes() || 0);
          } else if (typeof postamble === "number") {
            travelMinutes = Math.round(postamble);
          } else if (typeof postamble === "string") {
            // Parse string like "10min" or "10"
            const match = postamble.match(/(\d+)/);
            travelMinutes = match ? parseInt(match[1], 10) : 0;
          }
        } else if (appointment.preamble) {
          // Travel time before current visit
          const preamble = appointment.preamble;
          if (typeof preamble === "object" && preamble.toMinutes) {
            travelMinutes = Math.round(preamble.toMinutes() || 0);
          } else if (typeof preamble === "number") {
            travelMinutes = Math.round(preamble);
          } else if (typeof preamble === "string") {
            // Parse string like "10min" or "10"
            const match = preamble.match(/(\d+)/);
            travelMinutes = match ? parseInt(match[1], 10) : 0;
          }
        }

        // If no travel time found, skip this segment (or use 0)
        if (travelMinutes > 0 || index === 0) {
          routeSegments.push({
            from: previousLocation,
            to: patientName,
            minutes: travelMinutes || 0,
            transportMode: employee.transportMode || "Bil",
            employeeName: employee.name,
            employeeId: employee.id,
          });
        }

        previousLocation = patientName;
        previousEvent = appointment;
      });

      // Last segment: Last visit -> Office/End (using postamble from last event)
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
          routeSegments.push({
            from: previousLocation,
            to: "Kontor",
            minutes: travelMinutes,
            transportMode: employee.transportMode || "Bil",
            employeeName: employee.name,
            employeeId: employee.id,
          });
        }
      }
    });

    return routeSegments;
  }, [scheduler, propRoutes]);

  // Group routes by employee
  const routesByEmployee = useMemo(() => {
    const grouped: Record<string, RouteSegment[]> = {};
    routes.forEach((route) => {
      const key = `${route.employeeId}-${route.employeeName}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(route);
    });
    return grouped;
  }, [routes]);

  // Calculate total metrics
  const totalTravelTime = routes.reduce((sum, r) => sum + r.minutes, 0);
  const totalSegments = routes.length;
  const uniqueEmployees = Object.keys(routesByEmployee).length;

  const transportIcons: Record<string, string> = {
    Bil: "🚗",
    Cykel: "🚴",
    Promenad: "🚶",
    Kollektivtrafik: "🚌",
  };

  return (
    <div className="route-summary">
      <div className="route-header">
        <span className="label">RESVÄG (TIMEFOLD)</span>
        <h3>Samlad rutt</h3>
        {totalSegments > 0 && (
          <div className="route-stats">
            <span className="stat-item">
              {totalSegments} segment{totalSegments !== 1 ? "er" : ""}
            </span>
            <span className="stat-item">{totalTravelTime} min totalt</span>
            <span className="stat-item">{uniqueEmployees} medarbetare</span>
          </div>
        )}
      </div>

      {totalSegments === 0 ? (
        <div className="route-empty">
          <p>Inga rutter att visa</p>
          <p className="route-note">
            Data kan ersättas av <code>/api/scheduling/route-preview</code>
          </p>
        </div>
      ) : (
        <>
          {/* Group by employee */}
          {Object.entries(routesByEmployee).map(([employeeKey, segments]) => {
            const firstSegment = segments[0];
            const employeeTotalTime = segments.reduce(
              (sum, s) => sum + s.minutes,
              0,
            );
            const transportIcon =
              transportIcons[firstSegment.transportMode] || "🚗";

            return (
              <div key={employeeKey} className="route-employee-group">
                <div className="route-employee-header">
                  <span className="employee-name">
                    {transportIcon} {firstSegment.employeeName}
                  </span>
                  <span className="employee-total">
                    {employeeTotalTime} min totalt
                  </span>
                </div>
                <div className="route-list">
                  {segments.map((segment, index) => (
                    <div key={index} className="route-segment">
                      <span className="route-from">{segment.from}</span>
                      <i className="fa fa-arrow-right route-arrow"></i>
                      <span className="route-to">{segment.to}</span>
                      <span className="route-time">{segment.minutes} min</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="route-note">
            Data kan ersättas av <code>/api/scheduling/route-preview</code>
          </p>
        </>
      )}
    </div>
  );
}
