import type { Control, RenderableControlType } from "@decisively-io/interview-sdk";
import React from "react";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import type { ControlComponents } from "./index";

const NAME_MAP: Omit<Record<RenderableControlType, keyof ControlComponents>, "document" | "interview_container"> = {
  boolean: "Boolean",
  currency: "Currency",
  date: "Date",
  datetime: "DateTime",
  entity: "Entity",
  image: "Image",
  number_of_instances: "NumberOfInstances",
  options: "Options",
  text: "Text",
  time: "Time",
  typography: "Typography",
  switch_container: "SwitchContainer",
  certainty_container: "CertaintyContainer",
  repeating_container: "RepeatingContainer",
  interview_container: "InterviewContainer",
  file: "File",
  data_container: "DataContainer",
  generative_chat: "GenerativeChat",
};

export interface RenderControlProps extends ControlWidgetProps<Control> {
  controlComponents: ControlComponents;
}

const RenderControl = (props: RenderControlProps) => {
  const { control, chOnScreenData, controlComponents, interviewProvider } = props;
  // @ts-ignore
  const component = controlComponents[NAME_MAP[control.type]];
  if (!component) {
    console.error(`[@decisively-io/interview-react-material] Control type "${control.type}" is not supported`);
    return null;
  }

  return React.createElement(component as any, {
    control,
    controlComponents,
    chOnScreenData,
    interviewProvider,
  });
};

export default RenderControl;
