// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';
import { DISPLAY_NAME_PREFIX } from '../constants';


export const classes = {
  '>menu': 'menu',
  '>content': 'content',
};


const Wrap = styled.div`
  height: 100%;
  display: flex;
  overflow: auto;

  >.${ classes[ '>menu' ] } {
    width: 20rem;
  }

  >.${ classes[ '>content' ] } {
    flex-grow: 1;
    overflow: auto;
  }
`;


export interface IProps {
  menuJSX: JSX.Element;
  contentJSX: JSX.Element;
  className?: string;
}


export const _: React.FC< IProps > = React.memo(
  ({ contentJSX, menuJSX, className }) => (
    <Wrap className={className}>
      <div className={classes[ '>menu' ]}>
        { menuJSX }
      </div>
      <div className={classes[ '>content' ]}>
        { contentJSX }
      </div>
    </Wrap>
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/Frame`;
