import type { RenderableSidebar, SidebarType } from "@decisively-io/interview-sdk";
import React, { useContext } from "react";
import styled from "styled-components";
import { CLASS_NAMES, LOADING_ANIMATION_CSS } from "../Constants";
import { InterviewContext } from "../interview";
import { SidebarConversation } from "./SidebarConversation";
import { SidebarData } from "./SidebarData";
import SidebarEntityList from "./SidebarEntityList";
import SidebarExplanation from "./SidebarExplanation";
import SidebarInterview from "./SidebarInterview";

export interface SidebarProps<S extends RenderableSidebar = RenderableSidebar> {
  sidebar: S;
}

export type SidebarComponent<S extends RenderableSidebar = RenderableSidebar> = React.ComponentType<SidebarProps<S>>;

export type SidebarOverrides = Record<string, SidebarComponent>;

export interface SidebarPanelProps {}

const Wrap = styled.div`
  ${LOADING_ANIMATION_CSS}

  height: 100%;
  min-width: 360px;
  max-width: 500px;
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  padding: 1rem;
`;

const TYPE_COMPONENTS: { [T in SidebarType]: SidebarComponent<Extract<RenderableSidebar, { type: T }>> } = {
  entity_list: SidebarEntityList,
  explanation: SidebarExplanation,
  data: SidebarData,
  conversation: SidebarConversation,
  interview: SidebarInterview,
};

const SidebarPanel = (props: SidebarPanelProps) => {
  const interview = useContext(InterviewContext);
  const { session, sidebarOverrides } = interview;
  const sidebars = session?.screen?.sidebars;
  if (!sidebars?.length) {
    return null;
  }

  const anyLoading = sidebars.some((sidebar) => sidebar.loading);

  return (
    <Wrap
      data-loading={anyLoading ? "true" : undefined}
      className={CLASS_NAMES.SIDEBAR.CONTAINER}
    >
      {sidebars.map((sidebar) => {
        const override = sidebar.id && sidebarOverrides?.[sidebar.id];

        const sidebarComponent = override ?? TYPE_COMPONENTS[sidebar.type];
        return sidebarComponent
          ? React.createElement(sidebarComponent as SidebarComponent<RenderableSidebar>, { sidebar, key: sidebar.id })
          : null;
      })}
    </Wrap>
  );
};

export default SidebarPanel;
