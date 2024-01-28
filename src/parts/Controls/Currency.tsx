import { AttributeData } from "@decisively-io/types-interview";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { ICurrency, deriveLabel } from "../../types/controls";
import { InterviewContext } from "../index";
import FormControl from "./FormControl";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface CurrencyProps {
  c: ICurrency;
  textFieldProps?: Omit<TextFieldProps, "value">;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

type IArg = { value: ICurrency["value"] } & NonNullable<CurrencyProps["textFieldProps"]>;

const StyledTextField = styled(TextField)`
  flex: 1;
`;
const withFallback = (arg: IArg) => (arg.value === null || arg.value === undefined ? <StyledTextField {...arg} value="" /> : <StyledTextField {...arg} />);

export const _: React.FC<CurrencyProps> = React.memo(({ c, textFieldProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute, symbol } = c;

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
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as ICurrency["value"];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (chOnScreenData) {
            chOnScreenData({ [attribute]: e.target.value });
          }

          onChange(e.target.value);
        };

        return (
          <FormControl explanation={explanation} title={c.label} className={className}>
            {({ Explanation }) => (
              <>
                <Explanation />
                {withFallback({
                  onChange: handleChange,
                  label: deriveLabel(c),
                  value: typedValue,
                  variant: "outlined",
                  error: error !== undefined,
                  helperText: error?.message || " ",
                  InputProps,
                  disabled: c.disabled,
                  ...textFieldProps,
                })}
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Currency`;
