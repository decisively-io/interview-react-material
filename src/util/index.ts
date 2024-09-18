import {
  type Control,
  type ControlsValue,
  DATE_FORMAT,
  type EntityControl,
  type GenerativeChatControl,
  type Screen,
  formatDate,
} from "@decisively-io/interview-sdk";

export const VALUE_ROWS_CONST = "valueRows";

export interface IEntityData {
  rowIds: string[];
  [VALUE_ROWS_CONST]: NonNullable<EntityControl["value"]>;
}

// ===================================================================================

export const MAX_INLINE_LABEL_LENGTH = 64;

// ===================================================================================

export const deriveDateFromTimeComponent = (t: string): Date => new Date(`1970-01-01T${t}`);

export const resolveNowInDate = (d?: string): string | undefined =>
  d === "now" ? formatDate(new Date(), DATE_FORMAT) : d;

export const requiredErrStr = "Please fill out this field";

export const deriveEntityChildId = (entity: string, indx: number, childIndx: number): string =>
  `${entity}.${VALUE_ROWS_CONST}.${indx}.${childIndx}`;

// export const deriveEntityDefaultsForRow = (template: IEntity[ 'template' ]): IEntityData[ 'valueRows' ][ 0 ] => (
//   template.map(
//     c => {
//       if(c.type === 'file' || c.type === 'image' || c.type === 'typography') {
//         return undefined;
//       }

//       return getDefaultControlValue(c);
//     },
//   )
// );

export const getEntityValueIndx = (path: string): number => {
  const match = path.match(/\[\d+\]$/);
  if (!match) return -1;
  const [maybeBracketedIndx] = match;

  return Number(maybeBracketedIndx?.slice(1, -1));
};

export function normalizeControlValue(c: Control, v: any): typeof v {
  if (c.type === "text") {
    const typedV = v as null | string | undefined;

    return typedV === null || typedV === undefined
      ? null
      : c.variation !== undefined && c.variation.type === "number"
        ? Number(typedV)
        : typedV;
  }

  if (c.type === "boolean") {
    return c.required ? Boolean(v) : typeof v === "boolean" ? v : null;
  }

  return v === undefined ? null : v;
}

export function normalizeControlsValue(
  controlsValue: ControlsValue,
  controls: Screen["controls"],
): typeof controlsValue {
  return controls.reduce<ControlsValue>((a, control) => {
    if (control.type === "typography" || control.type === "image") {
      return a;
    }

    if (control.type === "generative_chat") {
      return Object.assign(a, controlsValue[control.id]);
    }

    if (control.type === "switch_container") {
      const controls = control.branch === "true" ? control.outcome_true : control.outcome_false;
      if (controls) {
        return Object.assign(a, normalizeControlsValue(controlsValue, controls));
      }
      return a;
    }

    if (control.type === "certainty_container") {
      const controls = control.branch === "certain" ? control.certain : control.uncertain;
      if (controls) {
        return Object.assign(a, normalizeControlsValue(controlsValue, controls));
      }
      return a;
    }

    if (control.type === "number_of_instances") {
      a[control.entity] = normalizeControlValue(control, controlsValue[control.entity]);
      return a;
    }

    if (control.type === "repeating_container") {
      const controls = control.controls;
      if (controls) {
        return Object.assign(a, normalizeControlsValue(controlsValue, controls));
      }
      return a;
    }

    if (control.type === "entity") {
      const controlValue = controlsValue[control.entity];
      if (!controlValue || !Array.isArray(controlValue)) {
        a[control.entity] = [];

        return a;
      }
      if (controlValue.some((it) => typeof it !== "object" || it === null)) return a;

      const entityValue = controlValue as ControlsValue[];

      const reduced = entityValue.reduce<typeof entityValue>((a, singleEntity) => {
        if (typeof singleEntity !== "object" || singleEntity === null) return a;

        const newValue = control.template.reduce<typeof singleEntity>((innerA, t) => {
          if (t.type === "typography" || t.type === "file" || t.type === "image") {
            return innerA;
          }

          if (t.type === "number_of_instances") {
            innerA[t.entity] = normalizeControlValue(t, singleEntity[t.entity]);
            return innerA;
          }

          if (t.type === "switch_container") {
            const controls = (t.branch === "false" ? t.outcome_false : t.outcome_true) || [];
            for (const child of controls) {
              if (child.attribute === undefined) continue;

              innerA[child.attribute] = normalizeControlValue(child, singleEntity[child.attribute]);
            }

            return innerA;
          }

          if (t.attribute) {
            innerA[t.attribute] = normalizeControlValue(t, singleEntity[t.attribute]);
          }
          return innerA;
        }, {});

        if (Object.keys(newValue).length === 0) return a;

        newValue["@id"] = singleEntity["@id"];

        return a.concat(newValue);
      }, []);

      a[control.entity] = reduced;

      return a;
    }

    if (control.attribute) {
      a[control.attribute] = normalizeControlValue(control, controlsValue[control.attribute]);
    }

    return a;
  }, {});
}
