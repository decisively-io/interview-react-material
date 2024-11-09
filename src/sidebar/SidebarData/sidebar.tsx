import type { RenderableDataSidebar } from "@decisively-io/interview-sdk/dist/core/sidebars/sidebar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styled from "styled-components";
import type { SidebarComponent } from "../SidebarPanel";
import { DataTree, type DataTreeProps } from "./DataTree";

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

  const [tree, setTreeRaw] = React.useState<DataTreeProps["tree"]>({
    type: "dir",
    id: "",
    title: "",
    children: [
      {
        type: "leaf",
        id: "1",
        attributeName: "the person's age",
        value: 19,
      },
      {
        type: "dir",
        id: "2",
        title: "residencies",
        children: [
          {
            type: "leaf",
            id: "21",
            attributeName: "the residency street address",
            value: "12 Main St.",
          },
          {
            type: "leaf",
            id: "22",
            attributeName: "the residency suburb",
            value: "Curtin",
          },
        ],
      },
    ],
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
