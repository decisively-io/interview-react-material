/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IText } from '../../types/controls';


export interface IProps {
  c: IText;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const { id, label, required } = c;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth margin='normal'>
          <TextField
            onChange={onChange}
            label={label}
            value={value}
            variant='outlined'
            error={error !== undefined}
            helperText={error?.message}
            required={required}
          />
        </FormControl>
      )}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Text`;
