// Simplified MapView for prototype - adapted from main app
// Will show placeholder until Mapbox integration is complete

import "./MapView.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useMemo } from "react";

import { Appointment } from "../lib/Appointment";
import { Doctor } from "../lib/Doctor";

interface Visit {
  id: number;
  patient: string;
  address: string;
  startDate: string;
  travelMinutes: number;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  visits: Visit[];
  employees: any[];
  scheduler?: SchedulerPro;
}

interface RouteInfo {
  employeeId: number;
  employeeName: string;
  transportMode: string;
  segments: Array<{
    from: string;
    to: string;
    fromCoords?: [number, number];
    toCoords?: [number, number];
    travelMinutes: number;
  }>;
  totalTravelTime: number;
}

export function MapView({ visits, employees, scheduler }: MapViewProps) {
  // Extract route information from scheduler
  const routes = useMemo(() => {
    if (!scheduler) return [];

    const routeInfos: RouteInfo[] = [];
    const resources = scheduler.resourceStore.records as Doctor[];

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

      const segments: RouteInfo["segments"] = [];
      let previousEvent: Appointment | null = null;
      let previousLocation = "Kontor";

      events.forEach((event) => {
        const appointment = event as Appointment;
        const patientName = appointment.patient || appointment.name;

        let travelMinutes = 0;
        if (previousEvent && previousEvent.postamble) {
          travelMinutes = Math.round(previousEvent.postamble.toMinutes() || 0);
        } else if (appointment.preamble) {
          travelMinutes = Math.round(appointment.preamble.toMinutes() || 0);
        }

        if (travelMinutes > 0 || segments.length === 0) {
          segments.push({
            from: previousLocation,
            to: patientName,
            fromCoords:
              previousEvent && previousEvent.lat && previousEvent.lng
                ? [previousEvent.lng, previousEvent.lat]
                : undefined,
            toCoords:
              appointment.lat && appointment.lng
                ? [appointment.lng, appointment.lat]
                : undefined,
            travelMinutes: travelMinutes || 0,
          });
        }

        previousLocation = patientName;
        previousEvent = appointment;
      });

      // Last segment back to office
      if (previousEvent && previousEvent.postamble) {
        const travelMinutes = Math.round(
          previousEvent.postamble.toMinutes() || 0,
        );
        if (travelMinutes > 0) {
          segments.push({
            from: previousLocation,
            to: "Kontor",
            fromCoords:
              previousEvent.lat && previousEvent.lng
                ? [previousEvent.lng, previousEvent.lat]
                : undefined,
            toCoords: undefined, // Office location would come from config
            travelMinutes,
          });
        }
      }

      if (segments.length > 0) {
        const totalTravelTime = segments.reduce(
          (sum, s) => sum + s.travelMinutes,
          0,
        );
        routeInfos.push({
          employeeId: employee.id,
          employeeName: employee.name,
          transportMode: employee.transportMode || "Bil",
          segments,
          totalTravelTime,
        });
      }
    });

    return routeInfos;
  }, [scheduler]);

  const totalTravelTime = routes.reduce((sum, r) => sum + r.totalTravelTime, 0);
  const totalSegments = routes.reduce((sum, r) => sum + r.segments.length, 0);
  const routesWithCoords = routes.filter((r) =>
    r.segments.some((s) => s.fromCoords && s.toCoords),
  );

  const transportIcons: Record<string, string> = {
    Bil: "🚗",
    Cykel: "🚴",
    Promenad: "🚶",
    Kollektivtrafik: "🚌",
  };

  return (
    <div className="map-view">
      <div className="map-placeholder">
        <div className="map-icon">🗺️</div>
        <h2>Kartvy</h2>
        <p>Geografisk visualisering av besök och rutter</p>
        <div className="map-stats">
          <div className="stat">
            <span className="value">{visits.length}</span>
            <span className="label">Besök</span>
          </div>
          <div className="stat">
            <span className="value">{employees.length}</span>
            <span className="label">Medarbetare</span>
          </div>
          <div className="stat">
            <span className="value">{routes.length}</span>
            <span className="label">Rutter</span>
          </div>
          <div className="stat">
            <span className="value">{totalTravelTime}</span>
            <span className="label">Min restid</span>
          </div>
        </div>

        {routes.length > 0 && (
          <div className="routes-preview">
            <h3>Ruttöversikt</h3>
            <div className="routes-list">
              {routes.map((route) => {
                const transportIcon =
                  transportIcons[route.transportMode] || "🚗";
                return (
                  <div key={route.employeeId} className="route-preview-item">
                    <div className="route-header">
                      <span className="route-employee">
                        {transportIcon} {route.employeeName}
                      </span>
                      <span className="route-total">
                        {route.totalTravelTime} min
                      </span>
                    </div>
                    <div className="route-segments">
                      {route.segments.slice(0, 3).map((segment, idx) => (
                        <div key={idx} className="route-segment-preview">
                          <span className="segment-from">{segment.from}</span>
                          <i className="fa fa-arrow-right"></i>
                          <span className="segment-to">{segment.to}</span>
                          <span className="segment-time">
                            {segment.travelMinutes} min
                          </span>
                        </div>
                      ))}
                      {route.segments.length > 3 && (
                        <div className="route-more">
                          +{route.segments.length - 3} fler segment
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="integration-note">
          <p>
            <strong>Integration klar!</strong>
          </p>
          <p>Använd SimpleScheduleMapView.tsx från huvudappen</p>
          <p>
            {routesWithCoords.length > 0
              ? `${routesWithCoords.length} rutter har koordinater och kan visas på karta`
              : "Inga koordinater tillgängliga - lägg till lat/lng i data"}
          </p>
          <p>
            Mapbox token:
            pk.eyJ1IjoiYmpvcm5jYWlyZSIsImEiOiJjbWNudGs5c3MwMHM4Mm9xdnQ1Z3dxaXJ4In0.GFAAu1PoH7fk7EnmQI95lQ
          </p>
        </div>
      </div>
    </div>
  );
}
