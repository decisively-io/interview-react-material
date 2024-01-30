import React from "react";
import type { Control } from "../../util/controls";
import type { RenderControlProps } from "./__controlsTypes";
import { DISPLAY_NAME_PREFIX } from "./__prefix";
import { RenderControl } from "./__renderControl";

// biome-ignore lint/suspicious/noShadowRestrictedNames: for the public interface of the library
import * as Boolean from "./Boolean";
import * as Currency from "./Currency";
// biome-ignore lint/suspicious/noShadowRestrictedNames: for the public interface of the library
import * as Date from "./Date";
import * as DateTime from "./DateTime";
import * as Entity from "./Entity";
import * as Image from "./Image";
import * as NumberOfInstances from "./NumberOfInstances";
import * as Options from "./Options";
import * as Text from "./Text";
import * as Time from "./Time";
import * as Typography from "./Typography";

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

export default Object.assign(Controls, {
  Boolean: Boolean,
  Currency: Currency,
  Date: Date,
  DateTime: DateTime,
  Entity: Entity,
  Image: Image,
  NumberOfInstances: NumberOfInstances,
  Options: Options,
  Text: Text,
  Time: Time,
  Typography: Typography,
});
