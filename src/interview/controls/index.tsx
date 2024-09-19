import React from "react";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";

import type { Control } from "@decisively-io/interview-sdk";
import BooleanControlWidget, { type BooleanControlWidgetProps } from "./BooleanControlWidget";
import CertaintyContainerWidget, { type CertaintyContainerControlWidgetProps } from "./CertaintyContainerWidget";
import CurrencyControlWidget, { type CurrencyControlWidgetProps } from "./CurrencyControlWidget";
import DataContainerWidget, { type DataContainerControlWidgetProps } from "./DataContainerWidget";
import DateControlWidget, { type DateControlWidgetProps } from "./DateControlWidget";
import DateTimeControlWidget, { type DateTimeControlWidgetProps } from "./DateTimeControlWidget";
import EntityControlWidget, { type EntityControlWidgetProps } from "./EntityControlWidget";
import GenerativeChatControlWidget, { type GenerativeChatControlWidgetProps } from "./GenerativeChatControlWidget";
import ImageControlWidget, { type ImageControlWidgetProps } from "./ImageControlWidget";
import NumberOfInstancesControlWidget, {
  type NumberOfInstancesControlWidgetProps,
} from "./NumberOfInstancesControlWidget";
import OptionsControlWidget, { type OptionsControlWidgetProps } from "./OptionsControlWidget";
import RenderControl from "./RenderControl";
import RepeatingContainerWidget, { type RepeatingContainerControlWidgetProps } from "./RepeatingContainerWidget";
import SwitchContainerWidget, { type SwitchContainerControlWidgetProps } from "./SwitchContainerWidget";
import TextControlWidget, { type TextControlWidgetProps } from "./TextControlWidget";
import TimeControlWidget, { type TimeControlWidgetProps } from "./TimeControlWidget";
import TypographyControlWidget, { type TypographyControlWidgetProps } from "./TypographyControlWidget";

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
  SwitchContainer?: React.ComponentType<SwitchContainerControlWidgetProps>;
  CertaintyContainer?: React.ComponentType<CertaintyContainerControlWidgetProps>;
  RepeatingContainer?: React.ComponentType<RepeatingContainerControlWidgetProps>;
  DataContainer?: React.ComponentType<DataContainerControlWidgetProps>;
  GenerativeChat?: React.ComponentType<GenerativeChatControlWidgetProps>;
}

const DEFAULT_CONTROL_COMPONENTS: Required<ControlComponents> = {
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
  SwitchContainer: SwitchContainerWidget,
  CertaintyContainer: CertaintyContainerWidget,
  RepeatingContainer: RepeatingContainerWidget,
  DataContainer: DataContainerWidget,
  GenerativeChat: GenerativeChatControlWidget,
};

const Controls = React.memo((props: ControlsProps) => {
  const { controls, controlComponents, chOnScreenData } = props;

  // console.log("====> screen.controls.upper", controls);

  const resolvedControlComponents = {
    ...DEFAULT_CONTROL_COMPONENTS,
    ...controlComponents,
  };
  return (
    <>
      {controls.map((it, i) => (
        <RenderControl
          key={it.id ?? `${it.type}-${i}`}
          control={it}
          chOnScreenData={chOnScreenData}
          controlComponents={resolvedControlComponents}
        />
      ))}
    </>
  );
});
Controls.displayName = `${DISPLAY_NAME_PREFIX}`;

export default Object.assign(Controls, DEFAULT_CONTROL_COMPONENTS);
