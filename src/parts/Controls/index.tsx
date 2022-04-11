/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { Control } from '../../types/controls';
import { RenderControl } from './__renderControl';


export interface IProps {
  controls: Control[];
}


export const _: React.FC< IProps > = React.memo(({ controls }) => (
  <>
    { controls.map((it, i) => <RenderControl key={it.id ?? `${ it.type }-${ i }`} c={it} />) }
  </>
));
_.displayName = `${ DISPLAY_NAME_PREFIX }`;
