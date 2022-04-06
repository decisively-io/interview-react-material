/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { ITypography } from '../../types/controls';


export interface IProps {
  c: ITypography;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { style, text } = c;

  return (
    <FormControl._>
      <Typography variant={style}>{text}</Typography>
    </FormControl._>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Typography`;
