import type { AttributeValues, BooleanControl } from "@decisively-io/interview-sdk";
import Checkbox, { type CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel, { type FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import React from "react";
import { useFormControl } from "../../FormControl";
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

    const FormControl = useFormControl({
      control,
      className: className,
      onScreenDataChange: chOnScreenData,
    });

    return (
      <FormControl>
        {({ onChange, value, forId, error, inlineLabel, renderExplanation }) => {
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
                    {...checkboxProps}
                  />
                }
                htmlFor={forId}
                label={inlineLabel}
                {...props.formControlLabelProps}
              />

              {renderExplanation({
                style: { marginTop: 4 },
              })}

              <ControlError>{error?.message || " "}</ControlError>
            </>
          );
        }}
      </FormControl>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Boolean`,
    /*** @deprecated use `Boolean` directly */
    _: undefined as any as React.ComponentType<BooleanControlWidgetProps>,
  },
);
BooleanControlWidget._ = BooleanControlWidget;

/*** @deprecated use `Boolean` directly */
export const _ = BooleanControlWidget;

export default BooleanControlWidget;
