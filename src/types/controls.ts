/* eslint-disable camelcase,import/no-extraneous-dependencies,react/forbid-prop-types */
import produce from 'immer';
import * as yup from 'yup';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import DateFns from '@date-io/date-fns';

import {
  IControlsValue,
  IEntity,
  IFile,
  TIME_FORMAT_24,
  ITypography,
  IImage,
  Control,
  TIME_FORMAT_12,
  DATE_FORMAT,
  Screen,
  NonNestedControl,
} from '@decisively-io/types-interview';


const DATE_FNS = new DateFns();

export * from '@decisively-io/types-interview/dist/controls';


export const VALUE_ROWS_CONST = 'valueRows';


export interface IEntityData {
  rowIds: string[];
  [ VALUE_ROWS_CONST ]: NonNullable< IEntity[ 'value' ] >;
}


// ===================================================================================


const __innerDeriveLabel = (label?: string, desiredLength?: number, required?: true) => {
  if(label === undefined) return undefined;

  const labelWithRequired = label + (required ? ' *' : '');

  if(desiredLength === undefined || labelWithRequired.length <= desiredLength) {
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
  return `${ labelWithRequired.slice(0, finalLength) }…${ required ? '*' : '' }`;
};

export const deriveLabel = (c: Control): string | undefined => {
  switch(c.type) {
    case 'boolean':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'options':
    case 'text':
    case 'time':
    case 'file':
      return __innerDeriveLabel(c.label, c.labelLength, c.required);
    case 'entity':
    case 'number_of_instances':
      return __innerDeriveLabel(c.label, c.labelLength);
    default: return undefined;
  }
};

// ===================================================================================


export const deriveDateFromTimeComponent = (t: string): Date => (
  new Date(`1970-01-01T${ t }`)
);

export const resolveNowInDate = (d?: string): string | undefined => (
  d === 'now' ? format(new Date(), DATE_FORMAT) : d
);

export const requiredErrStr = 'Please fill out this field';


function getDefaultControlValue(
  c: Exclude< Control, IEntity | ITypography | IImage | IFile >,
): IControlsValue[ keyof IControlsValue ] {
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

    default:
  }
}


export const deriveEntityChildId = (entity: string, indx: number, childIndx: number): string => (
  `${ entity }.${ VALUE_ROWS_CONST }.${ indx }.${ childIndx }`
);

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


export function deriveDefaultControlsValue(cs: Control[]): IControlsValue {
  return cs.reduce< IControlsValue >(
    (a, c) => produce(a, draft => {
      /* eslint-disable no-param-reassign */
      switch(c.type) {
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
          draft[ c.entity ] = getDefaultControlValue(c);
          break;

        case 'entity':
          const { min, value, template } = c;
          const values: typeof value = (() => {
            if(min === undefined) return value || [];

            const amountOfItemsToAppend = Math.max(min - ((value && value.length) || 0), 0);
            return ([] as NonNullable< typeof value >)
              .concat(value || [])
              .concat(new Array(amountOfItemsToAppend).fill(0).map(() => ({
                '@id': uuid(),
                ...deriveDefaultControlsValue(template),
              })));
          })();

          draft[ c.entity ] = values;
          break;

        default:
      }
      /* eslint-enable no-param-reassign */
    }),
    {},
  );
}

