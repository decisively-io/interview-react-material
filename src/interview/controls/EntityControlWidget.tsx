import {
  type Control,
  type RenderableEntityControl,
  deriveDefaultControlsValue,
  flatten,
  uuid,
} from "@decisively-io/interview-sdk";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { CLASS_NAMES } from "../../Constants";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

const Wrap = styled.div`
  > .${CLASS_NAMES.ENTITY_CONTROL.HEADING} {
    margin-bottom: 1rem;
  }

  > .${CLASS_NAMES.ENTITY_CONTROL.FIELD_GROUPS} {
    > .${CLASS_NAMES.ENTITY_CONTROL.FIELD_GROUP} {
      &:not(:last-child) {
        margin-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;
      }

      > .${CLASS_NAMES.ENTITY_CONTROL.FIELD_CONTROLS} {
        > * {
          margin-bottom: 1rem;
        }
      }
    }
  }
`;

export interface EntityControlWidgetProps extends ControlWidgetProps<RenderableEntityControl> {
  controlComponents: ControlComponents;
  className?: string;
}

// const DebugState = () => {
//   const { watch } = useFormContext();
//   React.useEffect(() => {
//     console.log('watching state changes');
//     const subscription = watch((value, { name, type }) => console.log(value, name, type));
//     return () => subscription.unsubscribe();
//   }, [watch]);
//   return null;
// };

const EntityControlWidget = Object.assign(
  (props: EntityControlWidgetProps) => {
    const { control, chOnScreenData, controlComponents, interviewProvider, className } = props;
    const { entity, instances, template } = control;
    const { control: formControl } = useFormContext();

    const parentPath = (control as any).attribute;
    const name = parentPath ?? entity;

    const { fields, append, remove } = useFieldArray({
      control: formControl,
      name: name,
    });

    const canAddMore = control.max === undefined || control.max > fields.length;

    const handleAdd = React.useCallback(() => {
      if (canAddMore === false) return;

      append({
        "@id": uuid(),
        ...deriveDefaultControlsValue(template),
      });
      const newValue = formControl._formValues[name];
      chOnScreenData?.(flatten({ [name]: newValue }));
    }, [append, template, canAddMore]);

    const handleDelete = (index: number) => {
      const oldValue = formControl._formValues[name];
      remove(index);
      const newValue = formControl._formValues[name];
      const flatKeys = Object.keys(flatten({ [name]: oldValue }));

      const update = {
        ...flatKeys.reduce((update, key) => {
          update[key] = undefined;
          return update;
        }, {} as any),
        ...flatten({
          [name]: newValue,
        }),
      };
      console.log(update, oldValue, newValue, flatKeys);
      // remove instance from data
      chOnScreenData?.(update);
    };

    return (
      <Wrap className={className}>
        {control.label ? (
          <Typography
            className={CLASS_NAMES.ENTITY_CONTROL.HEADING}
            variant="h5"
          >
            {control.label}
          </Typography>
        ) : null}

        <Grid
          className={CLASS_NAMES.ENTITY_CONTROL.FIELD_GROUPS}
          container
          direction="column"
        >
          {instances?.map((instance, index, arr) => {
            const shouldHideDelete = control.min !== undefined && arr.length === control.min;

            return (
              <Grid
                item
                container
                key={(instance as any)["@id"] ?? instance.id}
                alignItems="flex-start"
                justifyContent="space-between"
                className={CLASS_NAMES.ENTITY_CONTROL.FIELD_GROUP}
              >
                <Grid
                  className={CLASS_NAMES.ENTITY_CONTROL.FIELD_CONTROLS}
                  item
                  xs={10}
                >
                  {instance.controls.map((subControl, controlIndex) => {
                    if (subControl.type === "typography") {
                      return (
                        <RenderControl
                          chOnScreenData={chOnScreenData}
                          key={controlIndex}
                          control={subControl}
                          controlComponents={controlComponents}
                          interviewProvider={interviewProvider}
                        />
                      );
                    }

                    if ("attribute" in subControl || subControl.type === "entity") {
                      const key = (subControl as any).attribute || (subControl as any).entity;
                      const path = key.includes("/")
                        ? key
                        : [parentPath ? `${parentPath}.${index}` : `${entity}.${index}`, key]
                            .filter((v) => v !== undefined)
                            .join(".");
                      const childControl = {
                        ...subControl,
                        attribute: path,
                      } as Control;

                      const content = (
                        <RenderControl
                          key={controlIndex}
                          chOnScreenData={chOnScreenData}
                          control={childControl}
                          controlComponents={controlComponents}
                          interviewProvider={interviewProvider}
                        />
                      );

                      if (subControl.type === "entity") {
                        return (
                          <Box
                            key={controlIndex}
                            padding={1}
                          >
                            {content}
                          </Box>
                        );
                      }
                      return content;
                    }

                    console.log("Unsupported template control", subControl);
                    return null;
                  })}
                </Grid>

                {shouldHideDelete ? null : (
                  <Grid
                    className={CLASS_NAMES.ENTITY_CONTROL.FIELD_ACTIONS}
                    item
                    container
                    justifyContent="center"
                    xs={2}
                  >
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            );
          })}
        </Grid>

        {canAddMore === false ? null : (
          <IconButton
            onClick={handleAdd}
            className={CLASS_NAMES.ENTITY_CONTROL.ADD_BUTTON}
          >
            <AddIcon />
          </IconButton>
        )}
      </Wrap>
    );
  },
  {
    displayName: `${DISPLAY_NAME_PREFIX}/EntityControlWidget`,
  },
);

export default EntityControlWidget;
