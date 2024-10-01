import {
  type ControlsValue,
  type RenderableInterviewContainerControl,
  type RenderableRepeatingContainerControl,
  type Session,
  type SessionConfig,
  type SessionInstance,
  getCurrentStep,
} from "@decisively-io/interview-sdk";
import clsx from "clsx";
import React from "react";
import { CLASS_NAMES, DEFAULT_STEP } from "../../Constants";
import { useApp } from "../../hooks/HooksApp";
import { normalizeControlsValue } from "../../util";
import Content, { NestedInterviewContainer, StyledControlsWrap } from "../Content";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";
import Controls from "./index";

export interface InterviewContainerControlWidgetProps extends ControlWidgetProps<RenderableInterviewContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

type ContainerState = {
  backDisabled: boolean;
  isSubmitting: boolean;
  isRequestPending: boolean;
  nextDisabled: boolean;
};

const InterviewContainerWidget = React.memo((props: InterviewContainerControlWidgetProps) => {
  const { control, controlComponents, className, interviewProvider } = props;
  const { interviewRef, initialData = "", required = false } = control;
  const [interviewLoaded, setInterviewLoaded] = React.useState<boolean>(false);

  const [session, setSession] = React.useState<SessionInstance | null>(null);
  const [errMessage, setErrMessage] = React.useState<string | null>(null);
  const [containerState, setContainerState] = React.useState<ContainerState>({
    backDisabled: false,
    isSubmitting: false,
    isRequestPending: false,
    nextDisabled: false,
  });
  const { sessionId } = useApp();

  console.log("====> interview_container control", control);

  // const isSelfReferencing = (() => {
  //   return true;
  // })();

  const initalDataMarshalled = (() => {
    if (initialData) {
      try {
        if (initialData && (typeof initialData === "string" || (initialData as any) instanceof String)) {
          return JSON.parse(initialData);
        }
        // shouldn't be anything other than a string...
      } catch (e) {
        console.error("interview_container Error parsing initialData", e);
      }
    }
    return undefined;
  })();

  React.useEffect(() => {
    if (interviewProvider && interviewRef) {
      (async () => {
        try {
          const { interactionMode } = interviewRef;

          if (["same-session", "new-session", "different-project"].includes(interactionMode)) {
            const createOpts = {
              interview: interviewRef.interviewId,
              initialData: initalDataMarshalled,
            } as SessionConfig;
            if (interactionMode === "same-session" && !sessionId) {
              throw new Error("sessionId is required for same-session interaction mode");
            } else if (interactionMode === "same-session") {
              createOpts.sessionId = sessionId || "";
            }

            const res = await interviewProvider.create(
              interviewRef.projectId,
              createOpts,
              // () => { console.log("196: interviewProvider.create callback") }
            );

            setSession(res);
          } else {
            throw new Error(`Invalid interaction mode: ${interactionMode}`);
          }
        } catch (e: any) {
          console.error("====> interview_container Error creating interview", e);
          setErrMessage(`Error creating interview: ${e.message || "Unknown error"}`);
        } finally {
          setInterviewLoaded(true);
        }
      })();
    } else if (!interviewProvider) {
      setErrMessage("Interview provider not available");
      setInterviewLoaded(true);
    }
  }, [interviewProvider, interviewRef]);

  // -- helpers

  const isFirstStep = (steps: Session["steps"], id: string): boolean => {
    if (!Array.isArray(steps) || steps.length === 0) {
      return false;
    }
    const first = steps[0];
    if (first.id === id) {
      return true;
    }
    if (first.steps?.length) {
      return isFirstStep(first.steps, id);
    }
    return false;
  };

  const isLastStep = (steps: Session["steps"], id: string): boolean => {
    if (!Array.isArray(steps) || steps.length === 0) {
      return false;
    }
    const last = steps[steps.length - 1];
    if (last.id === id) {
      return true;
    }
    if (last.steps?.length) {
      return isLastStep(last.steps, id);
    }
    return false;
  };

  // -- session mgmt

  const goBack = (data: ControlsValue, reset: () => unknown) => {
    if (!session) {
      return;
    }

    setContainerState((prev) => ({
      ...prev,
      backDisabled: true,
      isRequestPending: true,
    }));

    session.back().then((s) => {
      reset?.();
      console.log("back success, setting new session data", s);
      setContainerState((prev) => ({
        ...prev,
        backDisabled: false,
        isRequestPending: false,
      }));
    });
  };

  const goNext = (data: ControlsValue, reset: () => unknown) => {
    if (!session) {
      return;
    }

    const parentPropName = "@parent";
    setContainerState((prev) => ({
      ...prev,
      nextDisabled: true,
      isRequestPending: true,
      isSubmitting: true,
    }));

    const normalized = normalizeControlsValue(data, session.screen.controls);

    if (data[parentPropName]) {
      normalized[parentPropName] = data[parentPropName];
    }

    session.save(normalized).then((s) => {
      console.log("next success, resetting");
      reset?.();
      console.log("next success, setting new session data", s);
      setContainerState((prev) => ({
        ...prev,
        nextDisabled: false,
        isRequestPending: false,
        isSubmitting: false,
      }));
    });
  };

  const lastStep = !session
    ? false
    : isLastStep(session.steps || [], session.screen.id) && session.status !== "in-progress";

  // -- rendering

  const renderErrorOverlay = () => {
    if (errMessage || session?.status === "error") {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
          // style={{
          //   backgroundColor: "white",
          //   padding: "20px",
          //   borderRadius: "5px",
          // }}
          >
            {errMessage || "Error loading interview"}
          </div>
        </div>
      );
    }

    return null;
  };

  /**
   * This is the content (no sidebar/menu)
   */
  const renderContent = () => {
    if (!session) {
      return null;
    }

    const buttons = (session.screen as any).buttons;
    const steps = session.steps || [];

    return (
      <Content
        key={session.screen.id}
        // keyForRemount={session.screen.id}
        step={getCurrentStep({
          ...DEFAULT_STEP,
          steps,
        })}
        screen={session.screen}
        controlComponents={controlComponents}
        next={lastStep || errMessage ? undefined : goNext}
        back={goBack}
        backDisabled={
          buttons?.back === false ||
          containerState.isRequestPending ||
          containerState.backDisabled ||
          // externalLoading ||
          session.externalLoading
        }
        isSubmitting={
          containerState.isSubmitting ||
          // externalLoading ||
          containerState.isRequestPending
        }
        nextDisabled={
          buttons?.next === false ||
          containerState.isRequestPending ||
          containerState.nextDisabled ||
          // externalLoading ||
          lastStep ||
          session.externalLoading
        }
        // chOnScreenData={onDataChangeAll}
        // rhfMode="onChange"
        // rhfReValidateMode="onChange"
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        interviewProvider={interviewProvider!}
        interactionId={session.interactionId}
        subinterviewRequired={required}
      />
    );
  };

  return (
    <NestedInterviewContainer
      data-id={control.id}
      data-loading={(control as any).loading || !interviewLoaded ? "true" : undefined}
    >
      {/* {renderControls()} */}
      {control.label ? <legend className="label">{control.label}</legend> : null}
      {renderContent()}
      {renderErrorOverlay()}
    </NestedInterviewContainer>
  );
});

InterviewContainerWidget.displayName = `${DISPLAY_NAME_PREFIX}/InterviewContainer`;

export default InterviewContainerWidget;
