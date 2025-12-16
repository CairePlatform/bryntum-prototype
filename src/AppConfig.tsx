import {
  CalendarModel,
  Column,
  ColumnStore,
  DateHelper,
  ProjectModelConfig,
  ResourceModel,
  SchedulerPro,
  StringHelper,
  WidgetColumn,
} from "@bryntum/schedulerpro";
import {
  BryntumGridProps,
  BryntumSchedulerProProps,
} from "@bryntum/schedulerpro-react";

import { Appointment } from "./lib/Appointment";
import { Doctor } from "./lib/Doctor";
import { UtilizationChart } from "./lib/UtilizationChart";

export const projectConfig: ProjectModelConfig = {
  autoLoad: true,
  loadUrl: "./data/2.0/mockup_data_optimized.json",
  resourceStore: {
    modelClass: Doctor,
    sorters: [{ field: "name", ascending: true }],
  },
  eventStore: {
    // Unassigned events should remain in store
    removeUnassignedEvent: false,
    modelClass: Appointment,
  },
  // This config enables response validation and dumping of found errors to the browser console.
  // It's meant to be used as a development stage helper only so please set it to false for production systems.
  validateResponse: true,
};

export const schedulerProps: BryntumSchedulerProProps = {
  startDate: new Date(2025, 2, 24, 7),
  endDate: new Date(2025, 2, 24, 20),
  rowHeight: 95,
  barMargin: 10,
  eventStyle: "bordered",
  eventColor: "blue",
  allowOverlap: false,
  useInitialAnimation: false,
  resourceImagePath: "users/",
  infiniteScroll: true,
  zoomOnTimeAxisDoubleClick: true,
  zoomOnMouseWheel: true,
  height: "100%", // Set explicit height to avoid minHeight warning
  features: {
    tree: true, // Enable tree feature for treeSummary to work
    charts: {
      popup: {
        minWidth: "60em",
        minHeight: "30em",
      },
      chartDesigner: {
        chartType: "barVertical",
      },
    },
    treeSummary: {
      // Custom renderer for visit density heatmap (like tree-summary-heatmap example)
      renderer: ({ startDate, endDate, resourceRecord, timeline }: any) => {
        if (!resourceRecord || !resourceRecord.events) {
          return null;
        }

        let totalEvents = 0;
        resourceRecord.events.forEach((event: any) => {
          if (event.startDate < endDate && event.endDate > startDate) {
            totalEvents++;
          }
        });

        if (totalEvents) {
          const min = 1,
            max = 10;
          const normalized = Math.min((totalEvents - min) / (max - min), 1);
          const alpha = 0.05 + normalized * 0.5;
          const backgroundColor = `rgba(30, 144, 255, ${alpha})`;

          return {
            class: {
              "b-summary-value": 1,
            },
            style: {
              backgroundColor,
            },
            dataset: {
              btip: totalEvents
                ? `${DateHelper.format(startDate, "HH:mm")}: ${totalEvents} besök`
                : undefined,
            },
            text: totalEvents,
          };
        }

        return null;
      },
    },
  },
  columns: [
    {
      type: "resourceInfo",
      field: "name",
      text: "Medarbetare",
      width: 320,
      showEventCount: false,
      showImage: true,
      imagePath: "users/",
      showMeta: (resourceRecord) => {
        const doctor = resourceRecord as Doctor;
        const transportIcons = {
          Bil: "🚗",
          Cykel: "🚴",
          Promenad: "🚶",
          Kollektivtrafik: "🚌",
        };
        const transportIcon =
          transportIcons[doctor.transportMode as keyof typeof transportIcons] ||
          "🚗";

        // Service area badge
        const serviceAreaBadge = doctor.serviceAreaName
          ? `<span style="background: ${doctor.serviceAreaColor || "#6366f1"}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
               ${StringHelper.encodeHtml(doctor.serviceAreaName)}
             </span>`
          : "";

        return `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div><i class="${doctor.roleIconCls}"></i> ${doctor.role}</div>
                        <div style="display: flex; gap: 8px; font-size: 11px; flex-wrap: wrap;">
                            ${serviceAreaBadge}
                            <span style="background: #dbeafe; padding: 2px 8px; border-radius: 4px; color: #1e40af; white-space: nowrap;">${doctor.contractType}</span>
                            <span style="background: #fef3c7; padding: 2px 8px; border-radius: 4px; color: #92400e; white-space: nowrap;">${transportIcon} ${doctor.transportMode}</span>
                        </div>
                    </div>
                `;
      },
    },
    {
      type: "column",
      text: "Arbetstid",
      editor: false,
      filterable: false,
      sortable: false,
      width: 110,
      align: "center",
      renderer: ({ record, grid }) => {
        const scheduler = grid as SchedulerPro,
          resource = record as ResourceModel,
          viewStart = scheduler.startDate,
          viewEnd = scheduler.endDate,
          // Get the calendar day for filtering (year, month, day)
          viewDay = viewStart.getDate(),
          viewMonth = viewStart.getMonth(),
          viewYear = viewStart.getFullYear(),
          // Get all events assigned to this resource that are visible in the current view
          events = scheduler.eventStore.query((event) => {
            // Check if resource is assigned to this event
            const isAssigned = (event.resources as ResourceModel[])?.some(
              (r) => r.id === resource.id,
            );

            if (!isAssigned) return false;

            const eventStart = event.startDate;

            // Only include events that START on the visible day
            // This ensures we don't include events from adjacent days that just overlap
            const eventDay = eventStart.getDate();
            const eventMonth = eventStart.getMonth();
            const eventYear = eventStart.getFullYear();

            const isSameDay =
              eventDay === viewDay &&
              eventMonth === viewMonth &&
              eventYear === viewYear;

            // Also check that event overlaps with visible time range
            const overlaps = eventStart < viewEnd && event.endDate > viewStart;

            return isSameDay && overlaps;
          });

        if (events?.length) {
          // Find earliest start time and latest end time from actual scheduled events
          // Use actual event times (event.startDate/endDate exclude preamble/postamble)
          const startTimes = events.map((event) => event.startDate.getTime());
          const endTimes = events.map((event) => event.endDate.getTime());
          const earliestStart = new Date(Math.min(...startTimes));
          const latestEnd = new Date(Math.max(...endTimes));

          // Format times to HH:mm
          return `${DateHelper.format(earliestStart, "HH:mm")} - ${DateHelper.format(latestEnd, "HH:mm")}`;
        } else {
          // Fallback to calendar working time if no events scheduled
          const calendar = resource?.calendar as CalendarModel,
            ranges = calendar?.getWorkingTimeRanges?.(
              scheduler.startDate,
              scheduler.endDate,
            );
          if (ranges?.length) {
            const range = ranges[0];
            return `${DateHelper.format(range.startDate, "HH:mm")} - ${DateHelper.format(range.endDate, "HH:mm")}`;
          } else {
            return "—";
          }
        }
      },
    },
  ],

  // Custom view preset with header configuration
  viewPreset: {
    base: "hourAndDay",
    columnLinesFor: 1,
    headers: [
      {
        unit: "d",
        align: "center",
        dateFormat: "dddd",
      },
      {
        unit: "h",
        align: "center",
        dateFormat: "HH",
      },
    ],
  },

  stripeFeature: true,
  columnLinesFeature: true,
  filterBarFeature: false, // Disabled - we use custom filter buttons instead
  // Enable ALL SchedulerPro features for MVP
  resourceHistogramFeature: {
    showBarTip: true,
    showBarText: true,
  },
  resourceTimeRangesFeature: true,
  nonWorkingTimeFeature: true,
  dependenciesFeature: true,
  constraintsFeature: true,
  undoFeature: true,
  pdfExportFeature: true,
  excelExporterFeature: true,
  printFeature: true,
  regionResizeFeature: true,
  timeRangesFeature: true,
  eventCopyPasteFeature: true,
  cellEditFeature: true,
  cellMenuFeature: true,
  headerMenuFeature: true,
  sortFeature: true,
  searchFeature: true,
  quickFindFeature: true,
  calendarHighlightFeature: {
    calendar: "resource",
    // This method is provided to determine which resources are available for one or more eventRecords,
    // in order to highlight the right availability intervals
    collectAvailableResources({ scheduler, eventRecords }) {
      const appointment = eventRecords[0] as Appointment;
      return scheduler.resourceStore.query(
        (doctor: Doctor) =>
          doctor.role === appointment.requiredRole || !appointment.requiredRole,
      ) as ResourceModel[];
    },
  },
  eventBufferFeature: {
    // The event buffer time spans are considered as unavailable time (EXACTLY like Bryntum Travel Time example)
    bufferIsUnavailableTime: true,
    tooltipTemplate: ({ duration }: any) =>
      `<i class="b-icon fa-car"></i>Restid: ${duration}`,
    renderer({
      eventRecord,
      resourceRecord,
      preambleConfig,
      postambleConfig,
    }: any) {
      const resource = resourceRecord as Doctor;

      // Get transport icon based on employee's transport mode
      const transportIcons = {
        Bil: "fa fa-car",
        Cykel: "fa fa-bicycle",
        Promenad: "fa fa-walking",
        Kollektivtrafik: "fa fa-bus",
      };
      const transportIcon =
        transportIcons[
        resource?.transportMode as keyof typeof transportIcons
        ] || "fa fa-car";

      // EXACTLY like Bryntum official example - use .toString(true) for duration display
      if (eventRecord.preamble) {
        preambleConfig.icon = transportIcon;
        preambleConfig.cls = eventRecord.preambleCls || "";
        preambleConfig.text =
          eventRecord.preamble.toString(true) +
          (eventRecord.preambleText ? ` (${eventRecord.preambleText})` : "");
      }

      if (eventRecord.postamble) {
        postambleConfig.icon = transportIcon;
        postambleConfig.cls = eventRecord.postambleCls || "";
        postambleConfig.text =
          eventRecord.postamble.toString(true) +
          (eventRecord.postambleText ? ` (${eventRecord.postambleText})` : "");
      }
    },
  },
  eventTooltipFeature: {
    template: (data: any) => {
      const event = data.eventRecord as Appointment;
      const pinnedBadge = event.pinned
        ? '<span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">LÅST</span>'
        : "";
      const priorityColor =
        event.priority === "Hög"
          ? "#dc2626"
          : event.priority === "Låg"
            ? "#6b7280"
            : "#3b82f6";
      const mapboxToken =
        "pk.eyJ1IjoiYmpvcm5jYWlyZSIsImEiOiJjbWNudGs5c3MwMHM4Mm9xdnQ1Z3dxaXJ4In0.GFAAu1PoH7fk7EnmQI95lQ";

      // Generate map HTML if coordinates are available (like Bryntum Travel Time example with Leaflet)
      const mapHtml =
        event.lat && event.lng
          ? `
                <div style="flex: 1; min-width: 200px;">
                    <img 
                        src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+3b82f6(${event.lng},${event.lat})/${event.lng},${event.lat},14,0/250x200@2x?access_token=${mapboxToken}"
                        alt="Karta"
                        style="width: 100%; height: 200px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;"
                    />
                </div>
            `
          : "";

      return `
                <div style="display: flex; flex-direction: column; min-width: 400px; max-width: 500px;">
                    <header style="display: flex; align-items: center; margin-bottom: 12px;">
                        ${event.patient ? `<div style="font-weight: 700; font-size: 16px; color: #1f2937;">${event.patient}</div>` : ""}
                    </header>
                    <div style="display: flex; gap: 16px;">
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                            <div style="font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                                <i class="fa fa-calendar" style="color: #6b7280;"></i>
                                ${event.name}
                                ${pinnedBadge}
                            </div>
                            <div style="font-size: 12px; color: #6b7280;">
                                ${DateHelper.format(event.startDate, "LT")} - ${DateHelper.format(event.endDate, "LT")}
                            </div>
                            <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
                                <strong><i class="fa fa-map-marker-alt" style="margin-right: 6px;"></i>Adress</strong><br/>
                                ${event.address || "Ingen adress"}
                            </div>
                            <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
                                <strong><i class="fa fa-car" style="margin-right: 6px;"></i>Restid</strong><br/>
                                ${event.preamble ? `<span>${event.preamble}min <i class="fa fa-arrow-right"></i></span>` : "<span>-</span>"}<br/>
                                ${event.postamble ? `<span>${event.postamble}min <i class="fa fa-arrow-left"></i></span>` : "<span>-</span>"}
                            </div>
                            <div style="font-size: 12px; margin-top: 8px;">
                                <strong>Varaktighet:</strong> ${Math.round(event.duration * 60)} min<br/>
                                <strong>Kompetens:</strong> ${event.requiredRole}<br/>
                                <strong style="color: ${priorityColor};">Prioritet:</strong> <span style="color: ${priorityColor};">${event.priority || "Normal"}</span>
                            </div>
                        </div>
                        ${mapHtml}
                    </div>
                </div>
            `;
    },
  },
  // Configure event menu items with correct phrases (could also be done through localization)
  eventMenuFeature: {
    items: {
      deleteEvent: {
        text: "Ta bort besök",
      },
      unassignEvent: {
        text: "Avboka besök (flytta till oplanerade)",
      },
      togglePinned: {
        text: "Lås/Lås upp besök",
        icon: "fa fa-lock",
        weight: 100,
        onItem: ({ eventRecord }: any) => {
          eventRecord.pinned = !eventRecord.pinned;
          // Trigger re-render
          eventRecord.stores[0].trigger("update", { record: eventRecord });
        },
      },
    },
  },
  eventDragFeature: {
    validatorFn({ eventRecords, newResource, startDate, endDate }) {
      const task = eventRecords[0] as Appointment,
        doctor = newResource as Doctor,
        { calendar } = doctor,
        valid =
          doctor.role === task.requiredRole &&
          (!calendar ||
            (calendar as CalendarModel).isWorkingTime(startDate, endDate)),
        message = valid ? "" : "Inget tillgängligt pass";

      return {
        valid,
        message:
          (valid ? "" : '<i class="b-icon fa-exclamation-triangle"></i>') +
          message,
      };
    },
  },
  taskEditFeature: {
    editorConfig: {
      title: "Redigera besök",
    },

    // Customize its contents inside the General tab
    items: {
      generalTab: {
        // Add a patient field
        items: {
          // Add a client field
          orderField: {
            type: "text",
            name: "patient",
            label: "Klient",
            // Place after name field
            weight: 150,
          },
        },
      },
    },
  },

  eventRenderer({ eventRecord, renderData }) {
    const appointment = eventRecord as Appointment;

    // Apply visit status classes - ONLY 2 base background colors: Optional (blue) or Mandatory (purple)
    // Every visit is either optional or mandatory - this is the base background
    // Extra, Cancelled, and Absent use overlays (borders/patterns)
    // Priority is a NUMBER (0-10) for filtering only - NO visual overlay

    // Base background: Only Optional or Mandatory
    if (appointment.isMandatory) {
      renderData.cls.add("visit-status-mandatory");
    } else {
      // Default: Optional
      renderData.cls.add("visit-status-optional");
    }

    // Overlay indicators (borders/patterns) - ONLY for visit types, NOT priority
    // Priority is filtered by the slider, not shown visually
    if (appointment.isExtra) {
      renderData.cls.add("visit-has-extra");
    }
    if (appointment.isCancelled) {
      renderData.cls.add("visit-has-cancelled");
    }
    if (appointment.isAbsent) {
      renderData.cls.add("visit-has-absent");
    }
    // Priority is NOT a visual overlay - it's just a number for filtering

    // Build badges for top-right corner
    const badges = [];

    // Lock icon
    if (appointment.pinned) {
      badges.push('<i class="fa fa-lock"></i>');
    }

    // Staffing icons
    if (appointment.staffingType === "single") {
      badges.push('<i class="fa fa-user"></i>');
    } else if (appointment.staffingType === "double") {
      badges.push('<i class="fa fa-users"></i>');
    }

    // Recurrence icons with calendar numbers
    // NOTE: Using "visitRecurrence" because "recurrence" is reserved by Bryntum
    // null/undefined values are treated as "daily" (see filter logic)
    const recurrence = appointment.visitRecurrence || "daily";
    if (recurrence === "daily") {
      badges.push(
        '<span class="recurrence-badge"><i class="fa fa-calendar"></i>1</span>',
      );
    } else if (recurrence === "weekly") {
      badges.push(
        '<span class="recurrence-badge"><i class="fa fa-calendar"></i>7</span>',
      );
    } else if (recurrence === "bi-weekly") {
      badges.push(
        '<span class="recurrence-badge"><i class="fa fa-calendar"></i>14</span>',
      );
    } else if (recurrence === "monthly") {
      badges.push(
        '<span class="recurrence-badge"><i class="fa fa-calendar"></i>30</span>',
      );
    }

    const badgesHtml =
      badges.length > 0
        ? `<div class="event-badges">${badges.map((b) => `<span class="badge-icon">${b}</span>`).join("")}</div>`
        : "";

    // Service area badge (small, inline with event name)
    const serviceAreaBadge = appointment.serviceAreaName
      ? `<span style="background: ${appointment.serviceAreaColor || "#6366f1"}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 9px; font-weight: 600; margin-left: 4px;">
           ${StringHelper.encodeHtml(appointment.serviceAreaName.substring(0, 3).toUpperCase())}
         </span>`
      : "";

    return `
            ${badgesHtml}
            <div class="event-name">${eventRecord.name}${serviceAreaBadge}</div>
            <div class="event-patient">${appointment.patient || ""}</div>
        `;
  },
};

