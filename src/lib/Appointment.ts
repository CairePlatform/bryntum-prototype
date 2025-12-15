import { EventModel } from "@bryntum/schedulerpro";

// Custom Appointment model, based on EventModel with additional fields and changed defaults
export class Appointment extends EventModel {
  declare patient: string;
  declare requiredRole: string;
  declare address: string;
  declare taskNotes: string;
  declare preferredWindowStart: string;
  declare preferredWindowEnd: string;
  declare allowedWindowStart: string;
  declare allowedWindowEnd: string;
  declare clientPhone: string;
  declare serviceAreaId: string;
  declare serviceAreaName: string;
  declare serviceAreaColor: string;

  // Visual system (VISUAL_SYSTEM.md)
  // Visit characteristics - can be combined (e.g., mandatory AND extra AND priority)
  declare isOptional: boolean; // Default status if nothing else applies
  declare isMandatory: boolean; // Required visit (can't skip)
  declare isExtra: boolean; // Extra visit (added by planner after import)
  declare isCancelled: boolean; // Cancelled visit
  declare isAbsent: boolean; // Employee/client absent
  declare priority: number; // Priority level 0-10 (0 = no priority, 10 = highest)

  // NOTE: "recurrence" is reserved by Bryntum for built-in recurring events - use "visitRecurrence" instead!
  declare visitRecurrence:
    | "daily"
    | "weekly"
    | "bi-weekly"
    | "monthly"
    | "other"
    | null; // Calendar icon with number
  // visitCategory is derived from visitRecurrence:
  // - "daily" = recurrenceType is null or "daily" (shows as 📅1)
  // - "recurring" = recurrenceType is "weekly"/"bi-weekly"/"monthly" (shows as 📅7/14/30)
  declare visitCategory: "daily" | "recurring";
  declare staffingType: "single" | "double"; // 👥 icon for double
  declare pinned: boolean; // 🔒 lock icon
  declare movable: boolean; // Can move to another day? (daily = false, weekly+ = true)
  declare requiredSkills: string[]; // Skills required for this visit (from visit_skills table)

  // Map & travel (eventBuffer feature)
  declare lat: number;
  declare lng: number;
  // preamble and postamble are Bryntum Duration fields (handled automatically)
  // Data format: "10min", "14min" (strings that Bryntum parses to Duration objects)
  // Don't declare explicit types - let Bryntum handle Duration parsing
  declare preambleText: string;
  declare preambleIcon: string;
  declare preambleCls: string;
  declare postambleText: string;
  declare postambleIcon: string;
  declare postambleCls: string;

  static fields = [
    "patient",
    "requiredRole",
    "address",
    "taskNotes",
    "preferredWindowStart",
    "preferredWindowEnd",
    "allowedWindowStart",
    "allowedWindowEnd",
    "clientPhone",
    "isOptional",
    "isMandatory",
    "isExtra",
    "isCancelled",
    "isAbsent",
    "priority",
    "visitRecurrence",
    "visitCategory",
    "staffingType",
    "pinned",
    "requiredSkills",
    "movable",
    "lat",
    "lng",
    "serviceAreaId",
    "serviceAreaName",
    "serviceAreaColor",
    // preamble and postamble are built-in Duration fields, don't redeclare them
    "preambleText",
    "preambleIcon",
    "preambleCls",
    "postambleText",
    "postambleIcon",
    "postambleCls",
    { name: "durationUnit", defaultValue: "h" },
    { name: "preambleIcon", defaultValue: "fa fa-car" }, // Default icon like official example
    { name: "postambleIcon", defaultValue: "fa fa-car" },
  ];

  static defaults = {
    durationUnit: "h",
    pinned: false,
    movable: true,
    isOptional: true,
    isMandatory: false,
    isExtra: false,
    isCancelled: false,
    isAbsent: false,
    priority: 0,
    staffingType: "single",
    visitRecurrence: null,
    requiredSkills: [],
  };
}
