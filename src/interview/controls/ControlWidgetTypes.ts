import type { AttributeValues, Control, InterviewProvider } from "@decisively-io/interview-sdk";

export interface ControlWidgetProps<C extends Control> {
  control: C;
  chOnScreenData?: (data: AttributeValues) => void;
  interviewProvider: InterviewProvider;
}
