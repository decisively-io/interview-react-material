import { AttributeData } from "@decisively-io/types-interview";
import { DateTimePicker, DateTimePickerProps } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { DATE_TIME_FORMAT_12, DATE_TIME_FORMAT_24, IDateTime, deriveLabel, resolveNowInDate } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";

export interface DateTimeProps {
  c: IDateTime;
  dateTimePickerProps?: Partial<DateTimePickerProps>;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

const StyledDateTimePicker = styled(DateTimePicker)`
  flex: 1;
)`;

export const _: React.FC<DateTimeProps> = React.memo(({ c, dateTimePickerProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { date_max, date_min, minutes_increment, amPmFormat, attribute } = c;

  const uiTimeFormat = amPmFormat ? DATE_TIME_FORMAT_12 : DATE_TIME_FORMAT_24;

  const nowLessDateMax = resolveNowInDate(date_max);
  const nowLessDateMin = resolveNowInDate(date_min);

  const maxDate = nowLessDateMax ? new Date(`${nowLessDateMax}T23:59:59`) : undefined;
  const minDate = nowLessDateMin ? new Date(`${nowLessDateMin}T23:59:59`) : undefined;

  const interview = React.useContext(InterviewContext);
  const explanation = interview?.getExplanation(attribute);

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDateTime["value"];

        const handleChange = (d: MaterialUiPickersDate) => {
          if (d) {
            if (chOnScreenData) {
              chOnScreenData({ [attribute]: format(d, DATE_TIME_FORMAT_24) });
            }

            onChange(format(d, DATE_TIME_FORMAT_24));
          }
        };

        return (
          <FormControl explanation={explanation} title={c.label} className={className}>
            {({ Explanation }) => (
              <>
                <Explanation visible={c.showExplanation} />

                <StyledDateTimePicker
                  label={deriveLabel(c)}
                  error={error !== undefined}
                  helperText={error?.message || " "}
                  value={typeof typedValue === "string" ? new Date(value) : null}
                  onChange={handleChange}
                  format={uiTimeFormat}
                  inputVariant="outlined"
                  ampm={Boolean(amPmFormat)}
                  minutesStep={minutes_increment}
                  maxDate={maxDate}
                  minDate={minDate}
                  disabled={c.disabled}
                  {...dateTimePickerProps}
                />
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/DateTime`;
