/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core';
import { DISPLAY_NAME_PREFIX } from './__prefix';


const Styled = withStyles({
  root: { marginTop: '0.5rem', marginBottom: 0 },
})(FormControl);


export const _ = React.memo< React.ComponentProps< typeof FormControl > >(
  ({ children, ...p }) => (
    <Styled fullWidth margin='normal' {...p}>
      { children }
    </Styled>
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/__formControl`;
