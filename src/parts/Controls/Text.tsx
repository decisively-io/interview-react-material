import { AttributeData } from "@decisively-io/types-interview";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IText, deriveLabel } from "../../types/controls";
import * as FormControl from "./__formControl";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface IProps {
  c: IText;
  textFieldProps?: TextFieldProps;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

type IParam = TextFieldProps;

const withFallback = (arg: IParam) => (typeof arg.value === "string" ? <TextField {...arg} /> : <TextField {...arg} value="" />);

export const _: React.FC<IProps> = React.memo(({ c, textFieldProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute, multi, variation } = c;

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

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as IText["value"];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (chOnScreenData) {
            chOnScreenData({ [attribute]: e.target.value });
          }

          onChange(e.target.value);
        };

        return (
          <FormControl._ title={c.label} className={className}>
            {withFallback({
              onChange: handleChange,
              label: deriveLabel(c),
              value: typedValue,
              variant: "outlined",
              error: error !== undefined,
              helperText: error?.message || " ",
              disabled: c.disabled,
              ...maybeWithType,
              ...maybeWithMulti,
              ...textFieldProps,
            })}
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Text`;
