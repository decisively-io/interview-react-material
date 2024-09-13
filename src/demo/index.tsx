import type { ResponseData, Session } from "@decisively-io/interview-sdk";
import { type SessionInstance, transformResponse } from "@decisively-io/interview-sdk";
import { CssBaseline, ThemeProvider, Typography, createTheme } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import ReactDom from "react-dom";
import * as Parts from "../parts";
import TextControlRender from "../parts/controls/TextControlWidget";
import * as FontNS from "../parts/font";
import { session as dataSession } from "./data";
import { PWD, provider } from "./interviews";
import styled from "styled-components";



const TestWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 4.5rem;
  border: 1px solid black;
  padding: 1rem;
  background-color: #F9F9F9;
`;
const TestCol = styled.div`
  display: flex;
  gap: 2rem;
  flex-grow: 1;
`;
const TestLabelCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
const Label = styled(Typography)`
  /* font-family: Montserrat; */
  font-size: 0.875rem;
  line-height: 1.2;
  color: #A3A3A3;
`;
const TestValueCol = styled( TestLabelCol )`

`;
const Value = styled(Label)`
  color: #000000;
`;

const Test = () => {
  type LabelValue = { label: string; value: string };
  type Data = LabelValue[][];

  const data: Data = [
    [
      { label: 'First name', value: 'John Micheal Smith' },
      { label: 'Last name', value: 'Smith' },
      { label: 'Passport Number', value: 'XXXXXX' },
      { label: 'Date of Birth', value: 'XXXXXX' },
    ],
    [
      { label: 'Street Address', value: 'xx Street Avenue' },
      { label: 'City', value: 'Sydney' },
      { label: 'Postal / Zip Code ', value: '1234' },
      { label: 'Country', value: 'Australia' },
    ],
    [
      { label: 'Email', value: 'John.m.smith@email.com' },
      { label: 'Phone', value: '+61 490123 456' },
    ],
  ]
  return (
    <div style={{ padding: '2rem' }}>
      <TestWrap>
        {
          data.map((col, i) => {
            const labels = col.map(it => it.label);
            const values = col.map(it => it.value);

            return (
              <TestCol key={i}>
                <TestLabelCol>
                  { labels.map((it, i) => <Label key={i}>{ it }</Label>) }
                </TestLabelCol>

                <TestValueCol>
                  { values.map((it, i) => <Value key={i}>{ it }</Value>)}
                </TestValueCol>
              </TestCol>
            );
          })
        }
      </TestWrap>
    </div>
  );
}

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
  return document.getElementById(APP_DIV_ID);
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
      {/* <Test /> */}
      <Parts.Root
        // getSession={getSession}
        session={dataSession as any}
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
