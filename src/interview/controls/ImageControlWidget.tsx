import type { ImageControl } from "@decisively-io/interview-sdk";
import React from "react";
import { useFormControl } from "../../FormControl";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface ImageControlWidgetProps extends ControlWidgetProps<ImageControl> {}

export const ImageControlWidget = Object.assign(
  React.memo((props: ImageControlWidgetProps) => {
    const { control } = props;
    const { data } = control;

    return useFormControl({
      control,
      render: ({ onChange }) => {
        return (
          <img
            src={data}
            alt=""
            width="100px"
          />
        );
      },
    });
  }),
  {},
);

export default ImageControlWidget;
