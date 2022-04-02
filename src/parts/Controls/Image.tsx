/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IImage } from '../../types/controls';


export interface IProps {
  c: IImage;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { data } = c;

  return (
    <FormControl fullWidth margin='normal'>
      <img src={data} alt='' width='100px' />
    </FormControl>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Image`;
