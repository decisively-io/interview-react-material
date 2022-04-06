/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IEntity } from '../../types/controls';
import type { RenderControl } from './__renderControl';


export interface IProps {
  c: IEntity;
  RenderControl: typeof RenderControl;
}


export const _: React.FC< IProps > = React.memo(({ c, RenderControl }) => {
  const { id, label, template } = c;
  const mappedControls: typeof template = React.useMemo(() => (
    template.map((it, i) => ({ ...it, id: `${ id }.${ i }` }))
  ), [template, id]);

  return (
    <FormControl._>
      <Typography>{label}</Typography>
      { mappedControls.map(it => <RenderControl key={it.id} c={it} />) }
    </FormControl._>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Typography`;
