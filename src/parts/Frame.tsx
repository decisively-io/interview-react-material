import React from "react";
import styled from "styled-components";
import { DISPLAY_NAME_PREFIX } from "../constants";

export const classes = {
  ">menu": "menu_aBBc89",
  ">content": "content_KQ3zSZ",
};

const Wrap = styled.div`
  height: 100%;
  display: flex;
  overflow: auto;

  > .${classes[">menu"]} {
    min-width: 20rem;
    max-width: 20rem;
    border-right: 1px solid #E5E5E5;
  }

  > .${classes[">content"]} {
    overflow: auto;
    flex-grow: 1;
  }
`;

export interface FrameProps {
  menuJSX?: JSX.Element;
  contentJSX: JSX.Element;
  className?: string;
}

const Frame = Object.assign(
  React.memo((props: FrameProps) => {
    const { menuJSX, contentJSX, className } = props;
    return (
      <Wrap className={className}>
        {menuJSX && <div className={classes[">menu"]}>{menuJSX}</div>}
        <div className={classes[">content"]}>{contentJSX}</div>
      </Wrap>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/Frame`,
    /*** @deprecated use Frame directly */
    _: undefined as any as React.ComponentType<FrameProps>,
  },
);
Frame._ = Frame;

/** @deprecated use Frame directly */
export const _ = Frame;

export default Frame;
