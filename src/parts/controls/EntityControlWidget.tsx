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
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";

export const classes = {
  ">h": "heading_jQlatn",

  ">fieldGroups": {
    _: "fieldGroups_bpLNPY",

    ">fieldGroup": {
      _: "fieldGroup_0HTULO",

      ">fieldControls": "fieldControls_OkY7Py",
      ">fieldActions": "fieldActions_7nxMEV",
    },
  },

  ">add": "addIconBtn_CIglRA",
};

const fieldGrpsClss = classes[">fieldGroups"];
const fieldGrpClss = classes[">fieldGroups"][">fieldGroup"];

const Wrap = styled.div`
  >.${classes[">h"]} {
    margin-bottom: 1rem;
  }

  >.${classes[">fieldGroups"]._} {
    >.${fieldGrpClss._} {
      &:not(:last-child) {
        margin-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;
      }

      >.${fieldGrpClss[">fieldControls"]} {
        >* { margin-bottom: 1rem; }
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
  React.memo((props: EntityControlWidgetProps) => {
    const { control, chOnScreenData, controlComponents, className } = props;
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
            className={classes[">h"]}
            variant="h5"
          >
            {control.label}
          </Typography>
        ) : null}

        <Grid
          className={fieldGrpsClss._}
          container
          direction="column"
        >
          {instances?.map((field, index, arr) => {
            const shouldHideDelete = control.min !== undefined && arr.length === control.min;

            return (
              <Grid
                item
                container
                key={(field as any)["@id"] || field.id}
                alignItems="flex-start"
                justifyContent="space-between"
                className={fieldGrpClss._}
              >
                <Grid
                  className={fieldGrpClss[">fieldControls"]}
                  item
                  xs={10}
                >
                  {field.controls.map((value, controlIndex) => {
                    if (value.type === "typography") {
                      return (
                        <RenderControl
                          chOnScreenData={chOnScreenData}
                          key={controlIndex}
                          control={value}
                          controlComponents={controlComponents}
                        />
                      );
                    }

                    if ("attribute" in value || value.type === "entity") {
                      const parent = control;
                      const key = (value as any).attribute || (value as any).entity;
                      const path = [parentPath ? `${parentPath}.${index}` : `${entity}.${index}`, key]
                        .filter((v) => v !== undefined)
                        .join(".");
                      const childControl = {
                        ...value,
                        attribute: path,
                        value: parent.value?.[index]?.[key],
                      } as Control;

                      const content = (
                        <RenderControl
                          key={controlIndex}
                          chOnScreenData={chOnScreenData}
                          control={childControl}
                          controlComponents={controlComponents}
                        />
                      );

                      if (value.type === "entity") {
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

                    console.log("Unsupported template control", value);
                    return null;
                  })}
                </Grid>

                {shouldHideDelete ? null : (
                  <Grid
                    className={fieldGrpClss[">fieldActions"]}
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
          <IconButton onClick={handleAdd}>
            <AddIcon />
          </IconButton>
        )}
      </Wrap>
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/EntityControlWidget`,
    classes,
    /*** @deprecated use `EntityControlWidget` directly */
    _: null as any as React.ComponentType<EntityControlWidgetProps>,
  },
);
EntityControlWidget._ = EntityControlWidget;

/*** @deprecated use `EntityControlWidget` directly */
export const _ = EntityControlWidget;

export default EntityControlWidget;
