import React from "react";
import { IImage } from "../../types/controls";
import * as FormControl from "./__formControl";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface ImageProps {
  c: IImage;
}

export const _: React.FC<ImageProps> = React.memo(({ c }) => {
  const { data } = c;

  return (
    <FormControl._>
      <img src={data} alt="" width="100px" />
    </FormControl._>
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Image`;
