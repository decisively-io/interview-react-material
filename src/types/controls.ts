/* eslint-disable camelcase,import/no-extraneous-dependencies,react/forbid-prop-types */
import produce from 'immer';
import * as yup from 'yup';
import { format } from 'date-fns';

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
} from '@decisively-io/types-interview';


export * from '@decisively-io/types-interview/dist/controls';


export const deriveLabel = (c: Control): string | undefined => {
  switch(c.type) {
    case 'boolean':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'options':
    case 'text':
    case 'time':
      return `${ c.label }${ c.required ? ' *' : '' }`;
    case 'entity':
    case 'number_of_instances':
      return c.label;
    default: return undefined;
  }
};


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

    case 'date':
      return c.value === undefined
        ? c.default
        : c.value;

    case 'time':
      return c.value === undefined
        ? c.default
        : c.value;

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
        if(c.value !== undefined) return c.value;
        if(c.default !== undefined) return c.default;

        return c.min;
      })();

    case 'text':
      return c.value === undefined
        ? c.default
        : c.value;

    default:
  }
}


export const deriveEntityChildId = (entity: string, indx: number, childAttr: string): string => (
  `${ entity }.${ indx }.${ childAttr }`
);

export const deriveEntityDefaultsForRow = (
  v: IControlsValue,
  entity: string,
  indx: number,
  template: IEntity[ 'template' ],
): typeof v => produce(v, draft => {
  template.forEach(c => {
    if(c.type === 'file' || c.type === 'image' || c.type === 'typography') {
      return;
    }

    const cId = c.type === 'number_of_instances'
      ? c.entity
      : c.attribute;

    const idForDraft = deriveEntityChildId(entity, indx, cId);
    // eslint-disable-next-line no-param-reassign
    draft[ idForDraft ] = getDefaultControlValue(c);
  });
});


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
          if(c.value) {
            c.value.forEach((row, i) => {
              deriveEntityDefaultsForRow(
                draft, c.entity, i, row,
              );
            });
          }

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
      const maybeRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        'This has to be checked',
        v => v === true,
      );

      return maybeRequired;
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

      const nowLessMax = resolveNowInDate(max);
      const nowLessMin = resolveNowInDate(min);


      const schema = yup.string().nullable();

      const withRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null,
      );

      const afterMax: typeof withRequired = nowLessMax === undefined ? withRequired : withRequired.test(
        'withMax',
        `Should be before or equal to ${ nowLessMax }`,
        v => v !== undefined && v !== null && v <= nowLessMax,
      );

      const afterMin: typeof afterMax = nowLessMin === undefined ? afterMax : afterMax.test(
        'withMin',
        `Should be after or equal to ${ nowLessMin }`,
        v => v !== undefined && v !== null && v >= nowLessMin,
      );

      return afterMin;
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
        min,
        `must be greater than or equal to ${ min }`,
      );

      return withMin;
    }
    case 'text': {
      const { required, max } = c;

      const schema = yup.string().nullable();
      const maybeRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        requiredErrStr,
        v => v !== undefined && v !== null && v !== '',
      );

      const withMax: typeof maybeRequired = max === undefined
        ? maybeRequired
        : maybeRequired.max(max, `This must be at most ${ max } characters`);

      return withMax;
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

        // case 'entity':
        //   return {
        //     ...a,
        //     ...c.template.reduce< Record< string, yup.AnySchema > >((a, it, i) => {
        //       switch(it.type) {
        //         case 'file':
        //         case 'image':
        //         case 'typography':
        //         case 'date':
        //         case 'options':
        //           return a;
        //         default:
        //           return {
        //             ...a,
        //             [ `${ [c.id] }.${ i }` ]: generateValidatorForControl(it),
        //           };
        //       }
        //     }, {}),
        //   };
        default: return a;
      }
    },
    {},
  );

  return yup.object().shape(shape).required();
}