// eslint-disable-next-line complexity
function generateValidatorForControl(
  c: Exclude< Control, IEntity | ITypography | IImage | IFile >,
): yup.AnySchema {
  switch(c.type) {
    case 'boolean': {
      const { required } = c;

      const schema = yup.boolean().nullable();
      const maybeDefined: typeof schema = required === undefined ? schema : (
        schema.defined('This must be checked or unchecked')
        // schema.test(
        //   'withDefined',
        //   '',
        //   v => typeof v === 'boolean',
        // )
      );

      return maybeDefined;
    }
    case 'currency': {
      const { max, min, required } = c;

      const schema = yup.number().typeError('Please specify a valid number. E.g. 5.50').nullable();
      const withRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null,
      );

      const afterMax: typeof withRequired = max === undefined ? withRequired : withRequired.test(
        'withMax',
        `Should be lower or equal to ${ max }`,
        v => v !== undefined && v !== null && v <= max,
      );

      const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test(
        'withMin',
        `Should be bigger or equal to ${ min }`,
        v => v !== undefined && v !== null && v >= min,
      );

      return afterMin;
    }
    case 'date': {
      const { max, min, required } = c;
      /** a.k.a YYYY-MM-DD */
      const DATE_FORMAT_REGEX = /^\d\d\d\d\-\d\d\-\d\d$/;

      const nowLessMax = resolveNowInDate(max);
      const nowLessMin = resolveNowInDate(min);


      const schema = yup.string().nullable();
      const finalSchema: typeof schema = (
        [schema]
          .map(it => (required === undefined ? it : it.test(
            'withRequired',
            requiredErrStr,
            v => v !== undefined && v !== null && v !== '',
          )))
          .map(it => it.test(
            'correctFormat',
            'Should be formatted like YYYY-MM-DD',
            v => (v === undefined || v === null || v === '' ? true : (
              Boolean(
                v.match(DATE_FORMAT_REGEX) &&
                Number.isNaN(Number(new Date(v))) === false,
              )
            )),
          ))
          .map(it => (nowLessMax === undefined ? it : it.test(
            'withMax',
            `Should be before or equal to ${ nowLessMax }`,
            v => v !== undefined && v !== null && v <= nowLessMax,
          )))
          .map(it => (nowLessMin === undefined ? it : it.test(
            'withMin',
            `Should be after or equal to ${ nowLessMin }`,
            v => v !== undefined && v !== null && v >= nowLessMin,
          )))
      )[ 0 ];

      return finalSchema;
    }
    case 'time': {
      const { max, min, required, amPmFormat } = c;

      const maxForUi = max &&
        format(deriveDateFromTimeComponent(max), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);
      const minForUi = min &&
        format(deriveDateFromTimeComponent(min), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);


      const schema = yup.string().nullable();

      const withRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null,
      );

      const afterMax: typeof withRequired = max === undefined ? withRequired : withRequired.test(
        'withMax',
        `Should be before or equal to ${ maxForUi }`,
        v => v !== undefined && v !== null && v <= max,
      );

      const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test(
        'withMin',
        `Should be after or equal to ${ minForUi }`,
        v => v !== undefined && v !== null && v >= min,
      );

      return afterMin;
    }
    case 'datetime': {
      const { required, time_max, time_min, date_max, date_min, amPmFormat } = c;

      const nowLessDateMax = resolveNowInDate(date_max);
      const nowLessDateMin = resolveNowInDate(date_min);

      const maxTimeForUi = time_max &&
        format(deriveDateFromTimeComponent(time_max), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);
      const minTimeForUi = time_min &&
        format(deriveDateFromTimeComponent(time_min), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);

      const schema = yup.string().nullable();

      const withRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null,
      );

      const withDateMax: typeof withRequired = nowLessDateMax === undefined ? withRequired : withRequired.test(
        'withDateMax',
        `Date should be before or equal to ${ nowLessDateMax }`,
        v => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) <= nowLessDateMax,
      );

      const withDateMin: typeof withDateMax = nowLessDateMin === undefined ? withDateMax : withDateMax.test(
        'withDateMin',
        `Date should be after or equal to ${ nowLessDateMin }`,
        v => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) >= nowLessDateMin,
      );

      const withTimeMax: typeof withDateMin = time_max === undefined ? withDateMin : withDateMin.test(
        'withTimeMax',
        `Time should be before or equal to ${ maxTimeForUi }`,
        v => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) <= time_max,
      );

      const withTimeMin: typeof withTimeMax = time_min === undefined ? withTimeMax : withTimeMax.test(
        'withTimeMin',
        `Time should be after or equal to ${ minTimeForUi }`,
        v => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) >= time_min,
      );

      return withTimeMin;
    }
    case 'number_of_instances': {
      const { max, min } = c;

      const schema = yup.number()
        .typeError('Please specify a valid positive integer. E.g. 5')
        .nullable();

      const withRequired: typeof schema = schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null,
      );

      const withMax: typeof withRequired = max === undefined
        ? withRequired
        : withRequired.max(max, `must be less than or equal to ${ max }`);


      const withMin: typeof withMax = withMax.min(
        min ?? 0,
        `must be greater than or equal to ${ min }`,
      );

      return withMin;
    }
    case 'text': {
      const { required, max, variation } = c;

      const schema = yup.string().nullable();
      const maybeRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null && v !== '',
      );

      const nextSchema = ((): typeof maybeRequired => {
        if(variation !== undefined && variation.type === 'number') {
          return maybeRequired.test(
            'asNumber',
            'Please input valid number',
            v => {
              if(typeof v !== 'string') return required === undefined;
              if(v === '' && required === undefined) return true;

              return Boolean(v.match(/^-?\d+(\.\d*)?$/));
            },
          );
        }

        const maybeWithEmail = variation !== undefined && variation.type === 'email'
          ? maybeRequired.email('Please provide valid email')
          : maybeRequired;

        return max === undefined
          ? maybeWithEmail
          : maybeWithEmail.max(max, `This must be at most ${ max } characters`);
      })();

      return nextSchema;
    }
    case 'options': {
      const { required } = c;

      const schema = yup.mixed().nullable();

      const maybeRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null && v !== '',
      );

      const withType: typeof maybeRequired = maybeRequired.test(
        'isStringOrNumberOrNullOrUndefined',
        'This value should be either string or boolean',
        v => typeof v === 'string' || typeof v === 'boolean' || v === null || v === undefined,
      );

      return withType;
    }
    default: return yup.string();
  }
}

