import produce from 'immer';
import { v4 as uuid } from 'uuid';
import DateFns from '@date-io/date-fns';
import {
  IControlsValue,
  IFile,
  ITypography,
  IImage,
  Control,
} from '@decisively-io/types-interview';
import { getUnsupportedControlErr } from '../../constants';

const DATE_FNS = new DateFns();


type GetDefaultCtrlValArg = Exclude< Control, ITypography | IImage | IFile >;
type GetDefaultCtrlValRtrn = IControlsValue[ keyof IControlsValue ]
function getDefaultControlValue(c: GetDefaultCtrlValArg): GetDefaultCtrlValRtrn {
  switch(c.type) {
    case 'boolean':
      return c.value === undefined
        ? c.default
        : c.value;

    case 'currency':
      return c.value === undefined
        ? c.default
        : c.value;

    case 'date': {

      const valueRaw = c.value === undefined
        ? c.default
        : c.value;

      return valueRaw === 'now' ? DATE_FNS.format(new Date(), 'yyyy-MM-dd') : valueRaw;
    }

    case 'time': {
      const valueRaw = c.value === undefined
        ? c.default
        : c.value;

      return valueRaw === 'now' ? DATE_FNS.format(new Date(), 'HH:mm:ss') : valueRaw;
    }

    case 'datetime':
      return c.value === undefined
        ? c.default
        : c.value;

    case 'options':
      return c.value === undefined
        ? c.default
        : c.value;

    case 'number_of_instances':
      return (() => {
        if(c.value !== undefined && c.value !== null) return c.value.length;
        if(c.default !== undefined) return c.default.length;

        return c.min ?? 0;
      })();

    case 'text': {
      const v = c.value === undefined
        ? c.default
        : c.value;

      // additional stringification is here, because we might get
      // number from server
      return (v == null || v === undefined) ? v : String(v);
    }

    case 'entity': {
      const { min, value, template } = c;
      const values: typeof value = (() => {
        if(min === undefined) return value || [];

        const amountOfItemsToAppend = Math.max(min - ((value && value.length) || 0), 0);
        return ([] as NonNullable< typeof value >)
          .concat(value || [])
          .concat(new Array(amountOfItemsToAppend).fill(0).map(() => {
            const innerVals = template.reduce(
              (a, it) => {
                if(it.type === 'file' || it.type === 'image' || it.type === 'typography') {
                  return a;
                }

                if(it.type === 'entity' || it.type === 'number_of_instances') {
                  return {
                    ...a,
                    [ it.entity ]: getDefaultControlValue(it),
                  };
                }

                return {
                  ...a,
                  [ it.attribute ]: getDefaultControlValue(it),
                };
              },
              {},
            );

            return ({
              '@id': uuid(),
              ...innerVals,
            });
          }));
      })();

      return values;
    }

    default: {
      const __unreachable: never = c;
      throw getUnsupportedControlErr('MOkDfnd0LA', __unreachable);
    }
  }
}


export function deriveDefaultControlsValue(cs: Control[]): IControlsValue {
  return cs.reduce< IControlsValue >(
    (a, c) => produce(a, draft => {
      /* eslint-disable no-param-reassign */
      switch(c.type) {
        case 'file':
        case 'image':
        case 'typography':
          break;

        case 'boolean':
        case 'currency':
        case 'date':
        case 'time':
        case 'datetime':
        case 'options':
        case 'text':
          draft[ c.attribute ] = getDefaultControlValue(c);
          break;

        case 'number_of_instances':
        case 'entity':
          draft[ c.entity ] = getDefaultControlValue(c);
          break;

        default: {
          const __unreachable: never = c;
          throw getUnsupportedControlErr('R0JvVX28vO', __unreachable);
        }
      }
      /* eslint-enable no-param-reassign */
    }),
    {},
  );
}
