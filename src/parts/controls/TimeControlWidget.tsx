import { TIME_FORMAT_12, TIME_FORMAT_24, type TimeControl } from "@decisively-io/interview-sdk";
import { TimePicker, type TimePickerProps } from "@material-ui/pickers";
import type { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import FormControl from "./FormControl";

export interface TimeControlWidgetProps extends ControlWidgetProps<TimeControl> {
  timePickerProps?: Partial<TimePickerProps>;
  className?: string;
}

const StyledTimePicker = styled(TimePicker)`
  flex: 1;
`;

export const secondLessViews: React.ComponentProps<typeof TimePicker>["views"] = ["hours", "minutes"];
export const allViews: React.ComponentProps<typeof TimePicker>["views"] = ["hours", "minutes", "seconds"];

const TimeControlWidget = Object.assign(
  React.memo((props: TimeControlWidgetProps) => {
    const { control, timePickerProps, chOnScreenData, className } = props;
    const { control: formControl } = useFormContext();
    const { attribute, amPmFormat, minutes_increment, allowSeconds } = control;
    let uiTimeFormat = amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24;
    const interview = React.useContext(InterviewContext);
    const explanation = interview?.getExplanation(attribute);

    // strip seconds from display
    if (!allowSeconds) {
      uiTimeFormat = uiTimeFormat.replace(":ss", "");
    }

    return (
      <Controller
        control={formControl}
        name={attribute}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const typedValue = value as TimeControl["value"];
          const compValue = typeof typedValue === "string" ? new Date(`1970-01-01T${value}`) : null;

          const handleChange = (d: MaterialUiPickersDate) => {
            if (d) {
              if (chOnScreenData) {
                chOnScreenData({ [attribute]: format(d, TIME_FORMAT_24) });
              }

              onChange(format(d, TIME_FORMAT_24));
            }
          };

          return (
            <FormControl
              explanation={explanation}
              title={control.label}
              className={className}
            >
              {({ Explanation }) => (
                <>
                  <Explanation visible={control.showExplanation} />
                  <StyledTimePicker
                    label={deriveLabel(control)}
                    error={error !== undefined}
                    helperText={error?.message || " "}
                    value={compValue}
                    onChange={handleChange}
                    format={uiTimeFormat}
                    inputVariant="outlined"
                    ampm={Boolean(amPmFormat)}
                    minutesStep={minutes_increment}
                    views={allowSeconds ? allViews : secondLessViews}
                    disabled={control.disabled}
                    {...timePickerProps}
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
    displayName: `${DISPLAY_NAME_PREFIX}/TimeInput`,
    /*** @deprecated use `TimeInput` directly */
    _: null as any as React.ComponentType<TimeControlWidgetProps>,
  },
);
TimeControlWidget._ = TimeControlWidget;

/*** @deprecated use `TimeInput` directly */
export const _ = TimeControlWidget;

export default TimeControlWidget;
