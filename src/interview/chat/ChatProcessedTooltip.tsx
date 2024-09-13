import type { ChatProcessed } from "@decisively-io/interview-sdk";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import type React from "react";
import styled from "styled-components";

export interface ChatProcessedTooltipProps {
  processed: ChatProcessed;
}

const List = styled("ul")`
  padding: 0;
  margin: 8px 4px;
  min-width: 200px;
  list-style: none;
`;

const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const ChatProcessedTooltip = (props: ChatProcessedTooltipProps) => {
  const { processed } = props;

  const children: React.ReactNode[] = [];
  let itemCount = 0;
  for (const [key, value] of Object.entries(processed.data)) {
    if (Array.isArray(value)) {
      itemCount += value.length;
      children.push(
        <li>
          Added {value.length} {toTitleCase(key)}
        </li>,
      );
    } else {
      const attribute = processed.attributes.find((attr) => attr.path === key || attr.path === `data.${key}`);
      children.push(
        <li>
          {attribute?.description ?? key} = <b>{JSON.stringify(value)}</b>
        </li>,
      );
      itemCount++;
    }
  }

  return (
    <Tooltip
      title={<List>{children}</List>}
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      }}
    >
      <Typography
        variant="caption"
        color="textSecondary"
      >
        Collected {itemCount} items
      </Typography>
    </Tooltip>
  );
};

export default ChatProcessedTooltip;
