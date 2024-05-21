import type { TextControl } from "@decisively-io/interview-sdk";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

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
    const { multi, variation } = control;

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

    const FormControl = useFormControl({
      control,
      className: className,
      onScreenDataChange: chOnScreenData,
    });

    return (
      <FormControl>
        {({ onChange, value, forId, error, inlineLabel, renderExplanation }) => {
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
          };

          return (
            <>
              {withFallback({
                onChange: handleChange,
                label: inlineLabel,
                value: value,
                variant: "outlined",
                id: forId,
                error: error !== undefined,
                helperText: error?.message || " ",
                disabled: control.disabled,
                ...maybeWithType,
                ...maybeWithMulti,
                ...textFieldProps,
              })}

              {renderExplanation()}
            </>
          );
        }}
      </FormControl>
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
