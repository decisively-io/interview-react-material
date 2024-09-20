import type { RenderableSwitchContainerControl } from "@decisively-io/interview-sdk";
import React from "react";
import { StyledControlsWrap } from "../Content";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

export interface SwitchContainerControlWidgetProps extends ControlWidgetProps<RenderableSwitchContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

const SwitchContainerControlWidget = (props: SwitchContainerControlWidgetProps) => {
  const { control, chOnScreenData, controlComponents, interviewProvider, className } = props;
  const { outcome_true, outcome_false, branch, condition, attribute } = control;

  const controls = (branch === "true" ? outcome_true : outcome_false) || [];

  /**
   * we want to override child controls in case we are rendering\
   * this control inside a nested one, and so control.attribute\
   * is smth like uuid1.0.uuid2, but for children we want to swap\
   * uuid2 for uuid of each child attribute
   */
  const mappedControls = React.useMemo(() => {
    if (attribute === undefined) return controls;

    const parentPathParts = attribute.split(attribute.includes("/") ? "/" : ".").slice(0, -1);
    if (!parentPathParts?.length) return controls;

    return controls.map((it) => {
      if (it.attribute === undefined) return it;

      if (it.attribute.startsWith(parentPathParts.join(".")) || it.attribute.startsWith(parentPathParts.join("/"))) {
        return it;
      }

      return { ...it, attribute: parentPathParts.concat(it.attribute).join(attribute.includes("/") ? "/" : ".") };
    });
  }, [controls, attribute]);

  return (
    <StyledControlsWrap
      data-id={control.id}
      data-loading={(control as any).loading ? "true" : undefined}
    >
      {mappedControls.length === 0
        ? null
        : mappedControls.map((value, controlIndex) => {
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
};

SwitchContainerControlWidget.displayName = `${DISPLAY_NAME_PREFIX}/SwitchContainer`;

export default SwitchContainerControlWidget;
