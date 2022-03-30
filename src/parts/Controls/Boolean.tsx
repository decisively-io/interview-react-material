// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useFormContext, Controller } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import Checkbox from '@material-ui/core/Checkbox';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IBoolean } from '../../types/controls';


export interface IProps {
  c: IBoolean;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={c.id}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormControlLabel
          control={(
            <Checkbox
              onChange={onChange}
              onBlur={onBlur}
              checked={Boolean(value)}
            />
          )}
          label={c.label}
        />
      )}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Boolean`;
