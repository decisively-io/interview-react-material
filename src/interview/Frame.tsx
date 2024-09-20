import React, { useContext } from "react";
import styled from "styled-components";
import { CLASS_NAMES, DISPLAY_NAME_PREFIX } from "../Constants";
import SidebarPanel, { type SidebarOverrides } from "../sidebar/SidebarPanel";

/**
 * @deprecated - use `CLASS_NAMES.FRAME` instead
 */
export const classes = {
  ">menu": CLASS_NAMES.FRAME.MENU,
  ">content": CLASS_NAMES.FRAME.CONTENT,
};

const Wrap = styled.div`
  height: 100%;
  display: flex;
  overflow: auto;

  > .${CLASS_NAMES.FRAME.MENU} {
    min-width: 20rem;
    max-width: 20rem;
    border-right: 1px solid #E5E5E5;
  }

  > .${CLASS_NAMES.FRAME.CONTENT} {
    overflow: auto;
    flex-grow: 1;
  }
`;

export interface FrameProps {
  menuJSX?: React.ReactNode;
  contentJSX: React.ReactNode;
  className?: string;
}

const Frame = Object.assign(
  React.memo((props: FrameProps) => {
    const { menuJSX, contentJSX, className } = props;

    return (
      <Wrap className={className}>
        {menuJSX && <div className={CLASS_NAMES.FRAME.MENU}>{menuJSX}</div>}
        <div className={CLASS_NAMES.FRAME.CONTENT}>{contentJSX}</div>
        <SidebarPanel />
      </Wrap>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Frame`,
    classes,
    /*** @deprecated use Frame directly */
    _: undefined as any as React.ComponentType<FrameProps>,
  },
);
Frame._ = Frame;

/** @deprecated use Frame directly */
export const _ = Frame;

export default Frame;
