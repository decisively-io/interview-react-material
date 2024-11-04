import type { CurrencyControl } from "@decisively-io/interview-sdk";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import { useExplSidebarActiveElStateHelpers } from "../../providers/InterviewContext";

export interface CurrencyControlWidgetProps extends ControlWidgetProps<CurrencyControl> {
  textFieldProps?: Omit<TextFieldProps, "value">;
  className?: string;
}

type IArg = { value: CurrencyControl["value"] } & NonNullable<CurrencyControlWidgetProps["textFieldProps"]>;

const StyledTextField = styled(TextField)`
  flex: 1;
`;
const withFallback = (arg: IArg) =>
  arg.value === null || arg.value === undefined ? (
    <StyledTextField
      {...arg}
      value=""
    />
  ) : (
    <StyledTextField {...arg} />
  );

const CurrencyControlWidget = Object.assign(
  React.memo((props: CurrencyControlWidgetProps) => {
    const { control, textFieldProps, chOnScreenData, className } = props;
    const { symbol } = control;
    const { markAsActiveForExplSidebar, resetExplSidebarActive } = useExplSidebarActiveElStateHelpers({
      attributeId: control.attribute,
      label: control.label,
    });

    const InputProps = React.useMemo(
      () => ({
        startAdornment: <InputAdornment position="start">{symbol || "$"}</InputAdornment>,
      }),
      [symbol],
    );

    return useFormControl({
      control,
      className: className,
      onScreenDataChange: chOnScreenData,
      renderValue: (value) => `${symbol || "$"} ${value}`,
      render: ({ onChange, forId, value, error, inlineLabel, renderExplanation, disabled }) => {
        const typedValue = value as CurrencyControl["value"];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        };

        return (
          <>
            {withFallback({
              onChange: handleChange,
              label: inlineLabel,
              value: typedValue,
              variant: "outlined",
              id: forId,
              error: error !== undefined,
              helperText: error?.message || " ",
              InputProps,
              disabled: control.disabled || disabled,
              onFocus: markAsActiveForExplSidebar,
              onBlur: resetExplSidebarActive,
              ...textFieldProps,
            })}

            {renderExplanation()}
          </>
        );
      },
    });
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Currency`,
  },
);

export default CurrencyControlWidget;
