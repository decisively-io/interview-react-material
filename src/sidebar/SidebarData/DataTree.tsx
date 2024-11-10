import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView, { type TreeViewProps } from "@material-ui/lab/TreeView";
import React from "react";
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import styled from "styled-components";
import {
  DataSidebarTreeCtx,
  type DataSidebarTreeCtxState,
  useDataSidebarTreeCtx,
} from "./DataTree_consts";
import * as utilsNS from './utils';


const DataTreeNodeLabelWrap = styled.label`
  display: flex;
  gap: 1rem;
  align-items: center;

  .isLeaf, .value {
    width: calc(50% - 0.5rem);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .MuiCheckbox-root {
    padding: 0.125rem;
  }

  .value {
    .MuiOutlinedInput-input {
      padding: 0.25rem;
    }
  }
`;

const DataTreeNodeLabel = React.memo<{ id: string }>(({ id }) => {
  const { tree, setTree } = useDataSidebarTreeCtx();

  const maybeNode = React.useMemo(() => utilsNS.findById({ id, node: tree }), [id, tree]);

  const onChangeStrOrNum = React.useCallback< NonNullable< TextFieldProps['onChange'] > >(e => {
    const { value } = e.currentTarget;
    if(maybeNode === null || maybeNode.type !== 'leaf') return;

    const { value: nodeValue } = maybeNode;

    if(typeof nodeValue === 'string') {
      // with "string value" tree node -> just set next value
      setTree(prev => utilsNS.setValue({ tree: prev, id, value }));

      return;
    }


  }, [maybeNode, setTree, id]);

  const onChangeBool = React.useCallback< NonNullable< CheckboxProps['onChange'] > >((e) => {
    const { currentTarget: { checked } } = e;
    if(maybeNode === null || maybeNode.type !== 'leaf') return;

    if(typeof maybeNode.value === 'boolean') {
      setTree(prev => utilsNS.setValue({ tree: prev, id, value: checked }));
    }
  }, [maybeNode, setTree, id]);

  /**
   * treeview has this internal logic that makes treeItems focused \
   * (using tabIndex) after those are clicked. And because for this\
   * treeView we need to have form controls (textFields and checkboxes\
   * ) inside - this conflicts with normal focusing logic. As I have\
   * no idea if it is possible to override this behavior in treeView\
   * (public API doesn't have anything related to that), instead the\
   * idea is to listen to focus event on a TextField and then recheck\
   * after relatively small period of time (like 100ms) to see if it is\
   * still focused. And if not - return focus automatically (we kinda \
   * expect user to not move focus during those 100ms)
   */
  const onTextFieldFocus = React.useCallback< NonNullable< TextFieldProps['onFocus'] > >(({ currentTarget }) => {
    setTimeout(() => {
      if(document.activeElement === currentTarget) return;

      currentTarget.focus();
    }, 100);
  }, []);


  if (maybeNode === null) return null;

  const title = maybeNode.type === "leaf" ? maybeNode.attributeName : maybeNode.title;

  return (
    <DataTreeNodeLabelWrap>
      <Typography className={maybeNode.type === "leaf" ? "isLeaf" : undefined}>{title}</Typography>

      {(() => {
        if(maybeNode.type !== "leaf" || maybeNode.value === null) return null;

        const { value } = maybeNode;
        if(typeof value === 'boolean') {
          return <Checkbox checked={value} onChange={onChangeBool} />;
        }

        return (
          <TextField
            variant="outlined"
            value={value}
            className="value"
            onChange={onChangeStrOrNum}
            onFocus={onTextFieldFocus}
          />
        );
      })()}
    </DataTreeNodeLabelWrap>
  );
});

const DataTreeNode = React.memo<{ id: string }>(({ id }) => {
  const { tree } = useDataSidebarTreeCtx();

  const maybeNode = React.useMemo(() => utilsNS.findById({ id, node: tree }), [id, tree]);
  if (maybeNode === null) return null;

  return (
    <TreeItem
      nodeId={id}
      label={<DataTreeNodeLabel id={id} />}
    >
      {maybeNode.type === "leaf"
        ? null
        : maybeNode.children.map((child) => (
            <DataTreeNode
              key={child.id}
              id={child.id}
            />
          ))}
    </TreeItem>
  );
});

const StyledTreeView = styled(TreeView)`
  overflow: auto;
  max-height: 400px;

  .MuiTreeItem-label {
    &:hover, &:focus {
      background-color: transparent;
    }
  }

  .MuiTreeItem-root:focus > .MuiTreeItem-content .MuiTreeItem-label {
    background-color: transparent;
  }
`;

const DataTreeCore = React.memo(() => {
  const {
    value: { expanded },
    tree,
    setValue,
  } = useDataSidebarTreeCtx();

  const handleToggle = React.useCallback<NonNullable<TreeViewProps["onNodeToggle"]>>(({ target }, nodeIds) => {
    if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) return;

    const clickedOnIcon =
      target.tagName === "path" ||
      target.classList.contains("MuiSvgIcon-root") ||
      target.classList.contains("MuiTreeItem-iconContainer");
    if (!clickedOnIcon) return;

    setValue((prev) => ({ ...prev, expanded: nodeIds }));
  }, [setValue]);

  return (
    <StyledTreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      selected={React.useMemo(() => [], [])}
      disableSelection
    >
      {tree.children.map((it) => (
        <DataTreeNode
          key={it.id}
          id={it.id}
        />
      ))}
    </StyledTreeView>
  );
});

export type DataTreeProps = {
  tree: DataSidebarTreeCtxState["tree"];
  setTree: DataSidebarTreeCtxState["setTree"];
};
export const DataTree: React.FC<DataTreeProps> = (p) => {
  const { setTree, tree } = p;

  const [ctxStateValue, setCtxStateValue] = React.useState<DataSidebarTreeCtxState["value"]>({
    expanded: [],
  });
  const ctxState = React.useMemo<DataSidebarTreeCtxState>(
    () => ({
      tree,
      setTree,
      value: ctxStateValue,
      setValue: setCtxStateValue,
    }),
    [tree, setTree, ctxStateValue, setCtxStateValue],
  );

  return (
    <DataSidebarTreeCtx.Provider value={ctxState}>
      <DataTreeCore />
    </DataSidebarTreeCtx.Provider>
  );
};
