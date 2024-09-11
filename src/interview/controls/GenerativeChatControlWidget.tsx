import type { GenerativeChatControl } from "@decisively-io/interview-sdk";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, type ControllerRenderProps, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { getChatFieldId } from "../../util";
import { InterviewContext } from "../Interview";
import type { ChatMessage } from "../chat";
import ChatPanel from "../chat/ChatPanel";
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

    const fieldId = getChatFieldId(control);

    const { session } = useContext(InterviewContext);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [responding, setResponding] = useState(false);
    const [interactionId, setInteractionId] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);
    const fieldRef = useRef<ControllerRenderProps>();

    const addMessage = async (message: string) => {
      setResponding(true);
      try {
        const payload = await session.chat(control.goal, message, interactionId, {
          aiOptions: control.aiOptions,
        });
        if (interactionId === undefined) {
          setInteractionId(payload.interactionId);
        }

        // @ts-ignore
        if (payload.status === "complete") {
          setCompleted(true);
          fieldRef.current?.onChange({
            target: {
              value: true,
            },
          });
        }

        setResponding(false);
        setMessages([
          ...messages,
          {
            self: false,
            content: payload.message,
          },
        ]);
      } catch (error) {
        setResponding(false);
        setMessages([...messages.slice(0, -1), { ...messages[messages.length - 1], failed: true }]);
      }
    };
    const setUserMessages = async (messages: ChatMessage[]) => {
      setMessages(messages);
      const newMessage = messages[messages.length - 1];
      await addMessage(newMessage.content);
    };

    useEffect(() => {
      addMessage(control.initialMessage);
    }, []);

    const ref = useRef();
    const { control: formControl } = useFormContext();

    return (
      <Controller
        name={fieldId}
        control={formControl}
        render={({ field }) => {
          fieldRef.current = field;
          return (
            <StyledChatPanel
              responding={responding}
              loading={session.externalLoading}
              ref={ref}
              disabled={Boolean(field.value || field.disabled || completed)}
              messages={messages}
              setMessages={setUserMessages}
            />
          );
        }}
      />
    );
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/GenerativeChat`,
  },
);
export default GenerativeChatControlWidget;
