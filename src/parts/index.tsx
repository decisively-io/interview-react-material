/* eslint-disable react/jsx-pascal-case,import/no-extraneous-dependencies,react/sort-comp */
import React from 'react';
import {
  Session,
  IControlsValue,
} from '@decisively-io/types-interview';
import {
  setCurrentInStep,
  getCurrentStep,
} from '@decisively-io/interview-sdk';
import { normalizeControlsValue } from '../types';
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
  getSession: () => Promise< Session >;
  next: (s: Session, d: IControlsValue) => Promise< typeof s >;
  back: (s: Session, d: IControlsValue) => Promise< typeof s >;
  navigateTo: (s: Session, stepId: Session[ 'steps' ][ 0 ][ 'id' ]) => Promise< typeof s >;
}

export interface IState {
  session: Session;
}

export class Root extends React.PureComponent< IProps, IState > {
  // eslint-disable-next-line react/static-property-placement
  static displayName = `${ DISPLAY_NAME_PREFIX }/Root`;

  constructor(p: Root['props']) {
    super(p);

    this.state = {
      session: defaultSession,
    };
  }


  // ===================================================================================


  ___setSession = (s: Session): void => {
    this.setState({ session: s });
  }

  __setCurrentStep = (stepId: Session[ 'steps' ][ 0 ][ 'id' ]): void => {
    const {
      props: { navigateTo },
      state: { session },
    } = this;

    navigateTo(session, stepId)
      .then(s => this.setState({ session: s }));
  }

  __getSession = (): void => {
    const { getSession } = this.props;

    getSession().then(s => this.___setSession(s));
  }

  componentDidMount(): void {
    this.__getSession();
  }

  componentDidUpdate(prevProps: Root[ 'props' ]): void {
    // eslint-disable-next-line react/destructuring-assignment
    if(prevProps.getSession !== this.props.getSession) this.__getSession();
  }


  // ===================================================================================


  __back: Content.IProps[ 'back' ] = (data, reset) => {
    const {
      props: { back },
      state: { session: s },
    } = this;

    back(s, normalizeControlsValue(data, s.screen.controls))
      .then(s => {
        reset();
        console.log('back success, setting new session data', s);
        this.___setSession({ ...s });
      });
  }

  __next: Content.IProps[ 'next' ] = (data, reset) => {
    const {
      props: { next },
      state: { session: s },
    } = this;

    next(s, normalizeControlsValue(data, s.screen.controls))
      .then(s => {
        console.log('next success, resetting');
        reset();
        console.log('next success, setting new session data', s);
        this.___setSession({ ...s });
      });
  }


  // ===================================================================================


  render(): JSX.Element {
    const {
      state: { session },
      __setCurrentStep,
      __back,
      __next,
    } = this;


    const { steps, screen, progress } = session;
    const currentStep = getCurrentStep({ ...defaultStep, steps });
    const stepIndex = currentStep ? steps.findIndex(s => s.id === currentStep.id) : -1;

    const stepAndScreen = currentStep === null
      ? null
      : { step: currentStep, screen };


    return (
      <Frame._
        contentJSX={(
          <Content._
            // use screen id as key, as it will re-render if the screen changes
            key={screen.id}
            stepAndScreen={stepAndScreen}
            next={__next}
            back={stepIndex !== 0 && __back}
          />
        )}
        menuJSX={(
          <Menu._
            stages={steps}
            progress={progress}
            onClick={__setCurrentStep}
          />
        )}
      />
    );
  }
}

export * as Frame from './Frame';
export * as Menu from './Menu';
export * as Font from './__font';
export * as Content from './Content';
