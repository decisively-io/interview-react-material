import * as yup from 'yup';
import type {
  Control,
} from '@decisively-io/types-interview';
import { generateValidatorForControl2 } from 'types/generateValidatorForControl';


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
          return { ...a, [ c.attribute ]: generateValidatorForControl2(c) };
        case 'number_of_instances':
        case 'entity':
          return { ...a, [ c.entity ]: generateValidatorForControl2(c) };
        default: return a;
      }
    },
    {},
  );

  return yup.object().shape(shape).required();
}
