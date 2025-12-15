import "./ScenarioHeader.scss";

import { HeartHandshake } from "lucide-react";

import { type Revision, RevisionSelector } from "./RevisionSelector";

export interface ScenarioHeaderProps {
  currentRevision: Revision;
  revisions: Revision[];
  onRevisionChange: (revisionId: string) => void;
  onSave: () => void;
  onOptimize: () => void;
  onCompare: () => void;
  hasUnsavedChanges?: boolean;
  isOptimizing?: boolean;
  optimizationProgress?: number;
}

export function ScenarioHeader({
  currentRevision,
  revisions,
  onRevisionChange,
  onSave,
  onOptimize,
  onCompare,
  hasUnsavedChanges,
  isOptimizing,
  optimizationProgress,
}: ScenarioHeaderProps) {
  return (
    <header className="scenario-header">
      <div className="header-content">
        <div className="title-section">
          <div className="branding">
            <div className="caire-logo">
              <HeartHandshake className="h-10 w-10 text-white" />
            </div>
            <div className="brand-text">
              <h1>CAIRE Scheduling</h1>
              <p className="subtitle">Hemtjänst Schemaläggning</p>
            </div>
          </div>
          <p className="description">10 medarbetare, 60 besök, 30 klienter.</p>
        </div>
        <RevisionSelector
          currentRevision={currentRevision}
          revisions={revisions}
          onRevisionChange={onRevisionChange}
          onSave={onSave}
          onOptimize={onOptimize}
          onCompare={onCompare}
          hasUnsavedChanges={hasUnsavedChanges}
          isOptimizing={isOptimizing}
          optimizationProgress={optimizationProgress}
        />
      </div>
    </header>
  );
}
