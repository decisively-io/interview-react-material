import type { RenderableSwitchContainerControl } from "@decisively-io/interview-sdk";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LOADING_ANIMATION_CSS } from "../../Constants";
import { StyledControlsWrap } from "../Content";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import EntityControlWidget from "./EntityControlWidget";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

export interface SwitchContainerControlWidgetProps extends ControlWidgetProps<RenderableSwitchContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

const SwitchContainerControlWidget = React.memo((props: SwitchContainerControlWidgetProps) => {
  const { control, chOnScreenData, controlComponents, className } = props;
  const { outcome_true, outcome_false, branch, condition } = control;

  const controls = branch === "true" ? outcome_true : outcome_false;

  return (
    <StyledControlsWrap data-id={control} data-loading={(control as any).loading ? "true" : undefined}>
      {controls?.map((value, controlIndex) => {
        return <RenderControl chOnScreenData={chOnScreenData} key={controlIndex} control={value} controlComponents={controlComponents} />;
      })}
    </StyledControlsWrap>
  );
});

SwitchContainerControlWidget.displayName = `${DISPLAY_NAME_PREFIX}/SwitchContainer`;

export default SwitchContainerControlWidget;
