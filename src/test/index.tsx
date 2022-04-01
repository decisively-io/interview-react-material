/* eslint-disable react/jsx-pascal-case */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDom from 'react-dom';
import { Step, setCurrentInStep, getCurrentStep, Screen } from '../types';
import { Parts } from '..';

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


const defaultStage: Step = {
  complete: false,
  context: { entity: '' },
  current: false,
  skipped: false,
  visitable: false,
  visited: false,
  id: '',
  title: '',
  steps: [],
};

const steps: Step[] = [
  {
    ...defaultStage,
    id: '1',
    title: 'Flight details',
    steps: [
      {
        ...defaultStage,
        id: '1.1',
        title: 'Welcome',
      },
      {
        ...defaultStage,
        id: '1.2',
        title: 'Itinerary',
      },
      {
        ...defaultStage,
        id: '1.3',
        title: 'Grievance',
      },
      {
        ...defaultStage,
        id: '1.4',
        title: 'Airline',
      },
      {
        ...defaultStage,
        id: '1.5',
        title: 'Distance',
      },
    ],
  },
  {
    ...defaultStage,
    id: '2.1',
    title: 'What happened?',
  },
  {
    ...defaultStage,
    id: '3.1',
    title: 'Outcome?',
  },
];


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
  const [screen] = React.useState< Screen >({
    id: 'screen1',
    title: 'Screen 1',
    controls: [
      {
        type: 'boolean',
        attribute: 'attributeBool',
        id: 'bool1',
        label: 'Bool 1',
      },
      {
        type: 'currency',
        attribute: 'attributeCurrency',
        id: 'currency1',
        label: 'Currency 1',
        symbol: '$',
        default: 5,
        // required: true,
        // max: 1,
        // min: -10,
      },
      {
        type: 'date',
        attribute: 'attributeDate',
        id: 'date1',
        label: 'Date 1',
        // min: '2022-03-01',
        // max: '2023-03-01',
        // default: '2022-01-01',
        // required: true,
      },
      {
        type: 'time',
        attribute: 'attributeTime',
        id: 'time1',
        label: 'Time 1',
        // min: '15:22:00',
        // max: '23:11:21',
        // minutes_increment: 15,
        // format: '12',
      },
      {
        type: 'datetime',
        attribute: 'attributeDatetime',
        id: 'datetime1',
        label: 'Datetime 1',
        // date_max: '2022-01-01',
        // date_min: '2021-01-01',
        // time_max: '15:00:00',
        // time_min: '13:00:00',
        // format: '12',
      },
      {
        type: 'options',
        attribute: 'attributeOptions',
        id: 'options1',
        label: 'Options 1',
        options: [
          { label: 'Uno', value: 'Uno' },
          { label: 'Dos', value: 'Dos' },
          { label: 'Tres', value: 'Tres' },
        ],
        as: 'radio',
      },
    ],
  });
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
