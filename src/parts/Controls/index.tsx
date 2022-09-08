/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import type { Control } from '../../types/controls';
import { RenderControl } from './__renderControl';
import type { IRenderControlProps } from './__controlsTypes';


export interface IProps extends Pick< IRenderControlProps, 'controlComponents' > {
  controls: Control[];
}


export const _: React.FC< IProps > = React.memo(({ controls, controlComponents }) => (
  <>
    {
      controls.map(
        (it, i) => (
          <RenderControl
            key={it.id ?? `${ it.type }-${ i }`}
            c={it}
            controlComponents={controlComponents}
          />
        ),
      )
    }
  </>
));
_.displayName = `${ DISPLAY_NAME_PREFIX }`;
