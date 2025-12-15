import "./ResourceUtilization.scss";

import type { SchedulerPro } from "@bryntum/schedulerpro";
import { useEffect, useRef } from "react";

interface ResourceUtilizationProps {
  scheduler?: SchedulerPro;
  mode: "timeline" | "comparison";
  visible: boolean;
}

export function ResourceUtilization({
  scheduler,
  mode,
  visible,
}: ResourceUtilizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!scheduler || !visible || !containerRef.current) {
      return;
    }

    // Dynamically import ResourceHistogram widget from Bryntum
    import("@bryntum/schedulerpro").then(({ ResourceHistogram }) => {
      try {
        // Clean up previous widget if it exists
        if (widgetRef.current) {
          widgetRef.current.destroy();
          widgetRef.current = null;
        }

        // Create ResourceHistogram widget (following Bryntum resourcehistogram example)
        const histogram = new ResourceHistogram({
          appendTo: containerRef.current,
          project: scheduler.project,
          partner: scheduler,
          height: mode === "comparison" ? 200 : 150,
          minHeight: 0,
          hideHeaders: true,
          showBarTip: true,
          showBarText: false,
          showMaxEffort: true,
          rowHeight: 40,
          columns: [
            {
              type: "resourceInfo",
              text: "Medarbetare",
              field: "name",
              width: 200,
              showEventCount: false,
              showImage: false,
            },
          ],
        });

        widgetRef.current = histogram;
      } catch (error) {
        console.error("Failed to create ResourceUtilization histogram:", error);
      }
    });

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying histogram:", error);
        }
        widgetRef.current = null;
      }
    };
  }, [scheduler, visible, mode]);

  if (!visible) return null;

  return (
    <div className={`resource-utilization ${mode}-mode`}>
      <div className="utilization-header">
        <h4>Resursutnyttjande</h4>
        <div className="utilization-legend">
          <span className="legend-item low">0-50%</span>
          <span className="legend-item medium">51-80%</span>
          <span className="legend-item high">81-100%</span>
          <span className="legend-item over">Över 100%</span>
        </div>
      </div>
      <div ref={containerRef} className="histogram-container"></div>
    </div>
  );
}
