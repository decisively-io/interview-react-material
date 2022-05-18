/* eslint-disable camelcase, import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DateTimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDateTime, DATE_TIME_FORMAT_24, DATE_TIME_FORMAT_12, resolveNowInDate, deriveLabel } from '../../types/controls';


export interface IProps {
  c: IDateTime;
}


export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const {
    date_max,
    date_min,
    minutes_increment,
    amPmFormat,
    attribute,
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
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDateTime[ 'value' ];

        return (
          <FormControl._ title={c.label}>
            <DateTimePicker
              label={deriveLabel(c)}
              error={error !== undefined}
              helperText={error?.message || ' '}
              value={typeof typedValue === 'string' ? new Date(value) : null}
              onChange={d => d && onChange(format(d, DATE_TIME_FORMAT_24))}
              format={uiTimeFormat}
              inputVariant='outlined'
              ampm={Boolean(amPmFormat)}
              minutesStep={minutes_increment}
              maxDate={maxDate}
              minDate={minDate}
            />
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/DateTime`;
