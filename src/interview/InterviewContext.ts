import type { SessionInstance } from "@decisively-io/interview-sdk";
import type { ControlsValue } from "@decisively-io/interview-sdk";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { OnFileTooBig, RemoveFile, UploadFile } from "./controls/FileControlWidget_types";

export interface InterviewContextState {
  registerFormMethods: (methods: UseFormReturn<ControlsValue>) => void;
  getExplanation: (attribute: string) => string | undefined;
  session: SessionInstance;
  uploadFile: UploadFile;
  onFileTooBig: OnFileTooBig;
  removeFile: RemoveFile;
}

export const fallbackUploadFile: InterviewContextState["uploadFile"] = () => Promise.resolve({ reference: "", id: "" });
export const fallbackOnFileTooBig: InterviewContextState["onFileTooBig"] = () => null;
export const fallbackRemoveFile: InterviewContextState["removeFile"] = () => Promise.resolve();

export const InterviewContext = React.createContext<InterviewContextState>({
  registerFormMethods: () => {},
  session: {} as SessionInstance,
  getExplanation: () => undefined,
  uploadFile: fallbackUploadFile,
  onFileTooBig: fallbackOnFileTooBig,
  removeFile: fallbackRemoveFile,
});

export const useInterviewContext = () => React.useContext(InterviewContext);
