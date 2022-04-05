/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import { DatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDate, DATE_FORMAT, resolveNowInDate } from '../../types/controls';


export interface IProps {
  c: IDate;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const {
    id,
    label,
    max,
    min,
    required,
  } = c;

  const resolvedMax = resolveNowInDate(max);
  const resolvedMin = resolveNowInDate(min);


  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDate[ 'value' ];

        return (
          <FormControl fullWidth margin='normal'>
            <DatePicker {...{
              label,
              error: error !== undefined,
              helperText: error?.message,
              value: typeof typedValue === 'string' ? new Date(typedValue) : null,
              onChange: d => d && onChange(format(d, DATE_FORMAT)),
              format: DATE_FORMAT,
              maxDate: resolvedMax && new Date(resolvedMax),
              minDate: resolvedMin && new Date(resolvedMin),
              required,
              inputVariant: 'outlined',
            }}
            />
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Date`;
