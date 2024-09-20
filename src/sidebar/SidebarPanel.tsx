import type { RenderableSidebar, Sidebar, SidebarType } from "@decisively-io/interview-sdk";
import React, { useContext } from "react";
import styled from "styled-components";
import { CLASS_NAMES } from "../Constants";
import { InterviewContext } from "../interview";
import SidebarEntityList from "./SidebarEntityList";

export interface SidebarProps<S extends RenderableSidebar = RenderableSidebar> {
  sidebar: S;
}

export type SidebarComponent<S extends RenderableSidebar = RenderableSidebar> = React.ComponentType<SidebarProps<S>>;

export type SidebarOverrides = Record<string, SidebarComponent>;

export interface SidebarPanelProps {}

const Wrap = styled.div`
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

const TYPE_COMPONENTS: Record<SidebarType, SidebarComponent> = {
  entity_list: SidebarEntityList,
};

const SidebarPanel = (props: SidebarPanelProps) => {
  const interview = useContext(InterviewContext);
  const { session, sidebarOverrides } = interview;
  const sidebar = session?.screen?.sidebar;
  if (!sidebar) {
    return null;
  }
  const override = sidebar.id && sidebarOverrides?.[sidebar.id];

  const sidebarComponent = override ?? TYPE_COMPONENTS[sidebar.type];

  return (
    <Wrap className={CLASS_NAMES.SIDEBAR.CONTAINER}>
      {sidebarComponent ? React.createElement(sidebarComponent, { sidebar }) : null}
    </Wrap>
  );
};

export default SidebarPanel;
