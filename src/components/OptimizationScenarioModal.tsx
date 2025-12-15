import "./OptimizationScenarioModal.scss";

import { useCallback, useState } from "react";

export interface OptimizationScenario {
  id: string;
  name: string;
  shortName: string;
  description: string;
  whenToUse: string;
  icon: string;
  color: string;
  weights: {
    travelTime: number;
    continuity: number;
    workloadBalance: number;
    overtime: number;
    unusedHoursRecapture: number;
  };
  constraints: {
    respectPinnedVisits: boolean;
    respectTimeWindows: boolean;
    respectSkills: boolean;
    allowOvertime: boolean;
    maxOvertimeMinutes: number;
  };
  estimatedDuration: string;
  recommended?: boolean;
  isCustom?: boolean;
}

const defaultScenarios: OptimizationScenario[] = [
  {
    id: "scenario-a",
    name: "Daglig Planering",
    shortName: "Standard",
    description:
      "Optimerar dagens schema med fokus på att minimera restid och respektera befintliga slingor. Låsta besök flyttas inte.",
    whenToUse:
      "Använd för vanliga dagar när schemat huvudsakligen följer etablerade mönster med få ändringar.",
    icon: "fa-calendar-check",
    color: "#3b82f6",
    weights: {
      travelTime: 80,
      continuity: 90,
      workloadBalance: 70,
      overtime: 50,
      unusedHoursRecapture: 40,
    },
    constraints: {
      respectPinnedVisits: true,
      respectTimeWindows: true,
      respectSkills: true,
      allowOvertime: false,
      maxOvertimeMinutes: 0,
    },
    estimatedDuration: "30-60 sek",
    recommended: true,
  },
  {
    id: "scenario-b",
    name: "Nya Klienter (Pre-planering)",
    shortName: "Tillväxt",
    description:
      "Placerar nya klienter och rörliga besök i befintliga slingor utan att störa låsta mönster. Balanserar arbetsbelastning mellan personal.",
    whenToUse:
      "Använd vid introduktion av nya klienter eller när flera rörliga besök behöver placeras optimalt.",
    icon: "fa-user-plus",
    color: "#10b981",
    weights: {
      travelTime: 70,
      continuity: 60,
      workloadBalance: 90,
      overtime: 60,
      unusedHoursRecapture: 50,
    },
    constraints: {
      respectPinnedVisits: true,
      respectTimeWindows: true,
      respectSkills: true,
      allowOvertime: true,
      maxOvertimeMinutes: 30,
    },
    estimatedDuration: "1-2 min",
  },
  {
    id: "scenario-c",
    name: "Störningshantering (Kaos)",
    shortName: "Akut",
    description:
      "Snabb omplanering vid sjukfrånvaro, avbokningar eller akuta behov. Prioriterar att lösa dagens problem med minimal störning.",
    whenToUse:
      "Använd vid oväntade händelser: personal sjuk, klient avbokar, akut besök tillkommer.",
    icon: "fa-bolt",
    color: "#f59e0b",
    weights: {
      travelTime: 60,
      continuity: 40,
      workloadBalance: 50,
      overtime: 30,
      unusedHoursRecapture: 80,
    },
    constraints: {
      respectPinnedVisits: false,
      respectTimeWindows: true,
      respectSkills: true,
      allowOvertime: true,
      maxOvertimeMinutes: 60,
    },
    estimatedDuration: "15-30 sek",
  },
  {
    id: "scenario-continuity",
    name: "Kontinuitetsfokus",
    shortName: "Kontinuitet",
    description:
      "Maximerar kontinuitet så att klienter träffar samma personal. Accepterar längre restider för stabilare relationer.",
    whenToUse:
      "Använd för demensklienter eller andra som kräver hög kontinuitet och trygghet.",
    icon: "fa-heart",
    color: "#8b5cf6",
    weights: {
      travelTime: 40,
      continuity: 100,
      workloadBalance: 60,
      overtime: 50,
      unusedHoursRecapture: 30,
    },
    constraints: {
      respectPinnedVisits: true,
      respectTimeWindows: true,
      respectSkills: true,
      allowOvertime: false,
      maxOvertimeMinutes: 0,
    },
    estimatedDuration: "1-2 min",
  },
  {
    id: "scenario-efficiency",
    name: "Maximal Effektivitet",
    shortName: "Effektiv",
    description:
      "Minimerar restid och väntetid till absolut minimum. Kan omfördela besök mellan personal för bästa resultat.",
    whenToUse:
      "Använd vid kapacitetsbrist eller när organisationen behöver maximera servicetid per skifttimme.",
    icon: "fa-rocket",
    color: "#ef4444",
    weights: {
      travelTime: 100,
      continuity: 30,
      workloadBalance: 80,
      overtime: 70,
      unusedHoursRecapture: 90,
    },
    constraints: {
      respectPinnedVisits: false,
      respectTimeWindows: true,
      respectSkills: true,
      allowOvertime: true,
      maxOvertimeMinutes: 45,
    },
    estimatedDuration: "2-3 min",
  },
  {
    id: "scenario-custom",
    name: "Anpassad",
    shortName: "Anpassad",
    description:
      "Skapa ditt eget scenario med helt anpassade vikter och begränsningar. Börja från scratch eller basera på ett annat scenario.",
    whenToUse:
      "Använd när inget fördefinierat scenario passar dina behov, eller för experimentering.",
    icon: "fa-cog",
    color: "#64748b",
    weights: {
      travelTime: 50,
      continuity: 50,
      workloadBalance: 50,
      overtime: 50,
      unusedHoursRecapture: 50,
    },
    constraints: {
      respectPinnedVisits: true,
      respectTimeWindows: true,
      respectSkills: true,
      allowOvertime: false,
      maxOvertimeMinutes: 30,
    },
    estimatedDuration: "Varierar",
    isCustom: true,
  },
];

