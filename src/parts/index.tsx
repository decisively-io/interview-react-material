/* eslint-disable react/jsx-pascal-case,import/no-extraneous-dependencies */
import React from 'react';
import {
  setCurrentInStep,
  getCurrentStep,
  Session,
} from '@decisively-io/types-interview';
import { DISPLAY_NAME_PREFIX } from '../constants';
import * as Frame from './Frame';
import * as Menu from './Menu';
import * as Content from './Content';


export const defaultStep: Session[ 'steps' ][ 0 ] = {
  complete: false,
  context: { entity: '' },
  current: false,
  id: '',
  skipped: false,
  title: '',
  visitable: true,
  visited: false,
  steps: [],
};

export const defaultSession: Session = {
  data: { '@parent': '' } as any,
  screen: {
    controls: [],
    id: '',
    title: '',
  },
  context: { entity: '' },
  sessionId: '',
  state: {},
  status: 'in-progress',
  steps: [],
};


export interface IProps {
  getSession(): Promise< Session >;
  next: Content.IProps[ 'next' ];
  back: Content.IProps[ 'back' ];
}


type SessionActions = (
  | { type: 'set', payload: Session, }
  | { type: 'setCurrentStep', payload: Session[ 'steps' ][ 0 ][ 'id' ] }
)


export const Root: React.FC< IProps > = React.memo(p => {
  const { getSession, next, back } = p;


  const [session, dispatch] = React.useReducer< React.Reducer< Session, SessionActions > >(
    (s, a) => {
      switch(a.type) {
        case 'set':
          return a.payload;

        case 'setCurrentStep':
          return {
            ...s,
            steps: setCurrentInStep(
              { ...defaultStep, steps: s.steps }, a.payload,
            ).steps || [],
          };
        default: return s;
      }
    },
    defaultSession,
  );

  React.useEffect(() => {
    getSession().then(s => dispatch({ type: 'set', payload: s }));
  }, [getSession, dispatch]);


  const currentStep = React.useMemo(
    () => getCurrentStep({ ...defaultStep, steps: session.steps }),
    [session.steps],
  );

  const { steps, screen } = session;


  const onClick = React.useCallback< Menu.IProps[ 'onClick' ] >(
    id => dispatch({ type: 'setCurrentStep', payload: id }),
    [dispatch],
  );

  const stepAndScreen = React.useMemo(() => (
    currentStep === null ? null : { step: currentStep, screen }
  ), [screen, currentStep]);


  return (
    <Frame._
      contentJSX={(
        <Content._
          stepAndScreen={stepAndScreen}
          next={next}
          back={back}
        />
      )}
      menuJSX={(
        <Menu._
          stages={steps}
          onClick={onClick}
          estimate='8 min'
          progress={25}
        />
      )}
    />
  );
});
Root.displayName = `${ DISPLAY_NAME_PREFIX }/Root`;


export * as Frame from './Frame';
export * as Menu from './Menu';
export * as Font from './__font';
export * as Content from './Content';
