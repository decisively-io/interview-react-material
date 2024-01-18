import React from "react";

import type { AttributeData, Control } from "@decisively-io/types-interview";
// biome-ignore lint/suspicious/noShadowRestrictedNames: for the public interface of the library
import type * as Boolean from "./Boolean";
import type * as Currency from "./Currency";
// biome-ignore lint/suspicious/noShadowRestrictedNames: for the public interface of the library
import type * as Date from "./Date";
import type * as DateTime from "./DateTime";
import type * as Entity from "./Entity";
import type * as Image from "./Image";
import type * as NumberOfInstances from "./NumberOfInstances";
import type * as Options from "./Options";
import type * as Text from "./Text";
import type * as Time from "./Time";
import type * as Typography from "./Typography";

export interface ControlComponents {
  Boolean?: React.ComponentType<Boolean.BooleanProps>;
  Currency?: React.ComponentType<Currency.CurrencyProps>;
  Date?: React.ComponentType<Date.DateProps>;
  DateTime?: React.ComponentType<DateTime.DateTimeProps>;
  Entity?: React.ComponentType<Entity.EntityProps>;
  Image?: React.ComponentType<Image.ImageProps>;
  NumberOfInstances?: React.ComponentType<NumberOfInstances.NumberOfInstancesProps>;
  Options?: React.ComponentType<Options.OptionsProps>;
  Text?: React.ComponentType<Text.TextProps>;
  Time?: React.ComponentType<Time.TimeProps>;
  Typography?: React.ComponentType<Typography.TypographyProps>;
}

export interface RenderControlProps {
  c: Control;
  controlComponents?: ControlComponents;
  chOnScreenData?: (data: AttributeData) => void;
}
