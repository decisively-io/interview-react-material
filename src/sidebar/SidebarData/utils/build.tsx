import { uuid } from '@decisively-io/interview-sdk';
import type { DataSidebarTreeNode } from '../DataTree_consts';


/**
 * this is how RenderableDataSidebar['data']['data'] is expected \
 * to look like: keys represent attribute names or entity names,\
 * values can either be primitive data types - string, number or\
 * boolean - or arrays, in which case we are dealing with entity \
 * values. Each element of entity value array is expected to be \
 * an object and each key can recursively be anything already \
 * described (except for a very special property "@id" which is \
 * an identifier of an entity instance in entity array - represented\
 * as natural numbers e.g. 1, 2, 3...).\
 * **IMPORTANT**: it is possible for a value to be smth different\
 * than described, but in that case we just treat it as a "don't \
 * know how to store/dispaly this" and we set its value to null in\
 * resulting data sidebar tree
 */
export type SidebarData = {
  [ key: string ]: (
    | boolean
    | number
    | string
    | SidebarData[]
  );
}

/** build Data sidebar tree (Arg) */
export type BuildArg = {
  data: SidebarData;
  /** if undefined - assume we are at the "global" node */
  entity?: string;
};
/** build Data sidebar tree (Rtrn) */
export type BuildRtrn = DataSidebarTreeNode;

/** build Data sidebar tree */
export const build = ({ data, entity = "global" }: BuildArg): BuildRtrn => ({
  type: 'dir',
  id: entity === 'global' ? 'global' : uuid(),
  title: entity,
  children: Object.entries(data).reduce< DataSidebarTreeNode[] >(
    (a, [key, value]) => {
      if(key === '@id') return a;

      const nextChild = ((): DataSidebarTreeNode => {
        const id = uuid();

        // for any of the primitive values - just create leaf node
        if(
          typeof value === 'boolean'
          || typeof value === 'number'
          || typeof value === 'string'
        ) {
          return {
            type: 'leaf',
            id,
            attributeName: key,
            value,
          };
        }

        if(Array.isArray(value)) {
          // just to make sure that the shape is right, we will check that each
          // array element is an object and it's not equal to null
          if(value.every(it => typeof it === 'object' && it !== null)) {
            return {
              type: 'dir',
              id,
              title: key,
              children: value.reduce< DataSidebarTreeNode[] >(
                (a, child) => {
                  const maybeId = child[ '@id' ];
                  if(!maybeId) return a;

                  const res = build({ data: child, entity: key });

                  // this should be impossbile
                  if(res.type === 'leaf') return a;

                  return a.concat({ ...res, title: String(maybeId) });
                },
                []
              ),
            };
          }

          // if not - we can safely fallback to the logic we use when value
          // does not match any expected shape
        }

        return {
          type: 'leaf',
          id,
          attributeName: key,
          value: null,
        };
      })();

      return a.concat(nextChild);
    },
    []
  ),
});
