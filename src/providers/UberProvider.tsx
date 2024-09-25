import type React from "react";
import AppProvider from "./AppProvider";
import { InterviewContext, type InterviewContextState } from "./InterviewContext";

interface UberProviderProps {
  registration: InterviewContextState;
  sessionId: string;
}

const UberProvider = ({ children, registration, sessionId }: React.PropsWithChildren<UberProviderProps>) => {

  return (
    <InterviewContext.Provider
      value={registration}
    >
      <AppProvider
        sessionId={sessionId}
      >
        {children}
      </AppProvider>
    </InterviewContext.Provider>
  );
};

export default (UberProvider);
