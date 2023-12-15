import React from "react";
import type { Control } from "../../types/controls";
import type { IRenderControlProps } from "./__controlsTypes";
import { DISPLAY_NAME_PREFIX } from "./__prefix";
import { RenderControl } from "./__renderControl";

export interface IProps extends Pick<IRenderControlProps, "controlComponents" | "chOnScreenData"> {
  controls: Control[];
}

export const _: React.FC<IProps> = React.memo(({ controls, controlComponents, chOnScreenData }) => (
  <>
    {controls.map((it, i) => (
      <RenderControl key={it.id ?? `${it.type}-${i}`} c={it} controlComponents={controlComponents} chOnScreenData={chOnScreenData} />
    ))}
  </>
));
_.displayName = `${DISPLAY_NAME_PREFIX}`;
