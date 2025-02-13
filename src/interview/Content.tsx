import DateFnsUtils from "@date-io/date-fns";
import {
  type AttributeValues,
  type ControlsValue,
  type InterviewProvider,
  type Screen,
  type Step,
  deriveDefaultControlsValue,
} from "@decisively-io/interview-sdk";
import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useContext } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";
import styled from "styled-components";
import { CLASS_NAMES, LOADING_ANIMATION_CSS } from "../Constants";
import { useApp } from "../hooks/HooksApp";
import { InterviewContext } from "../providers/InterviewContext";
import Controls, { type ControlComponents } from "./controls";

/**
 * @deprecated - use `CLASS_NAMES.CONTENT` instead
 */
export const classes = {
  formWrap: CLASS_NAMES.CONTENT.FORM_WRAP,
  form: CLASS_NAMES.CONTENT.FORM,
  heading: CLASS_NAMES.CONTENT.FORM_HEADING,
  controls: CLASS_NAMES.CONTENT.FORM_CONTROLS,
  btns: CLASS_NAMES.CONTENT.BUTTONS,
  back: CLASS_NAMES.CONTENT.BUTTONS_BACK,
  submit: CLASS_NAMES.CONTENT.BUTTONS_SUBMIT,
  next: CLASS_NAMES.CONTENT.BUTTONS_NEXT,

  ">formWrap": {
    _: CLASS_NAMES.CONTENT.FORM_WRAP,

    ">form": {
      _: CLASS_NAMES.CONTENT.FORM,
      ">h": CLASS_NAMES.CONTENT.FORM_HEADING,
      ">controls": CLASS_NAMES.CONTENT.FORM_CONTROLS,
    },
  },

  ">btns": {
    _: CLASS_NAMES.CONTENT.BUTTONS,

    ">back": CLASS_NAMES.CONTENT.BUTTONS_BACK,
    ">submit": {
      _: CLASS_NAMES.CONTENT.BUTTONS_SUBMIT,
      ">next": CLASS_NAMES.CONTENT.BUTTONS_NEXT,
    },
  },
};

const formClss = classes[">formWrap"][">form"];
const submitClss = classes[">btns"][">submit"];

// const Wrap = styled.form`
const Wrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  > .${CLASS_NAMES.CONTENT.FORM_WRAP} {
    flex-grow: 1;
    overflow: auto;

    > .${CLASS_NAMES.CONTENT.FORM} {
      margin: 0 auto;
      height: 100%;
      padding: 1.5rem 2rem;
      max-width: 43.75rem;
      display: flex;
      flex-direction: column;

        > .${CLASS_NAMES.CONTENT.FORM_CONTROLS} {
            height: 100%;
            display: flex;
            flex-direction: column;
        }


      > .${CLASS_NAMES.CONTENT.FORM_HEADING} {
        margin-bottom: 1.5rem;
      }
    }
  }

  > .${CLASS_NAMES.CONTENT.BUTTONS} {
    padding: 1rem 2rem;
    width: 100%;
    border-top: 1px solid #E5E5E5;
    display: flex;
    justify-content: space-between;

    > .${CLASS_NAMES.CONTENT.BUTTONS_SUBMIT} {
      display: flex;
      align-items: center;

      > .${CLASS_NAMES.CONTENT.BUTTONS_NEXT} {
        margin-left: 1rem;
      }
    }

    .MuiTypography-root {
      font-weight: 600;
      text-transform: initial;
    }


  }
`;

export const NestedInterviewContainer = styled.fieldset`
  ${LOADING_ANIMATION_CSS}

  display: block;
  position: relative;

  border: 0.5px solid grey;
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  width: 100%;

  scrollbar-width: thin;
  scrollbar-color: grey transparent;
  overflow-y: auto;
  // overflow-x: hidden;

  max-height: 800px;
  min-height: 450px;
  height: 50vh;

  .label {
    padding: 0 5px;
    font-size: 0.75rem;
    font-weight: 600;
  }

`;

export const StyledControlsWrap = styled.div`
  ${LOADING_ANIMATION_CSS}

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  &.table {
    display: grid;
    // grid-template-columns: repeat(X, 1fr); // we'll fill this in dynamically
    margin-bottom: 0;

    > * {
      border: 1px solid grey;
      border-top: none;
      border-right: none;
      margin-bottom: 0 !important;
      padding: 0.25rem;

      word-break: break-word;
      white-space: pre-wrap;
      hyphens: auto;
    }
    > *:last-child {
      border-right: 1px solid grey;
    }
    .header {
      font-weight: 600;
      border: 1px solid grey;
      border-top: 1px solid grey;
      border-right: none;
      // background-color: #f5f5f5;
      &.last {
        border-right: 1px solid grey;
      }
    }

    &.top_border {
      > * {
        border-top: 1px solid grey;
      }
    }

    &.borderless {
      // remove all borders from the table
      > * {
        border: none;
      }
      > *:last-child {
        border-right: none;
      }
      .header {
        border: none;
        &.last {
          border: none;
        }
      }
    }

    &.last_row {
      margin-bottom: 1rem;
    }
  }
