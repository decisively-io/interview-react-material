import {
  DATE_TIME_FORMAT_12,
  DATE_TIME_FORMAT_24,
  type DateTimeControl,
  formatDate,
} from "@decisively-io/interview-sdk";
import { DateTimePicker, type DateTimePickerProps } from "@material-ui/pickers";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { resolveNowInDate } from "../../util";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface DateTimeControlWidgetProps extends ControlWidgetProps<DateTimeControl> {
  dateTimePickerProps?: Partial<DateTimePickerProps>;
  className?: string;
}

const StyledDateTimePicker = styled(DateTimePicker)`
  flex: 1;
`;

const DateTimeControlWidget = React.memo((props: DateTimeControlWidgetProps) => {
  const { control, className, chOnScreenData, dateTimePickerProps } = props;
  const { date_max, date_min, minutes_increment, amPmFormat } = control;

  const uiTimeFormat = amPmFormat ? DATE_TIME_FORMAT_12 : DATE_TIME_FORMAT_24;

  const nowLessDateMax = resolveNowInDate(date_max);
  const nowLessDateMin = resolveNowInDate(date_min);

  const maxDate = nowLessDateMax ? new Date(`${nowLessDateMax}T23:59:59`) : undefined;
  const minDate = nowLessDateMin ? new Date(`${nowLessDateMin}T23:59:59`) : undefined;

  return useFormControl({
    control,
    className: className,
    onScreenDataChange: chOnScreenData,
    render: ({ onChange, value, forId, error, inlineLabel, renderExplanation, disabled }) => (
      <>
        <StyledDateTimePicker
          label={inlineLabel}
          error={error !== undefined}
          helperText={error?.message || " "}
          value={typeof value === "string" ? new Date(value) : null}
          onChange={(value) => onChange(formatDate(value as any, DATE_TIME_FORMAT_24))}
          format={uiTimeFormat}
          id={forId}
          inputVariant="outlined"
          ampm={Boolean(amPmFormat)}
          minutesStep={minutes_increment}
          maxDate={maxDate}
          minDate={minDate}
          disabled={control.disabled || disabled}
          {...dateTimePickerProps}
        />

        {renderExplanation()}
      </>
    ),
  });
});

export default DateTimeControlWidget;
