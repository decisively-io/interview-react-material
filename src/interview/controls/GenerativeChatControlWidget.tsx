import type { GenerativeChatControl } from "@decisively-io/interview-sdk";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import type { ChatMessage } from "../chat";
import ChatPanel from "../chat/ChatPanel";
import { getChatFieldId } from "../../util";
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

    const addMessage = async (message: string) => {
      try {
        const payload = await session.chat(message, {
          aiOptions: control.aiOptions,
        });
        setMessages([
          ...messages,
          {
            self: false,
            content: payload.message,
          },
        ]);
      } catch (error) {
        setMessages([...messages.slice(0, -1), { ...messages[messages.length - 1], failed: true }]);
      }
    };

    useEffect(() => {
      addMessage(control.initialMessage);
    }, []);

    const setUserMessages = async (messages: ChatMessage[]) => {
      setMessages(messages);
      const newMessage = messages[messages.length - 1];
      await addMessage(newMessage.content);
    };

    const ref = useRef();
    const { control: formControl } = useFormContext();

    return (
      <Controller
        name={getChatFieldId(control)}
        control={formControl}
        render={({ field }) => (
          <StyledChatPanel
            loading={session.externalLoading}
            ref={ref}
            disabled={Boolean(field.value || field.disabled)}
            messages={messages}
            setMessages={setUserMessages}
          />
        )}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/GenerativeChat`,
  },
);
export default GenerativeChatControlWidget;