`;

export interface ContentRootProps {
  interviewProvider: InterviewProvider;
  controlComponents?: ControlComponents;
  className?: string;
  step: Step | null;
  screen: Screen | null;
  next?: (data: ControlsValue, reset: () => unknown) => unknown;
  back?: (data: ControlsValue, reset: () => unknown) => unknown;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
  chOnScreenData?: (data: AttributeValues) => void;
  onDataChange?: (data: AttributeValues, name: string | undefined) => void;
  rhfMode?: UseFormProps["mode"];
  rhfReValidateMode?: UseFormProps["reValidateMode"];
  interactionId: string;
  /** applicable only to nested interviews */
  subinterviewRequired?: boolean;
}

const Content = Object.assign(
  (props: ContentRootProps) => {
    const {
      className,
      step,
      screen,
      next,
      back,
      backDisabled = false,
      nextDisabled = false,
      isSubmitting = false,
      controlComponents,
      chOnScreenData,
      onDataChange,
      rhfMode = "onSubmit",
      rhfReValidateMode = "onChange",
      interviewProvider,
      interactionId,
      subinterviewRequired = false,
    } = props;
    const { registerInterview, deRegisterInterview, markInteractionAsComplete, checkInteractionBelowStillRunning } =
      useApp();
    const { controls } = screen ?? { controls: [] };
    const defaultValues = deriveDefaultControlsValue(controls);

    const interviewContext = useContext(InterviewContext);

    const formRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (formRef.current) {
        registerInterview(formRef, interactionId);
      }

      return () => {
        deRegisterInterview(interactionId);
      };
    }, []);

    React.useEffect(() => {
      if (next === undefined || subinterviewRequired === false) {
        markInteractionAsComplete(interactionId);
      }
      // otherwise we wait for the subinterview to complete
    }, [next, subinterviewRequired]);

    const methods = useForm({
      defaultValues,
      mode: rhfMode,
      reValidateMode: rhfReValidateMode,
    });
    interviewContext.registerFormMethods(methods);

    const { getValues, reset, watch } = methods;

    const onSubmit = React.useCallback(
      (data: ControlsValue) => {
        // console.log("onSubmit values", data);
        // console.log("onSubmit errors", methods.formState.errors);
        if (next) {
          next(data, reset);
        }
      },
      [next, reset],
    );

    const onBack = React.useCallback(() => {
      const values = getValues();
      if (back) {
        back(values, reset);
      }
    }, [getValues, back, reset]);

    if (!screen) return null;

    const pageTitle = screen.title || step?.title || "";

    React.useEffect(() => {
      const subscription = watch((value, { name, type }) => {
        if (type === "change") {
          onDataChange?.(value, name);
        }
      });
      return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <FormProvider {...methods}>
          <Wrap
            ref={formRef}
            onSubmit={methods.handleSubmit(onSubmit)}
            className={className}
          >
            <div
              data-deci-component={"ContentFormWrap"}
              className={CLASS_NAMES.CONTENT.FORM_WRAP}
            >
              <div
                data-deci-component={"ContentForm"}
                className={CLASS_NAMES.CONTENT.FORM}
              >
                <Typography
                  data-deci-component={"ContentFormHeading"}
                  variant="h4"
                  className={CLASS_NAMES.CONTENT.FORM_HEADING}
                >
                  {pageTitle}
                </Typography>

                <StyledControlsWrap
                  data-deci-component={"ContentFormControls"}
                  className={CLASS_NAMES.CONTENT.FORM_CONTROLS}
                >
                  <Controls
                    controlComponents={controlComponents}
                    controls={screen?.controls || []}
                    chOnScreenData={chOnScreenData}
                    interviewProvider={interviewProvider}
                  />
                </StyledControlsWrap>
              </div>
            </div>
            {(next || back) && (
              <div
                data-deci-component={"ContentButtons"}
                className={CLASS_NAMES.CONTENT.BUTTONS}
              >
                {back && (
                  <Button
                    data-deci-component={"ContentBackButton"}
                    size="medium"
                    variant="outlined"
                    disabled={backDisabled}
                    onClick={onBack}
                    className={CLASS_NAMES.CONTENT.BUTTONS_BACK}
                  >
                    <Typography>Back</Typography>
                  </Button>
                )}
                {next && (
                  <div
                    data-deci-component={"ContentSubmitPanel"}
                    className={CLASS_NAMES.CONTENT.BUTTONS_SUBMIT}
                  >
                    {isSubmitting && <CircularProgress size="2rem" />}
                    <Button
                      data-deci-component={"ContentNextButton"}
                      size="medium"
                      // type="submit" // we can't use this anymore as we may be nesting forms
                      onClick={methods.handleSubmit(onSubmit)}
                      variant="contained"
                      color="primary"
                      disabled={
                        nextDisabled ||
                        (!methods.formState.isValid && methods.formState.isSubmitted) ||
                        checkInteractionBelowStillRunning(interactionId)
                      }
                      className={submitClss[">next"]}
                    >
                      <Typography>Next</Typography>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Wrap>
        </FormProvider>
      </MuiPickersUtilsProvider>
    );
  },
  {
    classes,
    /*** @deprecated use `Content` directly */
    _: undefined as any as React.ComponentType<ContentRootProps>,
  },
);
Content._ = Content;

/*** @deprecated use `Content` directly */
export const _ = Content;

export default Content;

export type ContentProps = Pick<
  ContentRootProps,
  | "className"
  | "back"
  | "next"
  | "step"
  | "backDisabled"
  | "nextDisabled"
  | "isSubmitting"
  | "controlComponents"
  | "screen"
  | "chOnScreenData"
  | "rhfMode"
  | "rhfReValidateMode"
  | "interactionId"
  | "interviewProvider"
>;
