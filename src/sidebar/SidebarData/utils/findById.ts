import type { DataSidebarTreeNode } from '../DataTree_consts';


/** "find by id" in Data sidebar tree (Arg) */
export type FindByIdArg = {
  node: DataSidebarTreeNode;
  id: string;
};
/** "find by id" in Data sidebar tree (Rtrn) */
export type FindByIdRtrn = DataSidebarTreeNode | null;
/** "find by id" in Data sidebar tree */
export const findById = ({ id, node }: FindByIdArg): FindByIdRtrn => {
  if (node.id === id) return node;
  if (node.type === "leaf") return null;

  return node.children.reduce<FindByIdRtrn>(
    (a, child) => (a === null ? findById({ id, node: child }) : a),
    null,
  );
};
