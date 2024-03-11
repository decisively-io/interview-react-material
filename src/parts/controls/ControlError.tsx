import FormHelperText from "@material-ui/core/FormHelperText";
import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";

export type ControlErrorProps = React.ComponentProps<typeof FormHelperText>;

const ControlError = React.memo((props: ControlErrorProps) => {
  const { children, ...otherProps } = props;
  return (
    <FormHelperText
      className="Mui-error MuiFormHelperText-contained"
      {...otherProps}
    >
      {children}
    </FormHelperText>
  );
});
ControlError.displayName = `${DISPLAY_NAME_PREFIX}/__error`;
export default ControlError;
