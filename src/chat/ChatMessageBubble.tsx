import { Box, Grow, Typography } from "@material-ui/core";

export interface ChatMessage {
  content: string;
  self: boolean;
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
          justifyContent={message.self ? "flex-end" : "flex-start"}
          style={{ overflowWrap: "break-word" }}
        >
          <Box
            minWidth={0}
            display="flex"
            flexDirection="column"
          >
            <Box
              maxWidth="100%"
              py={1}
              px={2}
              bgcolor={message.self ? "primary.main" : "background.paper"}
              color={message.self ? "primary.contrastText" : "text.primary"}
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
          </Box>
        </Box>
      </Box>
    </Grow>
  );
};

export default ChatMessageBubble;
