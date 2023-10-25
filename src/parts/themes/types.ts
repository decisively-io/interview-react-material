import React from 'react';
import type { IProps as MenuProps } from '../Menu';
import type { IProps as ContentProps } from '../Content';


export type ThemedCompProps = {
  menu: MenuProps;
  content: ContentProps & { keyForRemount: string };
  className?: string;
}
export type ThemedCompT = React.ComponentType< ThemedCompProps >;
