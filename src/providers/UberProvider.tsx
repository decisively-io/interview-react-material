import type React from "react";
import AppProvider from "./AppProvider";
import type { InterviewContextState } from "./InterviewContext";

interface UberProviderProps {
  registration: InterviewContextState;
}

const UberProvider = ({ children }: React.PropsWithChildren<UberProviderProps>) => {

  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

export default (UberProvider);
