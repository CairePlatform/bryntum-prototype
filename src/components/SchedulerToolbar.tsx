import { DateHelper, SchedulerPro, Toast } from "@bryntum/schedulerpro";
import {
  BryntumSchedulerPro,
  BryntumToolbar,
} from "@bryntum/schedulerpro-react";
import { forwardRef, RefObject, useCallback, useEffect, useState } from "react";

interface SchedulerToolbarProps {
  schedulerRef: RefObject<BryntumSchedulerPro>;
  toggleLayout: boolean;
  setToggleLayout: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenEmployeeManager?: () => void;
}

const SchedulerToolbar = forwardRef<BryntumToolbar, SchedulerToolbarProps>(
  (props, schedulerToolbarRef) => {
    // Some variables used in this demo
    const startHour = 7;
    const endHour = 20;

    // destructure props
    const {
      schedulerRef,
      toggleLayout,
      setToggleLayout,
      onOpenEmployeeManager,
    } = props;

    // Save scheduler instance for easy access
    const [scheduler, setScheduler] = useState<SchedulerPro>();

    useEffect(() => {
      setScheduler(schedulerRef.current!.instance);
    }, [schedulerRef]);

    const onSelect = useCallback(
      ({ record }: { record: any }) => {
        const value = record.value;
        const startDate = DateHelper.add(
          DateHelper.clearTime(scheduler!.startDate),
          startHour,
          "h",
        );
        const endDate = DateHelper.add(startDate, value - 1, "d");

        endDate.setHours(endHour);
        scheduler!.viewPreset = record.preset;
        scheduler!.setTimeSpan(startDate, endDate);

        // reset scroll
        scheduler!.scrollLeft = 0;
      },
      [scheduler],
    );

    const onShiftPrevious = useCallback(() => {
      scheduler!.shiftPrevious();
    }, [scheduler]);

    const onShiftNext = useCallback(() => {
      scheduler!.shiftNext();
    }, [scheduler]);

    const onClickToday = useCallback(() => {
      const startDate = DateHelper.clearTime(new Date());
      scheduler!.setTimeSpan(
        DateHelper.add(startDate, startHour, "h"),
        DateHelper.add(startDate, endHour, "h"),
      );
    }, [scheduler]);

    const onToggleLayout = useCallback(() => {
      setToggleLayout(!toggleLayout);
    }, [setToggleLayout, toggleLayout]);

    const onGroupChange = useCallback(
      ({ value }: any) => {
        if (!scheduler) return;
        if (value === "none") {
          scheduler.resourceStore.clearGroupers();
        } else {
          scheduler.resourceStore.group(value);
        }
      },
      [scheduler],
    );

    const onZoomIn = useCallback(() => {
      if (scheduler) {
        scheduler.zoomIn();
      }
    }, [scheduler]);

    const onZoomOut = useCallback(() => {
      if (scheduler) {
        scheduler.zoomOut();
      }
    }, [scheduler]);

    const onExportPDF = useCallback(() => {
      if (scheduler?.features.pdfExport) {
        scheduler.features.pdfExport.export({
          filename: `schema-${DateHelper.format(new Date(), "YYYY-MM-DD")}.pdf`,
        });
      }
    }, [scheduler]);

    const onExportExcel = useCallback(() => {
      if (scheduler?.features.excelExporter) {
        scheduler.features.excelExporter.export({
          filename: `schema-${DateHelper.format(new Date(), "YYYY-MM-DD")}.xlsx`,
        });
      }
    }, [scheduler]);

    const onPrint = useCallback(() => {
      if (scheduler?.features.print) {
        scheduler.features.print.print();
      }
    }, [scheduler]);

    return (
      <BryntumToolbar
        ref={schedulerToolbarRef}
        items={[
          {
            type: "combo",
            ref: "preset",
            editable: false,
            label: "Visa",
            value: 1,
            valueField: "value",
            displayField: "name",
            items: [
              {
                name: "1 dag",
                value: 1,
                preset: {
                  base: "hourAndDay",
                  tickWidth: 45,
                },
              },
              {
                name: "3 dagar",
                value: 3,
                preset: {
                  base: "dayAndWeek",
                },
              },
              {
                name: "1 vecka",
                value: 7,
                preset: {
                  base: "dayAndWeek",
                },
              },
            ],
            onSelect,
          },
          {
            type: "combo",
            editable: false,
            label: "👥 Gruppera",
            value: "none",
            width: 150,
            items: [
              { text: "Ingen", value: "none" },
              { text: "Roll", value: "role" },
              { text: "Kontrakt", value: "contractType" },
              { text: "Transport", value: "transportMode" },
            ],
            onChange: onGroupChange,
          },
          {
            type: "combo",
            editable: false,
            label: "👤 Roll",
            value: "all",
            width: 160,
            items: [
              { text: "Alla", value: "all" },
              { text: "Sjuksköterska", value: "Sjuksköterska" },
              { text: "Undersköterska", value: "Undersköterska" },
              { text: "Vårdbiträde", value: "Vårdbiträde" },
              { text: "Sjukgymnast", value: "Sjukgymnast" },
            ],
            onChange: ({ value }: any) => {
              if (value === "all") {
                scheduler?.resourceStore.removeFilter("role-filter");
              } else {
                scheduler?.resourceStore.filter({
                  id: "role-filter",
                  filterBy: (resource: any) => resource.role === value,
                });
              }
            },
          },
          "->",
          {
            type: "buttonGroup",
            items: [
              {
                icon: "b-icon fa-chevron-left",
                tooltip: "Föregående dag",
                onAction: onShiftPrevious,
              },
              {
                type: "button",
                text: "Idag",
                onAction: onClickToday,
              },
              {
                icon: "b-icon fa-chevron-right",
                tooltip: "Nästa dag",
                onAction: onShiftNext,
              },
            ],
          },
          // Filter buttons removed - now handled by clickable legend items
          // Histogram button removed - will be fixed later
          {
            type: "buttonGroup",
            items: [
              {
                icon: "fa fa-undo",
                tooltip: "Ångra",
                onAction: () => {
                  if (scheduler?.project) {
                    scheduler.project.stm.undo();
                  }
                },
              },
              {
                icon: "fa fa-redo",
                tooltip: "Gör om",
                onAction: () => {
                  if (scheduler?.project) {
                    scheduler.project.stm.redo();
                  }
                },
              },
            ],
          },
          {
            type: "button",
            icon: "fa fa-download",
            text: "Exportera",
            tooltip: "Exportera schema",
            menu: {
              items: [
                {
                  text: "PDF",
                  icon: "fa fa-file-pdf",
                  onItem: onExportPDF,
                },
                {
                  text: "Excel",
                  icon: "fa fa-file-excel",
                  onItem: onExportExcel,
                },
                {
                  text: "Skriv ut",
                  icon: "fa fa-print",
                  onItem: onPrint,
                },
              ],
            },
          },
          {
            icon: "fa fa-users-cog",
            text: "Medarbetare",
            tooltip: "Hantera medarbetare",
            onAction: onOpenEmployeeManager,
          },
        ]}
      />
    );
  },
);

SchedulerToolbar.displayName = "SchedulerToolbar";

export default SchedulerToolbar;
