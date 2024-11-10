import type { RenderableDataSidebar } from "@decisively-io/interview-sdk/dist/core/sidebars/sidebar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styled from "styled-components";
import type { SidebarComponent } from "../SidebarPanel";
import { DataTree, type DataTreeProps } from "./DataTree";
import { dataSidebarUtilsNS } from "./utils_reexport";
import { defaultDataSidebarTreeCtxState } from "./DataTree_consts";


const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SidebarData: SidebarComponent<RenderableDataSidebar> = ({ sidebar }) => {
  const {
    data: { data, attributes },
    title,
    config,
    dynamicAttributes,
  } = sidebar;
  const maybeDesc = config ? config.description : undefined;

  const [tree, setTreeRaw] = React.useState<DataTreeProps["tree"]>(() => {
    const maybeTree = dataSidebarUtilsNS.build({data});

    return maybeTree.type === 'leaf' ? defaultDataSidebarTreeCtxState.tree : maybeTree;
  });
  const setTree = React.useCallback<DataTreeProps["setTree"]>((cb) => setTreeRaw((prev) => cb(prev)), [setTreeRaw]);

  return (
    <Wrap>
      <Typography
        variant="h6"
        style={{ fontWeight: 700 }}
      >
        {title}
      </Typography>

      {!maybeDesc ? null : <Typography>{maybeDesc}</Typography>}

      <DataTree {...{ tree, setTree }} />
    </Wrap>
  );
};
