/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IBoolean } from '../../types/controls';


export interface IProps {
  c: IBoolean;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const {
    id,
    label,
    required,
  } = c;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth margin='normal'>
          <FormControlLabel
            control={(
              <Checkbox
                onChange={onChange}
                checked={value || false}
                required={required}
                indeterminate={value === undefined}
              />
            )}
            label={label}
          />
        </FormControl>
      )}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Boolean`;
