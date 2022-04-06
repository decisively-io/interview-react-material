/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as FormControl from './__formControl';
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
      render={({ field: { onChange, value } }) => {
        const typedValue = value as IBoolean[ 'value' ];

        return (
          <FormControl._>
            <FormControlLabel
              control={(
                <Checkbox
                  onChange={onChange}
                  checked={typeof typedValue === 'boolean' ? typedValue : undefined}
                  required={required}
                  indeterminate={typeof typedValue !== 'boolean'}
                />
              )}
              label={label}
            />
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Boolean`;
