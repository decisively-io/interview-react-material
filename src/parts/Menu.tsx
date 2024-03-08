import type { Progress, Session, Step } from "@decisively-io/interview-sdk";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { addSeconds, formatDistanceToNow } from "date-fns";
import React from "react";
import styled from "styled-components";
import { DISPLAY_NAME_PREFIX, MENU_CLASS_NAMES } from "../Constants";
import MenuItem, { getClassNameForLevel, isStepVisibleInMenu, type MenuItemProps } from "./MenuItem";

const BorderLinearProgress = styled(LinearProgress)`
  height: 0.5rem;
  border-radius: 0.25rem;
  background-color: #E5E5E5;

  > .MuiLinearProgress-bar {
    border-radius: 0.2rem;
  }
`;

const displayName = `${DISPLAY_NAME_PREFIX}/Menu`;

const clssItem = MENU_CLASS_NAMES[">list"][">item"];
const clssPrgrsInfo = MENU_CLASS_NAMES[">progress"][">info"];

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  overflow: auto;

  .${MENU_CLASS_NAMES[">list"]._} {
    flex-grow: 1;
    overflow: auto;
  }

  .MuiTypography-root {
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    color: #767676;
  }

  .${clssItem._}.${clssItem["&.complete"]} {
    opacity: 1;

    .MuiTypography-root {
      font-weight: 600;
    }
  }

  .${clssItem._}.${clssItem["&.active"]} {
    & > .${clssItem[">avatar"]._} {
      background-color: #0A0A0A;
      border: none;

      .MuiTypography-root {
        color: #ffffff;
      }
    }

    & > .${clssItem[">text"]} .MuiTypography-root {
      color: #0A0A0A;
    }
  }

  ${`.${clssItem._}:hover`} {
    .MuiTypography-root {
      color: #0A0A0A;
    }

    .${clssItem[">avatar"]._} {
      border: 1px solid #0A0A0A;
    }
  }


  .${clssItem[">avatar"]._} {
    margin-right: 1rem;
    border: 1px solid #767676;
    background-color: #ffffff;


    &.${getClassNameForLevel(1)} {
      opacity: 0;
    }

    .${clssItem[">avatar"][">T"]} {
      display: inline-block;
      font-weight: 700;
      font-size: 20px;
      line-height: 1.2;
    }
  }

  .${MENU_CLASS_NAMES[">progress"]._}, .${MENU_CLASS_NAMES[">list"][">item"]._} {
    padding: 0.5rem 1.5rem;
  }

  .${clssPrgrsInfo._} {
    display: flex;
    margin-top: 0.25rem;

    .MuiTypography-root {
      font-size: 12px;
      color: #0A0A0A;
      font-weight: 400;
    }

    .${clssPrgrsInfo[">est"]} {
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
      menuItems.push(<MenuItem key={step.id} step={step} status={status} avatarContent={visibleIndex} onClick={onClick} />);
    }

    return (
      <Wrap className={className}>
        <List className={`${MENU_CLASS_NAMES[">list"]._} ${getClassNameForLevel(0)}`}>{menuItems}</List>

        {progress && (
          <div className={MENU_CLASS_NAMES[">progress"]._}>
            <BorderLinearProgress className={MENU_CLASS_NAMES[">progress"][">bar"]} variant="determinate" value={progress.percentage} />
            <div className={clssPrgrsInfo._}>
              <Typography variant="caption" className={clssPrgrsInfo[">est"]}>
                {progress.percentage === 100 ? "Complete" : `Progress ${progress.percentage.toFixed(0)}%`}
              </Typography>
              {progress.time > 0 && (
                <Typography variant="caption" className={clssPrgrsInfo[">summary"]}>
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
    classes: MENU_CLASS_NAMES,
    displayName,
  },
);
Menu._ = Menu;

/*** @deprecated use Menu directly */
export const _ = Menu;

export const classes = MENU_CLASS_NAMES;

export default Menu;
