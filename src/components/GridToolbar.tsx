import { Grid } from "@bryntum/schedulerpro";
import { BryntumGrid, BryntumToolbar } from "@bryntum/schedulerpro-react";
import { RefObject, useCallback, useEffect, useState } from "react";

interface GridToolbarProps {
  gridRef?: RefObject<BryntumGrid>;
  onTogglePanel?: () => void;
}

const GridToolbar = (props: GridToolbarProps) => {
  const { gridRef, onTogglePanel } = props;

  const [grid, setGrid] = useState<Grid>();
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    setGrid(gridRef!.current!.instance);
  }, [gridRef]);

  const onToggleExpandCollapse = useCallback(() => {
    if (!grid) return;

    if (allExpanded) {
      grid.collapseAll();
      setAllExpanded(false);
    } else {
      grid.expandAll();
      setAllExpanded(true);
    }
  }, [grid, allExpanded]);

  return (
    <BryntumToolbar
      items={[
        {
          type: "widget",
          tag: "strong",
          html: "Oplanerade besök",
          flex: 1,
        },
        {
          type: "button",
          icon: allExpanded
            ? "fa fa-angle-double-up"
            : "fa fa-angle-double-down",
          ref: "toggle-expand-collapse",
          cls: "b-blue b-raised",
          text: allExpanded ? "Fäll ihop alla" : "Expandera alla",
          tooltip: allExpanded
            ? "Fäll ihop alla grupper"
            : "Expandera alla grupper",
          onClick: onToggleExpandCollapse,
        },
        {
          type: "button",
          icon: "fa fa-chevron-right",
          ref: "hide-panel",
          cls: "b-transparent",
          tooltip: "Dölj oplanerade besök",
          onClick: onTogglePanel,
        },
      ]}
    />
  );
};

export default GridToolbar;
