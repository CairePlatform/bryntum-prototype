import "./WebSocketProgress.scss";

import { useEffect, useRef, useState } from "react";

interface WebSocketProgressProps {
  jobId?: string;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

export function WebSocketProgress({
  jobId,
  onComplete,
  onError,
}: WebSocketProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "connecting" | "running" | "completed" | "failed"
  >("connecting");
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId) return;

    // In real app, connect to WebSocket endpoint
    // const wsUrl = `wss://api.caire.se/ws/optimization/${jobId}`;
    // For prototype, simulate WebSocket with polling
    const simulateWebSocket = () => {
      setStatus("connecting");
      setMessage("Ansluter till optimeringsserver...");

      // Simulate connection delay
      setTimeout(() => {
        setStatus("running");
        setMessage("Optimerar schema...");

        // Simulate progress updates
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 10;
          if (currentProgress >= 100) {
            currentProgress = 100;
            setProgress(100);
            setStatus("completed");
            setMessage("Optimering klar!");
            clearInterval(interval);

            if (onComplete) {
              onComplete({
                jobId,
                status: "completed",
                newRevisionId: "rev-4",
              });
            }
          } else {
            setProgress(Math.round(currentProgress));
            setMessage(
              `Optimerar... ${Math.round(currentProgress)}% (${Math.round(currentProgress * 0.18)} sekunder)`,
            );
          }
        }, 500);
      }, 1000);
    };

    simulateWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [jobId, onComplete]);

  if (!jobId) return null;

  return (
    <div className="websocket-progress">
      <div className="progress-header">
        <h3>Optimeringsstatus</h3>
        <div className={`status-badge ${status}`}>
          {status === "connecting" && "Ansluter..."}
          {status === "running" && "Körs"}
          {status === "completed" && "Klar"}
          {status === "failed" && "Misslyckades"}
        </div>
      </div>
      <div className="progress-content">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              backgroundColor:
                status === "completed"
                  ? "#10b981"
                  : status === "failed"
                    ? "#dc2626"
                    : "#3b82f6",
            }}
          />
        </div>
        <div className="progress-text">
          <span className="progress-percentage">{progress}%</span>
          <span className="progress-message">{message}</span>
        </div>
      </div>
    </div>
  );
}
