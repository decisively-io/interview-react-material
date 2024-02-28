import { ImageControl } from "@decisively-io/interview-sdk";
import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import { ControlRenderProps } from "./ControlRenderTypes";
import FormControl from "./FormControl";

export interface ImageControlRenderProps extends ControlRenderProps<ImageControl> {}

export const ImageControlRender = Object.assign(
  React.memo((props: ImageControlRenderProps) => {
    const { control } = props;
    const { data } = control;

    return (
      <FormControl>
        <img src={data} alt="" width="100px" />
      </FormControl>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Image`,
    /*** @deprecated use `ImageInput` directly */
    _: null as any as React.ComponentType<ImageControlRenderProps>,
  },
);
ImageControlRender._ = ImageControlRender;

/*** @deprecated use `ImageInput` directly */
export const _ = ImageControlRender;

export default ImageControlRender;
