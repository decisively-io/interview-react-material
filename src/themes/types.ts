import type { Theme } from "@material-ui/core/styles/createTheme";
import type React from "react";
import type { ContentProps } from "../interview/Content";
import type { MenuProps } from "../interview/Menu";
import type { SidebarOverrides } from "../sidebar/SidebarPanel";

export interface ThemedComponentProps {
  menu: MenuProps;
  content: ContentProps & { keyForRemount: string };
  className?: string;
  themeProducer?: (outerTheme: Theme) => Theme;
  sidebarOverrides?: SidebarOverrides;
}

/**
 * @deprecated use `ThemedComponentProps` instead
 */
export type ThemedCompProps = ThemedComponentProps;
/**
 * @deprecated use `ThemedComponent` instead
 */
export type ThemedCompT = React.ComponentType<ThemedComponentProps>;
export type ThemedComponent = React.ComponentType<ThemedComponentProps>;

// re-export mui styling components
export { makeStyles } from "@material-ui/core";
