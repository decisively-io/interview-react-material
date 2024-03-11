import { type ControlsValue, type SessionInstance, getCurrentStep } from "@decisively-io/interview-sdk";
import type { AttributeData, Session } from "@decisively-io/interview-sdk";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { boolean } from "yup";
import { DISPLAY_NAME_PREFIX } from "../Constants";
import { normalizeControlsValue } from "../util";
import Content, { type ContentProps } from "./Content";
import Frame from "./Frame";
import Menu, { type MenuProps } from "./Menu";
import type { ControlComponents } from "./controls";
import type { ThemedCompProps, ThemedCompT, ThemedComponent } from "./themes/types";

export const defaultStep: Session["steps"][0] = {
  complete: false,
  context: { entity: "" },
  current: false,
  id: "",
  skipped: false,
  title: "",
  visitable: true,
  visited: false,
  steps: [],
};

export interface RootProps {
  session: SessionInstance;
  onDataChange?: (data: AttributeData, name: string | undefined) => void;
  // flag to indicate that the component is loading data from an external source
  externalLoading?: boolean;
  ThemedComp?: ThemedComponent;
  controlComponents?: ControlComponents;
}

export interface RootState {
  backDisabled: boolean;
  isSubmitting: boolean;
  isRequestPending: boolean;
  renderAt?: number;
  nextDisabled: boolean;
}

export interface InterviewContextState {
  registerFormMethods: (methods: UseFormReturn<ControlsValue>) => void;
  getExplanation: (attribute: string) => string | undefined;
  session: Session;
}

export const InterviewContext = React.createContext<InterviewContextState>({
  registerFormMethods: () => {},
  session: {} as Session,
  getExplanation: () => undefined,
});

export class Root<P extends RootProps = RootProps> extends React.Component<P, RootState> {
  static displayName = `${DISPLAY_NAME_PREFIX}/Root`;
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
    this.session.navigate(stepId);
  };

  setFormValues = (values: ControlsValue): void => {
    this.formMethods?.reset(values);
  };

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<RootState>, nextContext: any): boolean {
    if (nextProps.session?.renderAt !== this.state.renderAt) {
      this.setState({ renderAt: nextProps.session?.renderAt });
      return true;
    }
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

  renderWrapper = (content: React.ReactNode): React.ReactNode => {
    return <InterviewContext.Provider value={this}>{content}</InterviewContext.Provider>;
  };

  render() {
    const {
      state: { backDisabled, isSubmitting, nextDisabled, isRequestPending },
      props: { controlComponents, onDataChange, ThemedComp },
      __setCurrentStep,
      __back,
      __next,
    } = this;

    const session = this.session;
    const { steps, screen, progress, status } = session;
    const { externalLoading } = this.props;
    const currentStep = getCurrentStep({
      ...defaultStep,
      steps,
    });

    const menuProps: MenuProps = {
      status,
      stages: steps,
      progress,
      onClick: __setCurrentStep,
    };

    const lastStep = this.isLastStep(steps, screen?.id) && status !== "in-progress";

    const contentProps: ThemedCompProps["content"] = {
      // use screen id as key, as it will re-render if the screen changes
      keyForRemount: screen.id,
      step: currentStep,
      screen,
      controlComponents,
      next: lastStep ? undefined : __next,
      back: __back,
      backDisabled: isRequestPending || backDisabled || this.isFirstStep(steps, screen?.id) || externalLoading || session.externalLoading,
      isSubmitting: isSubmitting || externalLoading || session.externalLoading,
      nextDisabled: isRequestPending || nextDisabled || externalLoading || lastStep || session.externalLoading,
      chOnScreenData: this.session.chOnScreenData,
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
          menuJSX={<Menu {...menuProps} />}
        />
      );
    }

    return this.renderWrapper(content);
  }
}

export { default as Frame, type FrameProps } from "./Frame";
export { default as Menu, type MenuProps } from "./Menu";
export * as Font from "./font";
export { default as Content, type ContentProps } from "./Content";
export * as Themes from "./themes";

// these are needed because when we use this lib in project with
// module not set to cjs, it starts importing other entities, and
// breaks references. So useFormContext inported in consumer project !== useFormContext
// that is compatible wth this repo
// that's why we reexport same exact functions that are referentially equal to
// react-hook-form build used in this repo
export {
  useFormContext,
  useFieldArray,
  useForm,
  useController,
  useWatch,
  useFormState,
  FormProvider,
  Controller,
  appendErrors,
  get,
  set,
} from "react-hook-form";
