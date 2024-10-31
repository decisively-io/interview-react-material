import React from "react";


export type DataSidebarTreeLeaf = {
  type: 'leaf';
  id: string;
  attributeName: string;
  value: string | number | null;
}
export type DataSidebarTreeDir = {
  type: 'dir';
  /** empty string is used in root node */
  id: string;
  /**
   * empty string for root, but most commonly this will be entity name\
   * e.g. "people", "residencies", etc.
   */
  title: string;
  children: Array< DataSidebarTreeDir | DataSidebarTreeLeaf >;
}
export type DataSidebarTreeNode = DataSidebarTreeDir | DataSidebarTreeLeaf;


//# region DataSidebarTreeUtils

export type FindByIdInDataSidebarTreeArg = {
  node: DataSidebarTreeNode;
  id: string;
}
export type FindByIdInDataSidebarTreeRtrn = DataSidebarTreeNode | null;
export const findByIdInDataSidebarTree = ({ id, node }: FindByIdInDataSidebarTreeArg): FindByIdInDataSidebarTreeRtrn => {
  if(node.id === id) return node;
  if(node.type === 'leaf') return null;

  return node.children.reduce< FindByIdInDataSidebarTreeRtrn >(
    (a, child) => a === null ? findByIdInDataSidebarTree({ id, node: child }) : a,
    null
  );
}

//# endregion

export type DataSidebarTreeCtxState = {
  tree: DataSidebarTreeDir;
  setTree: (cb: (prev: DataSidebarTreeCtxState['tree']) => typeof prev) => unknown;
  value: {
    expanded: string[];
  };
  setValue: (cb: (prev: DataSidebarTreeCtxState['value']) => typeof prev) => unknown;
}


export const defaultDataSidebarTreeCtxState: DataSidebarTreeCtxState = {
  tree: { type: 'dir', id: '', title: '', children: [] },
  setTree: () => {
    console.error('@decisively-io/interview-react-material | ixVMZ7wCpV | - uninitialized setTree')
  },
  value: {expanded: []},
  setValue: () => {
    console.error('@decisively-io/interview-react-material | kpR4AZErNW | - uninitialized setValue')
  },
};


export const DataSidebarTreeCtx = React.createContext(defaultDataSidebarTreeCtxState);
export const useDataSidebarTreeCtx = () => React.useContext(DataSidebarTreeCtx);
