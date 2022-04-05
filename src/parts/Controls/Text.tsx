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


type IParam = Pick<
  React.ComponentProps< typeof TextField >,
  | 'onChange'
  | 'label'
  | 'value'
  | 'variant'
  | 'error'
  | 'helperText'
>;
const withFallback = (arg: IParam) => (
  typeof arg.value === 'string'
    ? <TextField {...arg} />
    : <TextField {...arg} value={undefined} />
);

export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const { id, label } = c;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as IText[ 'value' ];

        return (
          <FormControl fullWidth margin='normal'>
            {
              withFallback({
                onChange,
                label,
                value: typedValue,
                variant: 'outlined',
                error: error !== undefined,
                helperText: error?.message,
              })
            }
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Text`;
