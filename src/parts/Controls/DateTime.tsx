/* eslint-disable camelcase, import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DateTimePicker, DateTimePickerProps } from '@material-ui/pickers';
import { format } from 'date-fns';
import { AttributeData } from '@decisively-io/types-interview';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDateTime, DATE_TIME_FORMAT_24, DATE_TIME_FORMAT_12, resolveNowInDate, deriveLabel } from '../../types/controls';


export interface IProps {
  c: IDateTime;
  dateTimePickerProps?: Partial< DateTimePickerProps >;
  chOnScreenData?: (data: AttributeData) => void;
}


export const _: React.FC<IProps> = React.memo(({ c, dateTimePickerProps, chOnScreenData }) => {
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

        const handleChange = (d: MaterialUiPickersDate) => {
          if (d) {
            if (chOnScreenData) {
              chOnScreenData({ [ attribute ]: format(d, DATE_TIME_FORMAT_24) });
            }

            onChange(format(d, DATE_TIME_FORMAT_24));
          }
        };

        return (
          <FormControl._ title={c.label}>
            <DateTimePicker
              label={deriveLabel(c)}
              error={error !== undefined}
              helperText={error?.message || ' '}
              value={typeof typedValue === 'string' ? new Date(value) : null}
              onChange={handleChange}
              format={uiTimeFormat}
              inputVariant='outlined'
              ampm={Boolean(amPmFormat)}
              minutesStep={minutes_increment}
              maxDate={maxDate}
              minDate={minDate}
              disabled={c.disabled}
              {...dateTimePickerProps}
            />
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/DateTime`;
