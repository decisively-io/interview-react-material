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
  const { session, explSidebarActiveEl } = useInterviewContext();

  const showAttributeExplanations = Boolean(config && config.showAttributeExplanations || false);
  const maybeExplanation = React.useMemo< AttributeInfo | null >(() => {
    const { explanations } = session;
    const { value: explSidebarActiveElVal } = explSidebarActiveEl;
    if(showAttributeExplanations === false || !explanations || explSidebarActiveElVal.active === false) {
      return null;
    }

    const maybeMatchedExpl = explanations[explSidebarActiveElVal.attributeId];
    if(!maybeMatchedExpl) return null;

    return { value: explSidebarActiveElVal.label || explSidebarActiveElVal.attributeId, label: maybeMatchedExpl };
  }, [showAttributeExplanations, explSidebarActiveEl, session]);

  return (
    <Wrap>
      <Typography variant='h6' style={{ fontWeight: 700 }}>{title}</Typography>

      { data.text ? <Typography>{data.text}</Typography> : null }

      {
        maybeExplanation && (
          <ExplanationsWrap>
            <AttributeExplanation key={maybeExplanation.value}>
              <legend>
                <Typography variant='caption'>
                  {maybeExplanation.value}
                </Typography>
              </legend>

              <Typography>
                {maybeExplanation.label || ''}
              </Typography>
            </AttributeExplanation>
          </ExplanationsWrap>
        )
      }
    </Wrap>
  );
};

export default SidebarExplanation;
