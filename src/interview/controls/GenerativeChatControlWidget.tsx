import type { GenerativeChatControl } from "@decisively-io/interview-sdk";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import type { ChatMessage } from "../../chat";
import ChatPanel from "../../chat/ChatPanel";
import { InterviewContext } from "../Interview";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

const StyledChatPanel = styled(ChatPanel)`
  border: 1px solid rgb(229, 229, 229);
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0.5rem 0;
  flex: 1;
  min-height: 30vh;
`;

export interface GenerativeChatControlWidgetProps extends ControlWidgetProps<GenerativeChatControl> {
  className?: string;
}

const GenerativeChatControlWidget = Object.assign(
  React.memo((props: GenerativeChatControlWidgetProps) => {
    const { control, chOnScreenData, className } = props;

    const { session } = useContext(InterviewContext);

    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const initialMessage = async () => {
      const payload = await session.chat(control.initialMessage, {
        aiOptions: control.aiOptions,
      });
      setMessages([
        {
          self: false,
          content: payload.message,
        },
      ]);
    };

    useEffect(() => {
      initialMessage();
    }, []);

    const setUserMessages = async (messages: ChatMessage[]) => {
      setMessages(messages);
      const newMessage = messages[messages.length - 1];
      const payload = await session.chat(newMessage.content, {
        aiOptions: control.aiOptions,
      });
      setMessages([
        ...messages,
        {
          self: false,
          content: payload.message,
        },
      ]);
    };

    const ref = useRef();

    return (
      <StyledChatPanel
        serverLoading={session.externalLoading}
        ref={ref}
        messages={messages}
        setMessages={setUserMessages}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/GenerativeChat`,
  },
);
export default GenerativeChatControlWidget;
