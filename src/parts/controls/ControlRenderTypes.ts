import { AttributeData, Control } from "@decisively-io/interview-sdk";

export interface ControlRenderProps<C extends Control> {
  control: C;
  chOnScreenData?: (data: AttributeData) => void;
}
