/* eslint-disable camelcase,import/no-extraneous-dependencies */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import { DateTimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDateTime, DATE_TIME_FORMAT_24, DATE_TIME_FORMAT_12 } from '../../types/controls';


export interface IProps {
  c: IDateTime;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const {
    date_max,
    date_min,
    minutes_increment,
    label,
    format: timeFormat,
    required,
    id,
  } = c;
  const uiTimeFormat = timeFormat === '12'
    ? DATE_TIME_FORMAT_12
    : DATE_TIME_FORMAT_24;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl fullWidth margin='normal'>
          <DateTimePicker
            label={label}
            error={error !== undefined}
            helperText={error?.message}
            value={new Date(value)}
            onChange={d => d && onChange(format(d, DATE_TIME_FORMAT_24))}
            format={uiTimeFormat}
            required={required}
            inputVariant='outlined'
            ampm={timeFormat === '12'}
            minutesStep={minutes_increment}
            maxDate={date_max && new Date(date_max)}
            minDate={date_min && new Date(date_min)}
          />
        </FormControl>
      )}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/DateTime`;
