/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { Control, generateValidator, deriveDefaultControlsValue, IControlsValue } from '../../types/controls';
import * as Boolean from './Boolean';


export interface IRenderControlProps {
  c: Control;
}

const RenderControl: React.FC< IRenderControlProps > = React.memo(({ c }) => {
  switch(c.type) {
    case 'boolean': return <Boolean._ {...{ c }} />;
    default: return null;
  }
});
RenderControl.displayName = `${ DISPLAY_NAME_PREFIX }/__RenderControl`;


export interface IProps {
  controls: Control[];
}


export const _: React.FC< IProps > = React.memo(({ controls }) => {
  const methods = useForm({
    resolver: yupResolver(generateValidator(controls)),
    defaultValues: deriveDefaultControlsValue(controls),
  });
  const onSubmit = (data: IControlsValue) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {
          controls.map(it => (
            <RenderControl
              key={it.id}
              c={it}
            />
          ))
        }
        <br />
        <input type='submit' />
      </form>
    </FormProvider>

  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }`;
