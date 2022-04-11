/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';

export const _ = React.memo< React.ComponentProps< typeof FormControl > >(
  ({ children, ...p }) => (
    <FormControl fullWidth margin='normal' {...p}>
      { children }
    </FormControl>
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/__formControl`;
