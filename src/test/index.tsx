/* eslint-disable react/jsx-pascal-case,import/no-extraneous-dependencies */
import React, { useState, useCallback } from 'react';
import ReactDom from 'react-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { SessionInstance, transformResponse } from '@decisively-io/interview-sdk';
import { AttributeData, ResponseData, Session } from '@decisively-io/types-interview';
import { Parts } from '..';
import { provider, motorVehicle, travelComp } from './interviews';

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
  React.useEffect(() => Parts.Font.add(document), []);

  const [session, setSession] = useState<SessionInstance>();
  const [prev, setPrev] = useState<string | null>(null);

  const getSession = useCallback(async () => {
    const { id, interview } = travelComp;
    const res = await provider.create(id, { interview });
    // provider.load(id, sessionAllVisited)
    setSession(res);
    return stripSession(res);
  }, [setSession]);

  // const state = useMemo(() => session && stripSession(session), [session]);

  // if(!session) {
  //   return <p>loading</p>;
  // }

  const onClick = async (id: string) => {
    if(session) {
      console.log('navigate', id);
      const res = await session.navigate(id);
      setSession(res);
    }

    return null;
  };

  const next = async (s: Session, data: AttributeData) => {
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

  const back = async (s: Session, data: AttributeData) => {
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

  console.log('session', session);

  return (
    <ThemeProvider theme={theme}>
      <Parts.Root
        getSession={getSession}
        next={next}
        back={back}
      />
    </ThemeProvider>
  );
};


ReactDom.render(<App />, rootDiv);
