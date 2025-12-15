import { DateHelper, StringHelper, Widget } from "@bryntum/schedulerpro";

// Custom Chart widget for showing utilization inside expanded rows
// Simple SVG-based chart since Chart class is not available in npm package
export class UtilizationChart extends Widget {
  static $name = "UtilizationChart";
  static type = "utilizationchart";

  static configurable = {
    tag: "div",
    cls: "b-utilization-chart",
    height: "100px",
  };

  refresh({
    record,
    timeAxisViewModel,
  }: {
    record: any;
    timeAxisViewModel: any;
  }) {
    if (!record || !record.rowExpanded || !timeAxisViewModel) {
      if (this.element) {
        this.element.innerHTML = "";
        this.element.style.display = "none";
      }
      return;
    }

    if (!this.element) {
      return;
    }

    this.element.style.display = "block";
    this.element.ariaLabel = `Diagram visar utnyttjande för ${record.name || "medarbetare"}`;

    const { timeAxis } = timeAxisViewModel;
    const utilizationData = record.getUtilizationData
      ? record.getUtilizationData(timeAxis.records || [])
      : [];

    if (utilizationData.length === 0) {
      this.element.innerHTML = "";
      return;
    }

    const maxValue = Math.max(
      ...utilizationData,
      record.maxCapacity || 10,
      100,
    );
    const chartHeight = 80;
    const chartWidth = timeAxisViewModel.totalSize || 1000;
    const stepWidth = chartWidth / Math.max(utilizationData.length, 1);
    const padding = 10;

    // Build SVG chart
    let svgPath = "";
    let areaPath = "";
    const points: Array<{ x: number; y: number }> = [];

    utilizationData.forEach((value: number, index: number) => {
      const x = index * stepWidth + padding;
      const y =
        chartHeight -
        (value / maxValue) * (chartHeight - padding * 2) +
        padding;
      points.push({ x, y });

      if (index === 0) {
        svgPath += `M ${x} ${y}`;
        areaPath += `M ${x} ${chartHeight - padding}`;
        areaPath += ` L ${x} ${y}`;
      } else {
        svgPath += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }
    });

    // Close area path
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      areaPath += ` L ${lastPoint.x} ${chartHeight - padding} Z`;
    }

    // Capacity line
    let capacityLine = "";
    if (record.showCapacityLine && record.maxCapacity) {
      const capacityY =
        chartHeight -
        (record.maxCapacity / maxValue) * (chartHeight - padding * 2) +
        padding;
      capacityLine = `<line x1="${padding}" y1="${capacityY}" x2="${chartWidth - padding}" y2="${capacityY}" 
        stroke="#10b981" stroke-width="2" stroke-dasharray="5,5" opacity="0.8" />`;
    }

    // Time labels
    const labels: string[] = [];
    timeAxis.forEach((tick: any, index: number) => {
      if (index % 6 === 0 && tick.startDate) {
        labels.push(
          `<text x="${index * stepWidth + padding}" y="${chartHeight + 15}" 
            font-size="10" fill="#6b7280" text-anchor="middle">
            ${DateHelper.format(tick.startDate, "HH:mm")}
          </text>`,
        );
      }
    });

    this.element.innerHTML = `
      <svg width="${chartWidth}" height="${chartHeight + 25}" style="display: block;">
        <!-- Area fill -->
        <path d="${areaPath}" fill="#3b82f611" stroke="none" />
        <!-- Line -->
        <path d="${svgPath}" fill="none" stroke="#3b82f6" stroke-width="2" />
        <!-- Capacity line -->
        ${capacityLine}
        <!-- Labels -->
        ${labels.join("")}
      </svg>
    `;

    // Set width to match timeAxis
    this.width = `${chartWidth}px`;
  }
}

// Register this widget type
UtilizationChart.initClass();
