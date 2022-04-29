/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';

export const _: React.FC< React.ComponentProps< typeof FormControl > > = React.memo(
  ({ children, ...p }) => (
    <FormControl fullWidth {...p}>
      { children }
    </FormControl>
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/__formControl`;
