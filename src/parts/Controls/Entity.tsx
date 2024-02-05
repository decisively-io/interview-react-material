import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { Control, IEntity, deriveDefaultControlsValue, deriveLabel } from "../../util/controls";
import type { RenderControlProps } from "./__controlsTypes";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";

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

export interface EntityProps extends Pick<RenderControlProps, "controlComponents"> {
  c: IEntity;
  RenderControl: React.FC<RenderControlProps>;
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

export const _: React.FC<EntityProps> = React.memo(({ c, RenderControl, controlComponents, className }) => {
  const { entity, template } = c;
  const { control } = useFormContext();

  const parentPath = (c as any).attribute;

  const { fields, append, remove } = useFieldArray({
    control,
    name: parentPath || entity,
  });

  const appendHanler = React.useCallback(
    () =>
      append({
        "@id": uuid(),
        ...deriveDefaultControlsValue(template),
      }),
    [append, template],
  );

  return (
    <Wrap className={className}>
      <Typography className={classes[">h"]} variant="h5">
        {deriveLabel(c)}
      </Typography>

      <Grid className={fieldGrpsClss._} container direction="column">
        {fields.map((field, index) => (
          <Grid item container key={field.id} alignItems="flex-start" justifyContent="space-between" className={fieldGrpClss._}>
            <Grid className={fieldGrpClss[">fieldControls"]} item xs={10}>
              {template.map((value, controlIndex) => {
                if (value.type === "typography") {
                  return <RenderControl key={controlIndex} c={value} controlComponents={controlComponents} />;
                }

                if ("attribute" in value || value.type === "entity") {
                  const parent = c;
                  const key = (value as any).attribute || (value as any).entity;
                  const path = [parentPath ? `${parentPath}.${index}` : `${entity}.${index}`, key].filter((v) => v !== undefined).join(".");
                  const control = {
                    ...value,
                    attribute: path,
                    value: parent.value?.[index]?.[key],
                  } as Control;

                  const content = <RenderControl key={controlIndex} c={control} controlComponents={controlComponents} />;

                  if (value.type === "entity") {
                    return (
                      <Box key={controlIndex} padding={1}>
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

            <Grid className={fieldGrpClss[">fieldActions"]} item container justifyContent="center" xs={2}>
              <IconButton onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <IconButton onClick={appendHanler}>
        <AddIcon />
      </IconButton>
    </Wrap>
  );
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Entity`;
