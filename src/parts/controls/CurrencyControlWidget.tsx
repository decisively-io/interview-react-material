import type { CurrencyControl } from "@decisively-io/interview-sdk";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

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
    const { attribute, symbol } = control;

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
      render: ({ onChange, forId, value, error, inlineLabel, renderExplanation }) => {
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
              disabled: control.disabled,
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
    /*** @deprecated use `Currency` directly instead */
    _: null as any as React.ComponentType<CurrencyControlWidgetProps>,
  },
);
CurrencyControlWidget._ = CurrencyControlWidget;

/*** @deprecated use `Currency` directly instead */
export const _ = CurrencyControlWidget;

export default CurrencyControlWidget;
