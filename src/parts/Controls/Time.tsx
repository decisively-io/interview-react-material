import { AttributeData } from "@decisively-io/types-interview";
import { TimePicker, TimePickerProps } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { ITime, TIME_FORMAT_12, TIME_FORMAT_24, deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";

export interface TimeProps {
  c: ITime;
  timePickerProps?: Partial<TimePickerProps>;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

const StyledTimePicker = styled(TimePicker)`
  flex: 1;
`;

export const secondLessViews: React.ComponentProps<typeof TimePicker>["views"] = ["hours", "minutes"];
export const allViews: React.ComponentProps<typeof TimePicker>["views"] = ["hours", "minutes", "seconds"];

export const _: React.FC<TimeProps> = React.memo(({ c, timePickerProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute, amPmFormat, minutes_increment, allowSeconds } = c;
  let uiTimeFormat = amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24;
  const interview = React.useContext(InterviewContext);
  const explanation = interview?.getExplanation(attribute);

  // strip seconds from display
  if (!allowSeconds) {
    uiTimeFormat = uiTimeFormat.replace(":ss", "");
  }

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as ITime["value"];
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
          <FormControl explanation={explanation} title={c.label} className={className}>
            {({ Explanation }) => (
              <>
                <Explanation visible={c.showExplanation} />
                <StyledTimePicker
                  label={deriveLabel(c)}
                  error={error !== undefined}
                  helperText={error?.message || " "}
                  value={compValue}
                  onChange={handleChange}
                  format={uiTimeFormat}
                  inputVariant="outlined"
                  ampm={Boolean(amPmFormat)}
                  minutesStep={minutes_increment}
                  views={allowSeconds ? allViews : secondLessViews}
                  disabled={c.disabled}
                  {...timePickerProps}
                />
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Time`;
