import type { ControlsValue, SessionInstance } from "@decisively-io/interview-sdk";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { InterviewState } from "../../interview/InterviewStateType";
import type { SidebarOverrides } from "../../sidebar/SidebarPanel";
import { ExplSidebarActiveEl, ExplSidebarActiveElMethods } from './explanationSidebarActiveElState'

export interface InterviewContextState {
  registerFormMethods: (methods: UseFormReturn<ControlsValue>) => void;
  getExplanation: (attribute: string) => string | undefined;
  session: SessionInstance;
  enclosedSetState: (s: Partial<InterviewState>) => unknown;
  sidebarOverrides: SidebarOverrides | undefined;
  explSidebarActiveEl: ExplSidebarActiveEl;
}

export const InterviewContext = React.createContext<InterviewContextState>({
  registerFormMethods: () => {},
  session: {} as SessionInstance,
  getExplanation: () => undefined,
  enclosedSetState: () => null,
  sidebarOverrides: undefined,
  explSidebarActiveEl: {
    value: { active: false },
    methods: new ExplSidebarActiveElMethods(() => {
      console.error('@decisively-io/interview-react-material | y7Qvvy1Eog | Uninitialized explSidebarActiveEl.methods');
    }),
  },
});

export const useInterviewContext = () => React.useContext(InterviewContext);

export type UseExplSidebarActiveElStateHelpersArg = {
  attributeId: string;
  label?: string;
}
export type UseExplSidebarActiveElStateHelpersRtrn = {
  markAsActiveForExplSidebar: () => unknown;
  resetExplSidebarActive: () => unknown;
}
export const useExplSidebarActiveElStateHelpers = (arg: UseExplSidebarActiveElStateHelpersArg): UseExplSidebarActiveElStateHelpersRtrn => {
  const { explSidebarActiveEl: { methods } } = useInterviewContext();
  const markAsActiveForExplSidebar = React.useCallback(() => methods.debouncedSetNextValue({
    active: true,
    attributeId: arg.attributeId,
    label: arg.label,
  }), [methods, arg.attributeId, arg.label]);
  const resetExplSidebarActive = React.useCallback(
    () => methods.resetNextValueImmediateAndCancelDebounced(),
    [methods]
  );

  return React.useMemo< UseExplSidebarActiveElStateHelpersRtrn >(() => ({
    markAsActiveForExplSidebar,
    resetExplSidebarActive,
  }), [markAsActiveForExplSidebar, resetExplSidebarActive]);
}
