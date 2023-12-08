import type {
  IControlsValue,
  Control,
  IFile,
  IImage,
  ITypography,
} from '@decisively-io/types-interview';
import { getUnsupportedControlErr } from '../../constants';


export function normalizeControlValue(c: Exclude< Control, IFile | IImage | ITypography >, v: any): typeof v {
  switch(c.type) {
    case 'text': {
      const typedV = v as null | string | undefined;

      return (typedV === null || typedV === undefined)
        ? null
        : (c.variation !== undefined && c.variation.type === 'number')
          ? Number(typedV)
          : typedV;
    }

    case 'boolean': {
      return c.required
        ? Boolean(v)
        : typeof v === 'boolean' ? v : null;
    }

    case 'entity': {
      const shouldFallBack = !Array.isArray(v) || v.some(it => typeof it !== 'object' || it === null);
      if(shouldFallBack) return [];

      const entityValue = v as IControlsValue[];

      const reduced = entityValue.reduce< typeof entityValue >((a, singleEntity) => {
        if(typeof singleEntity !== 'object' || singleEntity === null) return a;

        const newValue = c.template.reduce< typeof singleEntity >((innerA, t) => {
          if(t.type === 'typography' || t.type === 'file' || t.type === 'image') {
            return innerA;
          }

          if(t.type === 'entity' || t.type === 'number_of_instances') {
            return {
              ...innerA,
              [ t.entity ]: normalizeControlValue(t, singleEntity[ t.entity ]),
            };
          }

          return {
            ...innerA,
            [ t.attribute ]: normalizeControlValue(t, singleEntity[ t.attribute ]),
          };
        }, {});

        if(Object.keys(newValue).length === 0) return a;

        newValue[ '@id' ] = singleEntity[ '@id' ];

        return a.concat(newValue);
      }, []);

      return reduced;
    }

    case 'number_of_instances':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'options':
    case 'time':
      return v === undefined ? null : v;

    default: {
      const __unreachable: never = c;
      throw getUnsupportedControlErr('3UrFpolYxu', __unreachable);
    }
  }
}

export function normalizeControlsValue(controlsValue: IControlsValue, cs: Control[]): typeof controlsValue {
  // we wrap parameters in one level of entity so that
  // we can leverage recursion and eliminate code duplication
  // then we can safely unwrap result and remove additional
  // level
  const value = normalizeControlValue(
    { type: 'entity', entity: 'global', id: '', template: cs },
    [controlsValue],
  );

  const { '@id': _id, ...rest } = value[ 0 ];
  void _id;

  return rest;
}
