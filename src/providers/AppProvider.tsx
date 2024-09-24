import { CircularProgress } from "@material-ui/core";
import React from "react";

const LogGroup = "AppProvider";

export interface AppProviderState {

}

export interface AppProviderCtx extends AppProviderState {
  registerInterview: (ref: React.RefObject<HTMLDivElement>, interactionId: string) => void;
  markInteractionAsComplete: (interactionId: string) => void;
  checkInteractionBelowStillRunning: (parentInteractionId: string) => boolean;
}

const defaultFn = () => {
  throw new Error("AppCtx not initialized");
};

const defaultProviderState: AppProviderCtx = {
  registerInterview: defaultFn,
  markInteractionAsComplete: defaultFn,
  checkInteractionBelowStillRunning: defaultFn,
};

export const AppCtx: React.Context<AppProviderCtx> = React.createContext(defaultProviderState);

// biome-ignore lint/complexity/noBannedTypes: <because>
const AppProvider: React.FC<React.PropsWithChildren<{}>> = (props): JSX.Element => {

  const [runningInterviews, setRunningInterviews] = React.useState<{
    ref: React.RefObject<HTMLDivElement>,
    interactionId: string,
    completed: boolean,
    depth: number,
  }[]>([]);

  const getElementDepth = (element: HTMLDivElement): number => {
    let depth = 0;
    let el: HTMLDivElement | null = element;
    if (!el) {
      return depth;
    }
    while (el?.parentElement) {
      depth++;
      el = el.parentElement as HTMLDivElement;
    }
    return depth;
  };

  const registerInterview = (ref: React.RefObject<HTMLDivElement>, interactionId: string) => {

    if (!ref.current) {
      return;
    }

    const domDepthElement = getElementDepth(ref.current);
    setRunningInterviews((prev) => ([
      ...prev,
      {
        ref,
        interactionId,
        completed: false,
        depth: domDepthElement,
      },
    ]));

    console.log(LogGroup, `registered interaction: ${interactionId} at depth ${domDepthElement}`);
  };

  const markInteractionAsComplete = (interactionId: string) => {

    setRunningInterviews((prev) => {
      return prev.map((ri) => {
        if (ri.interactionId === interactionId) {
          return {
            ...ri,
            completed: true,
          };
        }
        return ri;
      });
    });

    console.log(LogGroup, `marked interaction as complete: ${interactionId}`);
  }

  const checkInteractionBelowStillRunning = (parentInteractionId: string) => {

    const parentInteraction = runningInterviews.find((ri) => ri.interactionId === parentInteractionId);
    if (!parentInteraction) {
      return false;
    }

    const children = runningInterviews.filter((ri) => ri.depth > parentInteraction.depth);
    const childrenStillRunning = children.some((ri) => !ri.completed);

    return childrenStillRunning;
  }

  // -- rendering

  const renderFullScreenLoading = () => {

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress
          size={80}
        />
      </div>
    );
  };

  const renderLoadingOverlay = () => {

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: 9000,
          // pointerEvents: "none", // this is allowing clicks to go through
        }}
        onClick={(e) => {
          // console.log("blocked!");
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    );
  };

  return (
    <AppCtx.Provider value={{
      registerInterview,
      markInteractionAsComplete,
      checkInteractionBelowStillRunning,
    }}>
      {/* {isBlockScreenInteraction.state ? renderLoadingOverlay() : null} */}
      {props.children}
    </AppCtx.Provider>
  );
};

export default (AppProvider);
