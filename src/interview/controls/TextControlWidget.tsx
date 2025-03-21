import type { TextControl } from "@decisively-io/interview-sdk";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface TextControlWidgetProps extends ControlWidgetProps<TextControl> {
  textFieldProps?: TextFieldProps;
  className?: string;
}

type IParam = TextFieldProps;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const TextControlWidget = React.memo((props: TextControlWidgetProps) => {
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

  return useFormControl({
    control,
    className: className,
    onScreenDataChange: chOnScreenData,
    render: ({ onChange, value, forId, error, inlineLabel, renderExplanation, disabled }) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      };

      return (
        <>
          <StyledTextField
            onChange={handleChange}
            label={inlineLabel}
            value={value ?? ""}
            variant={"outlined"}
            id={forId}
            error={error !== undefined}
            helperText={error?.message || " "}
            disabled={control.disabled || disabled}
            {...maybeWithType}
            {...maybeWithMulti}
            {...textFieldProps}
          />

          {renderExplanation()}
        </>
      );
    },
  });
});

export default TextControlWidget;
