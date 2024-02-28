import { NumberOfInstancesControl } from "@decisively-io/interview-sdk";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel } from "../../util/controls";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import { ControlRenderProps } from "./ControlRenderTypes";
import FormControl from "./FormControl";

export interface NumberOfInstancesControlRenderProps extends ControlRenderProps<NumberOfInstancesControl> {
  textFieldProps?: Omit<TextFieldProps, "value">;
  className?: string;
}

type Value = number | null | undefined;

type IArg = { value: Value } & NonNullable<NumberOfInstancesControlRenderProps["textFieldProps"]>;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const withFallback = (arg: IArg) => (arg.value === undefined || arg.value === null ? <StyledTextField {...arg} value="" /> : <StyledTextField {...arg} />);

const NumberOfInstancesControlRender = Object.assign(
  React.memo((props: NumberOfInstancesControlRenderProps) => {
    const { control, textFieldProps, className } = props;
    const { control: formControl } = useFormContext();
    const { entity } = control;

    return (
      <Controller
        control={formControl}
        name={entity}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const typedValue = value as Value;

          return (
            <FormControl title={control.label} className={className}>
              {withFallback({
                onChange,
                label: deriveLabel(control),
                value: typedValue,
                variant: "outlined",
                error: error !== undefined,
                helperText: error?.message || " ",
                disabled: control.disabled,
                ...textFieldProps,
              })}
            </FormControl>
          );
        }}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/NumberOfInstancesInput`,
    /*** @deprecated use `NumberOfInstancesInput` directly */
    _: null as any as React.ComponentType<NumberOfInstancesControlRenderProps>,
  },
);
NumberOfInstancesControlRender._ = NumberOfInstancesControlRender;

/*** @deprecated use `NumberOfInstancesInput` directly */
export const _ = NumberOfInstancesControlRender;

export default NumberOfInstancesControlRender;
