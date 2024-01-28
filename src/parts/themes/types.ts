import type { Theme } from "@material-ui/core/styles/createTheme";
import React from "react";
import type { ContentProps } from "../Content";
import type { IProps as MenuProps } from "../Menu";

export interface ThemedComponentProps {
  menu: MenuProps;
  content: ContentProps & { keyForRemount: string };
  className?: string;
  themeProducer?: (outerTheme: Theme) => Theme;
}

/**
 * @deprecated use `ThemedComponentProps` instead
 */
export type ThemedCompProps = ThemedComponentProps;
/**
 * @deprecated use `ThemedComponent` instead
 */
export type ThemedCompT = React.ComponentType<ThemedCompProps>;
export type ThemedComponent = React.ComponentType<ThemedCompProps>;
