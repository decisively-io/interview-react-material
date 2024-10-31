import type { AttributeInfo, RenderableExplanationSidebar } from "@decisively-io/interview-sdk/dist/core/sidebars/sidebar";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import type { SidebarComponent } from "./SidebarPanel";
import { useInterviewContext } from "../interview";
import React from "react";


const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ExplanationsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
const AttributeExplanation = styled.fieldset`
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;

  legend {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

const SidebarExplanation: SidebarComponent<RenderableExplanationSidebar> = ({ sidebar }) => {
  const { data, title, config } = sidebar;
  const { session } = useInterviewContext();

  const showAttributeExplanations = Boolean(config && config.showAttributeExplanations || false);
  const explanationsArr = React.useMemo< AttributeInfo[] >(() => {
    const { explanations, screen: { controls } } = session;
    if(showAttributeExplanations === false || !explanations) return [];

    return controls.reduce< AttributeInfo[] >(
      (a, { attribute }) => {
        if(!attribute ) return a;

        const maybeExplanation = explanations[attribute];
        if(!maybeExplanation) return a;

        return a.concat({value: attribute, label: maybeExplanation});
      },
      []
    );
  }, [showAttributeExplanations, session]);

  return (
    <Wrap>
      <Typography variant='h6' style={{ fontWeight: 700 }}>{title}</Typography>

      { data.text ? <Typography>{data.text}</Typography> : null }

      {
        explanationsArr.length === 0 ? null : (
          <ExplanationsWrap>
            {explanationsArr.map(it => (
              <AttributeExplanation key={it.value}>
                <legend>
                  <Typography variant='caption'>
                    {it.value}
                  </Typography>
                </legend>

                <Typography>
                  {it.label || ''}
                </Typography>
              </AttributeExplanation>
            ))}
          </ExplanationsWrap>
        )
      }
    </Wrap>
  );
};

export default SidebarExplanation;
