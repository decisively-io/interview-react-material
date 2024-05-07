import { AttributeValues, type CurrencyControl } from "@decisively-io/interview-sdk";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import FormControl from "./FormControl";

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
    const { control: formControl } = useFormContext();
    const { attribute, symbol } = control;

    const InputProps = React.useMemo(
      () => ({
        startAdornment: <InputAdornment position="start">{symbol || "$"}</InputAdornment>,
      }),
      [symbol],
    );

    const interview = React.useContext(InterviewContext);
    const explanation = interview?.getExplanation(attribute);

    return (
      <Controller
        control={formControl}
        name={attribute}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const typedValue = value as CurrencyControl["value"];

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (chOnScreenData) {
              chOnScreenData({ [attribute]: e.target.value });
            }

            onChange(e.target.value);
          };

          return (
            <FormControl
              explanation={explanation}
              title={control.label}
              className={className}
            >
              {({ Explanation }) => (
                <>
                  {withFallback({
                    onChange: handleChange,
                    label: deriveLabel(control),
                    value: typedValue,
                    variant: "outlined",
                    error: error !== undefined,
                    helperText: error?.message || " ",
                    InputProps,
                    disabled: control.disabled,
                    ...textFieldProps,
                  })}

                  <Explanation visible={control.showExplanation} />
                </>
              )}
            </FormControl>
          );
        }}
      />
    );
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
