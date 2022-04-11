/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import cls from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { Session } from '@decisively-io/types-interview';
import { containsCurrentStep } from '@decisively-io/interview-sdk';
import { DISPLAY_NAME_PREFIX } from '../constants';


const BorderLinearProgress = withStyles(() => ({
  root: {
    height: '0.5rem',
    borderRadius: '0.25rem',
  },
  colorPrimary: {
    backgroundColor: '#E5E5E5',
  },
  bar: {
    borderRadius: '0.25rem',
    backgroundColor: '#0A0A0A',
  },
}))(LinearProgress);

const displayName = `${ DISPLAY_NAME_PREFIX }/Menu`;

/**
 * @param level number (integers, 0,1,2,3,...)
 * @returns string
 */
export const getCnameForLevel = (level: number): string => `lvl${ level }`;


export const classes = {
  '>list': {
    _: 'list',
    '>item': {
      _: 'item',

      '&.active': 'active',
      '>avatar': {
        _: 'avatar',
        '>T': 'typography',
      },
      '>text': 'text',
    },
    '>collapse': 'collapse',
  },
  '>progress': {
    _: 'progress',

    '>bar': 'bar',
    '>info': {
      _: 'info',

      '>summary': 'summary',
      '>est': 'estimate',
    },
  },
};

const clssItem = classes[ '>list' ][ '>item' ];
const clssPrgrsInfo = classes[ '>progress' ][ '>info' ];

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  overflow: auto;

  .${ classes[ '>list' ]._ } {
    flex-grow: 1;
    overflow: auto;
  }

  .MuiTypography-root {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5;
    font-style: normal;
    color: #767676;
  }

  .${ clssItem._ }.${ clssItem[ '&.active' ] } {
    &>.${ clssItem[ '>avatar' ]._ } {
      background-color: #0A0A0A;
      .MuiTypography-root { color: #ffffff; }
    }

    &>.${ clssItem[ '>text' ] } .MuiTypography-root {
      color: #0A0A0A;
    }
  }


  .${ clssItem[ '>avatar' ]._ } {
    margin-right: 1rem;
    border: 1px solid #767676;
    background-color: #ffffff;


    &.${ getCnameForLevel(1) } {
      opacity: 0;
    }

    .${ clssItem[ '>avatar' ][ '>T' ] } {
      display: inline-block;
      font-weight: 700;
      font-size: 20px;
      line-height: 1.2;
    }
  }

  .${ classes[ '>progress' ]._ }, .${ classes[ '>list' ][ '>item' ]._ } {
    padding: 0.5rem 1.5rem;
  }

  .${ clssPrgrsInfo._ } {
    display: flex;
    margin-top: 0.25rem;

    .MuiTypography-root {
      font-size: 12px;
      color: #0A0A0A;
      font-weight: 400;
    }

    .${ clssPrgrsInfo[ '>est' ] } {
      font-weight: 700;
    }
  }
`;


export interface IRenderStageProps {
  s: IProps[ 'stages' ][ 0 ],
  level?: number;
  index?: number;
  onClick: (id: IProps[ 'stages' ][0][ 'id' ]) => unknown;
}

const RenderStage: React.FC< IRenderStageProps > = React.memo(
  ({ s, level = 0, index, onClick }) => {
    const clickOnItem = React.useCallback(
      () => onClick(s.id),
      [s.id, onClick],
    );

    const cNameForLevel = getCnameForLevel(level);
    const AvatarJSX = React.useMemo(() => (
      <Avatar className={cls(clssItem[ '>avatar' ]._, cNameForLevel)}>
        <Typography className={clssItem[ '>avatar' ][ '>T' ]} variant='h4'>
          {index || '-'}
        </Typography>
      </Avatar>
    ), [index, cNameForLevel]);

    const open = React.useMemo(() => containsCurrentStep(s), [s]);

    const itemCName = cls(clssItem._, cNameForLevel, open && clssItem[ '&.active' ]);
    const textCName = cls(clssItem[ '>text' ], cNameForLevel);
    const collapseCName = cls(classes[ '>list' ][ '>collapse' ], cNameForLevel);
    const listCName = cls(classes[ '>list' ]._, getCnameForLevel(level + 1));


    if(s.steps !== undefined && s.steps.length === 0) {
      return (
        <>
          <ListItem onClick={clickOnItem} button className={itemCName}>
            { AvatarJSX }
            <ListItemText primary={s.title} className={textCName} />
          </ListItem>
        </>
      );
    }

    return (
      <>
        <ListItem
          button
          onClick={clickOnItem}
          className={itemCName}
        >
          { AvatarJSX }
          <ListItemText primary={s.title} className={textCName} />
        </ListItem>
        <Collapse in={open} timeout='auto' className={collapseCName}>
          { s.steps && (
            <List className={listCName}>
              { s.steps.map(it => <RenderStage key={it.id} s={it} level={level + 1} onClick={onClick} />) }
            </List>
          ) }
        </Collapse>
      </>
    );
  },
);
RenderStage.displayName = `${ displayName }/RenderStage`;


export interface IProps {
  stages: Session[ 'steps' ];
  onClick: IRenderStageProps[ 'onClick' ];
  className?: string;
  /** percent */
  progress: number;
  /** e.g. '8 min', '1 hour' */
  estimate: string;
}

export const _: React.FC< IProps > = React.memo(
  ({ stages, className, onClick, estimate, progress }) => (
    <Wrap className={className}>
      <List className={cls(classes[ '>list' ]._, getCnameForLevel(0))}>
        {
          stages.reduce(
            (a, it, i) => a.concat(<RenderStage key={it.id} s={it} index={i + 1} onClick={onClick} />),
          [] as JSX.Element[],
          )
        }
      </List>

      <div className={classes[ '>progress' ]._}>
        <LinearProgress
          className={classes[ '>progress' ][ '>bar' ]}
          variant='determinate'
          value={progress}
        />

        <div className={clssPrgrsInfo._}>
          <Typography variant='caption' className={clssPrgrsInfo[ '>est' ]}>
            Progress
            {' '}
            {progress}
            %
          </Typography>
          <Typography variant='caption' className={clssPrgrsInfo[ '>summary' ]}>
            - estimate
            {' '}
            {estimate}
            {' '}
            left
          </Typography>
        </div>
      </div>
    </Wrap>
  ),
);
_.displayName = displayName;
