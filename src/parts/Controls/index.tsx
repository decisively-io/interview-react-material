/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { Control, generateValidator, deriveDefaultControlsValue, IControlsValue } from '../../types/controls';
import * as Boolean from './Boolean';
import * as Currency from './Currency';
import * as Date from './Date';
import * as Time from './Time';
import * as DateTime from './DateTime';
import * as Options from './Options';


export interface IRenderControlProps {
  c: Control;
}


const RenderControl: React.FC< IRenderControlProps > = React.memo(({ c }) => {
  switch(c.type) {
    case 'boolean': return <Boolean._ {...{ c }} />;
    case 'currency': return <Currency._ {...{ c }} />;
    case 'date': return <Date._ {...{ c }} />;
    case 'time': return <Time._ {...{ c }} />;
    case 'datetime': return <DateTime._ {...{ c }} />;
    case 'options': return <Options._ {...{ c }} />;
    default: return null;
  }
});
RenderControl.displayName = `${ DISPLAY_NAME_PREFIX }/__RenderControl`;


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
