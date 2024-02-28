import { AttributeData, BooleanControl } from "@decisively-io/interview-sdk";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel, { FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import ControlError from "./ControlError";
import { ControlRenderProps } from "./ControlRenderTypes";
import FormControl from "./FormControl";

export interface BooleanControlRenderProps extends ControlRenderProps<BooleanControl> {
  checkboxProps?: CheckboxProps;
  formControlLabelProps?: FormControlLabelProps;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

const BooleanControlRender = Object.assign(
  React.memo((props: BooleanControlRenderProps) => {
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
            <FormControl explanation={explanation} title={control.label} disabled={control.disabled} className={className}>
              {({ Explanation }) => (
                <>
                  <Explanation visible={control.showExplanation} style={{ marginTop: 4 }} />
                  <FormControlLabel control={<Checkbox onChange={handleChange} checked={typedValue || false} indeterminate={typeof typedValue !== "boolean"} {...checkboxProps} />} label={deriveLabel(control)} />
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
    _: undefined as any as React.ComponentType<BooleanControlRenderProps>,
  },
);
BooleanControlRender._ = BooleanControlRender;

/*** @deprecated use `Boolean` directly */
export const _ = BooleanControlRender;

export default BooleanControlRender;
