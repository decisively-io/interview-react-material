/* eslint-disable react/jsx-pascal-case,import/no-extraneous-dependencies */
import React from 'react';
import ReactDom from 'react-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { Parts } from '..';
import { session } from './data';


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


const theme = createTheme({
  palette: {
    primary: {
      main: '#70F058',
    },
  },
});

const getSession = () => Promise.resolve(session);

const App = () => {
  React.useEffect(() => Parts.Font.add(document), []);


  return (
    <ThemeProvider theme={theme}>
      <Parts.Root
        getSession={getSession}
        next={d => console.log('next', d)}
        back={d => console.log('back', d)}
      />
    </ThemeProvider>
  );
};


ReactDom.render(<App />, rootDiv);
