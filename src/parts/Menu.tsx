/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import cls from 'classnames';
import { Interview } from '../types';
import { DISPLAY_NAME_PREFIX } from '../constants';


const displayName = `${ DISPLAY_NAME_PREFIX }/Menu`;


export const getCnameForLevel = (level: number): string => `lvl${ level }`;


export const classes = {
  _: 'list',
  '>item': {
    _: 'item',

    '>avatar': 'avatar',
    '>text': 'text',
  },
  '>collapse': 'collapse',
};


const Wrap = styled(List)`

`;


export interface IProps {
  stages: Interview[ 'stages' ];
  className?: string;
}

export interface IRenderStageProps {
  s: IProps[ 'stages' ][ 0 ],
  level?: number;
  index?: number;
}

const RenderStage: React.FC< IRenderStageProps > = React.memo(
  ({ s, level = 0, index }) => {
    const [open, dispatch] = React.useReducer< React.Reducer< boolean, { type: 'toggle' } > >(
      (s, a) => {
        switch(a.type) {
          case 'toggle': return !s;
          default: return s;
        }
      },
      false,
    );
    const toggleOpen = React.useCallback(() => dispatch({ type: 'toggle' }), [dispatch]);

    const cNameForLevel = getCnameForLevel(level);
    const AvatarJSX = React.useMemo(() => (level === 0 && index !== undefined
      ? (
        <Avatar className={cls(classes[ '>item' ][ '>avatar' ], cNameForLevel)}>
          {index}
        </Avatar>
      )
      : null
    ), [level, index, cNameForLevel]);


    const itemCName = cls(classes[ '>item' ]._, cNameForLevel);
    const textCName = cls(classes[ '>item' ][ '>text' ], cNameForLevel);
    const collapseCName = cls(classes[ '>collapse' ], cNameForLevel);
    const listCName = cls(classes._, getCnameForLevel(level + 1));


    if(s.steps.length === 0) {
      return (
        <>
          <ListItem button className={itemCName}>
            { AvatarJSX }
            <ListItemText primary={s.title} className={textCName} />
          </ListItem>
        </>
      );
    }

    return (
      <>
        <ListItem button onClick={toggleOpen} className={itemCName}>
          { AvatarJSX }
          <ListItemText primary='Inbox' className={textCName} />
        </ListItem>
        <Collapse in={open} timeout='auto' unmountOnExit className={collapseCName}>
          <List component='nav' className={listCName}>
            { s.steps.map(it => <RenderStage key={it.id} s={it} level={level + 1} />) }
          </List>
        </Collapse>
      </>
    );
  },
);
RenderStage.displayName = `${ displayName }/RenderStage`;


export const _: React.FC< IProps > = React.memo(
  ({ stages, className }) => (
    <List
      component='nav'
      className={cls(className, classes._, getCnameForLevel(0))}
    >
      {
        stages.reduce(
          (a, it, i) => a.concat(<RenderStage key={it.id} s={it} index={i + 1} />),
          [] as JSX.Element[],
        )
      }
    </List>
  ),
);
_.displayName = displayName;
