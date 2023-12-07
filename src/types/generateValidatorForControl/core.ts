/* eslint-disable camelcase,import/no-extraneous-dependencies,react/forbid-prop-types */
import * as yup from 'yup';
import { format } from 'date-fns';
import {
  IFile,
  TIME_FORMAT_24,
  ITypography,
  IImage,
  Control,
  TIME_FORMAT_12,
  DATE_FORMAT,
} from '@decisively-io/types-interview';


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


export const errMsgs = {
  _required: requiredErrStr,
  currency: {
    type: 'Please specify a valid number. E.g. 5.50',
  },
  date: {
    format: 'Should be formatted like YYYY-MM-DD',
  },
  time: {
    format: 'Should be formatted like HH:mm:ss',
  },
  dateTime: {
    format: 'Should be formatted like YYYY-MM-DD HH:mm:ss',
  },
  numberOfInstances: {
    type: 'Please specify a valid positive integer. E.g. 5',
  },
  options: {
    type: 'This value should be either string or boolean',
  },
};


// eslint-disable-next-line complexity
export function generateValidatorForControl2(
  c: Exclude< Control, ITypography | IImage | IFile >,
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

      const schema = yup.number().typeError(errMsgs.currency).nullable();

      const finalSchema: typeof schema = (
        [schema]
          .map(it => (required === undefined ? it : it.test(
            'withRequired',
            requiredErrStr,
            v => v !== undefined && v !== null,
          )))
          .map(it => (max === undefined ? it : it.test(
            'withMax',
            `Should be lower or equal to ${ max }`,
            v => v !== undefined && v !== null && v <= max,
          )))
          .map(it => (min === undefined ? it : it.test(
            'withMin',
            `Should be bigger or equal to ${ min }`,
            v => v !== undefined && v !== null && v >= min,
          )))
      )[ 0 ];

      return finalSchema;
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
            errMsgs.date.format,
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

      /** a.k.a HH:mm:ss */
      const TIME_FORMAT_REGEX = /^\d\d\:\d\d\:\d\d$/;

      const maxForUi = max &&
        format(deriveDateFromTimeComponent(max), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);
      const minForUi = min &&
        format(deriveDateFromTimeComponent(min), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);


      const schema = yup.string().nullable();
      const finalSchema: typeof schema = (
        [schema]
          .map(it => (required === undefined ? it : it.test(
            'withRequired',
            requiredErrStr,
            v => v !== undefined && v !== null,
          )))
          .map(it => it.test(
            'correctFormat',
            errMsgs.time.format,
            v => (v === undefined || v === null || v === '' ? true : (
              Boolean(
                v.match(TIME_FORMAT_REGEX) &&
                Number.isNaN(Number(deriveDateFromTimeComponent(v))) === false,
              )
            )),
          ))
          .map(it => (max === undefined ? it : it.test(
            'withMax',
            `Should be before or equal to ${ maxForUi }`,
            v => v !== undefined && v !== null && v <= max,
          )))
          .map(it => (
            min === undefined ? it : it.test(
              'withMin',
              `Should be after or equal to ${ minForUi }`,
              v => v !== undefined && v !== null && v >= min,
            )))
      )[ 0 ];


      return finalSchema;
    }
    case 'datetime': {
      const { required, time_max, time_min, date_max, date_min, amPmFormat } = c;

      const DATE_TIME_REGEX = /\d\d\d\d\-\d\d\-\d\d \d\d\:\d\d\:\d\d/;

      const nowLessDateMax = resolveNowInDate(date_max);
      const nowLessDateMin = resolveNowInDate(date_min);

      const maxTimeForUi = time_max &&
        format(deriveDateFromTimeComponent(time_max), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);
      const minTimeForUi = time_min &&
        format(deriveDateFromTimeComponent(time_min), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);

      const schema = yup.string().nullable();

      const finalSchema: typeof schema = (
        [schema]
          .map(it => (required === undefined ? it : it.test(
            'withRequired',
            requiredErrStr,
            v => v !== undefined && v !== null,
          )))
          .map(it => it.test(
            'correctFormat',
            errMsgs.dateTime.format,
            v => (v === undefined || v === null || v === '' || (
              Boolean(
                v.match(DATE_TIME_REGEX) &&
                Number.isNaN(Number(new Date(v))) === false,
              )
            )),
          ))
          .map(it => (nowLessDateMax === undefined ? it : it.test(
            'withDateMax',
            `Date should be before or equal to ${ nowLessDateMax }`,
            v => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) <= nowLessDateMax,
          )))
          .map(it => (nowLessDateMin === undefined ? it : it.test(
            'withDateMin',
            `Date should be after or equal to ${ nowLessDateMin }`,
            v => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) >= nowLessDateMin,
          )))
          .map(it => (time_max === undefined ? it : it.test(
            'withTimeMax',
            `Time should be before or equal to ${ maxTimeForUi }`,
            v => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) <= time_max,
          )))
          .map(it => (time_min === undefined ? it : it.test(
            'withTimeMin',
            `Time should be after or equal to ${ minTimeForUi }`,
            v => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) >= time_min,
          )))
      )[ 0 ];


      return finalSchema;
    }
    case 'number_of_instances': {
      const { max, min } = c;

      const schema = yup.number()
        .typeError(errMsgs.numberOfInstances.type)
        .test(
          'withRequired',
          requiredErrStr,
          v => v !== undefined && v !== null,
        )
        .min(
          min ?? 0,
          `must be greater than or equal to ${ min }`,
        );

      const finalSchema: typeof schema = (
        [schema]
          .map(it => (max === undefined ? it : (
            it.max(max, `must be less than or equal to ${ max }`)
          )))
      )[ 0 ];

      return finalSchema;
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
      const finalSchema: typeof schema = (
        [schema]
          .map(it => (required === undefined ? it : it.test(
            'withRequired',
            requiredErrStr,
            v => v !== undefined && v !== null && v !== '',
          )))
          .map(it => (it.test(
            'isStringOrNumberOrNullOrUndefined',
            errMsgs.options.type,
            v => typeof v === 'string' || typeof v === 'boolean' || v === null || v === undefined,
          )))
      )[ 0 ];

      return finalSchema;
    }
    case 'entity': {
      const { template, max, min } = c;

      const childValidators = template.reduce< Record< string, yup.AnySchema > >(
        (a, child) => {
          if(child.type === 'file' || child.type === 'image' || child.type === 'typography') {
            return a;
          }

          const validator = generateValidatorForControl2(child);
          const prop = (child.type === 'number_of_instances' || child.type === 'entity')
            ? child.entity
            : child.attribute;

          return {
            ...a,
            [ prop ]: validator,
          };
        },
        {},
      );

      const schema: yup.ArraySchema< yup.AnySchema > = yup.array(
        yup.object({
          '@id': yup.string().required(),
          ...childValidators,
        }),
      );
      const finalSchema: typeof schema = (
        [schema]
          .map(it => (max === undefined ? it : (
            it.max(
              max,
              `Must have at most ${ max } elements`,
            )
          )))
          .map(it => (min === undefined ? it : (
            it.min(
              min,
              `Must have at least ${ min } elements`,
            )
          )))
      )[ 0 ];

      return finalSchema;
    }
    default: {
      const __unreachable: never = c;
      throw new Error(__unreachable);
    }
  }
}
