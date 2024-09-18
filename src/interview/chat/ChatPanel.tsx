import type { ChatMessage } from "@decisively-io/interview-sdk";
import { Box } from "@material-ui/core";
import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import styled from "styled-components";
import ChatInput, { type ChatInputProps } from "./ChatInput";
import ChatInputCompact from "./ChatInputCompact";
import ChatMessageBubble, { type ChatMessageBubbleProps } from "./ChatMessageBubble";

export interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  loading?: boolean;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  responding?: boolean;
  components?: {
    input?: React.ComponentType<ChatInputProps>;
    messageBubble?: React.ComponentType<ChatMessageBubbleProps>;
  };
  additionalAction?: {
    icon?: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  compact?: boolean;
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
      padding: 1rem;
      padding-bottom: 0.5rem;
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
      padding: 1rem;
      padding-top: 0.5rem;

    & > * {
      min-width: 0;
    }
  }

`;

export interface ChatPanelHandle {
  scrollToBottom: () => void;
}

const ChatPanel = React.forwardRef((props: ChatPanelProps, ref: any) => {
  const {
    messages,
    responding,
    disabled,
    setMessages,
    loading,
    additionalAction,
    compact = false,
    ...otherProps
  } = props;

  const scrollableRef = useRef<any>();
  const handle: ChatPanelHandle = {
    scrollToBottom: () => {
      scrollableRef.current?.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
    },
  };
  useImperativeHandle(ref, () => handle);

  useEffect(() => {
    handle.scrollToBottom();
  }, [messages.length]);

  const onAddMessage = (msg: ChatMessage) => {
    messages.push(msg);
    setMessages([...messages]);
  };

  const ChatMessageBubbleComponent = props.components?.messageBubble || ChatMessageBubble;
  const ChatInputComponent = props.components?.input || (compact ? ChatInputCompact : ChatInput);

  return (
    <ChatPanelWrap {...otherProps}>
      <div
        ref={scrollableRef}
        className={CHAT_PANEL_CLASSES.messages}
      >
        {messages.map((msg, index) => (
          <ChatMessageBubbleComponent
            key={index}
            id={`cu-msg-${index + 1}`}
            message={msg}
          />
        ))}
        {responding ? (
          <ChatMessageBubbleComponent
            loading={true}
            id={"__responding"}
            message={{
              self: false,
              content: "Typing...",
            }}
          />
        ) : null}
      </div>
      <Box className={CHAT_PANEL_CLASSES.input}>
        <ChatInputComponent
          disabled={disabled}
          onAddMessage={onAddMessage}
          loading={loading}
          additionalAction={additionalAction}
        />
      </Box>
    </ChatPanelWrap>
  );
});

export default Object.assign(ChatPanel, {
  classes: CHAT_PANEL_CLASSES,
});
