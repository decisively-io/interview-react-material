/* eslint-disable react/jsx-pascal-case */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDom from 'react-dom';
import { Step, setCurrentInStep, getCurrentStep, Screen } from '../types';
import { Parts } from '..';
import { defaultStage, steps, testScreen } from './data';

if(module.hot) {
  module.hot.accept();
}

const APP_DIV_ID = 'app';
const rootDiv = (() => {
  const maybeRootDiv = document.getElementById(APP_DIV_ID);
  if(maybeRootDiv !== null) {
    return maybeRootDiv;
  }

  document.body.insertAdjacentHTML('beforeend', `<div id='${ APP_DIV_ID }'></div>`);
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
      *{box-sizing: border-box;}
      body,html{width:100vw;height:100vh;margin:0}
      #${ APP_DIV_ID }{width:100%;height:100%;padding:1rem;background-color:rgba(155,155,155,0.3);}
      #${ APP_DIV_ID }>div{ background-color: white;}
      </style>`,
  );
  return document.getElementById(APP_DIV_ID)!;
})();

const App = () => {
  React.useEffect(() => Parts.Font.add(document), []);

  const [stages, dispatch] = React.useReducer< React.Reducer< Step[], { type: 'click', payload: Step[ 'id' ] } > >(
    (s, a) => {
      switch(a.type) {
        case 'click': return setCurrentInStep(
          { ...defaultStage, steps: s }, a.payload,
        ).steps;
        default: return s;
      }
    },
    steps,
  );
  const [screen] = React.useState< Screen >(testScreen);
  const onClick = React.useCallback< Parts.Menu.IProps[ 'onClick' ] >(
    id => dispatch({ type: 'click', payload: id }),
    [dispatch],
  );

  const currentStep = React.useMemo(
    () => getCurrentStep({ ...defaultStage, steps: stages }),
    [stages],
  );

  return (
    <Parts.Frame._
      contentJSX={(
        <Parts.Content._ stepAndScreen={
          currentStep === null ? null : { step: currentStep, screen }
        }
        />
      )}
      menuJSX={(
        <Parts.Menu._
          stages={stages}
          onClick={onClick}
          estimate='8 min'
          progress={25}
        />
      )}
    />
  );
};


ReactDom.render(<App />, rootDiv);
