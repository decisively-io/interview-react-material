import FormHelperText from "@material-ui/core/FormHelperText";
import React from "react";

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
export default ControlError;