export const getEntityValueIndx = (path: string): number => {
  const [maybeBracketedIndx] = path.match(/\[\d+\]$/)!;

  return Number(maybeBracketedIndx!.slice(1, -1));
};


function maybeGetErrMessage(path: string, template: IEntity[ 'template' ], value: any): string | false {
  const i = getEntityValueIndx(path);
  const c = template[ i ];
  if(c.type === 'file' || c.type === 'typography' || c.type === 'image') {
    return false;
  }

  const validator = generateValidatorForControl(c);

  try {
    validator.validateSync(value);
  } catch(e) {
    if(e instanceof Error) {
      return e.message;
    }
  }

  return false;
}

export function generateValidator(cs: Control[]): yup.AnyObjectSchema {
  const shape = cs.reduce(
    // eslint-disable-next-line complexity
    (a, c) => {
      switch(c.type) {
        case 'boolean':
        case 'currency':
        case 'time':
        case 'datetime':
        case 'text':
        case 'date':
        case 'options':
          return { ...a, [ c.attribute ]: generateValidatorForControl(c) };
        case 'number_of_instances':
          return { ...a, [ c.entity ]: generateValidatorForControl(c) };

        case 'entity':
          const template: IEntity[ 'template' ] = c.template;

          return {
            ...a,
            [ c.entity ]: yup.array(
              yup.object({
                '@id': yup.string(),

                ...template.reduce< Record< string, yup.AnySchema > >(
                  (a, it) => {
                    if(it.type === 'file' || it.type === 'image' || it.type === 'typography') {
                      return a;
                    }

                    return {
                      ...a,
                      [ it.type === 'number_of_instances' ? it.entity : it.attribute ]: generateValidatorForControl(it),
                    };
                  },
                  {},
                ),
              }),
            ),
          };
        default: return a;
      }
    },
    {},
  );

  return yup.object().shape(shape).required();
}

export function normalizeControlValue(c: NonNestedControl, v: any): typeof v {
  if(c.type === 'text') {
    const typedV = v as null | string | undefined;

    return (typedV === null || typedV === undefined)
      ? null
      : (c.variation !== undefined && c.variation.type === 'number')
        ? Number(typedV)
        : typedV;
  }

  if(c.type === 'boolean') {
    return c.required
      ? Boolean(v)
      : typeof v === 'boolean' ? v : null;
  }

  return v === undefined ? null : v;
}

export function normalizeControlsValue(controlsValue: IControlsValue, cs: Screen['controls']): typeof controlsValue {
  return produce({}, draft => cs.reduce< IControlsValue >(
    (a, c) => {
      if(c.type === 'typography' || c.type === 'file' || c.type === 'image') {
        return a;
      }

      if(c.type === 'number_of_instances') {
        // eslint-disable-next-line no-param-reassign
        a[ c.entity ] = normalizeControlValue(c, controlsValue[ c.entity ]);
        return a;
      }

      if(c.type === 'entity') {
        const controlValue = controlsValue[ c.entity ];
        if(!controlValue || !Array.isArray(controlValue)) return a;
        if(controlValue.some(it => typeof it !== 'object' || it === null)) return a;

        const entityValue = controlValue as IControlsValue[];

        const reduced = entityValue.reduce< typeof entityValue >((a, singleEntity) => {
          if(typeof singleEntity !== 'object' || singleEntity === null) return a;

          const newValue = c.template.reduce< typeof singleEntity >((innerA, t) => {
            if(t.type === 'typography' || t.type === 'file' || t.type === 'image') {
              return innerA;
            }

            if(t.type === 'number_of_instances') {
              // eslint-disable-next-line no-param-reassign
              innerA[ t.entity ] = normalizeControlValue(t, singleEntity[ t.entity ]);
              return innerA;
            }

            // eslint-disable-next-line no-param-reassign
            innerA[ t.attribute ] = normalizeControlValue(t, singleEntity[ t.attribute ]);
            return innerA;
          }, {});

          if(Object.keys(newValue).length === 0) return a;

          newValue[ '@id' ] = singleEntity[ '@id' ];

          return a.concat(newValue);
        }, []);

        // eslint-disable-next-line no-param-reassign
        if(reduced.length) a[ c.entity ] = reduced;

        return a;
      }

      // eslint-disable-next-line no-param-reassign
      a[ c.attribute ] = normalizeControlValue(c, controlsValue[ c.attribute ]);
      return a;
    },
    draft,
  ));
}
