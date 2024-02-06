import React from "react";
import { IImage } from "../../util/controls";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";

export interface ImageProps {
  c: IImage;
}

export const _: React.FC<ImageProps> = React.memo(({ c }) => {
  const { data } = c;

  return (
    <FormControl>
      <img src={data} alt="" width="100px" />
    </FormControl>
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Image`;
