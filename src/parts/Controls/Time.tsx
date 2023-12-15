import { AttributeData } from "@decisively-io/types-interview";
import { TimePicker, TimePickerProps } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ITime, TIME_FORMAT_12, TIME_FORMAT_24, deriveLabel } from "../../types/controls";
import * as FormControl from "./__formControl";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface IProps {
  c: ITime;
  timePickerProps?: Partial<TimePickerProps>;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

export const secondLessViews: React.ComponentProps<typeof TimePicker>["views"] = ["hours", "minutes"];
export const allViews: React.ComponentProps<typeof TimePicker>["views"] = ["hours", "minutes", "seconds"];

export const _: React.FC<IProps> = React.memo(({ c, timePickerProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute, amPmFormat, minutes_increment, allowSeconds } = c;
  let uiTimeFormat = amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24;

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
          <FormControl._ title={c.label} className={className}>
            <TimePicker
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
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Time`;
