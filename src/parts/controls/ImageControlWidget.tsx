import type { ImageControl } from "@decisively-io/interview-sdk";
import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import FormControl from "./FormControl";

export interface ImageControlWidgetProps extends ControlWidgetProps<ImageControl> {}

export const ImageControlWidget = Object.assign(
  React.memo((props: ImageControlWidgetProps) => {
    const { control } = props;
    const { data } = control;

    return (
      <FormControl>
        <img
          src={data}
          alt=""
          width="100px"
        />
      </FormControl>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Image`,
    /*** @deprecated use `ImageInput` directly */
    _: null as any as React.ComponentType<ImageControlWidgetProps>,
  },
);
ImageControlWidget._ = ImageControlWidget;

/*** @deprecated use `ImageInput` directly */
export const _ = ImageControlWidget;

export default ImageControlWidget;
