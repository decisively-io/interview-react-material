
/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Step, Screen } from '@decisively-io/types-interview';
import { CircularProgress } from '@material-ui/core';
import * as Controls from './Controls';
import { DISPLAY_NAME_PREFIX } from '../constants';
import { generateValidator, deriveDefaultControlsValue, IControlsValue } from '../types/controls';


export const classes = {
  '>formWrap': {
    _: 'formWrap',

    '>form': {
      _: 'form',
      '>h': 'heading',
      '>desc': 'desc',
    },
  },
  '>btns': {
    _: 'btns',

    '>back': 'back',
    '>submit': {
      _: 'submit',
      '>next': 'next',
    },
  },
};
const formClss = classes[ '>formWrap' ][ '>form' ];
const submitClss = classes[ '>btns' ][ '>submit' ];

const Wrap = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .MuiTypography-root {
    font-family: 'Montserrat';
    font-style: normal;
  }

  >.${ classes[ '>formWrap' ]._ } {
    flex-grow: 1;
    overflow: auto;

    >.${ formClss._ } {
      margin: 0 auto;
      padding: 1.5rem 2rem;
      max-width: 43.75rem;
      display: flex;
      flex-direction: column;

      .${ formClss[ '>h' ] } {
        margin-bottom: 1.5rem;
      }

      > * {
        margin-top: 1rem;
        margin-bottom: 0;
      }
    }
  }

  >.${ classes[ '>btns' ]._ } {
    padding: 1rem 2rem;
    width: 100%;
    border-top: 1px solid #E5E5E5;
    display: flex;
    justify-content: space-between;

    .${ submitClss._ } {
      display: flex;
      align-items: center;

      .${ submitClss[ '>next' ] } {
        margin-left: 1rem;
      }
    }

    .MuiTypography-root {
      font-weight: 600;
      text-transform: initial;
    }
  }
`;


export interface IRootProps {
  className?: string;
  stepAndScreen: { step: Step; screen: Screen };
  next: (data: IControlsValue, reset: () => unknown) => unknown;
  back: false | ((data: IControlsValue, reset: () => unknown) => unknown);
}


const CONTENT_DISPLAY_NAME = `${ DISPLAY_NAME_PREFIX }/Content`;


export const __Root: React.FC< IRootProps > = React.memo(p => {
  const {
    className,
    stepAndScreen: { step, screen },
    next,
    back,
  } = p;
  const { controls } = screen;

  const defaultValues = deriveDefaultControlsValue(controls);
  const resolver = yupResolver(generateValidator(controls));

  const methods = useForm({ resolver, defaultValues });

  const { getValues, reset, formState } = methods;

  const onSubmit = React.useCallback((data: IControlsValue) => {
    console.log('form on submit', data);
    next(data, reset);
  }, [next, reset]);

  const onBack = React.useCallback(() => {
    const values = getValues();
    if(back) {
      back(values, reset);
    }
  }, [getValues, back, reset]);

  const submitting = formState.isSubmitting || formState.isSubmitted;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormProvider {...methods}>
        <Wrap
          onSubmit={methods.handleSubmit(onSubmit)}
          className={className}
        >
          <div className={classes[ '>formWrap' ]._}>
            <div className={formClss._}>
              <Typography variant='h4' className={formClss[ '>h' ]}>
                {step.title}
              </Typography>

              <Controls._ controls={screen.controls} />
            </div>
          </div>
          <div className={classes[ '>btns' ]._}>
            <Button
              size='medium'
              variant='outlined'
              disabled={back === false}
              onClick={onBack}
              className={classes[ '>btns' ][ '>back' ]}
            >
              <Typography>Back</Typography>
            </Button>
            <div className={submitClss._}>
              {submitting && <CircularProgress size='2rem' />}
              <Button
                size='medium'
                type='submit'
                variant='contained'
                color='primary'
                disabled={submitting || !formState.isValid}
                className={submitClss[ '>next' ]}
              >
                <Typography>Next</Typography>
              </Button>
            </div>
          </div>
        </Wrap>
      </FormProvider>
    </MuiPickersUtilsProvider>
  );
});
__Root.displayName = `${ CONTENT_DISPLAY_NAME }/__Root`;


export interface IProps extends Pick< IRootProps, 'className' | 'back' | 'next' > {
  stepAndScreen: IRootProps[ 'stepAndScreen' ] | null;
}

export const _: React.FC< IProps > = React.memo(
  ({ stepAndScreen, ...p }) => {
    if(stepAndScreen === null) return null;

    return <__Root {...{ stepAndScreen, ...p }} />;
  },
);
_.displayName = CONTENT_DISPLAY_NAME;
