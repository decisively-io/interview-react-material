/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { INumberOfInstances } from '../../types/controls';


export interface IProps {
  c: INumberOfInstances;
}


type IArg = { value: INumberOfInstances[ 'value' ] } & Pick<
  React.ComponentProps< typeof TextField >,
  | 'onChange'
  | 'label'
  | 'type'
  | 'variant'
  | 'error'
  | 'helperText'
  | 'required'
>;
const withFallback = (arg: IArg) => (
  (arg.value === undefined || arg.value === null)
    ? <TextField {...arg} value='' />
    : <TextField {...arg} />
);

export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const { id, label, required } = c;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as INumberOfInstances[ 'value' ];

        return (
          <FormControl._>
            {
              withFallback({
                onChange,
                label,
                value: typedValue,
                variant: 'outlined',
                error: error !== undefined,
                helperText: error?.message,
                required,
              })
            }
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/NumberOfInstances`;
