/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { ITypography } from '../../types/controls';


export interface IProps {
  c: ITypography;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { style, text } = c;

  return (
    <FormControl fullWidth margin='normal'>
      <Typography variant={style}>{text}</Typography>
    </FormControl>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Typography`;
