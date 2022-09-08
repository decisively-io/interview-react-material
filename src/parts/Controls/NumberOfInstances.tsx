/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { deriveLabel, INumberOfInstances } from '../../types/controls';


export interface IProps {
  c: INumberOfInstances;
  textFieldProps?: Omit< TextFieldProps, 'value' >;
}


type Value = number | null | undefined;


type IArg = { value: Value } & NonNullable< IProps[ 'textFieldProps' ] >;

const withFallback = (arg: IArg) => (
  (arg.value === undefined || arg.value === null)
    ? <TextField {...arg} value='' />
    : <TextField {...arg} />
);

export const _: React.FC< IProps > = React.memo(({ c, textFieldProps }) => {
  const { control } = useFormContext();
  const { entity } = c;

  return (
    <Controller
      control={control}
      name={entity}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as Value;

        return (
          <FormControl._ title={c.label}>
            {
              withFallback({
                onChange,
                label: deriveLabel(c),
                value: typedValue,
                variant: 'outlined',
                error: error !== undefined,
                helperText: error?.message || ' ',
                ...textFieldProps,
              })
            }
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/NumberOfInstances`;
