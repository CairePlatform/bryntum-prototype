import "./LegendAndFiltering.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useEffect, useState } from "react";

export interface LegendAndFilteringProps {
  rowHeight: number;
  onRowHeightChange: (height: number) => void;
  scheduler?: SchedulerPro;
  serviceAreas?: Array<{ id: string; name: string; color?: string }>;
  selectedServiceAreaIds?: Set<string>;
  onServiceAreaFilterChange?: (selectedIds: Set<string>) => void;
}

export function LegendAndFiltering({
  rowHeight,
  onRowHeightChange,
  scheduler,
  serviceAreas = [],
  selectedServiceAreaIds: propSelectedServiceAreaIds,
  onServiceAreaFilterChange,
}: LegendAndFilteringProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Service area filter state
  const [selectedServiceAreaIds, setSelectedServiceAreaIds] = useState<
    Set<string>
  >(() => new Set(propSelectedServiceAreaIds || serviceAreas.map((a) => a.id)));

  // Skills filter state - initialize empty, will be populated when scheduler loads
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  // Cache all available skills from the FULL unfiltered store
  const [allAvailableSkillsCache, setAllAvailableSkillsCache] = useState<
    string[]
  >([]);

  // Initialize selectedSkills with all available skills when scheduler loads or data changes
  // IMPORTANT: Read from the FULL store, not filtered view
  useEffect(() => {
    if (!scheduler) return;

    const skillsSet = new Set<string>();
    // Read from the full eventStore (before any filters are applied)
    // Use project.eventStore if available, otherwise scheduler.eventStore
    const fullEventStore =
      scheduler.project?.eventStore || scheduler.eventStore;

    fullEventStore.forEach((event: any) => {
      if (event.requiredSkills && Array.isArray(event.requiredSkills)) {
        event.requiredSkills.forEach((skill: string) => {
          if (skill && skill.trim()) {
            skillsSet.add(skill.trim());
          }
        });
      }
    });

    const skillsArray = Array.from(skillsSet).sort();

    // Update cache
    setAllAvailableSkillsCache(skillsArray);

    // Update selected skills if we found new skills
    if (skillsArray.length > 0) {
      // Only update if the set has changed
      const currentSkills = Array.from(selectedSkills).sort().join(",");
      const newSkills = skillsArray.join(",");
      if (currentSkills !== newSkills) {
        // If skills were previously empty, select all by default
        if (selectedSkills.size === 0) {
          setSelectedSkills(new Set(skillsArray));
        } else {
          // Otherwise, keep current selection but add any new skills
          const updated = new Set(selectedSkills);
          skillsArray.forEach((skill) => updated.add(skill));
          setSelectedSkills(updated);
        }
      }
    }
  }, [
    scheduler,
    scheduler?.project?.eventStore?.count,
    scheduler?.eventStore?.count,
  ]); // Re-run when event count changes (data loaded)

  // Priority filter range (0-10) - dual-handle slider
  const [priorityRange, setPriorityRange] = useState<[number, number]>([0, 10]);

  // Default: ALL filters active (show everything) - click to HIDE
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    () =>
      new Set([
        "status-optional",
        "status-mandatory",
        "status-extra",
        "status-cancelled",
        "status-absent",
        "recurrence-daily",
        "recurrence-weekly",
        "recurrence-biweekly",
        "recurrence-monthly",
        "single-staffing",
        "double-staffing",
        "pinned-filter",
        "transport-bil",
        "transport-cykel",
        "transport-promenad",
        "transport-kollektivtrafik",
      ]),
  );

  const toggleFilter = (filterId: string) => {
    if (!scheduler) return;

    const newActiveFilters = new Set(activeFilters);
    const isCurrentlyActive = activeFilters.has(filterId);

    if (isCurrentlyActive) {
      // Remove from active = HIDE this type
      newActiveFilters.delete(filterId);
    } else {
      // Add to active = SHOW this type
      newActiveFilters.add(filterId);
    }

    setActiveFilters(newActiveFilters);
    applyFilters(newActiveFilters);
  };

  const toggleServiceAreaFilter = (areaId: string) => {
    const newSelected = new Set(selectedServiceAreaIds);
    if (newSelected.has(areaId)) {
      newSelected.delete(areaId);
    } else {
      newSelected.add(areaId);
    }
    setSelectedServiceAreaIds(newSelected);
    if (onServiceAreaFilterChange) {
      onServiceAreaFilterChange(newSelected);
    }
    applyServiceAreaFilter(newSelected);
  };

  const applyServiceAreaFilter = (filters: Set<string>) => {
    if (!scheduler) return;

    scheduler.eventStore.removeFilter("service-area-filter");
    scheduler.resourceStore.removeFilter("service-area-resource-filter");

    // If all service areas are selected, show everything
    if (filters.size === serviceAreas.length) {
      scheduler.refresh();
      return;
    }

    // If nothing is selected, hide everything
    if (filters.size === 0) {
      scheduler.eventStore.filter({
        id: "service-area-filter",
        filterBy: () => false, // Hide all events
      });
      scheduler.resourceStore.filter({
        id: "service-area-resource-filter",
        filterBy: () => false, // Hide all resources
      });
      scheduler.refresh();
      return;
    }

    // Filter events by service area
    scheduler.eventStore.filter({
      id: "service-area-filter",
      filterBy: (event: any) => {
        if (!event.serviceAreaId) return false; // Hide events without service area
        return filters.has(event.serviceAreaId);
      },
    });

    // Filter resources by service area
    scheduler.resourceStore.filter({
      id: "service-area-resource-filter",
      filterBy: (resource: any) => {
        if (!resource.serviceAreaId) return false; // Hide resources without service area
        return filters.has(resource.serviceAreaId);
      },
    });

    scheduler.refresh();
  };

  const applyFilters = (filters: Set<string>) => {
    if (!scheduler) return;

    scheduler.eventStore.removeFilter("visit-filter");

    // All filter IDs
    const allFilterIds = [
      "status-optional",
      "status-mandatory",
      "status-extra",
      "status-cancelled",
      "status-absent",
      "recurrence-daily",
      "recurrence-weekly",
      "recurrence-biweekly",
      "recurrence-monthly",
      "single-staffing",
      "double-staffing",
      "pinned-filter",
      "transport-bil",
      "transport-cykel",
      "transport-promenad",
      "transport-kollektivtrafik",
    ];

    // If all filters active and priority is full range and skills all selected, show everything
    const isPriorityFullRange =
      priorityRange[0] === 0 && priorityRange[1] === 10;
    const allSkillsSelected =
      selectedSkills.size === 0 ||
      selectedSkills.size === getAllSkills().length;
    if (
      filters.size === allFilterIds.length &&
      isPriorityFullRange &&
      allSkillsSelected
    ) {
      scheduler.refresh();
      return;
    }

    // FILTERING LOGIC:
    // - Status filters: Check boolean flags independently (can be combined)
    // - Priority filter: Check priority number range (0-10)
    // - Recurrence filters: Event's recurrence must match an ACTIVE recurrence filter
    // - Staffing/Pinned: Only hide if filter is OFF and event has that attribute
    // - Transport filters: Event's assigned resource's transportMode must match an ACTIVE transport filter
    // - Skills filter: Event must have at least one skill matching selected skills
    const currentSelectedSkills = selectedSkills; // Capture in closure
    const currentPriorityRange = priorityRange; // Capture in closure

    scheduler.eventStore.filter({
      id: "visit-filter",
      filterBy: (event: any) => {
        // 1. STATUS CHECK: Base status (Optional/Mandatory) + Overlays (Extra/Cancelled/Absent)
        // Every visit is either Optional (blue) or Mandatory (purple) - this is the base
        // Extra, Cancelled, Absent are overlays that can combine with base
        // Filters work as: active = show, inactive = hide

        // Base status: Must match at least one active base filter
        let baseStatusMatch = false;
        if (filters.has("status-optional") && !event.isMandatory) {
          // Optional filter is active AND visit is optional
          baseStatusMatch = true;
        }
        if (filters.has("status-mandatory") && event.isMandatory === true) {
          // Mandatory filter is active AND visit is mandatory
          baseStatusMatch = true;
        }

        if (!baseStatusMatch) return false;

        // Overlay statuses: Extra, Cancelled, Absent (can combine with base)
        // If overlay filter is active, show visits with that overlay
        // If overlay filter is inactive, hide visits with that overlay
        if (filters.has("status-extra") === false && event.isExtra === true) {
          // Extra filter is inactive AND visit is extra → hide
          return false;
        }
        if (
          filters.has("status-cancelled") === false &&
          event.isCancelled === true
        ) {
          // Cancelled filter is inactive AND visit is cancelled → hide
          return false;
        }
        if (filters.has("status-absent") === false && event.isAbsent === true) {
          // Absent filter is inactive AND visit is absent → hide
          return false;
        }

        // 2. PRIORITY CHECK: Event's priority must be within range
        const eventPriority = event.priority || 0;
        if (
          eventPriority < currentPriorityRange[0] ||
          eventPriority > currentPriorityRange[1]
        ) {
          return false;
        }

        // 3. RECURRENCE CHECK: Event's visitRecurrence must match an active filter
        // NOTE: Using "visitRecurrence" because "recurrence" is reserved by Bryntum
        // Events with null/undefined visitRecurrence count as "daily" (non-recurring)
        const recurrenceMap: Record<string, string> = {
          "recurrence-daily": "daily",
          "recurrence-weekly": "weekly",
          "recurrence-biweekly": "bi-weekly",
          "recurrence-monthly": "monthly",
        };

        const eventRecurrence = event.visitRecurrence || "daily"; // null = daily
        let recurrenceMatch = false;
        for (const [filterId, recurrenceValue] of Object.entries(
          recurrenceMap,
        )) {
          if (filters.has(filterId) && eventRecurrence === recurrenceValue) {
            recurrenceMatch = true;
            break;
          }
        }
        if (!recurrenceMatch) return false;

        // 4. STAFFING CHECKS: Only hide if filter is OFF and event has attribute
        if (
          !filters.has("single-staffing") &&
          event.staffingType === "single"
        ) {
          return false;
        }
        if (
          !filters.has("double-staffing") &&
          event.staffingType === "double"
        ) {
          return false;
        }
        if (!filters.has("pinned-filter") && event.pinned === true) {
          return false;
        }

        // 5. SKILLS CHECK: If any skills are deselected, hide events with those skills
        // Logic: Show all by default. Only hide if a skill is NOT selected and event has it.
        // Use cached skills from full store, not filtered store
        const allAvailableSkills = allAvailableSkillsCache;
        if (
          allAvailableSkills.length > 0 &&
          currentSelectedSkills.size > 0 &&
          currentSelectedSkills.size < allAvailableSkills.length
        ) {
          // Some skills are deselected - filter events
          const eventSkills = event.requiredSkills || [];
          if (Array.isArray(eventSkills) && eventSkills.length > 0) {
            // Check if event has ANY skill that IS selected
            // If event has skills but NONE are selected, hide it
            const hasSelectedSkill = eventSkills.some((skill: string) =>
              currentSelectedSkills.has(skill?.trim()),
            );
            if (!hasSelectedSkill) {
              return false; // Event has skills but none are selected
            }
          } else {
            // Event has no skills - show it only if "no skills" is implicitly selected
            // (when all skills are selected, events with no skills are shown)
            // When some skills are deselected, events with no skills are still shown
          }
        }

        // 6. TRANSPORT CHECK: Event's assigned resource's transportMode must match an active transport filter
        // Get all resources assigned to this event
        const assignments = scheduler.assignmentStore.query(
          (assignment) => assignment.eventId === event.id,
        );
        if (assignments.length > 0) {
          const transportMap: Record<string, string> = {
            "transport-bil": "Bil",
            "transport-cykel": "Cykel",
            "transport-promenad": "Promenad",
            "transport-kollektivtrafik": "Kollektivtrafik",
          };

          // Check if any assigned resource matches an active transport filter
          let transportMatch = false;
          for (const assignment of assignments) {
            const resource = scheduler.resourceStore.getById(
              assignment.resourceId,
            ) as any;
            if (resource && resource.transportMode) {
              for (const [filterId, transportValue] of Object.entries(
                transportMap,
              )) {
                if (
                  filters.has(filterId) &&
                  resource.transportMode === transportValue
                ) {
                  transportMatch = true;
                  break;
                }
              }
              if (transportMatch) break;
            }
          }
          // If no transport filters are active, show all (transportMatch stays false but we check if any transport filter is active)
          const hasActiveTransportFilter = Object.keys(transportMap).some(
            (filterId) => filters.has(filterId),
          );
          if (hasActiveTransportFilter && !transportMatch) {
            return false;
          }
        }

        return true;
      },
    });

    scheduler.refresh();
  };

  const isFilterActive = (filterId: string) => activeFilters.has(filterId);

  // Get all unique skills from events - use cached version from full store
  const getAllSkills = (): string[] => {
    // Return cached skills from full unfiltered store
    return allAvailableSkillsCache;
  };

  const allSkills = getAllSkills();

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(skill)) {
        newSelected.delete(skill);
      } else {
        newSelected.add(skill);
      }
      // Trigger filter refresh after state update
      requestAnimationFrame(() => {
        if (scheduler) {
          applyFilters(activeFilters);
        }
      });
      return newSelected;
    });
  };

  return (
    <div className="legend-and-filtering">
      <div className="legend-controls">
        <div className="legend-header-section">
          <button
            className="legend-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Dölj filter" : "Visa filter"}
          >
            <i className={`fa fa-chevron-${isExpanded ? "up" : "down"}`}></i>
            <span className="legend-title">Filter</span>
          </button>
        </div>

        <div className="row-height-control">
          <label htmlFor="row-height-slider">Radhöjd:</label>
          <input
            id="row-height-slider"
            type="range"
            min="50"
            max="150"
            value={rowHeight}
            onChange={(e) => onRowHeightChange(Number(e.target.value))}
            className="row-height-slider"
          />
          <span className="row-height-value">{rowHeight}px</span>
          <span className="zoom-hint">💡 Använd mushjulet för zoom</span>
        </div>
      </div>

      {isExpanded && (
        <div className="legend-content">
          <div className="legend-group">
            <h5>Besök:</h5>
            <div className="legend-items">
              <div
                className={`legend-item clickable ${isFilterActive("status-optional") ? "active" : ""}`}
                onClick={() => toggleFilter("status-optional")}
                title="Klicka för att dölja/visa standard besök"
              >
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#3b82f6" }}
                ></div>
                <span>Standard</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("status-mandatory") ? "active" : ""}`}
                onClick={() => toggleFilter("status-mandatory")}
                title="Klicka för att dölja/visa obligatoriska besök"
              >
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#8b5cf6" }}
                ></div>
                <span>Obligatoriskt</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("status-extra") ? "active" : ""}`}
                onClick={() => toggleFilter("status-extra")}
                title="Klicka för att dölja/visa extra besök (grön vertikal rand + vänsterkant)"
              >
                <div className="legend-color legend-overlay-extra">
                  <div className="legend-pattern-extra"></div>
                  <div className="legend-border-left-extra"></div>
                </div>
                <span>Extra</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("status-cancelled") ? "active" : ""}`}
                onClick={() => toggleFilter("status-cancelled")}
                title="Klicka för att dölja/visa inställda besök (gul diagonal + streckad kant)"
              >
                <div className="legend-color legend-overlay-cancelled">
                  <div className="legend-pattern-cancelled"></div>
                  <div className="legend-border-dashed-cancelled"></div>
                </div>
                <span>Inställt</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("status-absent") ? "active" : ""}`}
                onClick={() => toggleFilter("status-absent")}
                title="Klicka för att dölja/visa frånvaro (grå horisontell rand + prickad kant)"
              >
                <div className="legend-color legend-overlay-absent">
                  <div className="legend-pattern-absent"></div>
                  <div className="legend-border-dotted-absent"></div>
                </div>
                <span>Frånvaro</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("recurrence-daily") ? "active" : ""}`}
                onClick={() => toggleFilter("recurrence-daily")}
                title="Klicka för att dölja/visa dagliga besök (📅1)"
              >
                <div className="recurrence-sample">
                  <i className="fa fa-calendar"></i>
                  <span className="recurrence-num">1</span>
                </div>
                <span>Daglig</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("recurrence-weekly") ? "active" : ""}`}
                onClick={() => toggleFilter("recurrence-weekly")}
                title="Klicka för att dölja/visa veckovisa besök (📅7)"
              >
                <div className="recurrence-sample">
                  <i className="fa fa-calendar"></i>
                  <span className="recurrence-num">7</span>
                </div>
                <span>Veckovis</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("recurrence-biweekly") ? "active" : ""}`}
                onClick={() => toggleFilter("recurrence-biweekly")}
                title="Klicka för att dölja/visa varannan vecka (📅14)"
              >
                <div className="recurrence-sample">
                  <i className="fa fa-calendar"></i>
                  <span className="recurrence-num">14</span>
                </div>
                <span>Varannan vecka</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("recurrence-monthly") ? "active" : ""}`}
                onClick={() => toggleFilter("recurrence-monthly")}
                title="Klicka för att dölja/visa månadsvisa besök (📅30)"
              >
                <div className="recurrence-sample">
                  <i className="fa fa-calendar"></i>
                  <span className="recurrence-num">30</span>
                </div>
                <span>Månadsvis</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("pinned-filter") ? "active" : ""}`}
                onClick={() => toggleFilter("pinned-filter")}
                title="Klicka för att dölja/visa låsta besök"
              >
                <i className="fa fa-lock legend-icon locked"></i>
                <span>Låst</span>
              </div>
            </div>
          </div>

          <div className="legend-group">
            <h5>Prioritet (0-10):</h5>
            <div className="priority-hint-text">
              <span>
                Prioritet är ett nummer (0-10) för filtrering. Ingen visuell
                indikator på besöken.
              </span>
            </div>
            <div className="legend-items priority-slider-container">
              <div className="priority-range-slider">
                <div className="priority-track">
                  <div
                    className="priority-range-fill"
                    style={{
                      left: `${(priorityRange[0] / 10) * 100}%`,
                      width: `${((priorityRange[1] - priorityRange[0]) / 10) * 100}%`,
                    }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={priorityRange[0]}
                  onChange={(e) => {
                    const newMin = Number(e.target.value);
                    const newMax = Math.max(newMin, priorityRange[1]);
                    setPriorityRange([newMin, newMax]);
                    setTimeout(() => applyFilters(activeFilters), 0);
                  }}
                  className="priority-handle priority-handle-min"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={priorityRange[1]}
                  onChange={(e) => {
                    const newMax = Number(e.target.value);
                    const newMin = Math.min(newMax, priorityRange[0]);
                    setPriorityRange([newMin, newMax]);
                    setTimeout(() => applyFilters(activeFilters), 0);
                  }}
                  className="priority-handle priority-handle-max"
                />
              </div>
              <div className="priority-values">
                <span className="priority-value">{priorityRange[0]}</span>
                <span className="priority-separator">-</span>
                <span className="priority-value">{priorityRange[1]}</span>
              </div>
              <div className="priority-hint">
                Visar besök med prioritet {priorityRange[0]}-{priorityRange[1]}
              </div>
            </div>
          </div>

          <div className="legend-group">
            <h5>Bemanning:</h5>
            <div className="legend-items">
              <div
                className={`legend-item clickable ${isFilterActive("single-staffing") ? "active" : ""}`}
                onClick={() => toggleFilter("single-staffing")}
                title="Klicka för att dölja/visa enkelbemanning"
              >
                <i
                  className="fa fa-user legend-icon"
                  style={{ color: "#6366f1" }}
                ></i>
                <span>Enkelbemanning</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("double-staffing") ? "active" : ""}`}
                onClick={() => toggleFilter("double-staffing")}
                title="Klicka för att dölja/visa dubbelbemanning"
              >
                <i
                  className="fa fa-users legend-icon"
                  style={{ color: "#8b5cf6" }}
                ></i>
                <span>Dubbelbemanning</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("transport-bil") ? "active" : ""}`}
                onClick={() => toggleFilter("transport-bil")}
                title="Klicka för att dölja/visa besök med bil"
              >
                <span className="transport-icon">🚗</span>
                <span>Bil</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("transport-cykel") ? "active" : ""}`}
                onClick={() => toggleFilter("transport-cykel")}
                title="Klicka för att dölja/visa besök med cykel"
              >
                <span className="transport-icon">🚴</span>
                <span>Cykel</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("transport-promenad") ? "active" : ""}`}
                onClick={() => toggleFilter("transport-promenad")}
                title="Klicka för att dölja/visa besök med promenad"
              >
                <span className="transport-icon">🚶</span>
                <span>Promenad</span>
              </div>
              <div
                className={`legend-item clickable ${isFilterActive("transport-kollektivtrafik") ? "active" : ""}`}
                onClick={() => toggleFilter("transport-kollektivtrafik")}
                title="Klicka för att dölja/visa besök med kollektivtrafik"
              >
                <span className="transport-icon">🚌</span>
                <span>Kollektivtrafik</span>
              </div>
            </div>
          </div>

          <div className="legend-group">
            <h5>🎯 Kompetens:</h5>
            <div className="legend-items">
              {allSkills.length > 0 ? (
                allSkills.map((skill) => (
                  <div
                    key={skill}
                    className={`legend-item clickable ${selectedSkills.has(skill) ? "active" : ""}`}
                    onClick={() => toggleSkillFilter(skill)}
                    title={`Klicka för att ${selectedSkills.has(skill) ? "dölja" : "visa"} besök som kräver ${skill}`}
                  >
                    <span>{skill}</span>
                  </div>
                ))
              ) : (
                <span className="legend-hint">
                  Inga kompetenser definierade
                </span>
              )}
            </div>
          </div>

          <div className="legend-group">
            <h5>📍 Serviceområde:</h5>
            <div className="legend-items">
              {serviceAreas.map((area) => (
                <div
                  key={area.id}
                  className={`legend-item clickable ${selectedServiceAreaIds.has(area.id) ? "active" : ""}`}
                  onClick={() => toggleServiceAreaFilter(area.id)}
                  title={`Klicka för att ${selectedServiceAreaIds.has(area.id) ? "dölja" : "visa"} ${area.name}`}
                >
                  <div
                    className="legend-color service-area-badge"
                    style={{ backgroundColor: area.color || "#6366f1" }}
                  >
                    {area.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span>{area.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
