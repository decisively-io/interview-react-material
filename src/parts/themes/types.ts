import type { Theme } from "@material-ui/core/styles/createTheme";
import type React from "react";
import type { ContentProps } from "../Content";
import type { MenuProps } from "../Menu";

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

// re-export mui styling components
export { makeStyles } from "@material-ui/core";
