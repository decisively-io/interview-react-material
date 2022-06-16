
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
import type { IRenderControlProps } from './Controls/__controlsTypes';


export const classes = {
  '>formWrap': {
    _: 'formWrap',

    '>form': {
      _: 'form',
      '>h': 'heading',
      '>controls': 'controls',
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

  >.${ classes[ '>formWrap' ]._ } {
    flex-grow: 1;
    overflow: auto;

    >.${ formClss._ } {
      margin: 0 auto;
      padding: 1.5rem 2rem;
      max-width: 43.75rem;
      display: flex;
      flex-direction: column;

      >.${ formClss[ '>h' ] } {
        margin-bottom: 1.5rem;
      }
    }
  }

  >.${ classes[ '>btns' ]._ } {
    padding: 1rem 2rem;
    width: 100%;
    border-top: 1px solid #E5E5E5;
    display: flex;
    justify-content: space-between;

    >.${ submitClss._ } {
      display: flex;
      align-items: center;

      >.${ submitClss[ '>next' ] } {
        margin-left: 1rem;
      }
    }

    .MuiTypography-root {
      font-weight: 600;
      text-transform: initial;
    }
  }
`;

export const StyledControlsWrap = styled.div`
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;


export interface IRootProps extends Pick< IRenderControlProps, 'controlComponents' > {
  className?: string;
  step: Step | null;
  screen: Screen;
  next?: (data: IControlsValue, reset: () => unknown) => unknown;
  back?: ((data: IControlsValue, reset: () => unknown) => unknown);
  backDisabled?: boolean;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
}


const CONTENT_DISPLAY_NAME = `${ DISPLAY_NAME_PREFIX }/Content`;


export const _: React.FC< IRootProps > = React.memo(p => {
  const {
    className,
    step,
    screen,
    next,
    back,
    backDisabled = false,
    nextDisabled = false,
    isSubmitting = false,
    controlComponents,
  } = p;
  const { controls } = screen ?? { controls: [] };

  const defaultValues = deriveDefaultControlsValue(controls);
  const resolver = yupResolver(generateValidator(controls));

  const methods = useForm({ resolver, defaultValues });

  const { getValues, reset } = methods;

  const onSubmit = React.useCallback((data: IControlsValue) => {
    console.log('form on submit', data);
    if(next) {
      next(data, reset);
    }
  }, [next, reset]);

  const onBack = React.useCallback(() => {
    const values = getValues();
    if(back) {
      back(values, reset);
    }
  }, [getValues, back, reset]);

  if(!screen) return null;

  const pageTitle = screen.title || step?.title || '';
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
                {pageTitle}
              </Typography>

              <StyledControlsWrap className={formClss[ '>controls' ]}>
                <Controls._ controlComponents={controlComponents} controls={screen.controls} />
              </StyledControlsWrap>
            </div>
          </div>
          {(next || back) && (
            <div className={classes[ '>btns' ]._}>
              {
                back && (
                  <Button
                    size='medium'
                    variant='outlined'
                    disabled={backDisabled}
                    onClick={onBack}
                    className={classes[ '>btns' ][ '>back' ]}
                  >
                    <Typography>Back</Typography>
                  </Button>
                )
              }
              {
                next && (
                  <div className={submitClss._}>
                    {isSubmitting && <CircularProgress size='2rem' />}
                    <Button
                      size='medium'
                      type='submit'
                      variant='contained'
                      color='primary'
                      disabled={nextDisabled}
                      className={submitClss[ '>next' ]}
                    >
                      <Typography>Next</Typography>
                    </Button>
                  </div>
                )
              }
            </div>
          )}
        </Wrap>
      </FormProvider>
    </MuiPickersUtilsProvider>
  );
});
_.displayName = `${ CONTENT_DISPLAY_NAME }/__Root`;


export interface IProps extends Pick<
  IRootProps,
  | 'className'
  | 'back'
  | 'next'
  | 'step'
  | 'backDisabled'
  | 'nextDisabled'
  | 'isSubmitting'
  | 'controlComponents'
> {
  screen: IRootProps[ 'screen' ] | null;
}

// export const _: React.FC< IProps > = React.memo(
//   props => {
//     if(props.screen === null) return null;

//     return <__Root {...props} />;
//   },
// );
// _.displayName = CONTENT_DISPLAY_NAME;
