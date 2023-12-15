import { containsCurrentStep } from "@decisively-io/interview-sdk";
import { Progress, Session } from "@decisively-io/types-interview";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import cls from "clsx";
import { addSeconds, formatDistanceToNow } from "date-fns";
import React from "react";
import styled from "styled-components";
import { DISPLAY_NAME_PREFIX } from "../constants";

const BorderLinearProgress = styled(LinearProgress)`
  height: 0.5rem;
  border-radius: 0.25rem;
  background-color: #E5E5E5;

  > .MuiLinearProgress-bar {
    border-radius: 0.2rem;
  }
`;

const displayName = `${DISPLAY_NAME_PREFIX}/Menu`;

/**
 * @param level number (integers, 0,1,2,3,...)
 * @returns string
 */
export const getCnameForLevel = (level: number): string => `lvl${level}`;

export const classes = {
  ">list": {
    _: "list_WlKObv",
    ">item": {
      _: "item_9Bq463",

      "&.complete": "complete_KNWPo2",
      "&.active": "active_QnECa8",
      "&.visited": "visited_Dles8p",
      ">avatar": {
        _: "avatar_3IdtNl",
        ">T": "typography_wmHqqq",
      },
      ">text": "text_KmRP5i",
    },
    ">collapse": "collapse_Y0R9FN",
  },
  ">progress": {
    _: "progress_D9jF3j",

    ">bar": "bar_O9bSkR",
    ">info": {
      _: "info_l9qs6g",

      ">summary": "summary_tsZ4SR",
      ">est": "estimate_sItjZq",
    },
  },
};

const clssItem = classes[">list"][">item"];
const clssPrgrsInfo = classes[">progress"][">info"];

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  overflow: auto;

  .${classes[">list"]._} {
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
    .MuiTypography-root { font-weight: 600; }
  }

  .${clssItem._}.${clssItem["&.active"]} {
    &>.${clssItem[">avatar"]._} {
      background-color: #0A0A0A;
      border: none;
      .MuiTypography-root { color: #ffffff; }
    }

    &>.${clssItem[">text"]} .MuiTypography-root {
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


    &.${getCnameForLevel(1)} {
      opacity: 0;
    }

    .${clssItem[">avatar"][">T"]} {
      display: inline-block;
      font-weight: 700;
      font-size: 20px;
      line-height: 1.2;
    }
  }

  .${classes[">progress"]._}, .${classes[">list"][">item"]._} {
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

export interface IRenderStageProps {
  s: IProps["stages"][0];
  status: Session["status"];
  level?: number;
  index?: number;
  onClick: (id: IProps["stages"][0]["id"]) => unknown;
}

const RenderStage: React.FC<IRenderStageProps> = React.memo(({ s, status, level = 0, index, onClick }) => {
  const clickOnItem = React.useCallback(() => {
    // do nothing if current step
    if (!s.current) {
      onClick(s.id);
    }
  }, [s, onClick]);

  const cNameForLevel = getCnameForLevel(level);
  const AvatarJSX = React.useMemo(
    () => (
      <Avatar className={cls(clssItem[">avatar"]._, cNameForLevel)}>
        <Typography className={clssItem[">avatar"][">T"]} variant="h4">
          {index || "-"}
        </Typography>
      </Avatar>
    ),
    [index, cNameForLevel],
  );

  const open = React.useMemo(() => containsCurrentStep(s), [s]);

  const itemCName = cls(clssItem._, cNameForLevel, open && clssItem["&.active"], s.complete && clssItem["&.complete"], s.visited && clssItem["&.visited"]);
  const textCName = cls(clssItem[">text"], cNameForLevel);
  const collapseCName = cls(classes[">list"][">collapse"], cNameForLevel);
  const listCName = cls(classes[">list"]._, getCnameForLevel(level + 1));

  const canNavigate = s.complete || s.visited || s.current;
  const interviewComplete = status !== "in-progress";
  const disableNavigation = !canNavigate || (interviewComplete && !s.current);

  return (
    <>
      <ListItem onClick={clickOnItem} disabled={disableNavigation} button className={itemCName}>
        {AvatarJSX}
        <ListItemText primary={s.title} className={textCName} />
      </ListItem>
      {s.steps === undefined || s.steps.length === 0 ? null : (
        <Collapse in={open} timeout="auto" className={collapseCName}>
          <List className={listCName}>
            {s.steps.map((it) => (
              <RenderStage key={it.id} s={it} status={status} level={level + 1} onClick={onClick} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
});
RenderStage.displayName = `${displayName}/RenderStage`;

export interface IProps {
  status: Session["status"];
  stages: Session["steps"];
  onClick: IRenderStageProps["onClick"];
  className?: string;
  /** The interviews progress, percent complete and time remaining */
  progress?: Progress;
}

export const _: React.FC<IProps> = React.memo(({ status, stages, className, onClick, progress }) => (
  <Wrap className={className}>
    <List className={cls(classes[">list"]._, getCnameForLevel(0))}>{stages.reduce((a, it, i) => a.concat(<RenderStage key={it.id} s={it} status={status} index={i + 1} onClick={onClick} />), [] as JSX.Element[])}</List>

    {progress && (
      <div className={classes[">progress"]._}>
        <BorderLinearProgress className={classes[">progress"][">bar"]} variant="determinate" value={progress.percentage} />
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
));
_.displayName = displayName;
