import React from 'react';
import styled from 'styled-components';
import TreeView, { TreeViewProps } from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextField from '@material-ui/core/TextField';
import {
  DataSidebarTreeCtxState,
  DataSidebarTreeCtx,
  useDataSidebarTreeCtx,
  findByIdInDataSidebarTree,
} from './DataTree_consts';


const DataTreeNodeLabelWrap = styled.div`
  display: flex;
  gap: 1rem;

  .isLeaf, .value {
    width: calc(50% - 0.5rem);
  }

  .value {
    .MuiOutlinedInput-input {
      padding: 0.25rem;
    }
  }
`;

const DataTreeNodeLabel = React.memo< { id: string } >(({ id }) => {
  const {
    tree,
  } = useDataSidebarTreeCtx();

  const maybeNode = React.useMemo(() => findByIdInDataSidebarTree({ id, node: tree }), [id, tree]);
  if(maybeNode === null) return null;

  const title = maybeNode.type === 'leaf' ? maybeNode.attributeName : maybeNode.title;

  return (
    <DataTreeNodeLabelWrap>
      <Typography className={maybeNode.type === 'leaf' ? 'isLeaf' : undefined}>
        { title }
      </Typography>

      {maybeNode.type !== 'leaf' ? null : (
        <TextField
          variant='outlined'
          value={maybeNode.value}
          disabled
          className='value'
        />
      )}
    </DataTreeNodeLabelWrap>
  )
});

const DataTreeNode = React.memo< { id: string } >(({ id }) => {
  const {
    tree,
  } = useDataSidebarTreeCtx();

  const maybeNode = React.useMemo(() => findByIdInDataSidebarTree({ id, node: tree }), [id, tree]);
  if(maybeNode === null) return null;

  return (
    <TreeItem nodeId={id} label={<DataTreeNodeLabel id={id}/>}>
      { maybeNode.type === 'leaf' ? null : (
        maybeNode.children.map(child => <DataTreeNode key={child.id} id={child.id} />)
      ) }
    </TreeItem>
  );;
});

const StyledTreeView = styled(TreeView)`
  overflow: auto;
  max-height: 400px;
`;

const DataTreeCore = React.memo(() => {
  const {
    value: { expanded },
    tree,
    setValue,
  } = useDataSidebarTreeCtx();

  const handleToggle = React.useCallback< NonNullable< TreeViewProps[ 'onNodeToggle'] >>(
    ({ target }, nodeIds) => {
      if(!(target instanceof HTMLElement) && !(target instanceof SVGElement)) return;

      const clickedOnIcon = target.tagName === 'path'
        || target.classList.contains('MuiSvgIcon-root')
        || target.classList.contains('MuiTreeItem-iconContainer');
      if(!clickedOnIcon) return;

      setValue(prev => ({ ...prev, expanded: nodeIds }));
    },
    []
  );

  return (
    <StyledTreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      selected={React.useMemo(() => [], [])}
    >
      { tree.children.map(it => <DataTreeNode key={ it.id } id={it.id} />) }
    </StyledTreeView>
  );
});

export type DataTreeProps = {
  tree: DataSidebarTreeCtxState['tree'];
  setTree: DataSidebarTreeCtxState['setTree'];
}
export const DataTree: React.FC< DataTreeProps > = p => {
  const { setTree, tree } = p;

  const [ctxStateValue, setCtxStateValue] = React.useState< DataSidebarTreeCtxState['value'] >({
    expanded: [],
  })
  const ctxState = React.useMemo< DataSidebarTreeCtxState >(() => ({
    tree,
    setTree,
    value: ctxStateValue,
    setValue: setCtxStateValue
  }), [tree, setTree, ctxStateValue, setCtxStateValue]);

  return (
    <DataSidebarTreeCtx.Provider value={ctxState}>
      <DataTreeCore />
    </DataSidebarTreeCtx.Provider>
  );
}
