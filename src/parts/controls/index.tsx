import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";

import { Control } from "@decisively-io/interview-sdk";
import BooleanControlWidget, { BooleanControlWidgetProps } from "./BooleanControlWidget";
import ConditionalContainerWidget, { ConditionalContainerControlWidgetProps } from "./ConditionalContainerWidget";
import CurrencyControlWidget, { CurrencyControlWidgetProps } from "./CurrencyControlWidget";
import DateControlWidget, { DateControlWidgetProps } from "./DateControlWidget";
import DateTimeControlWidget, { DateTimeControlWidgetProps } from "./DateTimeControlWidget";
import EntityControlWidget, { EntityControlWidgetProps } from "./EntityControlWidget";
import ImageControlWidget, { ImageControlWidgetProps } from "./ImageControlWidget";
import NumberOfInstancesControlWidget, { NumberOfInstancesControlWidgetProps } from "./NumberOfInstancesControlWidget";
import OptionsControlWidget, { OptionsControlWidgetProps } from "./OptionsControlWidget";
import RenderControl from "./RenderControl";
import TextControlWidget, { TextControlWidgetProps } from "./TextControlWidget";
import TimeControlWidget, { TimeControlWidgetProps } from "./TimeControlWidget";
import TypographyControlWidget, { TypographyControlWidgetProps } from "./TypographyControlWidget";

export interface ControlsProps {
  controls: Control[];
  controlComponents?: ControlComponents;
  chOnScreenData?: any;
}

export interface ControlComponents {
  Boolean?: React.ComponentType<BooleanControlWidgetProps>;
  Currency?: React.ComponentType<CurrencyControlWidgetProps>;
  Date?: React.ComponentType<DateControlWidgetProps>;
  DateTime?: React.ComponentType<DateTimeControlWidgetProps>;
  Entity?: React.ComponentType<EntityControlWidgetProps>;
  Image?: React.ComponentType<ImageControlWidgetProps>;
  NumberOfInstances?: React.ComponentType<NumberOfInstancesControlWidgetProps>;
  Options?: React.ComponentType<OptionsControlWidgetProps>;
  Text?: React.ComponentType<TextControlWidgetProps>;
  Time?: React.ComponentType<TimeControlWidgetProps>;
  Typography?: React.ComponentType<TypographyControlWidgetProps>;
  ConditionalContainer?: React.ComponentType<ConditionalContainerControlWidgetProps>;
}

const DEFAULT_CONTROL_COMPONENTS: ControlComponents = {
  Boolean: BooleanControlWidget,
  Currency: CurrencyControlWidget,
  Date: DateControlWidget,
  DateTime: DateTimeControlWidget,
  Entity: EntityControlWidget,
  Image: ImageControlWidget,
  NumberOfInstances: NumberOfInstancesControlWidget,
  Options: OptionsControlWidget,
  Text: TextControlWidget,
  Time: TimeControlWidget,
  Typography: TypographyControlWidget,
  ConditionalContainer: ConditionalContainerWidget,
};

const Controls = React.memo((props: ControlsProps) => {
  const { controls, controlComponents, chOnScreenData } = props;

  const resolvedControlComponents = {
    ...DEFAULT_CONTROL_COMPONENTS,
    ...controlComponents,
  };
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
