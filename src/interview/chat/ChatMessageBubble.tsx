import type { ChatMessage } from "@decisively-io/interview-sdk";
import { Box, Grow, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ChatProcessedTooltip from "./ChatProcessedTooltip";

export interface ChatMessageBubbleProps {
  id: string;
  message: ChatMessage;
  loading?: boolean;
}

const Bubble = styled(Box)`

  @keyframes loading {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.5;
    }
  }

  &[data-loading="true"] {
    animation: loading 1s infinite;
  }
`;

const ChatMessageBubble = (props: ChatMessageBubbleProps) => {
  const { id, loading, message } = props;

  let backgroundColor = message.self ? "primary.main" : "background.paper";
  if (message.failed) {
    backgroundColor = "#ddd";
  } else if (loading) {
    backgroundColor = "transparent";
  }
  const color = message.self || message.failed ? "primary.contrastText" : "text.primary";

  return (
    <Grow in>
      <Box
        maxWidth="100%"
        display="flex"
        flexDirection="column"
      >
        <Box
          id={id}
          maxWidth="100%"
          my={1}
          pl={message.self ? "20%" : 0}
          pr={message.self ? 0 : "20%"}
          display="flex"
          flexDirection={"column"}
          alignItems={message.self ? "flex-end" : "flex-start"}
          style={{ overflowWrap: "break-word" }}
        >
          {message.content ? (
            <Bubble
              maxWidth="100%"
              py={1}
              px={2}
              bgcolor={backgroundColor}
              color={color}
              borderRadius={4}
              data-loading={loading ? "true" : undefined}
              boxShadow={2}
            >
              <Typography
                variant="body1"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {message.content}
              </Typography>
            </Bubble>
          ) : null}
          {message.failed ? (
            <Typography
              variant="body1"
              color={"error"}
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "0.9em",
              }}
            >
              {message.self ? "Failed to send message" : "Something went wrong"}
            </Typography>
          ) : message.processed ? (
            <ChatProcessedTooltip processed={message.processed} />
          ) : null}
        </Box>
      </Box>
    </Grow>
  );
};

export default ChatMessageBubble;
