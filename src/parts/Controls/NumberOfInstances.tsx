import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { INumberOfInstances, deriveLabel } from "../../types/controls";
import * as FormControl from "./__formControl";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface NumberOfInstancesProps {
  c: INumberOfInstances;
  textFieldProps?: Omit<TextFieldProps, "value">;
  className?: string;
}

type Value = number | null | undefined;

type IArg = { value: Value } & NonNullable<NumberOfInstancesProps["textFieldProps"]>;

const withFallback = (arg: IArg) => (arg.value === undefined || arg.value === null ? <TextField {...arg} value="" /> : <TextField {...arg} />);

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
          <FormControl._ title={c.label} className={className}>
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
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/NumberOfInstances`;
