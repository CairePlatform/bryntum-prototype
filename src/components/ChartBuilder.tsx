import "./ChartBuilder.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useMemo, useState } from "react";

interface ChartBuilderProps {
  scheduler?: SchedulerPro;
}

type ChartType = "line" | "bar" | "area" | "pie";
type DataSource =
  | "capacity"
  | "demand"
  | "utilization"
  | "visits"
  | "travelTime";
type GroupBy = "hour" | "day" | "employee" | "serviceArea";

interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  dataSource: DataSource;
  groupBy: GroupBy;
  color?: string;
}

export function ChartBuilder({ scheduler }: ChartBuilderProps) {
  const [charts, setCharts] = useState<ChartConfig[]>([
    {
      id: "1",
      title: "Kapacitet över tid",
      type: "line",
      dataSource: "capacity",
      groupBy: "hour",
      color: "#3b82f6",
    },
  ]);
  const [selectedChart, setSelectedChart] = useState<string | null>("1");
  const [isAddingChart, setIsAddingChart] = useState(false);

  // Get available data sources
  const dataSources: Array<{ value: DataSource; label: string }> = [
    { value: "capacity", label: "Kapacitet" },
    { value: "demand", label: "Efterfrågan" },
    { value: "utilization", label: "Utnyttjande" },
    { value: "visits", label: "Antal besök" },
    { value: "travelTime", label: "Restid" },
  ];

  const chartTypes: Array<{ value: ChartType; label: string; icon: string }> = [
    { value: "line", label: "Linje", icon: "fa-chart-line" },
    { value: "bar", label: "Stapel", icon: "fa-chart-bar" },
    { value: "area", label: "Yta", icon: "fa-chart-area" },
    { value: "pie", label: "Cirkel", icon: "fa-chart-pie" },
  ];

  const groupByOptions: Array<{ value: GroupBy; label: string }> = [
    { value: "hour", label: "Per timme" },
    { value: "day", label: "Per dag" },
    { value: "employee", label: "Per medarbetare" },
    { value: "serviceArea", label: "Per serviceområde" },
  ];

  // Calculate chart data based on config
  const chartData = useMemo(() => {
    if (!scheduler || !selectedChart) return null;

    const config = charts.find((c) => c.id === selectedChart);
    if (!config) return null;

    // Check if stores exist and have records property
    if (
      !scheduler.resourceStore ||
      !scheduler.eventStore ||
      !scheduler.assignmentStore ||
      !scheduler.resourceStore.records ||
      !scheduler.eventStore.records
    ) {
      return null;
    }

    const resources = scheduler.resourceStore.records || [];
    const events = scheduler.eventStore.records || [];
    const startDate = scheduler.startDate;
    const endDate = scheduler.endDate;

    if (!startDate || !endDate) {
      return null;
    }

    if (config.groupBy === "hour") {
      const hours = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
      );
      const data: Array<{ label: string; value: number }> = [];

      for (let i = 0; i < hours; i++) {
        const slotStart = new Date(startDate.getTime() + i * 60 * 60 * 1000);
        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

        let value = 0;
        if (config.dataSource === "capacity") {
          value = resources.filter((r) => {
            try {
              const calendar = r.calendar;
              return calendar?.isWorkingTime?.(slotStart, slotEnd) || false;
            } catch {
              return false;
            }
          }).length;
        } else if (config.dataSource === "demand") {
          value = events.filter((e) => {
            try {
              return (
                e.startDate < slotEnd &&
                e.endDate > slotStart &&
                e.assignments?.length > 0
              );
            } catch {
              return false;
            }
          }).length;
        } else if (config.dataSource === "utilization") {
          const capacity = resources.filter((r) => {
            try {
              const calendar = r.calendar;
              return calendar?.isWorkingTime?.(slotStart, slotEnd) || false;
            } catch {
              return false;
            }
          }).length;
          const demand = events.filter((e) => {
            try {
              return (
                e.startDate < slotEnd &&
                e.endDate > slotStart &&
                e.assignments?.length > 0
              );
            } catch {
              return false;
            }
          }).length;
          value = capacity > 0 ? Math.round((demand / capacity) * 100) : 0;
        }

        data.push({
          label: slotStart.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value,
        });
      }

      return data;
    } else if (config.groupBy === "employee") {
      if (!scheduler.assignmentStore || !scheduler.eventStore) {
        return [];
      }
      return resources.map((resource) => {
        try {
          const assignments = scheduler.assignmentStore.query(
            (a) => a.resourceId === resource.id,
          );
          const resourceEvents = assignments
            .map((a) => {
              try {
                return scheduler.eventStore.getById(a.eventId);
              } catch {
                return null;
              }
            })
            .filter((e) => e != null);

          let value = 0;
          if (config.dataSource === "visits") {
            value = resourceEvents.length;
          } else if (config.dataSource === "travelTime") {
            // Calculate total travel time for this employee
            value = resourceEvents.reduce((sum, event) => {
              try {
                const postamble = (event as any).postamble;
                if (typeof postamble === "object" && postamble?.toMinutes) {
                  return sum + (postamble.toMinutes() || 0);
                } else if (typeof postamble === "number") {
                  return sum + postamble;
                }
              } catch {
                // Ignore errors
              }
              return sum;
            }, 0);
          }

          return {
            label: (resource as any).name || `Resource ${resource.id}`,
            value,
          };
        } catch {
          return {
            label: (resource as any).name || `Resource ${resource.id}`,
            value: 0,
          };
        }
      });
    }

    return [];
  }, [scheduler, selectedChart, charts]);

  // Show message if scheduler is not available
  if (!scheduler) {
    return (
      <div className="chart-builder">
        <div className="chart-builder-header">
          <h2>Skapa Diagram</h2>
          <p>Bygg anpassade diagram baserat på schemadata</p>
        </div>
        <div className="chart-builder-content">
          <div className="no-scheduler-message">
            <i className="fa fa-info-circle"></i>
            <p>
              Ingen scheduler tillgänglig. Gå tillbaka till Schema-vyn för att
              ladda data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const addChart = () => {
    const newChart: ChartConfig = {
      id: Date.now().toString(),
      title: "Ny diagram",
      type: "line",
      dataSource: "capacity",
      groupBy: "hour",
      color: "#3b82f6",
    };
    setCharts([...charts, newChart]);
    setSelectedChart(newChart.id);
    setIsAddingChart(false);
  };

  const updateChart = (id: string, updates: Partial<ChartConfig>) => {
    setCharts(charts.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteChart = (id: string) => {
    const newCharts = charts.filter((c) => c.id !== id);
    setCharts(newCharts);
    if (selectedChart === id) {
      setSelectedChart(newCharts.length > 0 ? newCharts[0].id : null);
    }
  };

  const selectedConfig = charts.find((c) => c.id === selectedChart);

  // If scheduler has charts feature, show instructions to use it
  if (scheduler?.features?.charts) {
    return (
      <div className="chart-builder">
        <div className="chart-builder-header">
          <h2>Skapa Diagram</h2>
          <p>Använd Bryntum Chart Builder för att skapa anpassade diagram</p>
        </div>
        <div className="chart-builder-content">
          <div className="bryntum-charts-info">
            <div className="info-card">
              <i className="fa fa-info-circle"></i>
              <h3>Bryntum Chart Builder</h3>
              <p>
                Klicka på knappen "Skapa diagram" i verktygsfältet för att öppna
                Bryntum's inbyggda diagrambyggare.
              </p>
              <p>Du kan skapa olika typer av diagram baserat på schemadata:</p>
              <ul>
                <li>Stapeldiagram (vertikalt/horisontellt)</li>
                <li>Linjediagram</li>
                <li>Cirkeldiagram</li>
                <li>Och mer...</li>
              </ul>
              <button
                className="open-charts-btn"
                onClick={() => {
                  scheduler.features.charts.openPopup();
                }}
              >
                <i className="fa fa-chart-bar"></i>
                Öppna Diagrambyggare
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if charts feature not available
  return (
    <div className="chart-builder">
      <div className="chart-builder-header">
        <h2>Skapa Diagram</h2>
        <p>Bygg anpassade diagram baserat på schemadata</p>
      </div>

      <div className="chart-builder-content">
        <div className="chart-list-panel">
          <div className="panel-header">
            <h3>Diagram</h3>
            <button
              className="add-chart-btn"
              onClick={() => setIsAddingChart(true)}
              title="Lägg till diagram"
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
          <div className="charts-list">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className={`chart-item ${
                  selectedChart === chart.id ? "active" : ""
                }`}
                onClick={() => setSelectedChart(chart.id)}
              >
                <div className="chart-item-header">
                  <i
                    className={`fa ${chartTypes.find((t) => t.value === chart.type)?.icon || "fa-chart-line"}`}
                  />
                  <span className="chart-title">{chart.title}</span>
                  <button
                    className="delete-chart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChart(chart.id);
                    }}
                    title="Ta bort diagram"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
                <div className="chart-item-meta">
                  <span className="data-source">
                    {dataSources.find((d) => d.value === chart.dataSource)
                      ?.label || chart.dataSource}
                  </span>
                  <span className="group-by">
                    {groupByOptions.find((g) => g.value === chart.groupBy)
                      ?.label || chart.groupBy}
                  </span>
                </div>
              </div>
            ))}
            {charts.length === 0 && (
              <div className="empty-state">
                <i className="fa fa-chart-line"></i>
                <p>Inga diagram ännu</p>
                <button onClick={addChart}>Skapa första diagrammet</button>
              </div>
            )}
          </div>
        </div>

        <div className="chart-config-panel">
          {selectedConfig ? (
            <>
              <div className="config-section">
                <h3>Diagraminställningar</h3>
                <div className="config-field">
                  <label>Titel</label>
                  <input
                    type="text"
                    value={selectedConfig.title}
                    onChange={(e) =>
                      updateChart(selectedChart!, { title: e.target.value })
                    }
                    placeholder="Diagramtitel"
                  />
                </div>
                <div className="config-field">
                  <label>Typ</label>
                  <div className="chart-type-selector">
                    {chartTypes.map((type) => (
                      <button
                        key={type.value}
                        className={`type-btn ${
                          selectedConfig.type === type.value ? "active" : ""
                        }`}
                        onClick={() =>
                          updateChart(selectedChart!, { type: type.value })
                        }
                        title={type.label}
                      >
                        <i className={`fa ${type.icon}`}></i>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="config-field">
                  <label>Datakälla</label>
                  <select
                    value={selectedConfig.dataSource}
                    onChange={(e) =>
                      updateChart(selectedChart!, {
                        dataSource: e.target.value as DataSource,
                      })
                    }
                  >
                    {dataSources.map((ds) => (
                      <option key={ds.value} value={ds.value}>
                        {ds.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="config-field">
                  <label>Gruppera efter</label>
                  <select
                    value={selectedConfig.groupBy}
                    onChange={(e) =>
                      updateChart(selectedChart!, {
                        groupBy: e.target.value as GroupBy,
                      })
                    }
                  >
                    {groupByOptions.map((gb) => (
                      <option key={gb.value} value={gb.value}>
                        {gb.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="config-field">
                  <label>Färg</label>
                  <input
                    type="color"
                    value={selectedConfig.color || "#3b82f6"}
                    onChange={(e) =>
                      updateChart(selectedChart!, { color: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="chart-preview-section">
                <h3>Förhandsgranskning</h3>
                {chartData && chartData.length > 0 ? (
                  <div className="chart-preview">
                    <div
                      className={`chart-visualization ${selectedConfig.type}`}
                    >
                      {selectedConfig.type === "bar" && (
                        <div className="bar-chart">
                          {chartData.map((point, idx) => {
                            const maxValue = Math.max(
                              ...chartData.map((d) => d.value),
                            );
                            return (
                              <div key={idx} className="bar-item">
                                <div
                                  className="bar"
                                  style={{
                                    height: `${(point.value / maxValue) * 100}%`,
                                    backgroundColor:
                                      selectedConfig.color || "#3b82f6",
                                  }}
                                  title={`${point.label}: ${point.value}`}
                                />
                                <div className="bar-label">
                                  {idx % 2 === 0 ? point.label : ""}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {selectedConfig.type === "line" && (
                        <div className="line-chart">
                          <svg viewBox="0 0 400 200" className="chart-svg">
                            <polyline
                              points={chartData
                                .map(
                                  (point, idx) =>
                                    `${(idx / (chartData.length - 1)) * 400},${
                                      200 -
                                      (point.value /
                                        Math.max(
                                          ...chartData.map((d) => d.value),
                                        )) *
                                        200
                                    }`,
                                )
                                .join(" ")}
                              fill="none"
                              stroke={selectedConfig.color || "#3b82f6"}
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      )}
                      {selectedConfig.type === "pie" && (
                        <div className="pie-chart">
                          <div className="pie-legend">
                            {chartData.slice(0, 5).map((point, idx) => (
                              <div key={idx} className="pie-legend-item">
                                <span
                                  className="legend-color"
                                  style={{
                                    backgroundColor:
                                      selectedConfig.color || "#3b82f6",
                                    opacity: 1 - idx * 0.15,
                                  }}
                                />
                                <span>
                                  {point.label}: {point.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="chart-stats">
                      <div className="stat">
                        <span className="stat-label">Max:</span>
                        <span className="stat-value">
                          {Math.max(...chartData.map((d) => d.value))}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Min:</span>
                        <span className="stat-value">
                          {Math.min(...chartData.map((d) => d.value))}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Medel:</span>
                        <span className="stat-value">
                          {Math.round(
                            chartData.reduce((sum, d) => sum + d.value, 0) /
                              chartData.length,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="preview-empty">
                    Ingen data tillgänglig för denna konfiguration
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <i className="fa fa-chart-line"></i>
              <p>Välj ett diagram för att redigera</p>
            </div>
          )}
        </div>
      </div>

      {isAddingChart && (
        <div className="add-chart-modal">
          <div className="modal-content">
            <h3>Skapa nytt diagram</h3>
            <p>Vill du skapa ett nytt diagram med standardinställningar?</p>
            <div className="modal-actions">
              <button onClick={addChart} className="btn-primary">
                Skapa
              </button>
              <button
                onClick={() => setIsAddingChart(false)}
                className="btn-secondary"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
