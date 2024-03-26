import { type SessionInstance, transformResponse } from "@decisively-io/interview-sdk";
import type { ResponseData, Session } from "@decisively-io/interview-sdk";
import { CssBaseline, ThemeProvider, createTheme } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import ReactDom from "react-dom";
import * as Parts from "../parts";
import TextControlRender from "../parts/controls/TextControlWidget";
import * as FontNS from "../parts/font";
import { session as dataSession } from "./data";
import { PWD, provider } from "./interviews";

const APP_DIV_ID = "app";
const rootDiv = (() => {
  const maybeRootDiv = document.getElementById(APP_DIV_ID);
  if (maybeRootDiv !== null) {
    return maybeRootDiv;
  }

  document.body.insertAdjacentHTML("beforeend", `<div id='${APP_DIV_ID}'></div>`);
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
      *{box-sizing: border-box;}
      body,html{width:100%;height:100%;margin:0}
      body{display:flex;flex-direction:column;}
      #${APP_DIV_ID}{width:100%;height:100%;padding:1rem;background-color:rgba(155,155,155,0.3);display:flex;flex-direction:column;}
      #${APP_DIV_ID}>div{ background-color: white;}
      </style>`,
  );
  return document.getElementById(APP_DIV_ID)!;
})();

FontNS.add(document);

const theme = createTheme({
  palette: {
    primary: {
      main: "#70F058",
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
  explanations: s.explanations,
});

const App = () => {
  const [session, setSession] = useState<SessionInstance>();

  const getSession: Parts.RootProps["getSession"] = useCallback(async () => {
    if (Math.random() > -1) {
      setSession(dataSession as any);
      return dataSession;
    }

    const { id, interview } = PWD;
    const res = await provider.create(id, { interview });
    setSession(res);
    return stripSession(res);
  }, []);

  const navigateTo: Parts.RootProps["navigateTo"] = async (_, id) => {
    if (!session) return _;

    console.log("navigate", id);
    const res = await session.navigate(id);
    setSession(res);

    return res;
  };

  const next: Parts.RootProps["next"] = async (s, data) => {
    // if(Math.random() > -1) {
    //   console.log(data);
    //   return s;
    // }

    if (session) {
      const payload = transformResponse(session, data as ResponseData);
      const res = await session.submit(payload);
      setSession(res);
      return stripSession(res);
    }

    return s;
  };

  const back: Parts.RootProps["back"] = async (s, data) => {
    if (session) {
      const res = await session.back();
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
          Text({ control }) {
            return <TextControlRender {...{ control, textFieldProps: { size: "small" } }} />;
          },
        }}
        rhfMode="onChange"
      />
    </ThemeProvider>
  );
};

ReactDom.render(<App />, rootDiv);
