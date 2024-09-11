import { Box, Button, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import type React from "react";
import { useState } from "react";
import type { ChatMessage } from "./ChatMessageBubble";

//import { LoadingDotsJSX } from "@icons";

export interface ChatInputProps {
  placeholder?: string;
  sendText?: string;
  onAddMessage: (newMessage: ChatMessage) => void;
  loading?: boolean;
  disabled?: boolean;
}

const ChatInput = (props: ChatInputProps) => {
  const { placeholder, sendText, disabled, onAddMessage, loading } = {
    placeholder: "",
    sendText: "Send",
    ...props,
  };

  const [value, setValue] = useState("");

  const setResponse = () => {
    if (loading) return;
    onAddMessage({
      content: value,
      self: true,
    });
    setValue("");
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      if (value) {
        e.preventDefault();
        setResponse();
      }
      //chatController.sendMessage()
    }
  };
  return (
    <Box
      sx={{
        flex: "1 1 auto",
        display: "flex",
        gridGap: "1rem",
        // @ts-ignore
        "& > *": {
          flex: "1 1 auto",
          minWidth: 0,
        },
        "& > * + *": {
          ml: 1,
        },
        "& :last-child": {
          flex: "0 1 auto",
        },
      }}
    >
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        disabled={disabled}
        multiline
        inputProps={{ onKeyDown: handleKeyDown }}
        variant="outlined"
        maxRows={10}
      />
      <Button
        type="button"
        onClick={setResponse}
        disabled={!value || loading || disabled}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        {loading ? <div>Loading...</div> : sendText}
      </Button>
    </Box>
  );
};
export default ChatInput;
