/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import type { Control } from '../../types/controls';
import { RenderControl } from './__renderControl';
import type { IRenderControlProps } from './__controlsTypes';


export interface IProps extends Pick<IRenderControlProps, 'controlComponents' | 'chOnScreenData' > {
  controls: Control[];
}


export const _: React.FC<IProps> = React.memo(({ controls, controlComponents, chOnScreenData }) => (
  <>
    {
      controls.map(
        (it, i) => (
          <RenderControl
            key={it.id ?? `${ it.type }-${ i }`}
            c={it}
            controlComponents={controlComponents}
            chOnScreenData={chOnScreenData}
          />
        ),
      )
    }
  </>
));
_.displayName = `${ DISPLAY_NAME_PREFIX }`;
