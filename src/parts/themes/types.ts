import React from 'react';
import type { Theme } from '@material-ui/core/styles/createTheme';
import type { IProps as MenuProps } from '../Menu';
import type { IProps as ContentProps } from '../Content';


export type ThemedCompProps = {
  menu: MenuProps;
  content: ContentProps & { keyForRemount: string };
  className?: string;
  themeProducer?: (outerTheme: Theme) => Theme
}
export type ThemedCompT = React.ComponentType< ThemedCompProps >;
