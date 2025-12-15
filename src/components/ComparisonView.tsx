import "./ComparisonView.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { DragHelper } from "@bryntum/schedulerpro";
import { ProjectModelConfig } from "@bryntum/schedulerpro";
import { BryntumSchedulerPro } from "@bryntum/schedulerpro-react";
import { useEffect, useRef, useState } from "react";

import { projectConfig, schedulerProps } from "../AppConfig";
import { MetricsPanel } from "./MetricsPanel";
import { ResourceUtilization } from "./ResourceUtilization";
import { RevisionSelector } from "./RevisionSelector";

type ComparisonMode = "revisions" | "serviceAreas";
type BottomSection = "metrics" | "utilization" | "none";

interface ComparisonViewProps {
  scheduler?: SchedulerPro;
  revisions: Array<{
    id: string;
    number: number;
    type: "baseline" | "manual_edit" | "ai_optimized";
    source?: "carefox" | "slinga";
    createdBy?: string;
    createdAt: string;
    description: string;
  }>;
  serviceAreas: Array<{ id: string; name: string; color: string }>;
  onRevisionChange: (revisionId: string) => void;
}

export function ComparisonView({
  scheduler,
  revisions,
  serviceAreas,
  onRevisionChange,
}: ComparisonViewProps) {
  const leftSchedulerRef = useRef<BryntumSchedulerPro>(null);
  const rightSchedulerRef = useRef<BryntumSchedulerPro>(null);
  const [leftRevisionId, setLeftRevisionId] = useState(revisions[0]?.id || "");
  const [rightRevisionId, setRightRevisionId] = useState(
    revisions[1]?.id || "",
  );
  const [leftScheduler, setLeftScheduler] = useState<SchedulerPro>();
  const [rightScheduler, setRightScheduler] = useState<SchedulerPro>();

  // Comparison mode state
  const [comparisonMode, setComparisonMode] =
    useState<ComparisonMode>("revisions");
  const [bottomSection, setBottomSection] = useState<BottomSection>("metrics");
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);

  // Service area state for each side (used in both modes)
  const [leftServiceAreaIds, setLeftServiceAreaIds] = useState<Set<string>>(
    () => new Set(serviceAreas.slice(0, 1).map((a) => a.id)), // First area for left
  );
  const [rightServiceAreaIds, setRightServiceAreaIds] = useState<Set<string>>(
    () => new Set(serviceAreas.slice(1, 2).map((a) => a.id)), // Second area for right
  );

  // Create separate project configs for each scheduler
  const leftProjectConfig: ProjectModelConfig = {
    ...projectConfig,
    autoLoad: false,
  };
  const rightProjectConfig: ProjectModelConfig = {
    ...projectConfig,
    autoLoad: false,
  };

  useEffect(() => {
    setLeftScheduler(leftSchedulerRef.current?.instance);
    setRightScheduler(rightSchedulerRef.current?.instance);
  }, [leftSchedulerRef, rightSchedulerRef]);

  // Map revision IDs to data files
  const revisionDataFiles: Record<string, string> = {
    "rev-1": "/data/homecare-complete.json",
    "rev-2": "/data/homecare-revision2.json",
    "rev-3": "/data/homecare-revision3.json",
  };

  const loadRevisionData = async (
    schedulerInstance: SchedulerPro | undefined,
    revisionId: string,
  ) => {
    if (!schedulerInstance) return;

    const dataFile = revisionDataFiles[revisionId];
    if (!dataFile) {
      console.warn(`No data file for revision: ${revisionId}`);
      return;
    }

    try {
      const response = await fetch(dataFile);
      const data = await response.json();
      await schedulerInstance.project.loadCrudManagerData(data);
      schedulerInstance.refresh();
    } catch (error) {
      console.error(`Failed to load revision data:`, error);
    }
  };

  // Apply service area filter to a scheduler
  const applyServiceAreaFilter = (
    schedulerInstance: SchedulerPro | undefined,
    filters: Set<string>,
  ) => {
    if (!schedulerInstance) return;

    schedulerInstance.eventStore.removeFilter("service-area-filter");
    schedulerInstance.resourceStore.removeFilter(
      "service-area-resource-filter",
    );

    // If all service areas are selected, show everything
    if (filters.size === serviceAreas.length) {
      schedulerInstance.refresh();
      return;
    }

    // If nothing is selected, hide everything
    if (filters.size === 0) {
      schedulerInstance.eventStore.filter({
        id: "service-area-filter",
        filterBy: () => false,
      });
      schedulerInstance.resourceStore.filter({
        id: "service-area-resource-filter",
        filterBy: () => false,
      });
      schedulerInstance.refresh();
      return;
    }

    // Filter events and resources by service area
    schedulerInstance.eventStore.filter({
      id: "service-area-filter",
      filterBy: (event: any) => {
        if (!event.serviceAreaId) return false;
        return filters.has(event.serviceAreaId);
      },
    });

    schedulerInstance.resourceStore.filter({
      id: "service-area-resource-filter",
      filterBy: (resource: any) => {
        if (!resource.serviceAreaId) return false;
        return filters.has(resource.serviceAreaId);
      },
    });

    schedulerInstance.refresh();
  };

  useEffect(() => {
    if (leftScheduler && leftRevisionId) {
      loadRevisionData(leftScheduler, leftRevisionId);
    }
  }, [leftScheduler, leftRevisionId]);

  useEffect(() => {
    if (rightScheduler && rightRevisionId) {
      loadRevisionData(rightScheduler, rightRevisionId);
    }
  }, [rightScheduler, rightRevisionId]);

  // Apply service area filters
  useEffect(() => {
    if (leftScheduler) {
      applyServiceAreaFilter(leftScheduler, leftServiceAreaIds);
    }
  }, [leftScheduler, leftServiceAreaIds]);

  useEffect(() => {
    if (rightScheduler) {
      applyServiceAreaFilter(rightScheduler, rightServiceAreaIds);
    }
  }, [rightScheduler, rightServiceAreaIds]);

  // Enable drag between schedulers using Bryntum native drag-between-schedulers pattern
  // Reference: https://bryntum.com/products/schedulerpro/examples-scheduler/drag-between-schedulers/
  useEffect(() => {
    if (!leftScheduler || !rightScheduler) return;

    // Store original event drag configs
    const leftOriginalConfig = leftScheduler.features.eventDrag;
    const rightOriginalConfig = rightScheduler.features.eventDrag;

    // Configure schedulers to allow drag between them
    // Following Bryntum "drag-between-schedulers" example pattern
    const setupCrossSchedulerDrag = () => {
      try {
        // Enable external drag for both schedulers
        leftScheduler.features.eventDrag.externalDropTargetSelector =
          ".b-schedulerpro";
        rightScheduler.features.eventDrag.externalDropTargetSelector =
          ".b-schedulerpro";

        // Listen for external drops on left scheduler from right
        const leftExternalDropHandler = ({ event, context }: any) => {
          const targetScheduler = leftScheduler;
          const sourceScheduler =
            context.source?.up?.("schedulerpro") === rightScheduler
              ? rightScheduler
              : null;

          if (sourceScheduler && sourceScheduler !== targetScheduler) {
            const { eventRecords, newResource, startDate } = context;

            if (eventRecords && newResource) {
              // Move event from source to target scheduler
              eventRecords.forEach((eventRecord: any) => {
                // Clone the event data
                const eventData = {
                  ...eventRecord.data,
                  id: `${eventRecord.id}-copy-${Date.now()}`, // New ID to avoid conflicts
                  startDate: startDate || eventRecord.startDate,
                  endDate: startDate
                    ? new Date(
                        startDate.getTime() +
                          (eventRecord.endDate.getTime() -
                            eventRecord.startDate.getTime()),
                      )
                    : eventRecord.endDate,
                };

                // Add to target scheduler
                const newEvent = targetScheduler.eventStore.add(eventData)[0];

                // Assign to resource in target scheduler
                if (newResource) {
                  targetScheduler.assignmentStore.add({
                    id: `assignment-${Date.now()}-${Math.random()}`,
                    eventId: newEvent.id,
                    resourceId: newResource.id,
                  });
                }

                // Optionally remove from source scheduler
                // sourceScheduler.eventStore.remove(eventRecord);
              });

              targetScheduler.refresh();
              console.log("✅ Event dragged from right to left");
            }
          }
        };

        // Listen for external drops on right scheduler from left
        const rightExternalDropHandler = ({ event, context }: any) => {
          const targetScheduler = rightScheduler;
          const sourceScheduler =
            context.source?.up?.("schedulerpro") === leftScheduler
              ? leftScheduler
              : null;

          if (sourceScheduler && sourceScheduler !== targetScheduler) {
            const { eventRecords, newResource, startDate } = context;

            if (eventRecords && newResource) {
              // Move event from source to target scheduler
              eventRecords.forEach((eventRecord: any) => {
                // Clone the event data
                const eventData = {
                  ...eventRecord.data,
                  id: `${eventRecord.id}-copy-${Date.now()}`, // New ID to avoid conflicts
                  startDate: startDate || eventRecord.startDate,
                  endDate: startDate
                    ? new Date(
                        startDate.getTime() +
                          (eventRecord.endDate.getTime() -
                            eventRecord.startDate.getTime()),
                      )
                    : eventRecord.endDate,
                };

                // Add to target scheduler
                const newEvent = targetScheduler.eventStore.add(eventData)[0];

                // Assign to resource in target scheduler
                if (newResource) {
                  targetScheduler.assignmentStore.add({
                    id: `assignment-${Date.now()}-${Math.random()}`,
                    eventId: newEvent.id,
                    resourceId: newResource.id,
                  });
                }

                // Optionally remove from source scheduler
                // sourceScheduler.eventStore.remove(eventRecord);
              });

              targetScheduler.refresh();
              console.log("✅ Event dragged from left to right");
            }
          }
        };

        // Attach event listeners
        leftScheduler.on("eventdrop", leftExternalDropHandler);
        rightScheduler.on("eventdrop", rightExternalDropHandler);

        return () => {
          // Cleanup on unmount
          if (leftScheduler && typeof leftScheduler.un === "function") {
            leftScheduler.un("eventdrop", leftExternalDropHandler);
            leftScheduler.features.eventDrag.externalDropTargetSelector = null;
          }
          if (rightScheduler && typeof rightScheduler.un === "function") {
            rightScheduler.un("eventdrop", rightExternalDropHandler);
            rightScheduler.features.eventDrag.externalDropTargetSelector = null;
          }
        };
      } catch (error) {
        console.error("Error setting up cross-scheduler drag:", error);
        return () => {};
      }
    };

    const cleanup = setupCrossSchedulerDrag();
    return cleanup;
  }, [leftScheduler, rightScheduler]);

  const leftRevision = revisions.find((r) => r.id === leftRevisionId);
  const rightRevision = revisions.find((r) => r.id === rightRevisionId);

  const getRevisionTitle = (revision: typeof leftRevision) => {
    if (!revision) return "";
    const typeLabels = {
      baseline:
        revision.source === "carefox"
          ? "Baseline (Carefox)"
          : revision.source === "slinga"
            ? "Baseline (Slinga)"
            : "Baseline (Manuell)",
      manual_edit: revision.createdBy
        ? `Manuellt (${revision.createdBy})`
        : "Manuellt redigerad",
      ai_optimized: "AI-optimerad",
    };
    return `Rev ${revision.number} - ${typeLabels[revision.type]}`;
  };

  const toggleLeftServiceArea = (areaId: string) => {
    const newSelected = new Set(leftServiceAreaIds);
    if (comparisonMode === "serviceAreas") {
      // In service area mode, only allow single selection
      newSelected.clear();
      newSelected.add(areaId);
    } else {
      // In revision mode, allow multi-select filtering
      if (newSelected.has(areaId)) {
        newSelected.delete(areaId);
      } else {
        newSelected.add(areaId);
      }
    }
    setLeftServiceAreaIds(newSelected);
  };

  const toggleRightServiceArea = (areaId: string) => {
    const newSelected = new Set(rightServiceAreaIds);
    if (comparisonMode === "serviceAreas") {
      // In service area mode, only allow single selection
      newSelected.clear();
      newSelected.add(areaId);
    } else {
      // In revision mode, allow multi-select filtering
      if (newSelected.has(areaId)) {
        newSelected.delete(areaId);
      } else {
        newSelected.add(areaId);
      }
    }
    setRightServiceAreaIds(newSelected);
  };

  // Get title for comparison header
  const getComparisonTitle = () => {
    if (comparisonMode === "revisions") {
      return "Jämför Revisioner";
    } else {
      return "Jämför Serviceområden";
    }
  };

  // Get label for left side
  const getLeftLabel = () => {
    if (comparisonMode === "revisions") {
      return leftRevision ? getRevisionTitle(leftRevision) : "";
    } else {
      const area = serviceAreas.find((a) => leftServiceAreaIds.has(a.id));
      return area ? area.name : "Välj område";
    }
  };

  // Get label for right side
  const getRightLabel = () => {
    if (comparisonMode === "revisions") {
      return rightRevision ? getRevisionTitle(rightRevision) : "";
    } else {
      const area = serviceAreas.find((a) => rightServiceAreaIds.has(a.id));
      return area ? area.name : "Välj område";
    }
  };

  // Render bottom section based on selection
  const renderBottomSection = (
    scheduler: SchedulerPro | undefined,
    side: "left" | "right",
    revision?: typeof leftRevision,
  ) => {
    if (bottomSection === "none") {
      return null;
    }

    if (bottomSection === "utilization") {
      return (
        <ResourceUtilization
          scheduler={scheduler}
          mode="comparison"
          visible={true}
        />
      );
    }

    if (bottomSection === "metrics" && scheduler) {
      return (
        <div className="scheduler-metrics">
          <MetricsPanel
            title={side === "left" ? getLeftLabel() : getRightLabel()}
            description={revision?.description || ""}
            scheduler={scheduler}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="comparison-view">
      <div
        className={`comparison-header ${settingsCollapsed ? "collapsed" : ""}`}
      >
        <div className="header-title-row">
          <h2>{getComparisonTitle()}</h2>
          <button
            className="collapse-toggle"
            onClick={() => setSettingsCollapsed(!settingsCollapsed)}
            title={
              settingsCollapsed ? "Visa inställningar" : "Dölj inställningar"
            }
          >
            <i
              className={`fa fa-chevron-${settingsCollapsed ? "down" : "up"}`}
            ></i>
            {settingsCollapsed ? "Visa inställningar" : "Dölj inställningar"}
          </button>
        </div>

        {!settingsCollapsed && (
          <>
            {/* Comparison Mode Selector */}
            <div className="comparison-mode-selector">
              <label>Jämför:</label>
              <button
                className={`mode-btn ${comparisonMode === "revisions" ? "active" : ""}`}
                onClick={() => {
                  setComparisonMode("revisions");
                  // Reset to show all service areas in revision mode
                  setLeftServiceAreaIds(new Set(serviceAreas.map((a) => a.id)));
                  setRightServiceAreaIds(
                    new Set(serviceAreas.map((a) => a.id)),
                  );
                  setBottomSection("metrics"); // Default to metrics for revisions
                }}
              >
                <i className="fa fa-code-branch"></i> Revisioner
              </button>
              <button
                className={`mode-btn ${comparisonMode === "serviceAreas" ? "active" : ""}`}
                onClick={() => {
                  setComparisonMode("serviceAreas");
                  // Set to first two service areas
                  setLeftServiceAreaIds(
                    new Set(serviceAreas.slice(0, 1).map((a) => a.id)),
                  );
                  setRightServiceAreaIds(
                    new Set(serviceAreas.slice(1, 2).map((a) => a.id)),
                  );
                  setBottomSection("utilization"); // Default to utilization for service areas
                }}
              >
                <i className="fa fa-map-marked-alt"></i> Serviceområden
              </button>
            </div>

            {/* Bottom Section Selector */}
            <div className="bottom-section-selector">
              <label>Visa under schema:</label>
              <button
                className={`section-btn ${bottomSection === "metrics" ? "active" : ""}`}
                onClick={() => setBottomSection("metrics")}
                title="Visa mätvärden och nyckeltal"
              >
                <i className="fa fa-chart-line"></i> Mätvärden
              </button>
              <button
                className={`section-btn ${bottomSection === "utilization" ? "active" : ""}`}
                onClick={() => setBottomSection("utilization")}
                title="Visa resursutnyttjande per timme"
              >
                <i className="fa fa-chart-bar"></i> Utnyttjande
              </button>
              <button
                className={`section-btn ${bottomSection === "none" ? "active" : ""}`}
                onClick={() => setBottomSection("none")}
                title="Visa inget under schema"
              >
                <i className="fa fa-eye-slash"></i> Inget
              </button>
            </div>

            {/* Revision/Area Selectors */}
            <div className="revision-selectors">
              {comparisonMode === "revisions" ? (
                <>
                  <div className="revision-selector">
                    <label>Vänster:</label>
                    <select
                      value={leftRevisionId}
                      onChange={(e) => setLeftRevisionId(e.target.value)}
                    >
                      {revisions.map((rev) => (
                        <option key={rev.id} value={rev.id}>
                          {getRevisionTitle(rev)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="vs-divider">vs</div>
                  <div className="revision-selector">
                    <label>Höger:</label>
                    <select
                      value={rightRevisionId}
                      onChange={(e) => setRightRevisionId(e.target.value)}
                    >
                      {revisions.map((rev) => (
                        <option key={rev.id} value={rev.id}>
                          {getRevisionTitle(rev)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="revision-selector">
                    <label>Vänster:</label>
                    <select
                      value={Array.from(leftServiceAreaIds)[0] || ""}
                      onChange={(e) => {
                        const newSelected = new Set<string>();
                        newSelected.add(e.target.value);
                        setLeftServiceAreaIds(newSelected);
                      }}
                    >
                      {serviceAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="vs-divider">vs</div>
                  <div className="revision-selector">
                    <label>Höger:</label>
                    <select
                      value={Array.from(rightServiceAreaIds)[0] || ""}
                      onChange={(e) => {
                        const newSelected = new Set<string>();
                        newSelected.add(e.target.value);
                        setRightServiceAreaIds(newSelected);
                      }}
                    >
                      {serviceAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="drag-hint">
              <i className="fa fa-info-circle"></i>
              Du kan dra besök och medarbetare mellan de två schemana
            </div>
          </>
        )}
      </div>

      <div className="comparison-content">
        <div className="comparison-scheduler left">
          <div className="scheduler-header">
            <h3>{getLeftLabel()}</h3>
            {comparisonMode === "revisions" && (
              <div className="service-area-filters">
                <span className="filter-label">Filter:</span>
                {serviceAreas.map((area) => (
                  <button
                    key={area.id}
                    className={`service-area-badge ${leftServiceAreaIds.has(area.id) ? "active" : ""}`}
                    style={{
                      backgroundColor: leftServiceAreaIds.has(area.id)
                        ? area.color
                        : "#e5e7eb",
                    }}
                    onClick={() => toggleLeftServiceArea(area.id)}
                    title={`${leftServiceAreaIds.has(area.id) ? "Dölj" : "Visa"} ${area.name}`}
                  >
                    {area.name.substring(0, 2).toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <BryntumSchedulerPro
            ref={leftSchedulerRef}
            cls="b-scheduler-pro b-comparison-scheduler"
            {...schedulerProps}
            project={leftProjectConfig}
            height="100%"
          />
          {renderBottomSection(leftScheduler, "left", leftRevision)}
        </div>

        <div className="comparison-scheduler right">
          <div className="scheduler-header">
            <h3>{getRightLabel()}</h3>
            {comparisonMode === "revisions" && (
              <div className="service-area-filters">
                <span className="filter-label">Filter:</span>
                {serviceAreas.map((area) => (
                  <button
                    key={area.id}
                    className={`service-area-badge ${rightServiceAreaIds.has(area.id) ? "active" : ""}`}
                    style={{
                      backgroundColor: rightServiceAreaIds.has(area.id)
                        ? area.color
                        : "#e5e7eb",
                    }}
                    onClick={() => toggleRightServiceArea(area.id)}
                    title={`${rightServiceAreaIds.has(area.id) ? "Dölj" : "Visa"} ${area.name}`}
                  >
                    {area.name.substring(0, 2).toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <BryntumSchedulerPro
            ref={rightSchedulerRef}
            cls="b-scheduler-pro b-comparison-scheduler"
            {...schedulerProps}
            project={rightProjectConfig}
            height="100%"
          />
          {renderBottomSection(rightScheduler, "right", rightRevision)}
        </div>
      </div>
    </div>
  );
}
