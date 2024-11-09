import type { AttributeValues, BooleanControl } from "@decisively-io/interview-sdk";
import Checkbox, { type CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel, { type FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import React from "react";
import { useFormControl } from "../../FormControl";
import { useExplSidebarActiveElStateHelpers } from "../../providers/InterviewContext";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import ControlError from "./ControlError";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface BooleanControlWidgetProps extends ControlWidgetProps<BooleanControl> {
  checkboxProps?: CheckboxProps;
  formControlLabelProps?: FormControlLabelProps;
  chOnScreenData?: (data: AttributeValues) => void;
  className?: string;
}

const BooleanControlWidget = Object.assign(
  React.memo((props: BooleanControlWidgetProps) => {
    const { control, checkboxProps, chOnScreenData, className } = props;
    const { markAsActiveForExplSidebar, resetExplSidebarActive } = useExplSidebarActiveElStateHelpers({
      attributeId: control.attribute,
      label: control.label,
    });

    return useFormControl({
      control,
      className: className,
      onScreenDataChange: chOnScreenData,
      render: ({ onChange, value, forId, error, inlineLabel, renderExplanation, disabled }) => {
        const typedValue = value as BooleanControl["value"];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.checked);
        };

        return (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChange}
                  id={forId}
                  checked={typedValue || false}
                  indeterminate={typeof typedValue !== "boolean"}
                  disabled={checkboxProps ? checkboxProps.disabled : disabled}
                  {...checkboxProps}
                />
              }
              htmlFor={forId}
              label={inlineLabel}
              disabled={props.formControlLabelProps ? props.formControlLabelProps.disabled : disabled}
              onFocus={markAsActiveForExplSidebar}
              onBlur={resetExplSidebarActive}
              {...props.formControlLabelProps}
            />

            {renderExplanation({
              style: { marginTop: 4 },
            })}

            <ControlError>{error?.message || " "}</ControlError>
          </>
        );
      },
    });
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Boolean`,
  },
);

export default BooleanControlWidget;
