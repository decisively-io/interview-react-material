import type { Session, Step } from "@decisively-io/interview-sdk";
import { containsCurrentStep } from "@decisively-io/interview-sdk";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React from "react";
import { CLASS_NAMES, DISPLAY_NAME_PREFIX, SHOW_UNVISITED_MENU_ITEMS } from "../Constants";
import { makeStyles } from "../themes/types";

const useStyles = makeStyles((theme) => ({
  nestedItem: {
    paddingLeft: "3rem !important",
  },
}));

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

const MenuItem: React.FC<MenuItemProps> = React.memo((props: MenuItemProps) => {
  const classes = useStyles();
  const { step, status, level = 0, avatarContent, onClick } = props;
  const isNestedSubstep = level > 0;

  const clickOnItem = React.useCallback(() => {
    // do nothing if current step
    if (!step.current) {
      onClick(step.id);
    }
  }, [step, onClick]);

  const classNameForLevel = getClassNameForLevel(level);
  const AvatarJSX = React.useMemo(
    () => (
      <Avatar className={clsx(CLASS_NAMES.MENU.LIST_ITEM_AVATAR, classNameForLevel)}>
        <Typography
          className={CLASS_NAMES.MENU.LIST_ITEM_AVATAR_TEXT}
          variant="h4"
        >
          {avatarContent || "-"}
        </Typography>
      </Avatar>
    ),
    [avatarContent, classNameForLevel],
  );

  const open = React.useMemo(() => containsCurrentStep(step), [step]);

  const itemClassName = clsx(
    CLASS_NAMES.MENU.LIST_ITEM,
    classNameForLevel,
    open && CLASS_NAMES.MENU.LIST_ITEM_ACTIVE,
    step.complete && !step.skipped && CLASS_NAMES.MENU.LIST_ITEM_COMPLETE,
    step.visited && CLASS_NAMES.MENU.LIST_ITEM_VISITED,
  );
  const textClassName = clsx(CLASS_NAMES.MENU.LIST_ITEM_TEXT, classNameForLevel);
  const collapseClassName = clsx(CLASS_NAMES.MENU.LIST_COLLAPSE, classNameForLevel);
  const listClassName = clsx(CLASS_NAMES.MENU.LIST, getClassNameForLevel(level + 1));

  const canNavigate = step.complete || step.visited || step.current;
  const disableNavigation = !canNavigate || step.skipped;

  if (!isStepVisibleInMenu(step)) {
    return null;
  }

  return (
    <>
      <ListItem
        onClick={clickOnItem}
        disabled={disableNavigation}
        button
        className={clsx(itemClassName, { [classes.nestedItem]: isNestedSubstep })}
      >
        {AvatarJSX}
        <ListItemText
          primary={step.title}
          className={textClassName}
        />
      </ListItem>
      {step.steps === undefined || step.steps.length === 0 ? null : (
        <Collapse
          in={open}
          timeout="auto"
          className={collapseClassName}
        >
          <List className={listClassName}>
            {step.steps.map((it: Step) => (
              <MenuItem
                key={it.id}
                step={it}
                status={status}
                level={level + 1}
                onClick={onClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
});
MenuItem.displayName = `${DISPLAY_NAME_PREFIX}/MenuItem`;
export default MenuItem;
