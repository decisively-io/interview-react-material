import type { AttributeValues, BooleanControl } from "@decisively-io/interview-sdk";
import Checkbox, { type CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel, { type FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import ControlError from "./ControlError";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import FormControl from "./FormControl";

export interface BooleanControlWidgetProps extends ControlWidgetProps<BooleanControl> {
  checkboxProps?: CheckboxProps;
  formControlLabelProps?: FormControlLabelProps;
  chOnScreenData?: (data: AttributeValues) => void;
  className?: string;
}

const BooleanControlWidget = Object.assign(
  React.memo((props: BooleanControlWidgetProps) => {
    const { control, checkboxProps, chOnScreenData, className } = props;
    const { control: formControl } = useFormContext();
    const { attribute } = control;
    const interview = React.useContext(InterviewContext);
    const explanation = interview?.getExplanation(attribute);

    return (
      <Controller
        control={formControl}
        name={attribute}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const typedValue = value as BooleanControl["value"];

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (chOnScreenData) {
              chOnScreenData({ [attribute]: e.target.checked });
            }

            onChange(e.target.checked);
          };

          return (
            <FormControl
              explanation={explanation}
              title={control.label}
              disabled={control.disabled}
              className={className}
            >
              {({ Explanation }) => (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleChange}
                        checked={typedValue || false}
                        indeterminate={typeof typedValue !== "boolean"}
                        {...checkboxProps}
                      />
                    }
                    label={deriveLabel(control)}
                  />

                  <Explanation
                    visible={control.showExplanation}
                    style={{ marginTop: 4 }}
                  />

                  <ControlError>{error?.message || " "}</ControlError>
                </>
              )}
            </FormControl>
          );
        }}
      />
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
