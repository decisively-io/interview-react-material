/* eslint-disable camelcase,import/no-extraneous-dependencies,react/forbid-prop-types */
import produce from 'immer';
import * as yup from 'yup';
import { format } from 'date-fns';

import {
  IControlsValue,
  ICurrency,
  IEntity,
  IFile,
  TIME_FORMAT_24,
  IOptions,
  ITypography,
  IImage,
  Control,
  TIME_FORMAT_12,
  DATE_FORMAT,
  IDateTime,
} from '@decisively-io/types-interview';


export * from '@decisively-io/types-interview/controls';


export const formatCurrency = (c: ICurrency, value: number): string => (
  new Intl.NumberFormat(c.locale || 'en-AU', { style: 'currency', currency: c.symbol || 'AUD' })
    .format(value)
);

export const deriveDateFromTimeComponent = (t: string): Date => (
  new Date(`1970-01-01T${ t }`)
);

export const resolveNowInDate = (d?: string): string | undefined => (
  d === 'now' ? format(new Date(), DATE_FORMAT) : d
);


function getDefaultControlValue(
  c: Exclude< Control, IEntity | ITypography | IImage | IFile >,
): IControlsValue[ keyof IControlsValue ] {
  switch(c.type) {
    case 'boolean':
      return c.value === undefined
        ? c.default
        : c.value;

    case 'currency':
      const maybeValueToFormat = c.value === undefined
        ? c.default
        : c.value;

      return maybeValueToFormat && formatCurrency(c, maybeValueToFormat);

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
      return c.default === undefined
        ? c.required === undefined
          ? 0
          : 1
        : c.default;

    case 'text':
      return c.value === undefined
        ? c.default
        : c.value;

    default:
  }
}

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
        case 'number_of_instances':
        case 'text':
          draft[ c.id ] = getDefaultControlValue(c);
          break;

        case 'entity':
          c.template.forEach((it, i) => {
            if(it.type === 'file' || it.type === 'typography' || it.type === 'image') {
              return;
            }

            draft[ `${ c.id }.${ i }` ] = getDefaultControlValue(it);
          });
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
  c: Exclude< Control, IEntity | ITypography | IImage | IFile | IOptions >,
): yup.AnySchema {
  switch(c.type) {
    case 'boolean': {
      const { required } = c;

      const schema = yup.boolean().nullable();
      const maybeRequired: typeof schema = required ? schema.required() : schema;

      return maybeRequired;
    }
    case 'currency': {
      return yup.string().nullable();

      // const { max, min, required } = c;
      // const C = getCurrencySymbol(c);
      // const regexp = new RegExp(`^-?\\d+(\\.\\d*)?\\${ C }$`);

      // const schema = yup.string()
      //   .test(
      //     'isCurrency',
      //     `Invalid currency format. E.g. 1.23${ C }`,
      //     v => v !== undefined && v.match(regexp) !== null,
      //   );

      // const withRequired: typeof schema = required ? schema : schema.required();

      // const afterMax: typeof withRequired = max === undefined ? withRequired : withRequired.test(
      //   'withMax',
      //   `Should be lower than ${ max }${ C }`,
      //   v => v !== undefined && parseInt(v, 10) < max,
      // );

      // const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test(
      //   'withMin',
      //   `Should be bigger than ${ min }${ C }`,
      //   v => v !== undefined && parseInt(v, 10) > min,
      // );

      // return afterMin;
    }
    case 'date': {
      const { max, min, required } = c;

      const nowLessMax = resolveNowInDate(max);
      const nowLessMin = resolveNowInDate(min);


      const schema = yup.string().nullable();

      const withRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        'Please fill out this field',
        v => v !== undefined && v !== null,
      );

      const afterMax: typeof withRequired = nowLessMax === undefined ? withRequired : withRequired.test(
        'withMax',
        `Should be before ${ nowLessMax }`,
        v => v !== undefined && v !== null && v < nowLessMax,
      );

      const afterMin: typeof afterMax = nowLessMin === undefined ? afterMax : afterMax.test(
        'withMin',
        `Should be after ${ nowLessMin }`,
        v => v !== undefined && v !== null && v > nowLessMin,
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
        'Please fill out this field',
        v => v !== undefined && v !== null,
      );

      const afterMax: typeof withRequired = max === undefined ? withRequired : withRequired.test(
        'withMax',
        `Should be before ${ maxForUi }`,
        v => v !== undefined && v !== null && v < max,
      );

      const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test(
        'withMin',
        `Should be after ${ minForUi }`,
        v => v !== undefined && v !== null && v > min,
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
        'Please fill out this field',
        v => v !== undefined && v !== null,
      );

      const withDateMax: typeof withRequired = nowLessDateMax === undefined ? withRequired : withRequired.test(
        'withDateMax',
        `Date should be before ${ nowLessDateMax }`,
        v => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) < nowLessDateMax,
      );

      const withDateMin: typeof withDateMax = nowLessDateMin === undefined ? withDateMax : withDateMax.test(
        'withDateMin',
        `Date should be after ${ nowLessDateMin }`,
        v => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) > nowLessDateMin,
      );

      const withTimeMax: typeof withDateMin = time_max === undefined ? withDateMin : withDateMin.test(
        'withTimeMax',
        `Time should be before ${ maxTimeForUi }`,
        v => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) < time_max,
      );

      const withTimeMin: typeof withTimeMax = time_min === undefined ? withTimeMax : withTimeMax.test(
        'withTimeMin',
        `Time should be after ${ minTimeForUi }`,
        v => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) > time_min,
      );

      return withTimeMin;
    }
    case 'number_of_instances': {
      const { required, max, min } = c;

      const schema = yup.number();

      const withRequired: typeof schema = required === undefined ? schema : schema.required();

      const withMax: typeof withRequired = max === undefined
        ? withRequired
        : withRequired.max(max, `must be less than or equal to ${ max }`);

      const normalizedMin = min === undefined
        ? required ? 1 : 0
        : min;

      const withMin: typeof withMax = withMax.min(
        normalizedMin,
        `must be greater than or equal to ${ normalizedMin }`,
      );

      return withMin;
    }
    case 'text': {
      const { required, max } = c;

      const schema = yup.string().nullable();
      const maybeRequired: typeof schema = required === undefined ? schema : schema.test(
        'withRequired',
        'Please fill out this field',
        v => v !== undefined && v !== null && v !== '',
      );

      const withMax: typeof maybeRequired = max === undefined
        ? maybeRequired
        : maybeRequired.max(max, `This must be at most ${ max } characters`);

      return withMax;
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
        case 'number_of_instances':
        case 'text':
        case 'date':
          return { ...a, [ c.id ]: generateValidatorForControl(c) };

        case 'entity':
          return {
            ...a,
            ...c.template.reduce< Record< string, yup.AnySchema > >((a, it, i) => {
              switch(it.type) {
                case 'file':
                case 'image':
                case 'typography':
                case 'date':
                case 'options':
                  return a;
                default:
                  return {
                    ...a,
                    [ `${ [c.id] }.${ i }` ]: generateValidatorForControl(it),
                  };
              }
            }, {}),
          };
        default: return a;
      }
    },
    {},
  );

  return yup.object().shape(shape).required();
}
