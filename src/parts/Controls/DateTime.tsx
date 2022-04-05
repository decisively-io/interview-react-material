/* eslint-disable camelcase,import/no-extraneous-dependencies */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import { DateTimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDateTime, DATE_TIME_FORMAT_24, DATE_TIME_FORMAT_12, resolveNowInDate } from '../../types/controls';


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
    amPmFormat,
    required,
    id,
  } = c;

  const uiTimeFormat = amPmFormat
    ? DATE_TIME_FORMAT_12
    : DATE_TIME_FORMAT_24;

  const nowLessDateMax = resolveNowInDate(date_max);
  const nowLessDateMin = resolveNowInDate(date_min);

  const maxDate = nowLessDateMax ? new Date(`${ nowLessDateMax }T23:59:59`) : undefined;
  const minDate = nowLessDateMin ? new Date(`${ nowLessDateMin }T23:59:59`) : undefined;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDateTime[ 'value' ];

        return (
          <FormControl fullWidth margin='normal'>
            <DateTimePicker
              label={label}
              error={error !== undefined}
              helperText={error?.message}
              value={typeof typedValue === 'string' ? new Date(value) : null}
              onChange={d => d && onChange(format(d, DATE_TIME_FORMAT_24))}
              format={uiTimeFormat}
              required={required}
              inputVariant='outlined'
              ampm={Boolean(amPmFormat)}
              minutesStep={minutes_increment}
              maxDate={maxDate}
              minDate={minDate}
            />
          </FormControl>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/DateTime`;
