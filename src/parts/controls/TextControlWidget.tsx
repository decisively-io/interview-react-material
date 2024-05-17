import { type TextControl } from "@decisively-io/interview-sdk";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import { useFormControl } from "../../Hooks";

export interface TextControlWidgetProps extends ControlWidgetProps<TextControl> {
  textFieldProps?: TextFieldProps;
  className?: string;
}

type IParam = TextFieldProps;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const withFallback = (arg: IParam) =>
  typeof arg.value === "string" ? (
    <StyledTextField {...arg} />
  ) : (
    <StyledTextField
      {...arg}
      value=""
    />
  );

const TextControlWidget = Object.assign(
  React.memo((props: TextControlWidgetProps) => {
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

    const { renderWrapper, label, renderExplanation } = useFormControl({
      control,
      wrapperClassName: className,
    });

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

          return renderWrapper(
            <>
              {withFallback({
                onChange: handleChange,
                label: label,
                value: typedValue,
                variant: "outlined",
                error: error !== undefined,
                helperText: error?.message || " ",
                disabled: control.disabled,
                ...maybeWithType,
                ...maybeWithMulti,
                ...textFieldProps,
              })}

              {renderExplanation()}
            </>,
          );
        }}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Text`,
    /*** @deprecated use `TextControlWidget` directly */
    _: null as any as React.ComponentType<TextControlWidgetProps>,
  },
);
TextControlWidget._ = TextControlWidget;

/*** @deprecated use `TextControlWidget` directly */
export const _ = TextControlWidget;

export default TextControlWidget;
