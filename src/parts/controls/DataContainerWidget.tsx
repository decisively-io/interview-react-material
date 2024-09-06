import type { RenderableControl, RenderableDataContainerControl } from "@decisively-io/interview-sdk";
import { Typography } from "@material-ui/core";
import React from "react";
import { Control } from "react-hook-form";
import styled from "styled-components";
import { StyledControlsWrap } from "../Content";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export interface DataContainerControlWidgetProps extends ControlWidgetProps<RenderableDataContainerControl> {
  controlComponents: ControlComponents;
}

const DataContainerControlWidget = (props: DataContainerControlWidgetProps) => {
  const { control, controlComponents } = props;

  const colNr = control.columns;
  const controls = control.controls ?? [];

  // const colData = (new Array(colNr)).fill(new Array()) as RenderableControl[][];
  const colData = [] as RenderableControl[][];
  for (let i = 0; i < colNr; i++) {
    colData.push([]);
  }
  for (let i = 0; i < controls.length; i++) {
    const col = i % colNr;
    colData[col].push(controls[i]);
  }

  return (
    <>
      {control.label ? <Typography variant="h5">{control.label}</Typography> : null}
      <ColumnWrapper>
        {colData.map((col, colIndex) => {
          return (
            <StyledControlsWrap
              data-id={control}
              data-loading={(control as any).loading ? "true" : undefined}
              key={colIndex}
            >
              {col.map((value, controlIndex) => {
                return (
                  <RenderControl
                    key={controlIndex}
                    control={value}
                    controlComponents={controlComponents}
                  />
                );
              })}
            </StyledControlsWrap>
          );
        })}
      </ColumnWrapper>
    </>
  );
};

export default DataContainerControlWidget;
