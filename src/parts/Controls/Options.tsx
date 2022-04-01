/* eslint-disable camelcase,import/no-extraneous-dependencies */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IOptions } from '../../types/controls';


const filter = createFilterOptions<{ label: string; value: string }>();


export interface IProps {
  c: IOptions;
}

const RadioControl = <Radio />;

export const _: React.FC< IProps > = React.memo(({ c }) => {
  const { control } = useFormContext();
  const {
    label,
    id,
    as: asType,
    options,
    allow_other,
  } = c;
  const selectId = `${ id }-input`;


  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { value, onChange } }) => (
        <FormControl fullWidth margin='normal'>
          {
            asType === 'radio'
              ? (
                <>
                  <FormLabel component='legend'>{label}</FormLabel>
                  <RadioGroup value={value} onChange={e => onChange(e.target.value)}>
                    { options.map(it => (
                      <FormControlLabel key={it.value} value={it.value} control={RadioControl} label={it.label} />
                    )) }
                  </RadioGroup>
                </>
              )
              : (
                <Autocomplete<{ label: string; value: string }, false, false, true>
                  value={
                    value
                      ? (options.find(it => it.value === value) || { value, label: value })
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
                  id={selectId}
                  options={options}
                  getOptionLabel={option => option.label}
                  renderOption={option => option.label}
                  freeSolo
                  renderInput={params => <TextField {...params} label={label} variant='outlined' />}
                />
              )
          }
        </FormControl>
      )}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Options`;
