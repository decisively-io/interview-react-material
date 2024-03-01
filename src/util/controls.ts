import DateFns from "@date-io/date-fns";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";

import { Control, ControlsValue, DATE_FORMAT, IControlsValue, IEntity, IFile, IImage, ITypography, RenderableControl, Screen } from "@decisively-io/interview-sdk";

const DATE_FNS = new DateFns();

export const VALUE_ROWS_CONST = "valueRows";

export interface IEntityData {
  rowIds: string[];
  [VALUE_ROWS_CONST]: NonNullable<IEntity["value"]>;
}

// ===================================================================================

const __innerDeriveLabel = (label?: string, desiredLength?: number, required?: true) => {
  if (label === undefined) return undefined;

  const labelWithRequired = label + (required ? " *" : "");

  if (desiredLength === undefined || labelWithRequired.length <= desiredLength) {
    return labelWithRequired;
  }

  /**
   * so, we know that our labelWithRequired is too long\
   * and we need to cut it, but persist the required suffix \
   * star, if that is present\
   * e.g. 'some really long label with required *' -> 'some really long lab…*'\
   *      'some really long label' -> 'some really long lab…'\
   *
   * to do that we need to slice labelWithRequired either to \
   * be of length (labelLength - 1) (if we just neeed to account\
   * for ellipsis) or (labelLength - 2) (ellipsis + *)
   */
  const finalLength = desiredLength - (required ? 2 : 1);
  return `${labelWithRequired.slice(0, finalLength)}…${required ? "*" : ""}`;
};

export const deriveLabel = (c: RenderableControl): string | undefined => {
  switch (c.type) {
    case "boolean":
    case "currency":
    case "date":
    case "datetime":
    case "options":
    case "text":
    case "time":
    case "file":
      return __innerDeriveLabel(c.label, c.labelLength, c.required);
    case "entity":
    case "number_of_instances":
      return __innerDeriveLabel(c.label, c.labelLength);
    default:
      return undefined;
  }
};

// ===================================================================================

export const deriveDateFromTimeComponent = (t: string): Date => new Date(`1970-01-01T${t}`);

export const resolveNowInDate = (d?: string): string | undefined => (d === "now" ? format(new Date(), DATE_FORMAT) : d);

export const requiredErrStr = "Please fill out this field";

function getDefaultControlValue(c: Exclude<Control, IEntity | ITypography | IImage | IFile>): IControlsValue[keyof IControlsValue] {
  switch (c.type) {
    case "boolean":
      return c.value === undefined ? c.default : c.value;

    case "currency":
      return c.value === undefined ? c.default : c.value;

    case "date": {
      const valueRaw = c.value === undefined ? c.default : c.value;

      return valueRaw === "now" ? DATE_FNS.format(new Date(), "yyyy-MM-dd") : valueRaw;
    }

    case "time": {
      const valueRaw = c.value === undefined ? c.default : c.value;

      return valueRaw === "now" ? DATE_FNS.format(new Date(), "HH:mm:ss") : valueRaw;
    }

    case "datetime":
      return c.value === undefined ? c.default : c.value;

    case "options":
      return c.value === undefined ? c.default : c.value;

    case "number_of_instances":
      return (() => {
        if (c.value !== undefined && c.value !== null) return c.value.length;
        if (c.default !== undefined) return c.default.length;

        return c.min ?? 0;
      })();

    case "text": {
      const v = c.value === undefined ? c.default : c.value;

      // additional stringification is here, because we might get
      // number from server
      return v == null || v === undefined ? v : String(v);
    }

    default:
  }
}

export const deriveEntityChildId = (entity: string, indx: number, childIndx: number): string => `${entity}.${VALUE_ROWS_CONST}.${indx}.${childIndx}`;

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

export function deriveDefaultControlsValue(controls: Control[]): IControlsValue {
  return controls.reduce<IControlsValue>((result, control) => {
    switch (control.type) {
      case "boolean":
      case "currency":
      case "date":
      case "time":
      case "datetime":
      case "options":
      case "text":
        result[control.attribute] = getDefaultControlValue(control);
        break;
      case "number_of_instances":
        result[control.entity] = getDefaultControlValue(control);
        break;

      case "entity": {
        const { min, value, template, entityId } = control;

        const entities = [];
        const entityCount = Math.max(min || 0, value?.length || 0);
        for (let i = 0; i < entityCount; i++) {
          const existingEntity = value?.[i];
          const resolveEntityId = existingEntity?.["@id"] || entityId || uuid();
          entities.push({
            "@id": resolveEntityId,
            ...deriveDefaultControlsValue(template),
            ...existingEntity,
          });
        }

        result[control.entity] = entities;
        break;
      }

      case "conditional_container":
        Object.assign(result, deriveDefaultControlsValue(control.controls));
        break;

      default:
        break;
    }
    return result;
  }, {});
}

export const getEntityValueIndx = (path: string): number => {
  const [maybeBracketedIndx] = path.match(/\[\d+\]$/)!;

  return Number(maybeBracketedIndx!.slice(1, -1));
};

export function normalizeControlValue(c: Control, v: any): typeof v {
  if (c.type === "text") {
    const typedV = v as null | string | undefined;

    return typedV === null || typedV === undefined ? null : c.variation !== undefined && c.variation.type === "number" ? Number(typedV) : typedV;
  }

  if (c.type === "boolean") {
    return c.required ? Boolean(v) : typeof v === "boolean" ? v : null;
  }

  return v === undefined ? null : v;
}

export function normalizeControlsValue(controlsValue: ControlsValue, cs: Screen["controls"]): typeof controlsValue {
  return cs.reduce<ControlsValue>((a, c) => {
    if (c.type === "typography" || c.type === "file" || c.type === "image") {
      return a;
    }

    if (c.type === "conditional_container") {
      return Object.assign(a, normalizeControlsValue(controlsValue, c.controls));
    }

    if (c.type === "number_of_instances") {
      a[c.entity] = normalizeControlValue(c, controlsValue[c.entity]);
      return a;
    }

    if (c.type === "entity") {
      const controlValue = controlsValue[c.entity];
      if (!controlValue || !Array.isArray(controlValue)) {
        a[c.entity] = [];

        return a;
      }
      if (controlValue.some((it) => typeof it !== "object" || it === null)) return a;

      const entityValue = controlValue as ControlsValue[];

      const reduced = entityValue.reduce<typeof entityValue>((a, singleEntity) => {
        if (typeof singleEntity !== "object" || singleEntity === null) return a;

        const newValue = c.template.reduce<typeof singleEntity>((innerA, t) => {
          if (t.type === "typography" || t.type === "file" || t.type === "image") {
            return innerA;
          }

          if (t.type === "number_of_instances") {
            innerA[t.entity] = normalizeControlValue(t, singleEntity[t.entity]);
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

      a[c.entity] = reduced;

      return a;
    }

    if (c.attribute) {
      a[c.attribute] = normalizeControlValue(c, controlsValue[c.attribute]);
    }

    return a;
  }, {});
}