// Custom grid that holds unassigned visits
export const gridProps: BryntumGridProps = {
  selectionMode: {
    cell: false,
  },
  stripeFeature: true,
  sortFeature: "name",
  groupFeature: {
    field: "requiredRole",
    renderer({ groupRowFor, column }: { groupRowFor: string; column: Column }) {
      if (column.parentIndex === 0) {
        return `Besök för ${groupRowFor}`;
      }

      return "";
    },
  },
  columns: [
    {
      type: "template",
      text: "Besök",
      flex: 1,
      cellCls: "unscheduledNameCell",

      template: ({ record }) => {
        const appointment = record as Appointment;
        return StringHelper.xss`
                        <i class="fa fa-${appointment.iconCls}"></i>
                        <div class="name-container">
                            <span>${StringHelper.encodeHtml(appointment.name)}</span>
                            <span class="patient-name">${appointment.patient}</span>
                        </div>
                    `;
      },
    },
    {
      text: "Kompetens",
      field: "requiredRole",
    },
    {
      type: "column",
      icon: "b-icon fa-clock",
      width: 80,
      align: "center",
      editor: "duration",
      field: "fullDuration",
      renderer: ({ record }) => {
        const appointment = record as Appointment;
        return `${appointment.duration} ${appointment.durationUnit}`;
      },
    },
  ],

  rowHeight: 65,
  disableGridRowModelWarning: true,
};
