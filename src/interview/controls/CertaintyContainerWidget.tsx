import type { RenderableCertaintyContainerControl } from "@decisively-io/interview-sdk";
import React from "react";
import { StyledControlsWrap } from "../Content";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

export interface CertaintyContainerControlWidgetProps extends ControlWidgetProps<RenderableCertaintyContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

const CertaintyContainerControlWidget = React.memo((props: CertaintyContainerControlWidgetProps) => {
  const { control, chOnScreenData, controlComponents, interviewProvider, className } = props;
  const { certain, uncertain, branch } = control;

  const controls = branch === "certain" ? certain : uncertain;

  return (
    <StyledControlsWrap
      data-deci-id={control}
      data-deci-loading={(control as any).loading ? "true" : undefined}
    >
      {controls?.map((value, controlIndex) => {
        return (
          <RenderControl
            interviewProvider={interviewProvider}
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

export default CertaintyContainerControlWidget;
