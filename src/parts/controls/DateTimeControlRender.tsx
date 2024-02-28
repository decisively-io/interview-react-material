import { AttributeData, DATE_TIME_FORMAT_12, DATE_TIME_FORMAT_24, DateTimeControl } from "@decisively-io/interview-sdk";
import { DateTimePicker, DateTimePickerProps } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel, resolveNowInDate } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import { ControlRenderProps } from "./ControlRenderTypes";
import FormControl from "./FormControl";

export interface DateTimeControlRenderProps extends ControlRenderProps<DateTimeControl> {
  dateTimePickerProps?: Partial<DateTimePickerProps>;
  className?: string;
}

const StyledDateTimePicker = styled(DateTimePicker)`
  flex: 1;
)`;

const DateTimeControlRender = Object.assign(
  React.memo((props: DateTimeControlRenderProps) => {
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
    displayName: `${DISPLAY_NAME_PREFIX}/DateTimeInput`,
    /*** @deprecated use `DateTimeInput` directly */
    _: null as any as React.ComponentType<DateTimeControlRenderProps>,
  },
);
DateTimeControlRender._ = DateTimeControlRender;

/*** @deprecated use `DateTimeInput` directly */
export const _ = DateTimeControlRender;

export default DateTimeControlRender;
