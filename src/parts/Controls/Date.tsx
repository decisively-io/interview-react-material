/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';
import { format } from 'date-fns';
import { AttributeData } from '@decisively-io/types-interview';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDate, DATE_FORMAT, resolveNowInDate, deriveLabel } from '../../types/controls';


export interface IProps {
  c: IDate;
  datePickerProps?: Partial< DatePickerProps >;
  chOnScreenData?: (data: AttributeData) => void;
}


export const _: React.FC<IProps> = React.memo(({ c, datePickerProps, chOnScreenData }) => {
  const { control } = useFormContext();
  const {
    attribute,
    max,
    min,
  } = c;

  const resolvedMax = resolveNowInDate(max);
  const resolvedMin = resolveNowInDate(min);


  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDate[ 'value' ];

        const handleChange = (d: MaterialUiPickersDate) => {
          if (d) {
            if (chOnScreenData) {
              chOnScreenData({ [ attribute ]: format(d, DATE_FORMAT) });
            }

            onChange(format(d, DATE_FORMAT));
          }
        };

        return (
          <FormControl._ title={c.label}>
            <DatePicker {...{
              label: deriveLabel(c),
              error: error !== undefined,
              helperText: error?.message || ' ',
              value: typeof typedValue === 'string' ? new Date(typedValue) : null,
              onChange: handleChange,
              format: DATE_FORMAT,
              maxDate: resolvedMax && new Date(resolvedMax),
              minDate: resolvedMin && new Date(resolvedMin),
              inputVariant: 'outlined',
              ...datePickerProps,
            }}
            />
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Date`;
