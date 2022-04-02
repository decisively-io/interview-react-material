/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { Control, generateValidator, deriveDefaultControlsValue, IControlsValue } from '../../types/controls';
import { RenderControl } from './__renderControl';


export interface IProps {
  controls: Control[];
}


export const _: React.FC< IProps > = React.memo(({ controls }) => {
  const defaultValues = deriveDefaultControlsValue(controls);

  const methods = useForm({
    resolver: yupResolver(generateValidator(controls)),
    defaultValues,
  });
  const onSubmit = (data: IControlsValue) => {
    console.log(data);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          { controls.map(it => <RenderControl key={it.id} c={it} />) }
          <br />
          <input type='submit' />
        </form>
      </FormProvider>
    </MuiPickersUtilsProvider>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }`;
