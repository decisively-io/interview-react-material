import type { ImageControl } from "@decisively-io/interview-sdk";
import React from "react";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface ImageControlWidgetProps extends ControlWidgetProps<ImageControl> {}

export const ImageControlWidget = Object.assign(
  React.memo((props: ImageControlWidgetProps) => {
    const { control } = props;
    const { data } = control;

    const FormControl = useFormControl({
      control,
    });

    return (
      <FormControl>
        {({ onChange }) => {
          return (
            <img
              src={data}
              alt=""
              width="100px"
            />
          );
        }}
      </FormControl>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Image`,
    /*** @deprecated use `ImageControlWidget` directly */
    _: null as any as React.ComponentType<ImageControlWidgetProps>,
  },
);
ImageControlWidget._ = ImageControlWidget;

/*** @deprecated use `ImageControlWidget` directly */
export const _ = ImageControlWidget;

export default ImageControlWidget;
