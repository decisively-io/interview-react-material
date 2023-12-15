import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import React from "react";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export const _: React.FC<FormControlProps> = React.memo(({ children, ...p }) => (
  <FormControl fullWidth {...p}>
    {children}
  </FormControl>
));
_.displayName = `${DISPLAY_NAME_PREFIX}/__formControl`;
