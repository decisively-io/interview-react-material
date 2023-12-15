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

export interface IControlsHash {
  Boolean?: React.ComponentType<Boolean.IProps>;
  Currency?: React.ComponentType<Currency.IProps>;
  Date?: React.ComponentType<Date.IProps>;
  DateTime?: React.ComponentType<DateTime.IProps>;
  Entity?: React.ComponentType<Entity.IProps>;
  Image?: React.ComponentType<Image.IProps>;
  NumberOfInstances?: React.ComponentType<NumberOfInstances.IProps>;
  Options?: React.ComponentType<Options.IProps>;
  Text?: React.ComponentType<Text.IProps>;
  Time?: React.ComponentType<Time.IProps>;
  Typography?: React.ComponentType<Typography.IProps>;
}

export interface IRenderControlProps {
  c: Control;
  controlComponents?: IControlsHash;
  chOnScreenData?: (data: AttributeData) => void;
}
