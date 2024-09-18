import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import type { ChatInputProps } from "./ChatInput";

const ChatInputCompact = (props: ChatInputProps) => {
  const { placeholder = "", sendText, disabled, onAddMessage, loading, additionalAction } = props;
  const [value, setValue] = React.useState<string>("");

  // -- handlers (common) TODO move to common area or hook or something....

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
    }
  };

  // -- rendering

  const renderActionButtons = () => {
    const SendBtn = (
      <Fab
        color="primary"
        size="small"
        variant="round"
        onClick={setResponse}
        disabled={!value || loading || disabled}
        style={{
          flexShrink: 0,
        }}
      >
        <SendIcon />
      </Fab>
    );

    if (!additionalAction) {
      return SendBtn;
    }

    return (
      <>
        {SendBtn}
        <Fab
          color="secondary"
          size="small"
          variant="round"
          onClick={additionalAction.onClick}
          disabled={loading || disabled || (additionalAction.disabled ?? false)}
          style={{
            marginLeft: "0.5rem",
            flexShrink: 0,
          }}
        >
          {additionalAction.icon || additionalAction.label}
        </Fab>
      </>
    );
  };

  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus={true}
      disabled={disabled}
      multiline={true}
      inputProps={{ onKeyDown: handleKeyDown }}
      variant="outlined"
      maxRows={10}
      style={{
        flex: "1 1 auto",
        display: "flex",
        gridGap: "1rem",
        width: "100%",
        position: "relative",
      }}
      InputProps={{
        endAdornment: renderActionButtons(),
      }}
    />
  );
};

export default ChatInputCompact;
