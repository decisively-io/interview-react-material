import rfdc from 'rfdc';
import type { DataSidebarTreeDir, DataSidebarTreeLeaf } from '../DataTree_consts';
import { findById } from './findById';

const rfdcInstance = rfdc();

/** set primitive value in data sidebar tree (arg) */
export type SetValueArg = {
  tree: DataSidebarTreeDir;
  id: string;
  value: NonNullable< DataSidebarTreeLeaf[ 'value' ] >;
};

/** set primitive value in data sidebar tree (rtrn) */
export type SetValueRtrn = DataSidebarTreeDir;

/** set primitive value in data sidebar tree */
export const setValue = (arg: SetValueArg): SetValueRtrn => {
  const { id, value: nextValue } = arg;

  const nextTree = ((): SetValueRtrn | null => {
    const clone = rfdcInstance(arg.tree);
    const maybeMatched = findById({ node: clone, id });

    if (
      maybeMatched === null
      || maybeMatched.type !== 'leaf'
      || typeof maybeMatched.value !== typeof nextValue
    ) return null;

    maybeMatched.value = nextValue;
    return clone;
  })();

  return nextTree || arg.tree;
}
