import { type Control, DATE_FORMAT, type IEntity, type IFile, type IImage, type ITypography, type RenderableControl, TIME_FORMAT_12, TIME_FORMAT_24 } from "@decisively-io/interview-sdk";
import { format } from "date-fns";
import { type Field, type FieldError, type FieldErrors, type FieldValues, type InternalFieldName, type Ref, type ResolverOptions, type ResolverResult, appendErrors, get, set } from "react-hook-form";
import type * as Yup from "yup";
import * as yup from "yup";
import { deriveDateFromTimeComponent, requiredErrStr, resolveNowInDate } from "./controls";

const setCustomValidity = (ref: Ref, fieldPath: string, errors: FieldErrors) => {
  if (ref && "reportValidity" in ref) {
    const error = get(errors, fieldPath) as FieldError | undefined;
    ref.setCustomValidity(error?.message || "");

    ref.reportValidity();
  }
};

// Native validation (web only)
export const validateFieldsNatively = <TFieldValues extends FieldValues>(errors: FieldErrors, options: ResolverOptions<TFieldValues>): void => {
  for (const fieldPath in options.fields) {
    const field = options.fields[fieldPath];
    if (field?.ref && "reportValidity" in field.ref) {
      setCustomValidity(field.ref, fieldPath, errors);
    } else if (field.refs) {
      for (const ref of field.refs) {
        setCustomValidity(ref, fieldPath, errors);
      }
    }
  }
};

export const toNestErrors = <TFieldValues extends FieldValues>(errors: FieldErrors, options: ResolverOptions<TFieldValues>): FieldErrors<TFieldValues> => {
  options.shouldUseNativeValidation && validateFieldsNatively(errors, options);

  const fieldErrors = {} as FieldErrors<TFieldValues>;
  for (const path in errors) {
    const field = get(options.fields, path) as Field["_f"] | undefined;
    const error = Object.assign(errors[path] || {}, {
      ref: field?.ref,
    });

    if (isNameInFieldArray(options.names || Object.keys(errors), path)) {
      const fieldArrayErrors = Object.assign({}, get(fieldErrors, path));

      set(fieldArrayErrors, "root", error);
      set(fieldErrors, path, fieldArrayErrors);
    } else {
      set(fieldErrors, path, error);
    }
  }

  return fieldErrors;
};

const isNameInFieldArray = (names: InternalFieldName[], name: InternalFieldName) => names.some((n) => n.startsWith(`${name}.`));

const generateValidatorsForControls = (controls: RenderableControl[], values: any): Record<string, yup.AnySchema> => {
  return controls.reduce((a, c) => {
    switch (c.type) {
      case "boolean":
      case "currency":
      case "time":
      case "datetime":
      case "text":
      case "date":
      case "options": {
        a[c.attribute] = generateValidatorForControl(c);
        return a;
      }
      case "switch_container": {
        const controls = c.branch === "true" ? c.outcome_true : c.outcome_false;
        if (controls) {
          return Object.assign(a, generateValidatorsForControls(controls, values));
        }
        return a;
      }

      case "number_of_instances": {
        a[c.entity] = generateValidatorForControl(c);
        return a;
      }
      case "entity": {
        const template: IEntity["template"] = c.template;

        a[c.entity] = yup.array(
          yup.object({
            "@id": yup.string(),

            ...template.reduce<Record<string, yup.AnySchema>>((a, it) => {
              if (it.type === "file" || it.type === "image" || it.type === "typography") {
                return a;
              }

              a[it.type === "number_of_instances" ? it.entity : (it as any).attribute] = generateValidatorForControl(it as any);

              return a;
            }, {} as any),
          }),
        );

        return a;
      }
      default:
        return a;
    }
  }, {} as any);
};

export type Resolver = <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>,
) => Promise<ResolverResult<TFieldValues>>;

/**
 * Why `path!` ? because it could be `undefined` in some case
 * https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
 */
