import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { INumberOfInstances, deriveLabel } from "../../util/controls";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";

export interface NumberOfInstancesProps {
  c: INumberOfInstances;
  textFieldProps?: Omit<TextFieldProps, "value">;
  className?: string;
}

type Value = number | null | undefined;

type IArg = { value: Value } & NonNullable<NumberOfInstancesProps["textFieldProps"]>;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const withFallback = (arg: IArg) => (arg.value === undefined || arg.value === null ? <StyledTextField {...arg} value="" /> : <StyledTextField {...arg} />);

export const _: React.FC<NumberOfInstancesProps> = React.memo(({ c, textFieldProps, className }) => {
  const { control } = useFormContext();
  const { entity } = c;

  return (
    <Controller
      control={control}
      name={entity}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as Value;

        return (
          <FormControl title={c.label} className={className}>
            {withFallback({
              onChange,
              label: deriveLabel(c),
              value: typedValue,
              variant: "outlined",
              error: error !== undefined,
              helperText: error?.message || " ",
              disabled: c.disabled,
              ...textFieldProps,
            })}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/NumberOfInstances`;
