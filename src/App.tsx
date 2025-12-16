import "./App.scss";
import "./lib/UtilizationChart"; // Register the chart widget

import {
  Grid,
  SchedulerPro,
  SchedulerResourceModel,
} from "@bryntum/schedulerpro";
import {
  BryntumGrid,
  BryntumSchedulerPro,
  BryntumToolbar,
} from "@bryntum/schedulerpro-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { gridProps, projectConfig, schedulerProps } from "./AppConfig";
import { ChartBuilder } from "./components/ChartBuilder";
import { ComparisonView } from "./components/ComparisonView";
import { EmbeddedChart } from "./components/EmbeddedChart";
import { EmployeeManager } from "./components/EmployeeManager";
import GridToolbar from "./components/GridToolbar";
import { LegendAndFiltering } from "./components/LegendAndFiltering";
import { MetricsPanel } from "./components/MetricsPanel";
import { type AppMode, ModeButtons } from "./components/ModeButtons";
import {
  type OptimizationScenario,
  OptimizationScenarioModal,
} from "./components/OptimizationScenarioModal";
import { ResourceUtilization } from "./components/ResourceUtilization";
import { RouteSummary } from "./components/RouteSummary";
import { ScenarioHeader } from "./components/ScenarioHeader";
import SchedulerToolbar from "./components/SchedulerToolbar";
import { TreeSummaryHeatmap } from "./components/TreeSummaryHeatmap";
import { WebSocketProgress } from "./components/WebSocketProgress";
import { Appointment } from "./lib/Appointment";
import { Doctor } from "./lib/Doctor";
import { Drag } from "./lib/Drag";
import { MapView } from "./views/MapView";

