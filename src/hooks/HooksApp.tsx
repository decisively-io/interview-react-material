import React from "react";
import { AppCtx, type AppProviderCtx } from "../providers/AppProvider";

const LogGroup = "HooksApp";

export const useApp = () => {

  const appCtxValue = React.useContext<AppProviderCtx>(AppCtx);

  return ({
    registerInterview: appCtxValue.registerInterview,
    markInteractionAsComplete: appCtxValue.markInteractionAsComplete,
    checkInteractionBelowStillRunning: appCtxValue.checkInteractionBelowStillRunning,
  });
};