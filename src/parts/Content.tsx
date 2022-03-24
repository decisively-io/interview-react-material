// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import Typography from '@material-ui/core/Typography';
import { DISPLAY_NAME_PREFIX } from '../constants';
import { Step } from '../types';


export const classes = {
  '>form': {
    _: 'form',

    '>h': 'heading',
    '>desc': 'desc',
  },
  '>btns': {
    _: 'btns',

    '>back': 'back',
    '>next': 'next',
  },
};


const Wrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .MuiTypography-root {
    font-family: 'Montserrat';
    font-style: normal;
  }

  >.${ classes[ '>form' ]._ } {
    flex-grow: 1;
    padding: 1.5rem 2rem;
    max-width: 43.75rem;
    margin: 0 auto;

    .${ classes[ '>form' ][ '>h' ] } {
      font-weight: 700;
      font-size: 20px;
      line-height: 1.2;
      margin-bottom: 1.5rem;
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


export interface IProps {
  className?: string;
  step: Step | null
}


export const _: React.FC< IProps > = React.memo(
  ({ className, step }) => (
    step === null ? null : (
      <Wrap className={className}>
        <div className={classes[ '>form' ]._}>
          <Typography variant='h4' className={classes[ '>form' ][ '>h' ]}>
            {step.title}
          </Typography>

          <Typography variant='body1'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in ultricies purus. Sed eu viverra risus, et cursus tortor. Proin sagittis arcu at mi mattis malesuada. Ut malesuada vitae felis sit amet lacinia. Pellentesque sagittis elementum vestibulum. Fusce ac lectus ut odio convallis varius quis nec risus.
          </Typography>

        </div>
        <div className={classes[ '>btns' ]._}>
          <Button size='medium' className={classes[ '>btns' ][ '>back' ]}>
            <Typography>Back</Typography>
          </Button>
          <Button size='medium' className={classes[ '>btns' ][ '>next' ]}>
            <Typography>Next</Typography>
          </Button>
        </div>
      </Wrap>
    )
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/Frame`;
