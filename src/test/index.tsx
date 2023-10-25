/* eslint-disable react/jsx-pascal-case,import/no-extraneous-dependencies */
import React, { useState, useCallback } from 'react';
import ReactDom from 'react-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@material-ui/core';
import { SessionInstance, transformResponse } from '@decisively-io/interview-sdk';
import { ResponseData, Session } from '@decisively-io/types-interview';
import * as Parts from '../parts';
import * as FontNS from '../parts/__font';
import * as TextControlNS from '../parts/Controls/Text';
import { provider, PWD } from './interviews';
import { session as dataSession } from './data';


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
      body,html{width:100%;height:100%;margin:0}
      body{display:flex;flex-direction:column;}
      #${ APP_DIV_ID }{width:100%;height:100%;padding:1rem;background-color:rgba(155,155,155,0.3);display:flex;flex-direction:column;}
      #${ APP_DIV_ID }>div{ background-color: white;}
      </style>`,
  );
  return document.getElementById(APP_DIV_ID)!;
})();

FontNS.add(document);

const theme = createTheme({
  palette: {
    primary: {
      main: '#70F058',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

const stripSession = (s: SessionInstance): Session => ({
  sessionId: s.sessionId,
  status: s.status,
  state: s.state,
  screen: s.screen,
  steps: s.steps,
  context: s.context,
  data: s.data,
});

const App = () => {
  const [session, setSession] = useState<SessionInstance>();
  const [prev, setPrev] = useState<string | null>(null);

  const getSession: Parts.IProps[ 'getSession' ] = useCallback(async () => {
    if(Math.random() > -1) {
      setSession(dataSession as any);
      return dataSession;
    }

    const { id, interview } = PWD;
    const res = await provider.create(id, { interview });
    // provider.load(id, sessionAllVisited)
    setSession(res);
    return stripSession(res);
  }, [setSession]);


  const navigateTo: Parts.IProps[ 'navigateTo' ] = async (_, id) => {
    if(!session) return _;

    console.log('navigate', id);
    const res = await session.navigate(id);
    setSession(res);

    return res;
  };

  const next: Parts.IProps[ 'next' ] = async (s, data) => {
    // if(Math.random() > -1) {
    //   console.log(data);
    //   return s;
    // }

    if(session) {
      const payload = transformResponse(session, data as ResponseData);
      console.log('next', s, data, payload);
      const res = await session.submit(payload);
      setPrev(session.screen.id);
      setSession(res);
      return stripSession(res);
    }

    return s;
  };

  const back: Parts.IProps[ 'back' ] = async (s, data) => {
    if(session) {
      const payload = transformResponse(session, data as ResponseData);
      const prevScreen = prev || undefined;
      const res = await session.submit(payload, prevScreen);
      setPrev(session.screen.id);
      setSession(res);
      return stripSession(res);
    }

    return s;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Parts.Root
        getSession={getSession}
        next={next}
        back={back}
        navigateTo={navigateTo}
        controlComponents={{
          // Text() {
          //   return <h5>Hello there</h5>;
          // },
          Text({ c }) {
            return <TextControlNS._ {...{ c, textFieldProps: { size: 'small' } }} />;
          },
        }}
      />
    </ThemeProvider>
  );
};


ReactDom.render(<App />, rootDiv);
