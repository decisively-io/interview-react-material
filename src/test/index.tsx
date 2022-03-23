/* eslint-disable react/jsx-pascal-case */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDom from 'react-dom';
import { Step } from 'types';
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


const contentJSX = (
  <>
    {
      new Array(100)
        .fill(0)
        .reduce(
          (acc, _, i) => acc.concat(
            <span key={i}>{i}</span>,
            <br />,
          ),
          [],
        )
    }
  </>
);

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

const menuJSX = (
  <Parts.Menu._
    stages={[
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
    ]}
  />
);


const App = () => {
  return (
    <Parts.Frame._
      contentJSX={contentJSX}
      menuJSX={menuJSX}
    />
  );
};


ReactDom.render(
  <App />,
  rootDiv,
);
