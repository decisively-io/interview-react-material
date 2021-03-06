/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { deriveLabel, IText } from '../../types/controls';


export interface IProps {
  c: IText;
}


type IParam = Pick<
  React.ComponentProps< typeof TextField >,
  | 'onChange'
  | 'label'
  | 'value'
  | 'variant'
  | 'error'
  | 'helperText'
  | 'multiline'
  | 'maxRows'
  | 'minRows'
>;
const withFallback = (arg: IParam) => (
  typeof arg.value === 'string'
    ? <TextField {...arg} />
    : <TextField {...arg} value='' />
);

export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const { attribute, multi } = c;


  const maybeWithMulti: Pick< IParam, 'multiline' | 'maxRows' | 'minRows' > = (
    multi === undefined
      ? {}
      : {
        multiline: true,
        ...multi,
      }
  );


  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const typedValue = value as IText[ 'value' ];

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
                ...maybeWithMulti,
              })
            }
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Text`;
