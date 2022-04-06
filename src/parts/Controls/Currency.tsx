/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { formatCurrency, ICurrency, parseCurrency } from '../../types/controls';


export interface IProps {
  c: ICurrency;
}

type IArg = { value: ICurrency[ 'value' ]; c: ICurrency; } & Pick<
  React.ComponentProps< typeof TextField >,
  | 'onChange'
  | 'label'
  | 'variant'
  | 'error'
  | 'helperText'
  | 'required'
>;
const withFallback = (arg: IArg) => (
  (arg.value === null || arg.value === undefined)
    ? <TextField {...arg} value='' />
    : <TextField {...arg} value={formatCurrency(arg.c, arg.value)} />
);


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control, setValue } = useFormContext();
  const { id, label, required } = c;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { value }, fieldState: { error } }) => {
        const typedValue = value as ICurrency[ 'value' ];
        const onChangeHandler: IArg[ 'onChange' ] = e => {
          console.log(e);
          // const parsed = parseCurrency(e.currentTarget.value, c);
          // const numbered = Number(parsed);
          // if(Number.isNaN(numbered)) return;

          // onChange(e);
        };

        return (
          <FormControl._ fullWidth margin='normal'>
            {
              withFallback({
                onChange: onChangeHandler,
                label,
                value: typedValue,
                variant: 'outlined',
                error: error !== undefined,
                helperText: error?.message,
                required,
                c,
              })
            }
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Currency`;
