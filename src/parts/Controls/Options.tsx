/* eslint-disable camelcase,import/no-extraneous-dependencies,react/jsx-pascal-case */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IOptions } from '../../types/controls';
import * as ErrorComp from './__error';
import * as FormControl from './__formControl';


const filter = createFilterOptions< IOptions[ 'options' ][ 0 ] >();


export interface IProps {
  c: IOptions;
}

const RadioControl = <Radio />;

export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const {
    label,
    id,
    asRadio,
    options,
    allow_other,
  } = c;


  const radioOptionsJSX = React.useMemo(
    () => options.map(
      it => (
        <FormControlLabel
          key={String(it.value)}
          value={it.value}
          control={RadioControl}
          label={it.label}
        />
      ),
    ),
    [options],
  );

  const isBool = React.useMemo(
    () => options.length === 2 &&
      options.some(it => it.value === false) &&
      options.some(it => it.value === true),
    [options],
  );


  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IOptions[ 'value' ];
        const errorJSX = <ErrorComp._>{error?.message || ' '}</ErrorComp._>;

        const setValueRadio: NonNullable< React.ComponentProps< typeof RadioGroup >[ 'onChange' ] > = (
          ({ currentTarget: { value } }) => {
            const nextValue = isBool ? (value === 'true') : value;

            onChange(nextValue);
          }
        );

        return (
          <FormControl._ fullWidth margin='normal'>
            {
              asRadio
                ? (
                  <>
                    <FormLabel error={Boolean(error)} component='legend'>{label}</FormLabel>
                    <RadioGroup
                      value={(typedValue === undefined || typedValue === null) ? null : typedValue}
                      onChange={setValueRadio}
                    >
                      {radioOptionsJSX}
                    </RadioGroup>

                    { errorJSX }
                  </>
                )
                : (
                  <>
                    <Autocomplete< IOptions[ 'options' ][ 0 ], false, false, true>
                      value={
                        typedValue
                          ? (
                            options.find(it => it.value === typedValue) ||
                              { value: typedValue, label: String(typedValue) }
                          )
                          : null
                      }
                      onChange={(_, newValue) => onChange(
                        newValue === null
                          ? null
                          : (typeof newValue === 'string'
                            ? newValue
                            : newValue.value
                          ),
                      )}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        // Suggest the creation of a new value
                        if (allow_other && params.inputValue !== '') {
                          filtered.push({
                            label: `Add "${ params.inputValue }"`,
                            value: params.inputValue,
                          });
                        }

                        return filtered;
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      options={options}
                      getOptionLabel={option => option.label}
                      renderOption={option => option.label}
                      freeSolo
                      renderInput={params => <TextField {...params} label={label} variant='outlined' />}
                    />
                    {errorJSX}
                  </>
                )
            }
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Options`;
