import type { RenderableRepeatingContainerControl } from "@decisively-io/interview-sdk";
import clsx from "clsx";
import React from "react";
import { StyledControlsWrap } from "../Content";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

export interface RepeatingContainerControlWidgetProps extends ControlWidgetProps<RenderableRepeatingContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

const RepeatingContainerControlWidget = React.memo((props: RepeatingContainerControlWidgetProps) => {
  const { control, chOnScreenData, controlComponents, className } = props;
  const { controls } = control;
  const isTable = control?.display === "table";
  // if `isTable`; each container is one row - so the number of elements in control.controls is the number of columns
  const countCols = isTable ? controls?.length : null;
  const isFirstRow = control?.isFirst ?? false;
  const isLastRow = (control as any)?.isLast ?? false;
  const showHeaders = control?.showHeaders ?? true;
  const showBorders = control?.showBorders ?? true;
  const colHeaders = (() => {
    if (!isTable) {
      return null;
    }

    return controls?.map((ctrl) => (ctrl as any).columnHeading || "");
  })();
  const colWidths = (() => {
    if (!isTable) {
      return null;
    }

    return controls?.map((ctrl) => (ctrl as any).columnWidth || "");
  })();

  const colLayout = (() => {
    if (!isTable) {
      return {};
    }

    const widthsDefined = colWidths?.some((width) => !!(width || "")) ?? false;

    if (widthsDefined) {
      const widths = colWidths?.map((width) => (width ? `${width}px` : "1fr"));
      return {
        gridTemplateColumns: widths?.join(" "),
      };
    }

    return {
      gridTemplateColumns: `repeat(${countCols}, 1fr)`,
    };
  })();

  // console.log("====> repeating_container control", control);

  // -- rendering

  const renderHeaderRow = () => {
    if (
      !isFirstRow ||
      !isTable ||
      !colHeaders ||
      colHeaders.length === 0 ||
      colHeaders.length !== countCols ||
      !showHeaders
    ) {
      return null;
    }

    return colHeaders.map((header, index) => {
      return (
        <div
          key={index}
          className={clsx("header", { last: index === colHeaders.length - 1 })}
        >
          {header}
        </div>
      );
    });
  };

  return (
    <StyledControlsWrap
      className={clsx(
        className,
        { table: isTable },
        { borderless: isTable && !showBorders },
        { top_border: isTable && showBorders && !showHeaders && isFirstRow },
        { last_row: isLastRow },
      )}
      style={colLayout}
      data-id={control}
      data-loading={(control as any).loading ? "true" : undefined}
    >
      {renderHeaderRow()}
      {controls?.map((value, controlIndex) => {
        return (
          <RenderControl
            chOnScreenData={chOnScreenData}
            key={controlIndex}
            control={value}
            controlComponents={controlComponents}
          />
        );
      })}
    </StyledControlsWrap>
  );
});

RepeatingContainerControlWidget.displayName = `${DISPLAY_NAME_PREFIX}/RepeatingContainer`;

export default RepeatingContainerControlWidget;
