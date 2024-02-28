import { Control } from "@decisively-io/interview-sdk";
import React from "react";
import { ControlRenderProps } from "./ControlRenderTypes";
import { ControlComponents } from "./index";

const NAME_MAP: Record<string, keyof ControlComponents> = {
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
};

export interface RenderControlProps extends ControlRenderProps<Control> {
  controlComponents: ControlComponents;
}

const RenderControl = (props: RenderControlProps) => {
  const { control, chOnScreenData, controlComponents } = props;
  const component = controlComponents[NAME_MAP[control.type]];
  if (!component) {
    console.error(`[@decisively-io/interview-react-material] Control type "${control.type}" is not supported`);
    return null;
  }

  return React.createElement(component as any, {
    control,
    controlComponents,
    chOnScreenData,
  });
};

export default RenderControl;
