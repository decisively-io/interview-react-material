import { AttributeData } from "@decisively-io/types-interview";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel, { FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IBoolean, deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";
import * as ErrorComp from "./__error";

export interface BooleanProps {
  c: IBoolean;
  checkboxProps?: CheckboxProps;
  formControlLabelProps?: FormControlLabelProps;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

export const _: React.FC<BooleanProps> = React.memo(({ c, checkboxProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const { attribute } = c;
  const interview = React.useContext(InterviewContext);
  const explanation = interview?.getExplanation(attribute);

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as IBoolean["value"];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (chOnScreenData) {
            chOnScreenData({ [attribute]: e.target.checked });
          }

          onChange(e.target.checked);
        };

        return (
          <FormControl explanation={explanation} title={c.label} disabled={c.disabled} className={className}>
            {({ Explanation }) => (
              <>
                <Explanation visible={c.showExplanation} style={{ marginTop: 4 }} />
                <FormControlLabel control={<Checkbox onChange={handleChange} checked={typedValue || false} indeterminate={typeof typedValue !== "boolean"} {...checkboxProps} />} label={deriveLabel(c)} />
                <ErrorComp._>{error?.message || " "}</ErrorComp._>
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Boolean`;