function App() {
  const gridRef = useRef<BryntumGrid>(null);
  const schedulerRef = useRef<BryntumSchedulerPro>(null);
  const dragRef = useRef<Drag>(null);
  const schedulerToolbarRef = useRef<BryntumToolbar>(null);
  const isSettingUpGridStore = useRef(false);

  const [grid, setGrid] = useState<Grid>();
  const [scheduler, setScheduler] = useState<SchedulerPro>();
  const [toggleLayout, setToggleLayout] = useState(false);
  const [activeMode, setActiveMode] = useState<AppMode>("timeline");
  const [showUnplannedPanel, setShowUnplannedPanel] = useState(false);
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);
  const [showEmployeeManager, setShowEmployeeManager] = useState(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationJobId, setOptimizationJobId] = useState<string | null>(
    null,
  );
  const [currentOptimizationScenario, setCurrentOptimizationScenario] =
    useState<OptimizationScenario | null>(null);
  const [rowHeight, setRowHeight] = useState(95); // Default row height
  const [optimizationScenarios, setOptimizationScenarios] = useState<OptimizationScenario[]>([]);

  // Service area state
  const [serviceAreas] = useState([
    { id: "area-1", name: "Västra", color: "#3b82f6" },
    { id: "area-2", name: "Östra", color: "#10b981" },
    { id: "area-3", name: "Södra", color: "#f59e0b" },
  ]);
  const [selectedServiceAreaIds, setSelectedServiceAreaIds] = useState<
    Set<string>
  >(() => new Set(serviceAreas.map((a) => a.id)));

  // Mock revisions data (in real app, fetched from API)
  // Each revision maps to a different JSON file in /data/
  const [currentRevisionId, setCurrentRevisionId] = useState("rev-1");
  const [revisions] = useState([
    {
      id: "rev-1",
      number: 1,
      type: "baseline" as const,
      source: "carefox" as const,
      createdAt: "2025-12-04T06:00:00",
      description: "Original schema importerad från Carefox",
    },
    {
      id: "rev-2",
      number: 2,
      type: "ai_optimized" as const,
      createdAt: "2025-12-04T09:15:00",
      description: "AI-optimerad: -5-10 min tidigare start, kortare restider",
    },
    {
      id: "rev-3",
      number: 3,
      type: "manual_edit" as const,
      createdBy: "Anna",
      createdAt: "2025-12-04T09:30:00",
      description: "Manuellt justerad: omfördelade besök, ändrade tider",
    },
  ]);

  const currentRevision =
    revisions.find((r) => r.id === currentRevisionId) || revisions[0];

  useEffect(() => {
    const schedulerInstance = schedulerRef.current?.instance;
    const gridInstance = gridRef.current?.instance;

    if (schedulerInstance) {
      // Check if scheduler instance is fully initialized
      if (
        typeof schedulerInstance.refresh !== "function" ||
        typeof schedulerInstance.on !== "function"
      ) {
        // Scheduler not fully initialized yet, skip
        return;
      }

      setScheduler(schedulerInstance);

      // Import and register UtilizationChart, then add to timeAxis column
      // Following embedded-chart example pattern
      import("./lib/UtilizationChart").then(({ UtilizationChart }) => {
        // Wait for scheduler to be fully painted
        const addChartWidget = () => {
          try {
            // Verify scheduler instance is still valid
            if (
              !schedulerInstance ||
              typeof schedulerInstance.refresh !== "function"
            ) {
              return;
            }

            // Find the timeAxis column (it's automatically added by Bryntum)
            const timeAxisColumn = schedulerInstance.columns?.find(
              (col: any) => col.type === "timeAxis",
            );

            if (timeAxisColumn) {
              // Configure widgets array and afterRenderCell like the example
              if (!timeAxisColumn.widgets) {
                timeAxisColumn.widgets = [
                  {
                    type: UtilizationChart.type,
                  },
                ];
              }

              // Set afterRenderCell callback (like example line 65-70)
              timeAxisColumn.afterRenderCell = ({
                record,
                grid: scheduler,
                widgets,
              }: any) => {
                if (
                  widgets &&
                  widgets[0] &&
                  typeof widgets[0].refresh === "function"
                ) {
                  try {
                    widgets[0].refresh({
                      record,
                      timeAxisViewModel: scheduler?.timeAxisViewModel,
                    });
                  } catch (err) {
                    console.warn("Error refreshing chart widget:", err);
                  }
                }
              };

              // Force refresh to apply changes
              if (typeof schedulerInstance.refresh === "function") {
                schedulerInstance.refresh();
              }
              console.log("Chart widget configured on timeAxis column");
            } else {
              console.warn("timeAxis column not found - will retry on paint");
            }
          } catch (err) {
            console.error("Error configuring chart widget:", err);
          }
        };

        // Try immediately if columns are available, otherwise wait for paint
        if (schedulerInstance.columns && schedulerInstance.columns.length > 0) {
          // Use setTimeout to ensure scheduler is fully initialized
          setTimeout(addChartWidget, 100);
        } else {
          // Check if on method exists before calling
          if (schedulerInstance && typeof schedulerInstance.on === "function") {
            schedulerInstance.on({
              paint: () => {
                setTimeout(addChartWidget, 100);
              },
              once: true,
            });
          }
        }
      });
    }

    if (gridInstance) {
      setGrid(gridInstance);
    }
  }, [gridRef, schedulerRef]);

  // Refresh scheduler when switching back to timeline mode
  useEffect(() => {
    if (
      activeMode === "timeline" &&
      scheduler &&
      typeof scheduler.refresh === "function"
    ) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (scheduler && typeof scheduler.refresh === "function") {
          scheduler.refresh();
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeMode, scheduler]);

  // Setup chained store when grid and scheduler are available
  // Use a separate effect that runs after panel expansion to ensure grid is mounted
  useEffect(() => {
    if (!showUnplannedPanel) {
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let assignmentChangeHandler: (() => void) | null = null;
    let gridInstance: any = null;
    let schedulerInstance: any = null;

    // Wait for grid to be available (it might not be mounted immediately)
    const setupGridStore = () => {
      gridInstance = gridRef.current?.instance;
      schedulerInstance = schedulerRef.current?.instance;

      if (!schedulerInstance || !gridInstance) {
        // Retry after a short delay if grid isn't ready yet
        timeoutId = setTimeout(setupGridStore, 50);
        return;
      }

      const { project } = schedulerInstance;

      // Set flag to prevent selection change events during setup
      isSettingUpGridStore.current = true;

      try {
        // Create a chained version of the event store as our store.
        // It will be filtered to only display events that lack of assignments.
        const chainedStore = (gridInstance.store = project.eventStore.chain(
          (eventRecord: Appointment) => {
            // Check assignmentStore to see if this event has any assignments
            const assignments = project.assignmentStore.query(
              (assignment) => assignment.eventId === eventRecord.id,
            );
            return assignments.length === 0;
          },
          undefined,
          {
            groupers: [
              {
                field: "requiredRole",
                ascending: true,
              },
            ],
          },
        ));

        // Fill the chained store from master immediately
        chainedStore.fillFromMaster();

        // Log for debugging
        console.log("📋 Unplanned grid setup:", {
          totalEvents: project.eventStore.count,
          unassignedCount: chainedStore.count,
          gridInstance: !!gridInstance,
        });

        // When assignments change, update our chained store to reflect the changes.
        assignmentChangeHandler = () => {
          chainedStore.fillFromMaster();
          if (gridInstance) {
            gridInstance.refresh();
          }
        };

        project.assignmentStore.on({
          change: assignmentChangeHandler,
          thisObj: gridInstance,
        });

        // Recreate Drag instance if needed
        if (!(dragRef as Drag).current) {
          (dragRef as Drag).current = new Drag({
            grid: gridInstance,
            schedule: schedulerInstance,
            constrain: false,
            outerElement: gridInstance.element,
          });
        }
      } finally {
        // Clear flag after setup is complete
        isSettingUpGridStore.current = false;
      }

      // Force grid refresh to show the data (after flag is cleared)
      requestAnimationFrame(() => {
        if (gridInstance) {
          gridInstance.refresh();
          // Also try scrolling to ensure visibility
          const chainedStore = gridInstance.store;
          if (chainedStore && chainedStore.count > 0) {
            gridInstance.scrollRowIntoView(0);
          }
        }
      });
    };

    // Start setup with a small delay to ensure DOM is ready
    timeoutId = setTimeout(setupGridStore, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (assignmentChangeHandler && schedulerInstance && gridInstance) {
        schedulerInstance.project.assignmentStore.un({
          change: assignmentChangeHandler,
          thisObj: gridInstance,
        });
      }
    };
  }, [showUnplannedPanel]);

  // We need to destroy Drag instance because React 18 Strict mode
  // runs this component twice in development mode and Drag has no
  // UI so it is not destroyed automatically as grid and scheduler.
  useEffect(() => {
    return () => (dragRef as Drag).current?.destroy?.();
  }, [dragRef]);

  const onSchedulerSelectionChange = useCallback(() => {
    const selectedRecords = scheduler!
      .selectedRecords as SchedulerResourceModel[];
    const { calendarHighlight } = scheduler!.features;
    if (selectedRecords.length > 0) {
      calendarHighlight.highlightResourceCalendars(selectedRecords);
    } else {
      calendarHighlight.unhighlightCalendars();
    }
  }, [scheduler]);

  const onGridSelectionChange = useCallback(() => {
    // Skip if we're in the middle of setting up the store
    if (isSettingUpGridStore.current) {
      return;
    }

    // Get grid from ref if state is not available
    const gridInstance = grid || gridRef.current?.instance;
    const schedulerInstance = scheduler || schedulerRef.current?.instance;

    if (!gridInstance || !schedulerInstance) {
      return;
    }

    const selectedRecords = gridInstance.selectedRecords as Appointment[];
    const { calendarHighlight } = schedulerInstance.features;
    const requiredRoles: Record<string, number> = {};

    selectedRecords.forEach(
      (appointment: Appointment) =>
        (requiredRoles[appointment.requiredRole as string] = 1),
    );

    if (Object.keys(requiredRoles).length === 1) {
      const appointment = selectedRecords[0] as Appointment;
      const availableResources = schedulerInstance.resourceStore.query(
        (doctor: Doctor) =>
          doctor.role === appointment.requiredRole || !appointment.requiredRole,
      ) as SchedulerResourceModel[];
      calendarHighlight.highlightResourceCalendars(availableResources);
    } else {
      calendarHighlight.unhighlightCalendars();
    }
  }, [grid, scheduler]);

  const handleAddEmployee = useCallback(
    (employee: any) => {
      scheduler?.resourceStore.add(employee);
    },
    [scheduler],
  );

  const handleUpdateEmployee = useCallback(
    (employee: any) => {
      const record = scheduler?.resourceStore.getById(employee.id);
      if (record) {
        record.set(employee);
      }
    },
    [scheduler],
  );

  const handleDeleteEmployee = useCallback(
    (id: number) => {
      const record = scheduler?.resourceStore.getById(id);
      if (record) {
        scheduler?.resourceStore.remove(record);
      }
    },
    [scheduler],
  );

  // Current schedule metrics - State to hold fetched metrics
  const [currentMetrics, setCurrentMetrics] = useState({
    serviceHours: 0,
    travelMinutes: 0,
    waitingMinutes: 0,
    utilization: 0,
    pinnedVisits: 0,
    unplanned: 0,
  });

  // Fetch metrics and scenarios on mount
  useEffect(() => {
    // Load metrics
    fetch("/data/2.0/mockup_metrics.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Loaded mockup metrics");
        // Access the first metric entry if it's an array, or the object itself
        const rawData = Array.isArray(data) ? data[0] : data;
        // Check if wrapped in scheduleMetrics property (mockup_metrics.json format)
        const metricsData = rawData.scheduleMetrics || rawData;

        // Map backend metrics format to UI metrics format
        setCurrentMetrics({
          serviceHours: metricsData.serviceHours || 0,
          travelMinutes: Math.round((metricsData.travelTimeSeconds || 0) / 60),
          waitingMinutes: Math.round((metricsData.waitingTimeSeconds || 0) / 60),
          utilization: (metricsData.utilizationPercentage || 0) / 100,
          pinnedVisits: 0, // Not in mockup_metrics.json usually
          unplanned: metricsData.unassignedVisits || 0,
        });
      })
      .catch((err) => console.error("Failed to load metrics:", err));

    // Load scenarios
    fetch("/data/2.0/mockup_scenarios.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Loaded mockup scenarios");
        if (data && data.scenarios) {
          setOptimizationScenarios(data.scenarios);
        }
      })
      .catch((err) => console.error("Failed to load scenarios:", err));
  }, []);

  // Map revision IDs to new 2.0 data files
  const revisionDataFiles: Record<string, string> = {
    "rev-1": "/data/2.0/mockup_data.json", // Baseline
    "rev-2": "/data/2.0/mockup_data_optimized.json", // Optimized
    "rev-3": "/data/2.0/mockup_data_optimized.json", // Manual (using optimized as base for now)
  };

  const loadRevisionData = useCallback(
    async (revisionId: string) => {
      if (!scheduler) return;

      const dataFile = revisionDataFiles[revisionId];
      if (!dataFile) {
        console.warn(`No data file for revision: ${revisionId}`);
        return;
      }

      try {
        console.log(`📦 Loading revision data: ${dataFile}`);
        const response = await fetch(dataFile);
        const data = await response.json();

        // Load new data into project
        if (scheduler.project) {
          await scheduler.project.loadCrudManagerData(data);
        }

        // Add service area data to loaded resources and events
        scheduler.resourceStore.forEach((resource: any, index: number) => {
          const areaIndex = index % serviceAreas.length;
          const area = serviceAreas[areaIndex];
          resource.serviceAreaId = area.id;
          resource.serviceAreaName = area.name;
          resource.serviceAreaColor = area.color;
        });

        scheduler.eventStore.forEach((event: any, index: number) => {
          const areaIndex = index % serviceAreas.length;
          const area = serviceAreas[areaIndex];
          event.serviceAreaId = area.id;
          event.serviceAreaName = area.name;
          event.serviceAreaColor = area.color;
        });

        // Recreate chained store for unplanned grid if panel is visible
        if (grid && showUnplannedPanel) {
          const chainedStore = (grid.store = scheduler.project.eventStore.chain(
            (eventRecord: Appointment) => {
              // Check assignmentStore to see if this event has any assignments
              const assignments = scheduler.project.assignmentStore.query(
                (assignment) => assignment.eventId === eventRecord.id,
              );
              return assignments.length === 0;
            },
            undefined,
            {
              groupers: [{ field: "requiredRole", ascending: true }],
            },
          ));
          chainedStore.fillFromMaster();
          grid.refresh();
        }

        scheduler.refresh();
        console.log(`✅ Loaded revision ${revisionId}`);
      } catch (error) {
        console.error(`Failed to load revision data:`, error);
      }
    },
    [scheduler, grid, showUnplannedPanel, serviceAreas],
  );

  const handleRevisionChange = useCallback(
    (revisionId: string) => {
      if (hasUnsavedChanges) {
        if (confirm("Du har osparade ändringar. Byta revision ändå?")) {
          setCurrentRevisionId(revisionId);
          setHasUnsavedChanges(false);
          loadRevisionData(revisionId);
        }
      } else {
        setCurrentRevisionId(revisionId);
        loadRevisionData(revisionId);
      }
    },
    [hasUnsavedChanges, loadRevisionData],
  );

  const handleSave = useCallback(() => {
    // In real app: send changes to backend, create new revision
    console.log("Saving changes and creating new revision...");
    setHasUnsavedChanges(false);
    // Mock: Show toast notification
    alert("Revision 4 skapad! (I real app: save to backend)");
  }, []);

  const handleVisitServiceAreaChange = useCallback(
    (visitId: string, newServiceAreaId: string) => {
      // Update visit's service area when moved to a different area
      if (!scheduler) return;

      const event = scheduler.eventStore.getById(visitId);
      if (event) {
        const newArea = serviceAreas.find((a) => a.id === newServiceAreaId);
        if (newArea) {
          event.serviceAreaId = newArea.id;
          event.serviceAreaName = newArea.name;
          event.serviceAreaColor = newArea.color;
          setHasUnsavedChanges(true);

          console.log("✅ Visit service area changed:", {
            visitId,
            newServiceAreaId,
            newAreaName: newArea.name,
          });
        }
      }
    },
    [scheduler, serviceAreas],
  );

  const handleOptimize = useCallback(() => {
    // Open the scenario selection modal
    setShowOptimizationModal(true);
  }, []);

  const handleStartOptimization = useCallback(
    (scenario: OptimizationScenario) => {
      // In real app: start optimization job with selected scenario
      console.log("Starting optimization with scenario:", scenario.name);
      console.log("Scenario weights:", scenario.weights);
      console.log("Scenario constraints:", scenario.constraints);

      setCurrentOptimizationScenario(scenario);
      setIsOptimizing(true);
      setOptimizationProgress(0);
      // Generate a mock job ID
      const jobId = `job-${Date.now()}`;
      setOptimizationJobId(jobId);
    },
    [],
  );

  const handleOptimizationComplete = useCallback(
    (result: any) => {
      setIsOptimizing(false);
      setCurrentOptimizationScenario(null);
      setOptimizationJobId(null);
      alert(
        `✅ Revision 4 (${currentOptimizationScenario?.shortName || "Optimerad"}) klar!\n\nScenario: ${currentOptimizationScenario?.name || "Okänt"}\nTid: ${currentOptimizationScenario?.estimatedDuration || "N/A"}\n\n(I real app: load new revision from Timefold)`,
      );
    },
    [currentOptimizationScenario],
  );

  const handleCompare = useCallback(() => {
    // In real app: open comparison view with multi-select
    console.log("Opening comparison view...");
    alert("Jämför-vy (I real app: multi-select revisions + split screen)");
  }, []);

  const handleUnplannedPanelToggle = useCallback(() => {
    setShowUnplannedPanel((prev) => !prev);
  }, []);

  const handleRowHeightChange = useCallback(
    (height: number) => {
      setRowHeight(height);
      if (scheduler) {
        scheduler.rowHeight = height;
      }
    },
    [scheduler],
  );

  const getRevisionTitle = (revision: typeof currentRevision) => {
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

  const getRevisionDescription = (revision: typeof currentRevision) => {
    return revision.description || "Ingen beskrivning";
  };

  const revisionTitle = getRevisionTitle(currentRevision);
  const revisionDescription = getRevisionDescription(currentRevision);

  // Get current data for views
  const currentVisits =
    scheduler?.eventStore?.records.map((event) => ({
      id: event.id,
      patient: (event as Appointment).patient,
      address: (event as Appointment).address,
      startDate: event.startDate,
      travelMinutes: (event as Appointment).travelMinutes,
    })) || [];

  const currentEmployees =
    scheduler?.resourceStore?.records.map((resource) => ({
      id: resource.id,
      name: resource.name,
      role: (resource as Doctor).role,
    })) || [];

  // Render different modes
  const renderMode = () => {
    switch (activeMode) {
      case "timeline":
        return (
          <div id="content" className="demo-app caire-layout">
            <div className="scheduler-container">
              <SchedulerToolbar
                ref={schedulerToolbarRef}
                schedulerRef={schedulerRef}
                toggleLayout={toggleLayout}
                setToggleLayout={setToggleLayout}
                onOpenEmployeeManager={() => setShowEmployeeManager(true)}
              />
              <LegendAndFiltering
                rowHeight={rowHeight}
                onRowHeightChange={handleRowHeightChange}
                scheduler={scheduler}
                serviceAreas={serviceAreas}
                selectedServiceAreaIds={selectedServiceAreaIds}
                onServiceAreaFilterChange={setSelectedServiceAreaIds}
              />
              <BryntumSchedulerPro
                ref={schedulerRef}
                cls="b-scheduler-pro"
                {...schedulerProps}
                project={projectConfig}
                onSelectionChange={onSchedulerSelectionChange}
                rowHeight={rowHeight}
                onPaint={() => {
                  // Ensure scheduler state is set when component paints
                  const instance = schedulerRef.current?.instance;
                  if (
                    instance &&
                    typeof instance.refresh === "function" &&
                    !scheduler
                  ) {
                    setScheduler(instance);
                  }
                }}
              />
              {/* ResourceUtilization histogram temporarily removed - will be fixed later */}
              {/* Embedded charts now shown inside rows when expanded - no need for separate container */}
            </div>
            {showUnplannedPanel ? (
              <div className="grid-container">
                <GridToolbar
                  gridRef={gridRef}
                  onTogglePanel={() => setShowUnplannedPanel(false)}
                />
                <BryntumGrid
                  ref={gridRef}
                  cls="b-unplanned-grid"
                  {...gridProps}
                  onSelectionChange={onGridSelectionChange}
                />
              </div>
            ) : (
              <div className="grid-container-collapsed">
                <button
                  className="panel-expand-btn unplanned-expand"
                  onClick={handleUnplannedPanelToggle}
                  title="Visa oplanerade besök"
                >
                  <i className="fa fa-chevron-right"></i>
                  <span>Oplanerade</span>
                </button>
              </div>
            )}
            {showInsightsPanel ? (
              <div className="insights-panel">
                <div className="panel-header">
                  <h3>Statistik & Rutter</h3>
                  <button
                    className="collapse-btn"
                    onClick={() => setShowInsightsPanel(false)}
                    title="Dölj panel"
                  >
                    <i className="fa fa-chevron-right"></i>
                  </button>
                </div>
                <div className="insights-panel-content">
                  <MetricsPanel
                    title={revisionTitle}
                    description={revisionDescription}
                    scheduler={scheduler}
                    metrics={currentMetrics}
                  />
                  <RouteSummary scheduler={scheduler} />
                </div>
              </div>
            ) : (
              <div className="insights-panel-collapsed">
                <button
                  className="panel-expand-btn insights-expand"
                  onClick={() => setShowInsightsPanel(true)}
                  title="Visa statistik & rutter"
                >
                  <i className="fa fa-chevron-left"></i>
                  <span>Statistik</span>
                </button>
              </div>
            )}
          </div>
        );

      case "map":
        return (
          <MapView
            visits={currentVisits}
            employees={currentEmployees}
            scheduler={scheduler}
          />
        );

      case "comparison":
        return (
          <ComparisonView
            scheduler={scheduler}
            revisions={revisions}
            serviceAreas={serviceAreas}
            onRevisionChange={handleRevisionChange}
          />
        );

      case "analysis":
        // Wait for scheduler to be available
        if (!scheduler) {
          return (
            <div className="analysis-view">
              <div className="analysis-loading">
                <p>Laddar analysdata...</p>
              </div>
            </div>
          );
        }

        return (
          <div className="analysis-view">
            <div className="analysis-header">
              <h2>Analysvy</h2>
              <div className="analysis-explanation">
                <p>
                  <strong>Vad visar denna sida?</strong>
                </p>
                <ul>
                  <li>
                    <strong>Kapacitet:</strong> Antal tillgängliga medarbetare
                    per timme (blå stapeldiagram)
                  </li>
                  <li>
                    <strong>Efterfrågan:</strong> Antal planerade besök per
                    timme (lila stapeldiagram)
                  </li>
                  <li>
                    <strong>Utnyttjande:</strong> Procentuell utnyttjande av
                    kapacitet (grön/orange/röd beroende på belastning)
                  </li>
                  <li>
                    <strong>Besöksdensitet:</strong> Heatmap som visar antal
                    besök per medarbetare per timme (ljusblå = få besök, mörkblå
                    = många besök)
                  </li>
                </ul>
                <div className="tip">
                  💡 <strong>Tips:</strong>
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    <li>
                      I Schema-vyn: Klicka på expandera-knappen (▼) i varje
                      medarbetarrad för att visa utnyttjandediagram direkt i
                      raden
                    </li>
                    <li>
                      Gå till "Diagram"-läget för att använda Bryntum Chart
                      Builder (baserat på{" "}
                      <a
                        href="https://bryntum.com/products/schedulerpro/examples-scheduler/charts/"
                        target="_blank"
                        rel="noopener"
                      >
                        charts example
                      </a>
                      )
                    </li>
                    <li>
                      Heatmap använder Bryntum's treeSummary feature (baserat på{" "}
                      <a
                        href="https://bryntum.com/products/schedulerpro/examples/tree-summary-heatmap/"
                        target="_blank"
                        rel="noopener"
                      >
                        tree-summary-heatmap example
                      </a>
                      )
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="analysis-content">
              <div className="analysis-charts">
                <EmbeddedChart scheduler={scheduler} type="capacity" />
                <EmbeddedChart scheduler={scheduler} type="demand" />
                <EmbeddedChart scheduler={scheduler} type="utilization" />
              </div>
              <div className="analysis-heatmap-info">
                <p>
                  <strong>Besöksdensitet:</strong> Heatmap visas direkt i
                  schemat när du aktiverar "treeSummary" feature. Växla tillbaka
                  till Schema-vyn för att se heatmap i varje cell.
                </p>
                <p>
                  Heatmap använder Bryntum's treeSummary feature (baserat på{" "}
                  <a
                    href="https://bryntum.com/products/schedulerpro/examples/tree-summary-heatmap/"
                    target="_blank"
                    rel="noopener"
                  >
                    tree-summary-heatmap example
                  </a>
                  ).
                </p>
              </div>
            </div>
          </div>
        );

      case "charts":
        // Wait for scheduler to be available
        if (!scheduler) {
          return (
            <div className="chart-builder">
              <div className="chart-builder-header">
                <h2>Skapa Diagram</h2>
                <p>Laddar schemadata...</p>
              </div>
            </div>
          );
        }
        return <ChartBuilder scheduler={scheduler} />;

      default:
        return null;
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-content">
        <ScenarioHeader
          currentRevision={currentRevision}
          revisions={revisions}
          onRevisionChange={handleRevisionChange}
          onSave={handleSave}
          onOptimize={handleOptimize}
          onCompare={handleCompare}
          hasUnsavedChanges={hasUnsavedChanges}
          isOptimizing={isOptimizing}
          optimizationProgress={optimizationProgress}
        />
        <ModeButtons activeMode={activeMode} onModeChange={setActiveMode} />
        <div
          className={
            activeMode === "analysis" || activeMode === "charts"
              ? "mode-view-scrollable"
              : ""
          }
        >
          {renderMode()}
        </div>
        {showEmployeeManager && scheduler && (
          <EmployeeManager
            onClose={() => setShowEmployeeManager(false)}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            employees={scheduler.resourceStore.records}
          />
        )}
        <OptimizationScenarioModal
          isOpen={showOptimizationModal}
          onClose={() => setShowOptimizationModal(false)}
          onStartOptimization={handleStartOptimization}
          currentRevisionName={getRevisionTitle(currentRevision)}
        />
        {isOptimizing && optimizationJobId && (
          <div className="optimization-progress-overlay">
            <div className="optimization-progress-modal">
              <div
                className="scenario-icon"
                style={{
                  backgroundColor:
                    currentOptimizationScenario?.color || "#3b82f6",
                }}
              >
                <i
                  className={`fa ${currentOptimizationScenario?.icon || "fa-cog"}`}
                ></i>
              </div>
              <h3>
                Optimerar med{" "}
                {currentOptimizationScenario?.name || "Standard scenario"}
              </h3>
              <WebSocketProgress
                jobId={optimizationJobId}
                onComplete={handleOptimizationComplete}
                onError={(error) => {
                  console.error("Optimization error:", error);
                  setIsOptimizing(false);
                  setOptimizationJobId(null);
                }}
              />
              <p className="progress-hint">
                Beräknad tid:{" "}
                {currentOptimizationScenario?.estimatedDuration || "2-3 min"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
