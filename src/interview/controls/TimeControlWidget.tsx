import { TIME_FORMAT_12, TIME_FORMAT_24, type TimeControl, formatDate } from "@decisively-io/interview-sdk";
import { TimePicker, type TimePickerProps } from "@material-ui/pickers";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

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
    const { amPmFormat, minutes_increment, allowSeconds } = control;
    let uiTimeFormat = amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24;

    // strip seconds from display
    if (!allowSeconds) {
      uiTimeFormat = uiTimeFormat.replace(":ss", "");
    }

    return useFormControl({
      control,
      className: className,
      onScreenDataChange: chOnScreenData,
      // renderValue: (value) => `${value}`, // TODO: figure out how to convert 24 hour time to am/pm format if amPmFormat is ture
      render: ({ onChange, value, error, forId, inlineLabel, renderExplanation, disabled }) => {
        const typedValue = value as TimeControl["value"];
        const compValue = typeof typedValue === "string" ? new Date(`1970-01-01T${value}`) : null;

        return (
          <>
            <StyledTimePicker
              label={inlineLabel}
              error={error !== undefined}
              helperText={error?.message || " "}
              id={forId}
              value={compValue}
              onChange={(value) => onChange(formatDate(value as any, TIME_FORMAT_24))}
              format={uiTimeFormat}
              inputVariant="outlined"
              ampm={Boolean(amPmFormat)}
              minutesStep={minutes_increment}
              views={allowSeconds ? allViews : secondLessViews}
              disabled={control.disabled || disabled}
              {...timePickerProps}
            />

            {renderExplanation()}
          </>
        );
      },
    });
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/TimeControlWidget`,
  },
);

export default TimeControlWidget;
