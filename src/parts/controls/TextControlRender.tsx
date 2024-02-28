import { AttributeData, TextControl } from "@decisively-io/interview-sdk";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import { ControlRenderProps } from "./ControlRenderTypes";
import FormControl from "./FormControl";

export interface TextControlRenderProps extends ControlRenderProps<TextControl> {
  textFieldProps?: TextFieldProps;
  className?: string;
}

type IParam = TextFieldProps;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const withFallback = (arg: IParam) => (typeof arg.value === "string" ? <StyledTextField {...arg} /> : <StyledTextField {...arg} value="" />);

const TextControlRender = Object.assign(
  React.memo((props: TextControlRenderProps) => {
    const { control, textFieldProps, chOnScreenData, className } = props;
    const { control: formControl } = useFormContext();
    const { attribute, multi, variation } = control;
    const interview = React.useContext(InterviewContext);
    const explanation = interview?.getExplanation(attribute);

    const maybeWithMulti: Pick<IParam, "multiline" | "maxRows" | "minRows"> =
      multi === undefined
        ? {}
        : {
            multiline: true,
            ...multi,
          };
    const maybeWithType =
      variation === undefined
        ? {}
        : {
            type: variation.type,
          };

    return (
      <Controller
        control={formControl}
        name={attribute}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const typedValue = value as TextControl["value"];

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (chOnScreenData) {
              chOnScreenData({ [attribute]: e.target.value });
            }

            onChange(e.target.value);
          };

          return (
            <FormControl explanation={explanation} title={control.label} className={className}>
              {({ Explanation }) => (
                <>
                  <Explanation visible={control.showExplanation} />
                  {withFallback({
                    onChange: handleChange,
                    label: deriveLabel(control),
                    value: typedValue,
                    variant: "outlined",
                    error: error !== undefined,
                    helperText: error?.message || " ",
                    disabled: control.disabled,
                    ...maybeWithType,
                    ...maybeWithMulti,
                    ...textFieldProps,
                  })}
                </>
              )}
            </FormControl>
          );
        }}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Text`,
    /*** @deprecated use `TextInput` directly */
    _: null as any as React.ComponentType<TextControlRenderProps>,
  },
);
TextControlRender._ = TextControlRender;

/*** @deprecated use `TextInput` directly */
export const _ = TextControlRender;

export default TextControlRender;
