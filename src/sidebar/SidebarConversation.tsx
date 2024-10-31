import type { RenderableConversationSidebar } from "@decisively-io/interview-sdk/dist/core/sidebars/sidebar";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import type { SidebarComponent } from "./SidebarPanel";


const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;


export const SidebarConversation: SidebarComponent<RenderableConversationSidebar> = ({ sidebar }) => {
  const { data: {}, title, config, dynamicAttributes } = sidebar;

  return (
    <Wrap>
      <Typography variant='h4'>{title}</Typography>
    </Wrap>
  );
};
