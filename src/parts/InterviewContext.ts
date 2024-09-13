import React from "react";
import type { Session } from "@decisively-io/interview-sdk";
import type { ControlsValue } from "@decisively-io/interview-sdk";
import type { UseFormReturn } from "react-hook-form";
import type { UploadFile } from './controls/FileControlWidget_types';


export const fallbackUploadFile: UploadFile = () => Promise.resolve({ reference: '' });

export interface InterviewContextState {
  registerFormMethods: (methods: UseFormReturn<ControlsValue>) => void;
  getExplanation: (attribute: string) => string | undefined;
  session: Session;
  uploadFile: UploadFile;
};

export const InterviewContext = React.createContext<InterviewContextState>({
  registerFormMethods: () => {},
  session: {} as Session,
  getExplanation: () => undefined,
  uploadFile: fallbackUploadFile,
});

export const useInterviewContext = () => React.useContext(InterviewContext);
