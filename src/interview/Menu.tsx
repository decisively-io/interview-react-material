import type { Progress, Session, Step } from "@decisively-io/interview-sdk";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { addSeconds, formatDistanceToNow } from "date-fns";
import React from "react";
import styled from "styled-components";
import { CLASS_NAMES, DISPLAY_NAME_PREFIX } from "../Constants";
import MenuItem, { getClassNameForLevel, isStepVisibleInMenu, type MenuItemProps } from "./MenuItem";

/**
 * @deprecated - use `CLASS_NAMES` instead
 */
export const classes = {
  ">list": {
    _: CLASS_NAMES.MENU.LIST,
    ">item": {
      _: CLASS_NAMES.MENU.LIST_ITEM,

      "&.complete": CLASS_NAMES.MENU.LIST_ITEM_COMPLETE,
      "&.active": CLASS_NAMES.MENU.LIST_ITEM_ACTIVE,
      "&.visited": CLASS_NAMES.MENU.LIST_ITEM_VISITED,
      ">avatar": {
        _: CLASS_NAMES.MENU.LIST_ITEM_AVATAR,
        ">T": CLASS_NAMES.MENU.LIST_ITEM_AVATAR_TEXT,
      },
      ">text": CLASS_NAMES.MENU.LIST_ITEM_TEXT,
    },
    ">collapse": CLASS_NAMES.MENU.LIST_COLLAPSE,
  },
  ">progress": {
    _: CLASS_NAMES.MENU.PROGRESS,

    ">bar": CLASS_NAMES.MENU.PROGRESS_BAR,
    ">info": {
      _: CLASS_NAMES.MENU.PROGRESS_INFO,

      ">summary": CLASS_NAMES.MENU.PROGRESS_SUMMARY,
      ">est": CLASS_NAMES.MENU.PROGRESS_ESTIMATE,
    },
  },
};

const BorderLinearProgress = styled(LinearProgress)`
  height: 0.5rem;
  border-radius: 0.25rem;
  background-color: #E5E5E5;

  > .MuiLinearProgress-bar {
    border-radius: 0.2rem;
  }
`;

const displayName = `${DISPLAY_NAME_PREFIX}/Menu`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  overflow: auto;

  .${CLASS_NAMES.MENU.LIST} {
    flex-grow: 1;
    overflow: auto;
  }

  .MuiTypography-root {
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    color: #767676;
  }

  .${CLASS_NAMES.MENU.LIST_ITEM}.${CLASS_NAMES.MENU.LIST_ITEM_COMPLETE} {
    opacity: 1;

    .MuiTypography-root {
      font-weight: 600;
    }
  }

  .${CLASS_NAMES.MENU.LIST_ITEM}.${CLASS_NAMES.MENU.LIST_ITEM_ACTIVE} {
    & > .${CLASS_NAMES.MENU.LIST_ITEM_AVATAR} {
      background-color: #0A0A0A;
      border: none;

      .MuiTypography-root {
        color: #ffffff;
      }
    }

    & > .${CLASS_NAMES.MENU.LIST_ITEM_TEXT} .MuiTypography-root {
      color: #0A0A0A;
    }
  }

  ${`.${CLASS_NAMES.MENU.LIST_ITEM}:hover`} {
    .MuiTypography-root {
      color: #0A0A0A;
    }

    .${CLASS_NAMES.MENU.LIST_ITEM_AVATAR} {
      border: 1px solid #0A0A0A;
    }
  }


  .${CLASS_NAMES.MENU.LIST_ITEM_AVATAR} {
    margin-right: 1rem;
    border: 1px solid #767676;
    background-color: #ffffff;


    &.${getClassNameForLevel(1)} {
      opacity: 0;
    }

    .${CLASS_NAMES.MENU.LIST_ITEM_AVATAR_TEXT} {
      display: inline-block;
      font-weight: 700;
      font-size: 20px;
      line-height: 1.2;
    }
  }

  .${CLASS_NAMES.MENU.PROGRESS}, .${CLASS_NAMES.MENU.LIST_ITEM} {
    padding: 0.5rem 1.5rem;
  }

  .${CLASS_NAMES.MENU.PROGRESS_INFO} {
    display: flex;
    margin-top: 0.25rem;

    .MuiTypography-root {
      font-size: 12px;
      color: #0A0A0A;
      font-weight: 400;
    }

    .${CLASS_NAMES.MENU.PROGRESS_ESTIMATE} {
      font-weight: 700;
    }
  }
`;

export interface MenuProps {
  status: Session["status"];
  stages: Step[];
  onClick: MenuItemProps["onClick"];
  className?: string;
  /** The interviews progress, percent complete and time remaining */
  progress?: Progress;
}

const Menu = Object.assign(
  React.memo((props: MenuProps) => {
    const { status, stages, className, onClick, progress } = props;

    const menuItems: React.ReactNode[] = [];
    let visibleIndex = 0;
    for (const step of stages) {
      if (isStepVisibleInMenu(step)) {
        visibleIndex++;
      }
      menuItems.push(
        <MenuItem
          key={step.id}
          step={step}
          status={status}
          avatarContent={visibleIndex}
          onClick={onClick}
        />,
      );
    }

    return (
      <Wrap className={className}>
        <List className={`${CLASS_NAMES.MENU.LIST} ${getClassNameForLevel(0)}`}>{menuItems}</List>

        {progress && (
          <div className={CLASS_NAMES.MENU.PROGRESS}>
            <BorderLinearProgress
              className={CLASS_NAMES.MENU.PROGRESS_BAR}
              variant="determinate"
              value={progress.percentage}
            />
            <div className={CLASS_NAMES.MENU.PROGRESS_INFO}>
              <Typography
                variant="caption"
                className={CLASS_NAMES.MENU.PROGRESS_SUMMARY}
              >
                {progress.percentage === 100 ? "Complete" : `Progress ${progress.percentage.toFixed(0)}%`}
              </Typography>
              {progress.time > 0 && (
                <Typography
                  variant="caption"
                  className={CLASS_NAMES.MENU.PROGRESS_SUMMARY}
                >
                  &nbsp;
                  {`- ${formatDistanceToNow(addSeconds(Date.now(), progress.time))} left`}
                </Typography>
              )}
            </div>
          </div>
        )}
      </Wrap>
    );
  }),
  {
    /*** @deprecated use Menu directly */
    _: undefined as any as React.ComponentType<MenuProps>,
    classes: classes,
    displayName,
  },
);
Menu._ = Menu;

/*** @deprecated use Menu directly */
export const _ = Menu;

export default Menu;
