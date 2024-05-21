import type { NumberOfInstancesControl } from "@decisively-io/interview-sdk";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface NumberOfInstancesControlWidgetProps extends ControlWidgetProps<NumberOfInstancesControl> {
  textFieldProps?: Omit<TextFieldProps, "value">;
  className?: string;
}

type Value = number | null | undefined;

type IArg = { value: Value } & NonNullable<NumberOfInstancesControlWidgetProps["textFieldProps"]>;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const withFallback = (arg: IArg) =>
  arg.value === undefined || arg.value === null ? (
    <StyledTextField
      {...arg}
      value=""
    />
  ) : (
    <StyledTextField {...arg} />
  );

const NumberOfInstancesControlWidget = Object.assign(
  React.memo((props: NumberOfInstancesControlWidgetProps) => {
    const { control, textFieldProps, className } = props;

    const FormControl = useFormControl({
      control,
      className: className,
    });

    return (
      <FormControl>
        {({ onChange, forId, value, error, inlineLabel }) => {
          const typedValue = value as Value;

          return withFallback({
            onChange,
            label: inlineLabel,
            value: typedValue,
            variant: "outlined",
            id: forId,
            error: error !== undefined,
            helperText: error?.message || " ",
            disabled: control.disabled,
            ...textFieldProps,
          });
        }}
      </FormControl>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/NumberOfInstancesControlWidget`,
    /*** @deprecated use `NumberOfInstancesControlWidget` directly */
    _: null as any as React.ComponentType<NumberOfInstancesControlWidgetProps>,
  },
);
NumberOfInstancesControlWidget._ = NumberOfInstancesControlWidget;

/*** @deprecated use `NumberOfInstancesControlWidget` directly */
export const _ = NumberOfInstancesControlWidget;

export default NumberOfInstancesControlWidget;
