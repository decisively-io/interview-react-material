import type { AttributeValues, InterviewProvider, Session } from "@decisively-io/interview-sdk";
import { type ControlsValue, type SessionInstance, getCurrentStep } from "@decisively-io/interview-sdk";
import fastDeepEqual from "fast-deep-equal";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { DEFAULT_STEP } from "../Constants";
import UberProvider from "../providers/UberProvider";
import type { SidebarOverrides } from "../sidebar/SidebarPanel";
import type { ThemedCompProps, ThemedComponent } from "../themes/types";
import { normalizeControlsValue } from "../util";
import Content, { type ContentProps } from "./Content";
import Frame from "./Frame";
import type { InterviewState } from "./InterviewStateType";
import Menu, { type MenuProps } from "./Menu";
import type { ControlComponents } from "./controls";

export interface InterviewProps {
  /**
   * @deprecated - no longer required as we can get the provider from the session
   */
  interviewProvider?: InterviewProvider;
  //--- session started from the client
  session: SessionInstance;
  onDataChange?: (data: AttributeValues, name: string | undefined) => void;
  // flag to indicate that the component is loading data from an external source
  externalLoading?: boolean;
  ThemedComp?: ThemedComponent;
  controlComponents?: ControlComponents;
  rhfMode?: ContentProps["rhfMode"];
  rhfReValidateMode?: ContentProps["rhfReValidateMode"];
  sidebarOverrides?: SidebarOverrides;
}

export type { InterviewState };

export default class Interview<P extends InterviewProps = InterviewProps> extends React.Component<P, InterviewState> {
  private formMethods: UseFormReturn<ControlsValue> | undefined;

  constructor(props: P) {
    super(props);

    this.state = {
      backDisabled: false,
      isSubmitting: false,
      isRequestPending: false,
      nextDisabled: false,
    };
  }

  // ===================================================================================

  get session(): SessionInstance {
    return this.props.session;
  }

  getExplanation = (attribute: string): string | undefined => {
    const id = attribute.split(".").pop();
    return id && this.session.explanations?.[id];
  };

  __setCurrentStep = (stepId: Session["steps"][0]["id"]): void => {
    console.log(this.session);
    this.session.navigate(stepId);
  };

  setFormValues = (values: ControlsValue): void => {
    this.formMethods?.reset(values);
  };

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<InterviewState>, nextContext: any): boolean {
    const session: any = this.props.session;
    if (nextProps.session?.renderAt !== session?.lastRenderAt) {
      return true;
    }
    // or if the theme has changed
    if (nextProps.ThemedComp !== this.props.ThemedComp) {
      return true;
    }
    if (!fastDeepEqual(this.state, nextState)) return true;

    return false;
  }

  // ===================================================================================

  __back: ContentProps["back"] = (_, reset) => {
    this.setState({
      backDisabled: true,
      isRequestPending: true,
    });

    this.session.back().then((s) => {
      reset?.();
      console.log("back success, setting new session data", s);
      this.setState({
        backDisabled: false,
        isRequestPending: false,
      });
    });
  };

  __next: ContentProps["next"] = (data, reset) => {
    const parentPropName = "@parent";
    this.setState({
      nextDisabled: true,
      isRequestPending: true,
      isSubmitting: true,
    });

    const normalized = normalizeControlsValue(data, this.session.screen.controls);

    if (data[parentPropName]) normalized[parentPropName] = data[parentPropName];

    this.session.save(normalized).then((s) => {
      console.log("next success, resetting");
      reset?.();
      console.log("next success, setting new session data", s);
      this.setState({
        nextDisabled: false,
        isRequestPending: false,
        isSubmitting: false,
      });
    });
  };

  isFirstStep = (steps: Session["steps"], id: string): boolean => {
    if (!Array.isArray(steps) || steps.length === 0) return false;
    const first = steps[0];
    if (first.id === id) {
      return true;
    }
    if (first.steps?.length) {
      return this.isFirstStep(first.steps, id);
    }
    return false;
  };

  isLastStep = (steps: Session["steps"], id: string): boolean => {
    if (!Array.isArray(steps) || steps.length === 0) return false;
    const last = steps[steps.length - 1];
    if (last.id === id) {
      return true;
    }
    if (last.steps?.length) {
      return this.isLastStep(last.steps, id);
    }
    return false;
  };

  registerFormMethods(formMethods: UseFormReturn<ControlsValue>) {
    this.formMethods = formMethods;
  }

  // ===================================================================================

  /**
   * in File control component we need to be able to set next/back buttons\
   * to disabled state, so we use this method to pass "setState" to any\
   * InterviewContext consumer
   */
  enclosedSetState = (s: Partial<InterviewState>) => this.setState((prev) => ({ ...prev, ...s }));

  renderWrapper = (content: React.ReactNode): React.ReactNode => {
    return (
      <UberProvider
        registration={{
          registerFormMethods: this.registerFormMethods.bind(this),
          getExplanation: this.getExplanation.bind(this),
          session: this.session,
          enclosedSetState: this.enclosedSetState.bind(this),
          sidebarOverrides: this.props.sidebarOverrides,
        }}
        sessionId={this.session.sessionId}
      >
        {content}
      </UberProvider>
    );
  };

  render() {
    const {
      state: { backDisabled, isSubmitting, nextDisabled, isRequestPending },
      props: { controlComponents, onDataChange, ThemedComp, rhfMode, rhfReValidateMode },
      __setCurrentStep,
      __back,
      __next,
    } = this;

    const session = this.session;
    const { steps, screen, progress, status } = session;
    const { externalLoading } = this.props;
    const currentStep = getCurrentStep({
      ...DEFAULT_STEP,
      steps,
    });

    const menuProps: MenuProps = {
      status,
      stages: steps,
      progress,
      onClick: __setCurrentStep,
    };

    const lastStep = this.isLastStep(steps, screen?.id) && status !== "in-progress";
    const buttons = (screen as any).buttons;

    const contentProps: ThemedCompProps["content"] = {
      // use screen id as key, as it will re-render if the screen changes
      keyForRemount: screen.id,
      step: currentStep,
      screen,
      controlComponents,
      next: lastStep ? undefined : __next,
      back: __back,
      backDisabled:
        buttons?.back === false ||
        isRequestPending ||
        backDisabled ||
        // https://app.clickup.com/t/86b0a7pdr - We don't want this behavior
        // trust backend, backDisabled instead
        // this.isFirstStep(steps, screen?.id) ||
        externalLoading ||
        session.externalLoading,
      isSubmitting: isSubmitting || externalLoading || session.externalLoading,
      nextDisabled:
        buttons?.next === false ||
        isRequestPending ||
        !session.canProgress ||
        nextDisabled ||
        externalLoading ||
        lastStep ||
        session.externalLoading,
      chOnScreenData: this.session.chOnScreenData,
      rhfMode,
      rhfReValidateMode,
      interviewProvider: session.provider ?? this.props.interviewProvider,
      interactionId: session.interactionId,
    };

    let content: React.ReactNode;
    if (ThemedComp !== undefined) {
      content = (
        // @ts-ignore
        <ThemedComp
          menu={menuProps}
          content={contentProps}
        />
      );
    } else {
      content = (
        <Frame
          contentJSX={
            <Content
              key={contentProps.keyForRemount}
              onDataChange={onDataChange}
              {...contentProps}
            />
          }
          // the sidebar with the numbers...
          menuJSX={<Menu {...menuProps} />}
        />
      );
    }

    return this.renderWrapper(content);
  }
}
