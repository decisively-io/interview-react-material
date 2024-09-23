import { getCurrentStep, type AttributeValues, type ControlsValue, type InterviewProvider, type RenderableInterviewContainerControl, type RenderableRepeatingContainerControl, type Session, type SessionInstance } from "@decisively-io/interview-sdk";
import clsx from "clsx";
import React from "react";
import Content, { NestedInterviewContainer, StyledControlsWrap } from "../Content";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";
import Controls from "./index";
import { CLASS_NAMES, DEFAULT_STEP } from "../../Constants";
import { normalizeControlsValue } from "../../util";

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

  const { control, chOnScreenData, controlComponents, className, interviewProvider } = props;
  const {
    interviewRef,
    initialData = "",
  } = control;

  const [ session, setSession ] = React.useState<SessionInstance | null>(null);
  const [ errMessage, setErrMessage ] = React.useState<string | null>(null);
  const [containerState, setContainerState] = React.useState<ContainerState>({
    backDisabled: false,
    isSubmitting: false,
    isRequestPending: false,
    nextDisabled: false,
  });

  console.log("====> interview_container control", control);

  const isSelfReferencing = (() => {
    if (interviewRef) {
      // TODO
    }
    return true;
  })();

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

          if (interactionMode === "same-session") {
            // same session, new INTERACTION
            // TODO I need to just lightly mod the SDK for this
            throw new Error("Not implemented");
          } else if (interactionMode === "new-session" || interactionMode === "different-project") {
            // same model, new SESSION (i.e. completely new interview, independent of the current one)
            const res = await interviewProvider.create(
              interviewRef.projectId,
              {
                interview: interviewRef.interviewId,
                initialData: initalDataMarshalled,
                // release: TODO,
                // debug: false,
              },
              () => { console.log("197: interviewProvider.create callback") }
            );

            console.log("====> interviewProvider.create", res);
            setSession(res);
          } else {
            throw new Error(`Invalid interaction mode: ${interactionMode}`);
          }
        } catch (e: any) {
          console.error("====> interview_container Error creating interview", e);
          setErrMessage(`Error creating interview: ${e.message || "Unknown error"}`);
        }
      })();
    }
  }, [interviewProvider, interviewRef]);

  // -- helpers (TODO move to commons/shared)

  const isFirstStep = (steps: Session["steps"], id: string): boolean => {

    if (!Array.isArray(steps) || steps.length === 0) return false;
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

    if (!Array.isArray(steps) || steps.length === 0) return false;
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

  const __back = (data: ControlsValue, reset: () => unknown) => {
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

  const __next = (data: ControlsValue, reset: () => unknown) => {

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

    if (data[parentPropName]) normalized[parentPropName] = data[parentPropName];

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

  const onDataChange = (data: AttributeValues, name: string | undefined) => {
    console.log("asdasdads");
  };

  const lastStep = !session
    ? false
    : isLastStep(session.steps || [], session.screen.id) && session.status !== "in-progress";

  // -- rendering

  /**
   * This is just the controls with wrapping elements
   */
  const renderControls = () => {

    return (
      <StyledControlsWrap
        className={CLASS_NAMES.CONTENT.FORM_CONTROLS}
      >
        <Controls
          // if we are self-referencing, we don't want to pass the interviewProvider, otherwise we'll create an infinite loop
          // we could pass the "level", but interviews will only be 1 level deep if they are a self-reference
          interviewProvider={isSelfReferencing ? null : interviewProvider}
          controlComponents={controlComponents}
          controls={session?.screen?.controls || []}
          chOnScreenData={onDataChange}
        />
      </StyledControlsWrap>
    );
  }

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
          steps
        })}
        screen={session.screen}
        controlComponents={controlComponents}
        next={lastStep ? undefined : __next}
        back={__back}
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
        chOnScreenData={chOnScreenData}
        // rhfMode="onChange"
        // rhfReValidateMode="onChange"
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        interviewProvider={interviewProvider!}
      />
    );
  }

  return (
    <NestedInterviewContainer
      data-id={control.id}
      data-loading={(control as any).loading ? "true" : undefined}
    >
      {/* {renderControls()} */}
      {renderContent()}
    </NestedInterviewContainer>
  );
});

InterviewContainerWidget.displayName = `${DISPLAY_NAME_PREFIX}/InterviewContainer`;

export default InterviewContainerWidget;
