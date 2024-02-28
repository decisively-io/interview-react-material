import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";

import { Control } from "@decisively-io/interview-sdk";
import BooleanControlRender, { BooleanControlRenderProps } from "./BooleanControlRender";
import CurrencyControlRender, { CurrencyControlRenderProps } from "./CurrencyControlRender";
import DateControlRender, { DateControlRenderProps } from "./DateControlRender";
import DateTimeControlRender, { DateTimeControlRenderProps } from "./DateTimeControlRender";
import EntityControlRender, { EntityControlRenderProps } from "./EntityControlRender";
import ImageControlRender, { ImageControlRenderProps } from "./ImageControlRender";
import NumberOfInstancesControlRender, { NumberOfInstancesControlRenderProps } from "./NumberOfInstancesControlRender";
import OptionsControlRender, { OptionsControlRenderProps } from "./OptionsControlRender";
import RenderControl from "./RenderControl";
import TextControlRender, { TextControlRenderProps } from "./TextControlRender";
import TimeControlRender, { TimeControlRenderProps } from "./TimeControlRender";
import TypographyControlRender, { TypographyControlRenderProps } from "./TypographyControlRender";

export interface ControlsProps {
  controls: Control[];
  controlComponents?: ControlComponents;
  chOnScreenData?: any;
}

export interface ControlComponents {
  Boolean?: React.ComponentType<BooleanControlRenderProps>;
  Currency?: React.ComponentType<CurrencyControlRenderProps>;
  Date?: React.ComponentType<DateControlRenderProps>;
  DateTime?: React.ComponentType<DateTimeControlRenderProps>;
  Entity?: React.ComponentType<EntityControlRenderProps>;
  Image?: React.ComponentType<ImageControlRenderProps>;
  NumberOfInstances?: React.ComponentType<NumberOfInstancesControlRenderProps>;
  Options?: React.ComponentType<OptionsControlRenderProps>;
  Text?: React.ComponentType<TextControlRenderProps>;
  Time?: React.ComponentType<TimeControlRenderProps>;
  Typography?: React.ComponentType<TypographyControlRenderProps>;
}

const DEFAULT_CONTROL_COMPONENTS: ControlComponents = {
  Boolean: BooleanControlRender,
  Currency: CurrencyControlRender,
  Date: DateControlRender,
  DateTime: DateTimeControlRender,
  Entity: EntityControlRender,
  Image: ImageControlRender,
  NumberOfInstances: NumberOfInstancesControlRender,
  Options: OptionsControlRender,
  Text: TextControlRender,
  Time: TimeControlRender,
  Typography: TypographyControlRender,
};

const Controls = React.memo((props: ControlsProps) => {
  const { controls, controlComponents, chOnScreenData } = props;

  const resolvedControlComponents = controlComponents ?? DEFAULT_CONTROL_COMPONENTS;
  return (
    <>
      {controls.map((it, i) => (
        <RenderControl key={it.id ?? `${it.type}-${i}`} control={it} chOnScreenData={chOnScreenData} controlComponents={resolvedControlComponents} />
      ))}
    </>
  );
});
Controls.displayName = `${DISPLAY_NAME_PREFIX}`;

export default Object.assign(Controls, DEFAULT_CONTROL_COMPONENTS);
