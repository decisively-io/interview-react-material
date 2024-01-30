import { getCurrentStep } from "@decisively-io/interview-sdk";
import { AttributeData, IControlsValue, Session } from "@decisively-io/types-interview";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DISPLAY_NAME_PREFIX } from "../constants";
import { normalizeControlsValue } from "../util";
import Content, { ContentProps } from "./Content";
import type { RenderControlProps } from "./Controls/__controlsTypes";
import Frame from "./Frame";
import Menu, { MenuProps } from "./Menu";
import type { ThemedCompProps, ThemedCompT } from "./themes/types";

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

export const defaultSession: Session = {
  data: { "@parent": "" } as any,
  screen: {
    controls: [],
    id: "",
    title: "",
  },
  context: { entity: "" },
  sessionId: "",
  status: "in-progress",
  steps: [],
};

export interface RootProps extends Pick<RenderControlProps, "controlComponents"> {
  getSession: () => Promise<Session>;
  next: (s: Session, d: IControlsValue) => Promise<typeof s>;
  back: (s: Session, d: IControlsValue) => Promise<typeof s>;
  navigateTo: (s: Session, stepId: Session["steps"][0]["id"]) => Promise<typeof s>;
  // callback to notify external component that data has been updated
  chOnScreenData?: (data: AttributeData) => void;
  onDataChange?: (data: AttributeData, name: string | undefined) => void;
  // flag to indicate that the component is loading data from an external source
  externalLoading?: boolean;
  ThemedComp?: ThemedCompT;
}

export interface RootState {
  session: Session;
  backDisabled: boolean;
  isSubmitting: boolean;
  isRequestPending: boolean;
  nextDisabled: boolean;
}

export interface InterviewContextState {
  registerFormMethods: (methods: UseFormReturn<IControlsValue>) => void;
  getExplanation: (attribute: string) => string | undefined;
  state: {
    session: Session;
  };
}

export const InterviewContext = React.createContext<InterviewContextState>({
  registerFormMethods: () => {},
  state: {} as any,
  getExplanation: () => undefined,
});

export class Root<P extends RootProps = RootProps> extends React.PureComponent<P, RootState> {
  static displayName = `${DISPLAY_NAME_PREFIX}/Root`;
  private formMethods: UseFormReturn<IControlsValue> | undefined;

  constructor(props: P) {
    super(props);

    this.state = {
      session: defaultSession,
      backDisabled: false,
      isSubmitting: false,
      isRequestPending: false,
      nextDisabled: false,
    };
  }

  // ===================================================================================

  getExplanation = (attribute: string): string | undefined => {
    const {
      state: { session },
    } = this;
    const id = attribute.split(".").pop();
    return id && session.explanations?.[id];
  };

  ___setSession = (s: Session): void => {
    this.setState({ session: s });
  };

  __setCurrentStep = (stepId: Session["steps"][0]["id"]): void => {
    const {
      props: { navigateTo },
      state: { session },
    } = this;

    this.setState({ isRequestPending: true });
    navigateTo(session, stepId)
      .then((s) => this.setState({ session: s }))
      .finally(() => {
        this.setState({ isRequestPending: false });
      });
  };

  __getSession = (): void => {
    const { getSession } = this.props;

    getSession().then((s) => {
      this.___setSession(s);
    });
  };

  componentDidMount(): void {
    this.__getSession();
  }

  componentDidUpdate(prevProps: Root["props"]): void {
    if (prevProps.getSession !== this.props.getSession) this.__getSession();
  }

  setFormValues = (values: IControlsValue): void => {
    this.formMethods?.reset(values);
  };

  // ===================================================================================

  __back: ContentProps["back"] = (_, reset) => {
    const {
      props: { back },
      state: { session: s },
    } = this;

    this.setState({
      backDisabled: true,
      isRequestPending: true,
    });

    back(s, {}).then((s) => {
      reset?.();
      console.log("back success, setting new session data", s);
      this.___setSession(s);
      this.setState({
        backDisabled: false,
        isRequestPending: false,
      });
    });
  };

  __next: ContentProps["next"] = (data, reset) => {
    const parentPropName = "@parent";
    const {
      props: { next },
      state: { session: s },
    } = this;

    this.setState({
      nextDisabled: true,
      isRequestPending: true,
      isSubmitting: true,
    });

    const normalized = normalizeControlsValue(data, s.screen.controls);

    if (data[parentPropName]) normalized[parentPropName] = data[parentPropName];

    next(s, normalized).then((s) => {
      console.log("next success, resetting");
      reset?.();
      console.log("next success, setting new session data", s);
      this.___setSession(s);
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

  registerFormMethods(formMethods: UseFormReturn<IControlsValue>) {
    this.formMethods = formMethods;
  }

  // ===================================================================================

  renderWrapper = (content: React.ReactNode): React.ReactNode => {
    return <InterviewContext.Provider value={this}>{content}</InterviewContext.Provider>;
  };

  render() {
    const {
      state: { session, backDisabled, isSubmitting, nextDisabled, isRequestPending },
      props: { controlComponents, onDataChange, ThemedComp },
      __setCurrentStep,
      __back,
      __next,
    } = this;

    const { steps, screen, progress, status } = session;
    const { chOnScreenData, externalLoading } = this.props;
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
      backDisabled: isRequestPending || backDisabled || this.isFirstStep(steps, screen?.id) || externalLoading,
      isSubmitting: isSubmitting || externalLoading,
      nextDisabled: isRequestPending || nextDisabled || externalLoading || lastStep,
      chOnScreenData,
    };

    let content: React.ReactNode;
    if (ThemedComp !== undefined) {
      // @ts-ignore
      content = <ThemedComp menu={menuProps} content={contentProps} />;
    } else {
      content = <Frame contentJSX={<Content key={contentProps.keyForRemount} onDataChange={onDataChange} {...contentProps} />} menuJSX={<Menu {...menuProps} />} />;
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
