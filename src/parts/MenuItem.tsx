import { containsCurrentStep } from "@decisively-io/interview-sdk";
import { Session, Step } from "@decisively-io/types-interview";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React from "react";
import { DISPLAY_NAME_PREFIX, MENU_CLASS_NAMES, SHOW_UNVISITED_MENU_ITEMS } from "../Constants";

export interface MenuItemProps {
  step: Step;
  status: Session["status"];
  level?: number;
  avatarContent?: string | number;
  onClick: (id: string) => unknown;
}

/**
 * @param level number (integers, 0,1,2,3,...)
 * @returns string
 */
export const getClassNameForLevel = (level: number): string => `lvl${level}`;

export const isStepVisibleInMenu = (step: Step): boolean => {
  if (SHOW_UNVISITED_MENU_ITEMS) {
    return true;
  }

  return step.visited || step.current;
};

const clssItem = MENU_CLASS_NAMES[">list"][">item"];

const MenuItem: React.FC<MenuItemProps> = React.memo((props: MenuItemProps) => {
  const { step, status, level = 0, avatarContent, onClick } = props;

  const clickOnItem = React.useCallback(() => {
    // do nothing if current step
    if (!step.current) {
      onClick(step.id);
    }
  }, [step, onClick]);

  const classNameForLevel = getClassNameForLevel(level);
  const AvatarJSX = React.useMemo(
    () => (
      <Avatar className={clsx(clssItem[">avatar"]._, classNameForLevel)}>
        <Typography className={clssItem[">avatar"][">T"]} variant="h4">
          {avatarContent || "-"}
        </Typography>
      </Avatar>
    ),
    [avatarContent, classNameForLevel],
  );

  const open = React.useMemo(() => containsCurrentStep(step), [step]);

  const itemClassName = clsx(clssItem._, classNameForLevel, open && clssItem["&.active"], step.complete && !step.skipped && clssItem["&.complete"], step.visited && clssItem["&.visited"]);
  const textClassName = clsx(clssItem[">text"], classNameForLevel);
  const collapseClassName = clsx(MENU_CLASS_NAMES[">list"][">collapse"], classNameForLevel);
  const listClassName = clsx(MENU_CLASS_NAMES[">list"]._, getClassNameForLevel(level + 1));

  const canNavigate = step.complete || step.visited || step.current;
  const disableNavigation = !canNavigate || step.skipped;

  if (!isStepVisibleInMenu(step)) {
    return null;
  }

  return (
    <>
      <ListItem onClick={clickOnItem} disabled={disableNavigation} button className={itemClassName}>
        {AvatarJSX}
        <ListItemText primary={step.title} className={textClassName} />
      </ListItem>
      {step.steps === undefined || step.steps.length === 0 ? null : (
        <Collapse in={open} timeout="auto" className={collapseClassName}>
          <List className={listClassName}>
            {step.steps.map((it: Step) => (
              <MenuItem key={it.id} step={it} status={status} level={level + 1} onClick={onClick} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
});
MenuItem.displayName = `${DISPLAY_NAME_PREFIX}/MenuItem`;
export default MenuItem;