export interface OptimizationScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOptimization: (scenario: OptimizationScenario) => void;
  currentRevisionName: string;
}

// Deep clone helper
const cloneScenario = (scenario: OptimizationScenario): OptimizationScenario =>
  JSON.parse(JSON.stringify(scenario));

export function OptimizationScenarioModal({
  isOpen,
  onClose,
  onStartOptimization,
  currentRevisionName,
}: OptimizationScenarioModalProps) {
  // Store modified scenarios (key = scenario id, value = modified scenario)
  const [modifiedScenarios, setModifiedScenarios] = useState<
    Record<string, OptimizationScenario>
  >({});

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    defaultScenarios.find((s) => s.recommended)?.id || defaultScenarios[0].id,
  );
  const [showDetails, setShowDetails] = useState(false);

  // Get current scenario (modified or default)
  const getScenario = useCallback(
    (id: string): OptimizationScenario => {
      if (modifiedScenarios[id]) {
        return modifiedScenarios[id];
      }
      return defaultScenarios.find((s) => s.id === id) || defaultScenarios[0];
    },
    [modifiedScenarios],
  );

  const selectedScenario = getScenario(selectedScenarioId);

  // Check if scenario has been modified
  const isModified = (id: string): boolean => {
    return !!modifiedScenarios[id];
  };

  // Update scenario settings
  const updateScenario = useCallback(
    (updates: Partial<OptimizationScenario>) => {
      const baseScenario =
        modifiedScenarios[selectedScenarioId] ||
        cloneScenario(
          defaultScenarios.find((s) => s.id === selectedScenarioId)!,
        );

      const updatedScenario = {
        ...baseScenario,
        ...updates,
        weights: {
          ...baseScenario.weights,
          ...(updates.weights || {}),
        },
        constraints: {
          ...baseScenario.constraints,
          ...(updates.constraints || {}),
        },
      };

      setModifiedScenarios((prev) => ({
        ...prev,
        [selectedScenarioId]: updatedScenario,
      }));
    },
    [selectedScenarioId, modifiedScenarios],
  );

  // Reset scenario to defaults
  const resetScenario = useCallback(() => {
    setModifiedScenarios((prev) => {
      const { [selectedScenarioId]: _, ...rest } = prev;
      return rest;
    });
  }, [selectedScenarioId]);

  // Copy settings from another scenario
  const copyFromScenario = useCallback(
    (sourceId: string) => {
      const sourceScenario = getScenario(sourceId);
      const targetScenario = getScenario(selectedScenarioId);

      const copiedScenario = {
        ...targetScenario,
        weights: { ...sourceScenario.weights },
        constraints: { ...sourceScenario.constraints },
      };

      setModifiedScenarios((prev) => ({
        ...prev,
        [selectedScenarioId]: copiedScenario,
      }));
    },
    [selectedScenarioId, getScenario],
  );

  if (!isOpen) return null;

  const handleStartOptimization = () => {
    onStartOptimization(selectedScenario);
    onClose();
  };

  // Editable weight slider
  const EditableWeightBar = ({
    label,
    value,
    color,
    weightKey,
  }: {
    label: string;
    value: number;
    color: string;
    weightKey: keyof OptimizationScenario["weights"];
  }) => (
    <div className="weight-bar editable">
      <div className="weight-label">
        <span>{label}</span>
        <span className="weight-value">{value}%</span>
      </div>
      <div className="weight-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) =>
            updateScenario({
              weights: { [weightKey]: Number(e.target.value) },
            })
          }
          className="weight-slider"
          style={
            {
              "--slider-color": color,
              "--slider-percent": `${value}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );

  // Editable constraint toggle
  const EditableConstraint = ({
    label,
    checked,
    constraintKey,
    showOvertimeInput,
  }: {
    label: string;
    checked: boolean;
    constraintKey: keyof OptimizationScenario["constraints"];
    showOvertimeInput?: boolean;
  }) => (
    <li className={`editable ${checked ? "enabled" : "disabled"}`}>
      <label className="constraint-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            updateScenario({
              constraints: { [constraintKey]: e.target.checked },
            })
          }
        />
        <span className="toggle-switch"></span>
        <span className="constraint-label">{label}</span>
      </label>
      {showOvertimeInput && checked && (
        <div className="overtime-input">
          <span>Max:</span>
          <input
            type="number"
            min="0"
            max="180"
            step="15"
            value={selectedScenario.constraints.maxOvertimeMinutes}
            onChange={(e) =>
              updateScenario({
                constraints: { maxOvertimeMinutes: Number(e.target.value) },
              })
            }
          />
          <span>min</span>
        </div>
      )}
    </li>
  );

  return (
    <div className="optimization-modal-overlay" onClick={onClose}>
      <div className="optimization-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <i className="fa fa-magic header-icon"></i>
            <div>
              <h2>Välj Optimeringsscenario</h2>
              <p className="subtitle">
                Optimerar: <strong>{currentRevisionName}</strong>
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Stäng">
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="scenarios-grid">
            {defaultScenarios.map((scenario) => {
              const currentScenario = getScenario(scenario.id);
              const modified = isModified(scenario.id);

              return (
                <div
                  key={scenario.id}
                  className={`scenario-card ${selectedScenarioId === scenario.id ? "selected" : ""} ${scenario.recommended ? "recommended" : ""} ${scenario.isCustom ? "custom" : ""} ${modified ? "modified" : ""}`}
                  onClick={() => {
                    setSelectedScenarioId(scenario.id);
                    // Auto-expand details for custom scenario
                    if (scenario.isCustom) {
                      setShowDetails(true);
                    }
                  }}
                  style={
                    {
                      "--scenario-color": currentScenario.color,
                    } as React.CSSProperties
                  }
                >
                  {scenario.recommended && (
                    <div className="recommended-badge">
                      <i className="fa fa-star"></i> Rekommenderad
                    </div>
                  )}
                  {modified && !scenario.isCustom && (
                    <div className="modified-badge">
                      <i className="fa fa-pencil-alt"></i> Anpassad
                    </div>
                  )}
                  {scenario.isCustom && (
                    <div className="custom-badge">
                      <i className="fa fa-cog"></i> Eget scenario
                    </div>
                  )}
                  <div className="card-header">
                    <div
                      className="scenario-icon"
                      style={{ backgroundColor: currentScenario.color }}
                    >
                      <i className={`fa ${scenario.icon}`}></i>
                    </div>
                    <div className="scenario-title">
                      <h3>{scenario.name}</h3>
                      <span className="duration">
                        <i className="fa fa-clock"></i>{" "}
                        {currentScenario.estimatedDuration}
                      </span>
                    </div>
                  </div>
                  <p className="scenario-description">{scenario.description}</p>
                  <div className="when-to-use">
                    <i className="fa fa-lightbulb"></i>
                    <span>{scenario.whenToUse}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedScenario && (
            <div className="scenario-details">
              <div className="details-header">
                <button
                  className="toggle-details-btn"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <i
                    className={`fa fa-chevron-${showDetails ? "up" : "down"}`}
                  ></i>
                  {showDetails
                    ? "Dölj inställningar"
                    : "Visa & redigera inställningar"}{" "}
                  för <strong>{selectedScenario.name}</strong>
                </button>

                {showDetails && (
                  <div className="details-actions">
                    {isModified(selectedScenarioId) && (
                      <button
                        className="reset-btn"
                        onClick={resetScenario}
                        title="Återställ till standardvärden"
                      >
                        <i className="fa fa-undo"></i> Återställ
                      </button>
                    )}
                    {selectedScenario.isCustom && (
                      <div className="copy-from-dropdown">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              copyFromScenario(e.target.value);
                              e.target.value = "";
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            📋 Kopiera från...
                          </option>
                          {defaultScenarios
                            .filter((s) => !s.isCustom)
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showDetails && (
                <div className="details-content">
                  <div className="edit-hint">
                    <i className="fa fa-info-circle"></i>
                    <span>
                      Dra reglagen eller klicka på växlarna för att justera
                      inställningarna. Ändringar sparas automatiskt för denna
                      session.
                    </span>
                  </div>

                  <div className="details-grid">
                    <div className="weights-section">
                      <h4>
                        <i className="fa fa-sliders-h"></i> Vikter
                      </h4>
                      <p className="section-hint">
                        Dra reglagen för att justera prioriteringen
                      </p>
                      <div className="weights-list">
                        <EditableWeightBar
                          label="Minimera restid"
                          value={selectedScenario.weights.travelTime}
                          color="#3b82f6"
                          weightKey="travelTime"
                        />
                        <EditableWeightBar
                          label="Kontinuitet"
                          value={selectedScenario.weights.continuity}
                          color="#8b5cf6"
                          weightKey="continuity"
                        />
                        <EditableWeightBar
                          label="Jämn arbetsbelastning"
                          value={selectedScenario.weights.workloadBalance}
                          color="#10b981"
                          weightKey="workloadBalance"
                        />
                        <EditableWeightBar
                          label="Undvik övertid"
                          value={selectedScenario.weights.overtime}
                          color="#f59e0b"
                          weightKey="overtime"
                        />
                        <EditableWeightBar
                          label="Återvinn outnyttjad tid"
                          value={selectedScenario.weights.unusedHoursRecapture}
                          color="#ef4444"
                          weightKey="unusedHoursRecapture"
                        />
                      </div>
                    </div>

                    <div className="constraints-section">
                      <h4>
                        <i className="fa fa-lock"></i> Begränsningar
                      </h4>
                      <p className="section-hint">
                        Klicka på växlarna för att aktivera/inaktivera
                      </p>
                      <ul className="constraints-list">
                        <EditableConstraint
                          label="Respektera låsta besök"
                          checked={
                            selectedScenario.constraints.respectPinnedVisits
                          }
                          constraintKey="respectPinnedVisits"
                        />
                        <EditableConstraint
                          label="Respektera tidsfönster"
                          checked={
                            selectedScenario.constraints.respectTimeWindows
                          }
                          constraintKey="respectTimeWindows"
                        />
                        <EditableConstraint
                          label="Matcha kompetenskrav"
                          checked={selectedScenario.constraints.respectSkills}
                          constraintKey="respectSkills"
                        />
                        <EditableConstraint
                          label="Tillåt övertid"
                          checked={selectedScenario.constraints.allowOvertime}
                          constraintKey="allowOvertime"
                          showOvertimeInput={true}
                        />
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <i className="fa fa-info-circle"></i>
            <span>
              Optimeringen skapar en ny revision som du kan granska innan
              publicering
            </span>
          </div>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={onClose}>
              Avbryt
            </button>
            <button
              className="start-btn"
              onClick={handleStartOptimization}
              disabled={!selectedScenario}
              style={
                selectedScenario
                  ? { backgroundColor: selectedScenario.color }
                  : undefined
              }
            >
              <i className="fa fa-play"></i>
              Starta Optimering
              {selectedScenario && (
                <span className="scenario-badge">
                  {isModified(selectedScenarioId)
                    ? `${selectedScenario.shortName}*`
                    : selectedScenario.shortName}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
