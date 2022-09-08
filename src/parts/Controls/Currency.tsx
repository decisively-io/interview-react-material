/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { deriveLabel, ICurrency } from '../../types/controls';


export interface IProps {
  c: ICurrency;
  textFieldProps?: Omit< TextFieldProps, 'value' >;
}

type IArg = { value: ICurrency[ 'value' ]; c: ICurrency; } & NonNullable< IProps[ 'textFieldProps' ] >;

const withFallback = (arg: IArg) => (
  (arg.value === null || arg.value === undefined)
    ? <TextField {...arg} value='' />
    : <TextField {...arg} value={arg.value} />
);


export const _: React.FC< IProps > = React.memo(({ c, textFieldProps }) => {
  const { control } = useFormContext();
  const { attribute, symbol } = c;


  const InputProps = React.useMemo(
    () => ({ startAdornment: <InputAdornment position='start'>{symbol || '$'}</InputAdornment> }),
    [symbol],
  );


  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as ICurrency[ 'value' ];

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
                c,
                InputProps,
                ...textFieldProps,
              })
            }
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Currency`;
