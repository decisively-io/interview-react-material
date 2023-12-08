/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';
import { format } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import type { AttributeData } from '@decisively-io/types-interview';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import styled from 'styled-components';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IDate, DATE_FORMAT } from '../../types/controls';
import { deriveLabel } from '../../types/deriveLabel';
import { resolveNowInDate } from '../../types/generateValidatorForControl';


export interface IProps {
  c: IDate & { manualControlsCssOverride?: string };
  datePickerProps?: Partial< DatePickerProps >;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

const ManualControlsWrap = styled(Box)<{ $cssOverride?: string }>`
  ${ p => p.$cssOverride };
`;


export const _: React.FC<IProps> = React.memo(({ c, datePickerProps, chOnScreenData, className }) => {
  const { control } = useFormContext();
  const {
    attribute,
    max,
    min,
    allowManual,
    manualControlsCssOverride,
    // disabled,
  } = c;
  const datePickerRef = React.useRef< HTMLInputElement >(null);

  const resolvedMax = resolveNowInDate(max);
  const resolvedMin = resolveNowInDate(min);


  const datePickerStyle = React.useMemo< React.CSSProperties >(() => (
    allowManual ? { visibility: 'hidden', position: 'absolute' } : {}
  ), [allowManual]);

  const emulateClickOnPicker = React.useCallback(() => (
    datePickerRef.current?.click()
  ), []);


  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IDate[ 'value' ];
        const manualInputProps: TextFieldProps = {
          label: deriveLabel(c),
          error: error !== undefined,
          helperText: error?.message || ' ',
          value,
          variant: 'outlined',
          onChange,
          fullWidth: true,
          disabled: c.disabled,
        };

        const handleChange = (d: MaterialUiPickersDate) => {
          if (d) {
            if (chOnScreenData) {
              chOnScreenData({ [ attribute ]: format(d, DATE_FORMAT) });
            }

            onChange(format(d, DATE_FORMAT));
          }
        };

        return (
          <FormControl._ title={c.label} className={className}>
            <DatePicker {...{
              label: deriveLabel(c),
              error: error !== undefined,
              helperText: error?.message || ' ',
              value: typeof typedValue === 'string'
                ? (typedValue === 'now' ? new Date() : new Date(typedValue))
                : null,
              onChange: handleChange,
              format: DATE_FORMAT,
              maxDate: resolvedMax && new Date(resolvedMax),
              minDate: resolvedMin && new Date(resolvedMin),
              inputVariant: 'outlined',
              disabled: c.disabled,
              style: datePickerStyle,
              inputRef: datePickerRef,
              ...datePickerProps,
            }}
            />

            {
              Boolean(allowManual) === false ? null : (
                <ManualControlsWrap
                  display='flex'
                  width='100%'
                  gridGap='0.5rem'
                  alignItems='center'
                  $cssOverride={manualControlsCssOverride}
                >
                  <Box flexGrow='1'>
                    {
                      (value === undefined || value === null)
                        ? <TextField {...{ ...manualInputProps, value: '' }} />
                        : <TextField {...manualInputProps} />
                    }
                  </Box>

                  <Box flexShrink='0' marginTop='-1.25rem'>
                    <IconButton onClick={emulateClickOnPicker}>
                      <CalendarTodayIcon />
                    </IconButton>
                  </Box>
                </ManualControlsWrap>
              )
            }

          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Date`;
