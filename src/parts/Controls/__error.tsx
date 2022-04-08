/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { DISPLAY_NAME_PREFIX } from './__prefix';


export const _ = React.memo< React.ComponentProps< typeof FormHelperText > >(
  ({ children, ...p }) => (
    <FormHelperText className='Mui-error MuiFormHelperText-contained' {...p}>
      {children}
    </FormHelperText>
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/__error`;
