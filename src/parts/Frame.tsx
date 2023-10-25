// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';
import { DISPLAY_NAME_PREFIX } from '../constants';


export const classes = {
  '>menu': 'menu_aBBc89',
  '>content': 'content_KQ3zSZ',
};


const Wrap = styled.div`
  height: 100%;
  display: flex;
  overflow: auto;

  >.${ classes[ '>menu' ] } {
    min-width: 20rem;
    max-width: 20rem;
    border-right: 1px solid #E5E5E5;
  }

  >.${ classes[ '>content' ] } {
    overflow: auto;
    flex-grow: 1;
  }
`;


export interface IProps {
  menuJSX?: JSX.Element;
  contentJSX: JSX.Element;
  className?: string;
}


export const _: React.FC< IProps > = React.memo(
  ({ contentJSX, menuJSX, className }) => (
    <Wrap className={className}>
      {menuJSX && (
        <div className={classes[ '>menu' ]}>
          { menuJSX }
        </div>
      )}
      <div className={classes[ '>content' ]}>
        { contentJSX }
      </div>
    </Wrap>
  ),
);
_.displayName = `${ DISPLAY_NAME_PREFIX }/Frame`;
