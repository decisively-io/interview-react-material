import React from "react";
import { useFormControl } from "../../FormControl";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import type { FileControl } from "@decisively-io/interview-sdk";


export interface FileControlWidgetProps extends ControlWidgetProps< FileControl > {

};

export default (p: FileControlWidgetProps) => {
  const { control, chOnScreenData } = p;

  return useFormControl({
    control,
    // className: className,
    onScreenDataChange: chOnScreenData,
    render: ({ onChange, value, forId, error, inlineLabel, renderExplanation }) => {
      const handleChange = () => {
        onChange([{ ref: '123' }]);
      };

      return (
        <>
          <div>
            file input

            <button onClick={handleChange}>click</button>
          </div>

          {renderExplanation()}
        </>
      );
    },
  })
};
