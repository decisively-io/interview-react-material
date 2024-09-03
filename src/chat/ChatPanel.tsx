import { Box } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import ChatMessageBubble, { type ChatMessage } from "./ChatMessageBubble";

export interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  serverLoading?: boolean;
}

const CHAT_PANEL_CLASSES = {
  messages: "messages_41hued",
  input: "input_e0zqxum",
} as const;

const ChatPanelWrap = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.palette?.background?.default};
  display: flex;
  flex-direction: column;
  & > * {
    max-width: 100%;
  }
  & > * + * {
    margin-top: 1rem;
  }


  .${CHAT_PANEL_CLASSES.messages} {
    flex: 1 1 0%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    & > * {
      max-width: 100%;
    }
  }

  .${CHAT_PANEL_CLASSES.input} {
    flex: 0 1 auto;
    display: flex;
    align-content: flex-end;

    & > * {
      min-width: 0;
    }
  }

`;

const ChatPanel = (props: ChatPanelProps) => {
  const { messages, setMessages, serverLoading } = props;

  const onAddMessage = (msg: ChatMessage) => {
    messages.push(msg);
    setMessages([...messages]);
  };

  return (
    <ChatPanelWrap>
      <Box className={CHAT_PANEL_CLASSES.messages}>
        {messages.map((msg, index) => (
          <ChatMessageBubble
            key={index}
            id={`cu-msg-${index + 1}`}
            message={msg}
          />
        ))}
      </Box>
      <Box className={CHAT_PANEL_CLASSES.input}>
        <ChatInput
          onAddMessage={onAddMessage}
          serverLoading={serverLoading}
        />
      </Box>
    </ChatPanelWrap>
  );
};

export default Object.assign(ChatPanel, {
  classes: CHAT_PANEL_CLASSES,
});