const parseErrorSchema = (error: Yup.ValidationError, validateAllFieldCriteria: boolean) => {
  return (error.inner || []).reduce<Record<string, FieldError>>((previous, error) => {
    if (!previous[error.path!]) {
      previous[error.path!] = { message: error.message, type: error.type! };
    }

    if (validateAllFieldCriteria) {
      const types = previous[error.path!].types;
      const messages = types?.[error.type!];

      previous[error.path!] = appendErrors(
        error.path!,
        validateAllFieldCriteria,
        previous,
        error.type!,
        messages ? ([] as string[]).concat(messages as string[], error.message) : error.message,
      ) as FieldError;
    }

    return previous;
  }, {});
};

export const generateValidator =
  (controls: RenderableControl[]): Resolver =>
  async (values, context, options) => {
    try {
      const shape = generateValidatorsForControls(controls, values);
      const schema = yup.object().shape(shape).required();

      const result = await schema.validate(values, Object.assign({ abortEarly: false }, {}, { context }));

      return {
        values: result,
        errors: {},
      };
    } catch (e: any) {
      if (!e.inner) {
        throw e;
      }

      return {
        values: {},
        errors: toNestErrors(parseErrorSchema(e, false), options ?? {}),
      };
    }
  };

function generateValidatorForControl(c: Exclude<Control, IEntity | ITypography | IImage | IFile>): yup.AnySchema {
  switch (c.type) {
    case "boolean": {
      const { required } = c;

      const schema = yup.boolean().nullable();
      const maybeDefined: typeof schema = required === undefined ? schema : schema.defined("This must be checked or unchecked");
      // schema.test(
      //   'withDefined',
      //   '',
      //   v => typeof v === 'boolean',
      // )

      return maybeDefined;
    }
    case "currency": {
      const { max, min, required } = c;

      const schema = yup.number().typeError("Please specify a valid number. E.g. 5.50").nullable();
      const withRequired: typeof schema = required === undefined ? schema : schema.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null);

      const afterMax: typeof withRequired = max === undefined ? withRequired : withRequired.test("withMax", `Should be lower or equal to ${max}`, (v) => v !== undefined && v !== null && v <= max);

      const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test("withMin", `Should be bigger or equal to ${min}`, (v) => v !== undefined && v !== null && v >= min);

      return afterMin;
    }
    case "date": {
      const { max, min, required } = c;
      /** a.k.a YYYY-MM-DD */
      const DATE_FORMAT_REGEX = /^\d\d\d\d\-\d\d\-\d\d$/;

      const nowLessMax = resolveNowInDate(max);
      const nowLessMin = resolveNowInDate(min);

      const schema = yup.string().nullable();
      const finalSchema: typeof schema = [schema]
        .map((it) => (required === undefined ? it : it.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null && v !== "")))
        .map((it) =>
          it.test("correctFormat", "Should be formatted like YYYY-MM-DD", (v) =>
            v === undefined || v === null || v === "" ? true : Boolean(v.match(DATE_FORMAT_REGEX) && Number.isNaN(Number(new Date(v))) === false),
          ),
        )
        .map((it) => (nowLessMax === undefined ? it : it.test("withMax", `Should be before or equal to ${nowLessMax}`, (v) => v !== undefined && v !== null && v <= nowLessMax)))
        .map((it) => (nowLessMin === undefined ? it : it.test("withMin", `Should be after or equal to ${nowLessMin}`, (v) => v !== undefined && v !== null && v >= nowLessMin)))[0];

      return finalSchema;
    }
    case "time": {
      const { max, min, required, amPmFormat } = c;

      const maxForUi = max && format(deriveDateFromTimeComponent(max), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);
      const minForUi = min && format(deriveDateFromTimeComponent(min), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);

      const schema = yup.string().nullable();

      const withRequired: typeof schema = required === undefined ? schema : schema.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null);

      const afterMax: typeof withRequired =
        max === undefined ? withRequired : withRequired.test("withMax", `Should be before or equal to ${maxForUi}`, (v) => v !== undefined && v !== null && v <= max);

      const afterMin: typeof afterMax = min === undefined ? afterMax : afterMax.test("withMin", `Should be after or equal to ${minForUi}`, (v) => v !== undefined && v !== null && v >= min);

      return afterMin;
    }
    case "datetime": {
      const { required, time_max, time_min, date_max, date_min, amPmFormat } = c;

      const nowLessDateMax = resolveNowInDate(date_max);
      const nowLessDateMin = resolveNowInDate(date_min);

      const maxTimeForUi = time_max && format(deriveDateFromTimeComponent(time_max), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);
      const minTimeForUi = time_min && format(deriveDateFromTimeComponent(time_min), amPmFormat ? TIME_FORMAT_12 : TIME_FORMAT_24);

      const schema = yup.string().nullable();

      const withRequired: typeof schema = required === undefined ? schema : schema.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null);

      const withDateMax: typeof withRequired =
        nowLessDateMax === undefined
          ? withRequired
          : withRequired.test("withDateMax", `Date should be before or equal to ${nowLessDateMax}`, (v) => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) <= nowLessDateMax);

      const withDateMin: typeof withDateMax =
        nowLessDateMin === undefined
          ? withDateMax
          : withDateMax.test("withDateMin", `Date should be after or equal to ${nowLessDateMin}`, (v) => v !== undefined && v !== null && format(new Date(v), DATE_FORMAT) >= nowLessDateMin);

      const withTimeMax: typeof withDateMin =
        time_max === undefined
          ? withDateMin
          : withDateMin.test("withTimeMax", `Time should be before or equal to ${maxTimeForUi}`, (v) => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) <= time_max);

      const withTimeMin: typeof withTimeMax =
        time_min === undefined
          ? withTimeMax
          : withTimeMax.test("withTimeMin", `Time should be after or equal to ${minTimeForUi}`, (v) => v !== undefined && v !== null && format(new Date(v), TIME_FORMAT_24) >= time_min);

      return withTimeMin;
    }
    case "number_of_instances": {
      const { max, min } = c;

      const schema = yup.number().typeError("Please specify a valid positive integer. E.g. 5").nullable();

      const withRequired: typeof schema = schema.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null);

      const withMax: typeof withRequired = max === undefined ? withRequired : withRequired.max(max, `must be less than or equal to ${max}`);

      const withMin: typeof withMax = withMax.min(min ?? 0, `must be greater than or equal to ${min}`);

      return withMin;
    }
    case "text": {
      const { required, max, variation } = c;

      const schema = yup.string().nullable();
      const maybeRequired: typeof schema = required === undefined ? schema : schema.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null && v !== "");

      const nextSchema = ((): typeof maybeRequired => {
        if (variation !== undefined && variation.type === "number") {
          return maybeRequired.test("asNumber", "Please input valid number", (v) => {
            if (typeof v !== "string") return required === undefined;
            if (v === "" && required === undefined) return true;

            return Boolean(v.match(/^-?\d+(\.\d*)?$/));
          });
        }

        const maybeWithEmail = variation !== undefined && variation.type === "email" ? maybeRequired.email("Please provide valid email") : maybeRequired;

        return max === undefined ? maybeWithEmail : maybeWithEmail.max(max, `This must be at most ${max} characters`);
      })();

      return nextSchema;
    }
    case "options": {
      const { required } = c;

      const schema = yup.mixed().nullable();

      const maybeRequired: typeof schema = required === undefined ? schema : schema.test("withRequired", requiredErrStr, (v) => v !== undefined && v !== null && v !== "");

      const withType: typeof maybeRequired = maybeRequired.test(
        "isStringOrNumberOrNullOrUndefined",
        "This value should be either string or boolean",
        (v) => typeof v === "string" || typeof v === "boolean" || v === null || v === undefined,
      );

      return withType;
    }
    default:
      return yup.string();
  }
}
