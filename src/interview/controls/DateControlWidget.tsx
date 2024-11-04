import { DATE_FORMAT, type DateControl, formatDate } from "@decisively-io/interview-sdk";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { DatePicker, type DatePickerProps } from "@material-ui/pickers";
import type { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { resolveNowInDate } from "../../util";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import { useExplSidebarActiveElStateHelpers } from "../../providers/InterviewContext";

export interface DateControlWidgetProps
  extends ControlWidgetProps<DateControl & { manualControlsCssOverride?: string }> {
  datePickerProps?: Partial<DatePickerProps>;
  className?: string;
}

const ManualControlsWrap = styled(Box)<{ $cssOverride?: string }>`
  ${(p) => p.$cssOverride};
`;

const StyledDatePicker = styled(DatePicker)`
  flex: 1;
  `;

const DateControlWidget = Object.assign(
  React.memo((props: DateControlWidgetProps) => {
    const { control, chOnScreenData, datePickerProps, className } = props;
    const { attribute, max, min, allowManual, manualControlsCssOverride, disabled } = control;
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

    const { markAsActiveForExplSidebar, resetExplSidebarActive } = useExplSidebarActiveElStateHelpers({
      attributeId: control.attribute,
      label: control.label,
    });

    return useFormControl({
      control,
      className: className,
      onScreenDataChange: chOnScreenData,
      render: ({ onChange, forId, value, error, inlineLabel, renderExplanation, disabled }) => {
        const typedValue = value as DateControl["value"];
        const manualInputProps: TextFieldProps = {
          label: inlineLabel,
          error: error !== undefined,
          helperText: error?.message || " ",
          value,
          variant: "outlined",
          onChange,
          fullWidth: true,
          disabled: control.disabled || disabled,
        };

        const handleChange = (d: MaterialUiPickersDate) => {
          if (d) {
            onChange(formatDate(d, DATE_FORMAT));
          }
        };

        return (
          <>
            <StyledDatePicker
              {...{
                label: inlineLabel,
                error: error !== undefined,
                helperText: error?.message || " ",
                value:
                  typeof typedValue === "string" ? (typedValue === "now" ? new Date() : new Date(typedValue)) : null,
                onChange: handleChange,
                format: DATE_FORMAT,
                id: forId,
                maxDate: resolvedMax && new Date(resolvedMax),
                minDate: resolvedMin && new Date(resolvedMin),
                inputVariant: "outlined",
                disabled: control.disabled || disabled,
                style: datePickerStyle,
                inputRef: datePickerRef,
                onFocus: markAsActiveForExplSidebar,
                onBlur: resetExplSidebarActive,
                ...datePickerProps,
              }}
            />

            {Boolean(allowManual) === false ? null : (
              <ManualControlsWrap
                display="flex"
                width="100%"
                gridGap="0.5rem"
                alignItems="center"
                $cssOverride={manualControlsCssOverride}
              >
                <Box flexGrow="1">
                  {value === undefined || value === null ? (
                    <TextField
                      onFocus={markAsActiveForExplSidebar}
                      onBlur={resetExplSidebarActive}
                      {...{
                        ...manualInputProps,
                        value: "",
                      }}
                    />
                  ) : (
                    <TextField
                      onFocus={markAsActiveForExplSidebar}
                      onBlur={resetExplSidebarActive}
                      {...manualInputProps}
                    />
                  )}
                </Box>

                <Box
                  flexShrink="0"
                  marginTop="-1.25rem"
                >
                  <IconButton onClick={emulateClickOnPicker}>
                    <CalendarTodayIcon />
                  </IconButton>
                </Box>
              </ManualControlsWrap>
            )}

            {renderExplanation()}
          </>
        );
      },
    });
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Date`,
  },
);

export default DateControlWidget;
