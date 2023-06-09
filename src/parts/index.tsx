/* eslint-disable react/jsx-pascal-case,import/no-extraneous-dependencies,react/sort-comp */
import React from 'react';
import {
  Session,
  IControlsValue,
  AttributeData,
} from '@decisively-io/types-interview';
import { getCurrentStep } from '@decisively-io/interview-sdk';
import { normalizeControlsValue } from '../types';
import { DISPLAY_NAME_PREFIX } from '../constants';
import * as Frame from './Frame';
import * as Menu from './Menu';
import * as Content from './Content';
import type { IRenderControlProps } from './Controls/__controlsTypes';


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
  status: 'in-progress',
  steps: [],
};


export interface IProps extends Pick< IRenderControlProps, 'controlComponents' > {
  getSession: () => Promise< Session >;
  next: (s: Session, d: IControlsValue) => Promise< typeof s >;
  back: (s: Session, d: IControlsValue) => Promise< typeof s >;
  navigateTo: (s: Session, stepId: Session[ 'steps' ][ 0 ][ 'id' ]) => Promise< typeof s >;
  // callback to notify external component that data has been updated
  chOnScreenData?: (data: AttributeData) => void;
  // flag to indicate that the component is loading data from an external source
  externalLoading?: boolean;
}

export interface IState extends Pick<
  Content.IProps,
  | 'backDisabled'
  | 'nextDisabled'
  | 'isSubmitting'
> {
  session: Session;
}

export class Root extends React.PureComponent< IProps, IState > {
  // eslint-disable-next-line react/static-property-placement
  static displayName = `${ DISPLAY_NAME_PREFIX }/Root`;

  constructor(p: Root['props']) {
    super(p);

    this.state = {
      session: defaultSession,
      backDisabled: false,
      isSubmitting: false,
      nextDisabled: false,
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

    getSession().then(s => {
      this.___setSession(s);
    });
  }

  componentDidMount(): void {
    this.__getSession();
  }

  componentDidUpdate(prevProps: Root[ 'props' ]): void {
    // eslint-disable-next-line react/destructuring-assignment
    if(prevProps.getSession !== this.props.getSession) this.__getSession();
  }


  // ===================================================================================


  __back: Content.IProps[ 'back' ] = (_, reset) => {
    const {
      props: { back },
      state: { session: s },
    } = this;

    this.setState({ backDisabled: true });

    back(s, {})
      .then(s => {
        reset();
        console.log('back success, setting new session data', s);
        this.___setSession(s);
        this.setState({ backDisabled: false });
      });
  }

  __next: Content.IProps[ 'next' ] = (data, reset) => {
    const parentPropName = '@parent';
    const {
      props: { next },
      state: { session: s },
    } = this;

    this.setState({ nextDisabled: true, isSubmitting: true });

    const normalized = normalizeControlsValue(data, s.screen.controls);

    if(data[ parentPropName ]) normalized[ parentPropName ] = data[ parentPropName ];

    next(s, normalized)
      .then(s => {
        console.log('next success, resetting');
        reset();
        console.log('next success, setting new session data', s);
        this.___setSession(s);
        this.setState({ nextDisabled: false, isSubmitting: false });
      });
  }


  // ===================================================================================


  render(): JSX.Element {
    const {
      state: {
        session,
        backDisabled,
        isSubmitting,
        nextDisabled,
      },
      props: { controlComponents },
      __setCurrentStep,
      __back,
      __next,
    } = this;


    const { steps, screen, progress, status } = session;
    const { chOnScreenData, externalLoading } = this.props;
    const currentStep = getCurrentStep({ ...defaultStep, steps });
    const stepIndex = currentStep ? steps.findIndex(s => s.id === currentStep.id) : -1;

    if(status !== 'in-progress') {
      return (
        <Frame._
          contentJSX={(
            <Content._
              // use screen id as key, as it will re-render if the screen changes
              key={screen.id}
              step={currentStep}
              screen={screen}
              controlComponents={controlComponents}
            />
          )}
          menuJSX={(
            <Menu._
              status={status}
              stages={steps}
              progress={progress}
              onClick={__setCurrentStep}
            />
          )}
        />
      );
    }

    return (

      <Frame._
        contentJSX={(
          <Content._
            // use screen id as key, as it will re-render if the screen changes
            key={screen.id}
            step={currentStep}
            screen={screen}
            next={__next}
            back={__back}
            backDisabled={backDisabled || stepIndex === 0 || externalLoading}
            isSubmitting={isSubmitting || externalLoading}
            nextDisabled={nextDisabled || externalLoading}
            controlComponents={controlComponents}
            chOnScreenData={chOnScreenData}
          />
        )}
        menuJSX={(
          <Menu._
            status={status}
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


// these are needed because when we use this lib in project with
// module not set to cjs, it starts importing other entities, and
// breaks references. So useFormContext inported in consumer project !== useFormContext
// that is compatible wth this repo
// that's why we reexport same exact functions that are referentially equal to
// react-hook-form build used in this repo
export {
  useFormContext,
  useFieldArray,
  useForm,
  useController,
  useWatch,
  useFormState,
  FormProvider,
  Controller,
  appendErrors,
  get,
  set,
} from 'react-hook-form';
