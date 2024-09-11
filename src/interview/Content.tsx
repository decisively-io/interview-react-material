import DateFnsUtils from "@date-io/date-fns";
import {
  type AttributeValues,
  type ControlsValue,
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
import { DISPLAY_NAME_PREFIX, LOADING_ANIMATION_CSS } from "../Constants";
import { InterviewContext } from "./Interview";
import ChatPanel from "./chat/ChatPanel";
import Controls, { type ControlComponents } from "./controls";

export const classes = {
  formWrap: "formWrap_2NgTRe",
  form: "form_eyu2Bt",
  heading: "heading_U1LjQu",
  controls: "controls_Uj4EDN",
  btns: "btns_fiwac2",
  back: "back_Qt7DZ6",
  submit: "submit_qOUndF",
  next: "next_ggiip5",

  /**
   * @deprecated - use `formWrap` instead
   */
  ">formWrap": {
    _: "formWrap_2NgTRe",

    ">form": {
      _: "form_eyu2Bt",
      ">h": "heading_U1LjQu",
      ">controls": "controls_Uj4EDN",
    },
  },
  /**
   * @deprecated - use `btns` instead
   */
  ">btns": {
    _: "btns_fiwac2",

    ">back": "back_Qt7DZ6",
    ">submit": {
      _: "submit_qOUndF",
      ">next": "next_ggiip5",
    },
  },
};

const formClss = classes[">formWrap"][">form"];
const submitClss = classes[">btns"][">submit"];

const Wrap = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  > .${classes[">formWrap"]._} {
    flex-grow: 1;
    overflow: auto;

    > .${formClss._} {
      margin: 0 auto;
      height: 100%;
      padding: 1.5rem 2rem;
      max-width: 43.75rem;
      display: flex;
      flex-direction: column;

        > .${classes.controls} {
            height: 100%;
            display: flex;
            flex-direction: column;
        }


      > .${formClss[">h"]} {
        margin-bottom: 1.5rem;
      }
    }
  }

  > .${classes[">btns"]._} {
    padding: 1rem 2rem;
    width: 100%;
    border-top: 1px solid #E5E5E5;
    display: flex;
    justify-content: space-between;

    > .${submitClss._} {
      display: flex;
      align-items: center;

      > .${submitClss[">next"]} {
        margin-left: 1rem;
      }
    }

    .MuiTypography-root {
      font-weight: 600;
      text-transform: initial;
    }


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
    } = props;
    const { controls } = screen ?? { controls: [] };
    const defaultValues = deriveDefaultControlsValue(controls);

    const interviewContext = useContext(InterviewContext);

    const methods = useForm({
      defaultValues,
      mode: rhfMode,
      reValidateMode: rhfReValidateMode,
    });
    interviewContext.registerFormMethods(methods);

    const { getValues, reset, watch } = methods;

    const onSubmit = React.useCallback(
      (data: ControlsValue) => {
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
            onSubmit={methods.handleSubmit(onSubmit)}
            className={className}
          >
            <div className={classes[">formWrap"]._}>
              <div className={formClss._}>
                <Typography
                  variant="h4"
                  className={formClss[">h"]}
                >
                  {pageTitle}
                </Typography>

                <StyledControlsWrap className={formClss[">controls"]}>
                  <Controls
                    controlComponents={controlComponents}
                    controls={screen?.controls || []}
                    chOnScreenData={chOnScreenData}
                  />
                </StyledControlsWrap>
              </div>
            </div>
            {(next || back) && (
              <div className={classes[">btns"]._}>
                {back && (
                  <Button
                    size="medium"
                    variant="outlined"
                    disabled={backDisabled}
                    onClick={onBack}
                    className={classes[">btns"][">back"]}
                  >
                    <Typography>Back</Typography>
                  </Button>
                )}
                {next && (
                  <div className={submitClss._}>
                    {isSubmitting && <CircularProgress size="2rem" />}
                    <Button
                      size="medium"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={nextDisabled || (!methods.formState.isValid && methods.formState.isSubmitted)}
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
    displayName: `${DISPLAY_NAME_PREFIX}/Content`,
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
>;

// export const _: React.FC< IProps > = React.memo(
//   props => {
//     if(props.screen === null) return null;

//     return <__Root {...props} />;
//   },
// );
// _.displayName = CONTENT_DISPLAY_NAME;
