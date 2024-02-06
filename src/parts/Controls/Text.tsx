import { AttributeData } from "@decisively-io/types-interview";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { IText, deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";

export interface TextProps {
  c: IText;
  textFieldProps?: TextFieldProps;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

type IParam = TextFieldProps;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const withFallback = (arg: IParam) => (typeof arg.value === "string" ? <StyledTextField {...arg} /> : <StyledTextField {...arg} value="" />);

export const _: React.FC<TextProps> = React.memo(({ c, textFieldProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute, multi, variation } = c;
  const interview = React.useContext(InterviewContext);
  const explanation = interview?.getExplanation(attribute);

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
          <FormControl explanation={explanation} title={c.label} className={className}>
            {({ Explanation }) => (
              <>
                <Explanation visible={c.showExplanation} />
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
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Text`;
