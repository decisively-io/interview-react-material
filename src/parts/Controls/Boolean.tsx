/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { deriveLabel, IBoolean } from '../../types/controls';
import * as ErrorComp from './__error';

export interface IProps {
  c: IBoolean;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const { attribute } = c;

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as IBoolean[ 'value' ];

        return (
          <FormControl._ title={c.label}>
            <FormControlLabel
              control={(
                <Checkbox
                  onChange={onChange}
                  checked={typedValue || false}
                  indeterminate={typeof typedValue !== 'boolean'}
                />
              )}
              label={deriveLabel(c)}
            />
            <ErrorComp._>{error?.message || ' '}</ErrorComp._>
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Boolean`;
