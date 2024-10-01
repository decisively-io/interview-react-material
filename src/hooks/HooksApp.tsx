import React from "react";
import { AppCtx, type AppProviderCtx } from "../providers/AppProvider";

const LogGroup = "HooksApp";

export const useApp = () => {
  const appCtxValue = React.useContext<AppProviderCtx>(AppCtx);

  return {
    sessionId: appCtxValue.sessionId,
    registerInterview: appCtxValue.registerInterview,
    deRegisterInterview: appCtxValue.deRegisterInterview,
    markInteractionAsComplete: appCtxValue.markInteractionAsComplete,
    checkInteractionBelowStillRunning: appCtxValue.checkInteractionBelowStillRunning,
  };
};
