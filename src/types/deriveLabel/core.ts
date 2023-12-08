/* eslint-disable camelcase,import/no-extraneous-dependencies,react/forbid-prop-types */
import type { Control } from '@decisively-io/types-interview';


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
