import { Box, Grow, Typography } from "@material-ui/core";

export interface ChatMessage {
  content: string;
  self: boolean;
  failed?: boolean;
}

export interface ChatMessageBubbleProps {
  id: string;
  message: ChatMessage;
}

const ChatMessageBubble = (props: ChatMessageBubbleProps) => {
  const { id, message } = props;

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
            <Box
              maxWidth="100%"
              py={1}
              px={2}
              bgcolor={message.failed ? "#ddd" : message.self ? "primary.main" : "background.paper"}
              color={message.self || message.failed ? "primary.contrastText" : "text.primary"}
              borderRadius={4}
              boxShadow={2}
            >
              <Typography
                variant="body1"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {message.content}
              </Typography>
            </Box>
          ) : null}
          {message.failed ? (
            <Typography
              variant="body1"
              color={"error"}
              style={{ whiteSpace: "pre-wrap", fontSize: "0.9em" }}
            >
              {message.self ? "Failed to send message" : "Something went wrong"}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Grow>
  );
};

export default ChatMessageBubble;
