import React from "react";

export type DataSidebarTreeLeaf = {
  type: "leaf";
  id: string;
  attributeName: string;
  value: (
    | string
    | number
    | boolean
    /**
     * for those nodes in data tree that have value neither string, \
     * nor number, nor boolean, and we don't really know how to \
     * properly display/work with it
     */
    | null
  );
};
/**
 * represents
 * - a global entity (which is the root of the tree)
 * - an entity instance with all the direct attributes and\
 * all the subentities that belong to a certain instance
 * - "an entity instance identifier" which is just a node\
 * that serves as a holder for another node with all the \
 * attributes of an instance
 */
export type DataSidebarTreeDir = {
  type: "dir";
  /** "global" literal is used in root node */
  id: string;
  /**
   * "global" literal for root, but most commonly this will be an entity\
   * name e.g. "people", "residencies", etc.
   */
  title: string;
  children: Array<DataSidebarTreeDir | DataSidebarTreeLeaf>;
};
export type DataSidebarTreeNode = DataSidebarTreeDir | DataSidebarTreeLeaf;


export type DataSidebarTreeCtxState = {
  tree: DataSidebarTreeDir;
  setTree: (cb: (prev: DataSidebarTreeCtxState["tree"]) => typeof prev) => unknown;
  value: {
    expanded: string[];
  };
  setValue: (cb: (prev: DataSidebarTreeCtxState["value"]) => typeof prev) => unknown;
};

export const defaultDataSidebarTreeCtxState: DataSidebarTreeCtxState = {
  tree: { type: "dir", id: "global", title: "global", children: [] },
  setTree: () => {
    console.error("@decisively-io/interview-react-material | ixVMZ7wCpV | - uninitialized setTree");
  },
  value: { expanded: [] },
  setValue: () => {
    console.error("@decisively-io/interview-react-material | kpR4AZErNW | - uninitialized setValue");
  },
};

export const DataSidebarTreeCtx = React.createContext(defaultDataSidebarTreeCtxState);
export const useDataSidebarTreeCtx = () => React.useContext(DataSidebarTreeCtx);
