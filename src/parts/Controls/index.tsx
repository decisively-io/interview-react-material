import React from "react";
import type { Control } from "../../types/controls";
import type { RenderControlProps } from "./__controlsTypes";
import { DISPLAY_NAME_PREFIX } from "./__prefix";
import { RenderControl } from "./__renderControl";

export interface ControlsProps extends Pick<RenderControlProps, "controlComponents" | "chOnScreenData"> {
  controls: Control[];
}

const Controls = React.memo((props: ControlsProps) => {
  const { controls, controlComponents, chOnScreenData } = props;
  return (
    <>
      {controls.map((it, i) => (
        <RenderControl key={it.id ?? `${it.type}-${i}`} c={it} controlComponents={controlComponents} chOnScreenData={chOnScreenData} />
      ))}
    </>
  );
});
Controls.displayName = `${DISPLAY_NAME_PREFIX}`;

export default Controls;
