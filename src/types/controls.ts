/* eslint-disable camelcase,import/no-extraneous-dependencies,react/forbid-prop-types */
import produce from 'immer';
import * as yup from 'yup';
import { format } from 'date-fns';

import {
  IControlsValue,
  ICurrency,
  IEntity,
  IFile,
  DATE_FORMAT,
  DATE_TIME_FORMAT_24,
  TIME_FORMAT_24,
  IDate,
  IOptions,
  ITypography,
  IImage,
  Control,
} from '@decisively-io/types-interview';


export * from '@decisively-io/types-interview/controls';


export const getCurrencySymbol = (c: ICurrency): string => (
  c.symbol || '$'
);

export const formatCurrency = (c: ICurrency, value: number): string => (
  new Intl.NumberFormat(c.locale || 'en-AU', { style: 'currency', currency: c.symbol || 'AUD' })
    .format(value)
);


function getDefaultControlValue(
  c: Exclude< Control, IEntity | ITypography | IImage | IFile >,
): IControlsValue[ keyof IControlsValue ] {
  switch(c.type) {
    case 'boolean':
      return c.default;

    case 'currency':
      return c.default && formatCurrency(c, c.default);

    case 'date':
      return c.default;

    case 'time':
      return c.default || '00:00:00';

    case 'datetime':
      return c.default || format(new Date(), DATE_TIME_FORMAT_24);

    case 'options':
      return c.default === undefined ? null : c.default;

    case 'number_of_instances':
      return c.default === undefined
        ? c.required === undefined
          ? 0
          : 1
        : c.default;

    case 'text':
      return c.default || '';

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

function generateValidatorForControl(
  c: Exclude< Control, IEntity | ITypography | IImage | IFile | IDate | IOptions >,
): yup.AnySchema {
  switch(c.type) {
    case 'boolean': {
      const { required } = c;

      const schema = yup.boolean();
      const maybeRequired: typeof schema = required ? schema.required() : schema;

      return maybeRequired;
    }
    case 'currency': {
      return yup.string();

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
    case 'time': {
      const { max, min, required } = c;

      const schema = yup.string();

      const withRequired: typeof schema = required ? schema : schema.required();

      const afterMax: typeof withRequired = max === undefined ? withRequired : withRequired.test(
        'withMax',
        `Should be before ${ max }`,
        v => v !== undefined && v < max,
      );

      const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test(
        'withMin',
        `Should be after ${ min }`,
        v => v !== undefined && v > min,
      );

      return afterMin;
    }
    case 'datetime': {
      const { required, time_max, time_min } = c;

      const schema = yup.string();

      const withRequired: typeof schema = required ? schema : schema.required();

      const afterMax: typeof withRequired = time_max === undefined ? withRequired : withRequired.test(
        'withMax',
        `Time should be before ${ time_max }`,
        v => v !== undefined && format(new Date(v), TIME_FORMAT_24) < time_max,
      );

      const afterMin: typeof afterMax = time_min === undefined ? afterMax : afterMax.test(
        'withMin',
        `Time should be after ${ time_min }`,
        v => v !== undefined && format(new Date(v), TIME_FORMAT_24) > time_min,
      );

      return afterMin;
    }
    case 'number_of_instances': {
      const { required, max, min } = c;

      const schema = yup.number();

      const withRequired: typeof schema = required ? schema.required() : schema;

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

      const schema = yup.string();
      const maybeRequired: typeof schema = required ? schema.required() : schema;

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

  return yup.object().shape(shape);
}
