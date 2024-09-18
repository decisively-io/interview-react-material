import type { RenderableSidebar, Sidebar } from "@decisively-io/interview-sdk";
import React from "react";
import styled from "styled-components";
import { CLASS_NAMES } from "../Constants";

export interface BaseSidebarPanelProps {
  sidebar: RenderableSidebar;
}

export type SidebarOverrides = Record<string, React.ComponentType<BaseSidebarPanelProps>>;

export interface SidebarPanelProps extends BaseSidebarPanelProps {
  overrides?: SidebarOverrides;
}

const Wrap = styled.div`
  height: 100%;
  min-width: 200px;
  max-width: 400px;
  display: flex;
  overflow: auto;
`;

const SidebarPanel = (props: SidebarPanelProps) => {
  const { sidebar, overrides } = props;
  const override = sidebar.id && overrides?.[sidebar.id];

  return (
    <Wrap className={CLASS_NAMES.SIDEBAR.CONTAINER}>
      {override ? React.createElement(override, { sidebar }) : null}
    </Wrap>
  );
};

export default SidebarPanel;
