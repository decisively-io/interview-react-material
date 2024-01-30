import { AttributeData } from "@decisively-io/types-interview";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { DatePicker, DatePickerProps } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { DATE_FORMAT, IDate, deriveLabel, resolveNowInDate } from "../../util/controls";
import { InterviewContext } from "../index";
import FormControl from "./FormControl";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface DateProps {
  c: IDate & { manualControlsCssOverride?: string };
  datePickerProps?: Partial<DatePickerProps>;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

const ManualControlsWrap = styled(Box)<{ $cssOverride?: string }>`
  ${(p) => p.$cssOverride};
`;

export const _: React.FC<DateProps> = React.memo(({ c, datePickerProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute, max, min, allowManual, manualControlsCssOverride, disabled } = c;
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  const resolvedMax = resolveNowInDate(max);
  const resolvedMin = resolveNowInDate(min);

  const datePickerStyle = React.useMemo<React.CSSProperties>(
    () =>
      allowManual
        ? {
            visibility: "hidden",
            position: "absolute",
          }
        : {},
    [allowManual],
  );

  const emulateClickOnPicker = React.useCallback(() => datePickerRef.current?.click(), []);

  const interview = React.useContext(InterviewContext);
  const explanation = interview?.getExplanation(attribute);

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDate["value"];
        const manualInputProps: TextFieldProps = {
          label: deriveLabel(c),
          error: error !== undefined,
          helperText: error?.message || " ",
          value,
          variant: "outlined",
          onChange,
          fullWidth: true,
          disabled: c.disabled,
        };

        const handleChange = (d: MaterialUiPickersDate) => {
          if (d) {
            if (chOnScreenData) {
              chOnScreenData({ [attribute]: format(d, DATE_FORMAT) });
            }

            onChange(format(d, DATE_FORMAT));
          }
        };

        return (
          <FormControl explanation={explanation} title={c.label} className={className}>
            {({ Explanation }) => (
              <>
                <DatePicker
                  {...{
                    label: deriveLabel(c),
                    error: error !== undefined,
                    helperText: error?.message || " ",
                    value: typeof typedValue === "string" ? (typedValue === "now" ? new Date() : new Date(typedValue)) : null,
                    onChange: handleChange,
                    format: DATE_FORMAT,
                    maxDate: resolvedMax && new Date(resolvedMax),
                    minDate: resolvedMin && new Date(resolvedMin),
                    inputVariant: "outlined",
                    disabled: c.disabled,
                    style: datePickerStyle,
                    inputRef: datePickerRef,
                    ...datePickerProps,
                  }}
                />

                {Boolean(allowManual) === false ? null : (
                  <ManualControlsWrap display="flex" width="100%" gridGap="0.5rem" alignItems="center" $cssOverride={manualControlsCssOverride}>
                    <Explanation visible={c.showExplanation} />
                    <Box flexGrow="1">
                      {value === undefined || value === null ? (
                        <TextField
                          {...{
                            ...manualInputProps,
                            value: "",
                          }}
                        />
                      ) : (
                        <TextField {...manualInputProps} />
                      )}
                    </Box>

                    <Box flexShrink="0" marginTop="-1.25rem">
                      <IconButton onClick={emulateClickOnPicker}>
                        <CalendarTodayIcon />
                      </IconButton>
                    </Box>
                  </ManualControlsWrap>
                )}
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Date`;
