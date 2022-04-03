
/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Controls from './Controls';
import { Step, Screen } from '../types';
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
    '>next': 'next',
  },
};
const formClss = classes[ '>formWrap' ][ '>form' ];


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

      .${ formClss[ '>h' ] } {
        font-weight: 700;
        font-size: 20px;
        line-height: 1.2;
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

    .MuiTypography-root {
      font-weight: 600;
      text-transform: initial;
    }

    >.${ classes[ '>btns' ][ '>back' ] }, >.${ classes[ '>btns' ][ '>next' ] } {
      border-radius: 0.5rem;
    }

    >.${ classes[ '>btns' ][ '>back' ] } { border: 1px solid #0A0A0A; }
    >.${ classes[ '>btns' ][ '>next' ] } { background-color: #70F058; }
  }
`;


export interface IRootProps {
  className?: string;
  stepAndScreen: { step: Step; screen: Screen };
}

const CONTENT_DISPLAY_NAME = `${ DISPLAY_NAME_PREFIX }/Content`;

export const __Root: React.FC< IRootProps > = React.memo(p => {
  const { className, stepAndScreen: { step, screen } } = p;
  const { controls } = screen;

  const defaultValues = deriveDefaultControlsValue(controls);
  const resolver = yupResolver(generateValidator(controls));

  const methods = useForm({ resolver, defaultValues });
  const onSubmit = React.useCallback((data: IControlsValue) => {
    console.log(data);
  }, []);


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormProvider {...methods}>
        <Wrap onSubmit={methods.handleSubmit(onSubmit)} className={className}>
          <div className={classes[ '>formWrap' ]._}>
            <div className={formClss._}>
              <Typography variant='h4' className={formClss[ '>h' ]}>
                {step.title}
              </Typography>

              <Typography className={formClss[ '>desc' ]} variant='body1'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in ultricies purus. Sed eu viverra risus, et cursus tortor. Proin sagittis arcu at mi mattis malesuada. Ut malesuada vitae felis sit amet lacinia. Pellentesque sagittis elementum vestibulum. Fusce ac lectus ut odio convallis varius quis nec risus.
              </Typography>


              <Controls._ controls={screen.controls} />
            </div>
          </div>
          <div className={classes[ '>btns' ]._}>
            <Button size='medium' className={classes[ '>btns' ][ '>back' ]}>
              <Typography>Back</Typography>
            </Button>
            <Button size='medium' type='submit' className={classes[ '>btns' ][ '>next' ]}>
              <Typography>Next</Typography>
            </Button>
          </div>
        </Wrap>
      </FormProvider>
    </MuiPickersUtilsProvider>
  );
});
__Root.displayName = `${ CONTENT_DISPLAY_NAME }/__Root`;


export interface IProps {
  className?: string;
  stepAndScreen: IRootProps[ 'stepAndScreen' ] | null;
}

export const _: React.FC< IProps > = React.memo(
  ({ className, stepAndScreen }) => {
    if(stepAndScreen === null) return null;

    return <__Root {...{ className, stepAndScreen }} />;
  },
);
_.displayName = CONTENT_DISPLAY_NAME;
