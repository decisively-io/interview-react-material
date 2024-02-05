import FormHelperText from "@material-ui/core/FormHelperText";
import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";

export const _: React.FC<React.ComponentProps<typeof FormHelperText>> = React.memo(({ children, ...p }) => (
  <FormHelperText className="Mui-error MuiFormHelperText-contained" {...p}>
    {children}
  </FormHelperText>
));
_.displayName = `${DISPLAY_NAME_PREFIX}/__error`;
