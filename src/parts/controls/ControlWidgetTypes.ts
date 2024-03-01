import { AttributeData, Control } from "@decisively-io/interview-sdk";

export interface ControlWidgetProps<C extends Control> {
  control: C;
  chOnScreenData?: (data: AttributeData) => void;
}
