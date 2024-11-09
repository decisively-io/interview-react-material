import type { TextControl } from "@decisively-io/interview-sdk";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { useExplSidebarActiveElStateHelpers } from "../../providers/InterviewContext";
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

    const { markAsActiveForExplSidebar, resetExplSidebarActive } = useExplSidebarActiveElStateHelpers({
      attributeId: control.attribute,
      label: control.label,
    });

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
              onFocus={markAsActiveForExplSidebar}
              onBlur={resetExplSidebarActive}
              {...maybeWithType}
              {...maybeWithMulti}
              {...textFieldProps}
            />

            {renderExplanation()}
          </>
        );
      },
    });
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Text`,
  },
);

export default TextControlWidget;
