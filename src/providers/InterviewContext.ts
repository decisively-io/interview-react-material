import type { ControlsValue, SessionInstance } from "@decisively-io/interview-sdk";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { InterviewState } from "../interview/InterviewStateType";

export interface InterviewContextState {
  registerFormMethods: (methods: UseFormReturn<ControlsValue>) => void;
  getExplanation: (attribute: string) => string | undefined;
  session: SessionInstance;
  enclosedSetState: (s: Partial<InterviewState>) => unknown;
}

export const InterviewContext = React.createContext<InterviewContextState>({
  registerFormMethods: () => {},
  session: {} as SessionInstance,
  getExplanation: () => undefined,
  enclosedSetState: () => null,
});

export const useInterviewContext = () => React.useContext(InterviewContext);
