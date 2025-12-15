import { ResourceModel } from "@bryntum/schedulerpro";
import { DateHelper } from "@bryntum/schedulerpro";

// Custom Doctor resource model, based on ResourceModel with additional fields
export class Doctor extends ResourceModel {
  declare role: string;
  declare roleIconCls: string;
  declare skillTags: string[];
  declare contractType: string;
  declare transportMode: string;
  declare serviceArea: string;
  declare serviceAreaId: string;
  declare serviceAreaName: string;
  declare serviceAreaColor: string;
  declare hourlyRate: number;
  declare rowExpanded: boolean;
  declare expandedRowHeight: number;
  declare maxCapacity: number;
  declare showCapacityLine: boolean;
  utilizationData?: number[];

  static fields = [
    "role",
    "roleIconCls",
    "skillTags",
    "contractType",
    "transportMode",
    "serviceArea",
    "serviceAreaId",
    "serviceAreaName",
    "serviceAreaColor",
    "hourlyRate",
    { name: "rowExpanded", defaultValue: false },
    { name: "expandedRowHeight", defaultValue: 180 },
    { name: "maxCapacity", defaultValue: 10 },
    { name: "showCapacityLine", defaultValue: true },
  ];

  toggleExpanded(value?: boolean) {
    const newValue = value != null ? value : !this.rowExpanded;
    this.rowExpanded = newValue;

    // Trigger scheduler refresh to update row height
    if (this.scheduler) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (this.scheduler) {
          this.scheduler.refresh();
        }
      });
    }
  }

  get rowHeight() {
    return this.rowExpanded ? this.expandedRowHeight : super.rowHeight;
  }

  set rowHeight(value) {
    super.rowHeight = value;
  }

  get cls() {
    return (super.cls || "") + (this.rowExpanded ? " b-row-expanded" : "");
  }

  set cls(value) {
    super.cls = value;
  }

  // Generate utilization data based on assigned events
  getUtilizationData(dateIntervals: any[]) {
    if (
      !this.scheduler ||
      !this.scheduler.assignmentStore ||
      !this.scheduler.eventStore
    ) {
      return dateIntervals.map(() => 0);
    }

    // If data length changed, recalculate
    if (
      !this.utilizationData ||
      this.utilizationData.length !== dateIntervals.length
    ) {
      try {
        const assignments = this.scheduler.assignmentStore.query(
          (a) => a.resourceId === this.id,
        );
        const events = assignments
          .map((a) => {
            try {
              return this.scheduler!.eventStore.getById(a.eventId);
            } catch {
              return null;
            }
          })
          .filter((e) => e != null);

        this.utilizationData = dateIntervals.map((tick) => {
          try {
            const tickStart = tick.startDate;
            const tickEnd = tick.endDate;

            // Count events overlapping with this time interval
            const eventsInInterval = events.filter((event) => {
              return event.startDate < tickEnd && event.endDate > tickStart;
            }).length;

            // Calculate utilization percentage (events / maxCapacity * 100)
            return Math.min(
              Math.round((eventsInInterval / (this.maxCapacity || 10)) * 100),
              100,
            );
          } catch {
            return 0;
          }
        });
      } catch {
        return dateIntervals.map(() => 0);
      }
    }

    return this.utilizationData || dateIntervals.map(() => 0);
  }
}
