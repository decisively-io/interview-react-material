import { AttributeData, DATE_TIME_FORMAT_12, DATE_TIME_FORMAT_24, type DateTimeControl } from "@decisively-io/interview-sdk";
import { DateTimePicker, type DateTimePickerProps } from "@material-ui/pickers";
import type { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel, resolveNowInDate } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import FormControl from "./FormControl";

export interface DateTimeControlWidgetProps extends ControlWidgetProps<DateTimeControl> {
  dateTimePickerProps?: Partial<DateTimePickerProps>;
  className?: string;
}

const StyledDateTimePicker = styled(DateTimePicker)`
  flex: 1;
)`;

const DateTimeControlWidget = Object.assign(
  React.memo((props: DateTimeControlWidgetProps) => {
    const { control, className, chOnScreenData, dateTimePickerProps } = props;
    const { control: formControl } = useFormContext();
    const { date_max, date_min, minutes_increment, amPmFormat, attribute } = control;

    const uiTimeFormat = amPmFormat ? DATE_TIME_FORMAT_12 : DATE_TIME_FORMAT_24;

    const nowLessDateMax = resolveNowInDate(date_max);
    const nowLessDateMin = resolveNowInDate(date_min);

    const maxDate = nowLessDateMax ? new Date(`${nowLessDateMax}T23:59:59`) : undefined;
    const minDate = nowLessDateMin ? new Date(`${nowLessDateMin}T23:59:59`) : undefined;

    const interview = React.useContext(InterviewContext);
    const explanation = interview?.getExplanation(attribute);

    return (
      <Controller
        control={formControl}
        name={attribute}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const typedValue = value as DateTimeControl["value"];

          const handleChange = (d: MaterialUiPickersDate) => {
            if (d) {
              if (chOnScreenData) {
                chOnScreenData({ [attribute]: format(d, DATE_TIME_FORMAT_24) });
              }

              onChange(format(d, DATE_TIME_FORMAT_24));
            }
          };

          return (
            <FormControl explanation={explanation} title={control.label} className={className}>
              {({ Explanation }) => (
                <>
                  <Explanation visible={control.showExplanation} />

                  <StyledDateTimePicker
                    label={deriveLabel(control)}
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
                    disabled={control.disabled}
                    {...dateTimePickerProps}
                  />
                </>
              )}
            </FormControl>
          );
        }}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/DateTimeControlWidget`,
    /*** @deprecated use `DateTimeControlWidget` directly */
    _: null as any as React.ComponentType<DateTimeControlWidgetProps>,
  },
);
DateTimeControlWidget._ = DateTimeControlWidget;

/*** @deprecated use `DateTimeControlWidget` directly */
export const _ = DateTimeControlWidget;

export default DateTimeControlWidget;
