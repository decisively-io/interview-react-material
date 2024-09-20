import type { RenderableEntityListSidebar } from "@decisively-io/interview-sdk";
import { Card } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { titleCase } from "title-case";
import type { SidebarComponent } from "./SidebarPanel";

export interface EntityCardProps {
  entity: any;
  data?: RenderableEntityListSidebar["data"];
}

const EntityCardContainer = styled(Card)`
  padding: 1rem;
  min-height: 6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
`;

const EntityCard = (props: EntityCardProps) => {
  const { entity, data } = props;
  const title = data?.titleAttributeDescription && entity[data.titleAttributeDescription];
  return (
    <EntityCardContainer>
      {title && <Typography variant={"h6"}>{title}</Typography>}
      {data?.descriptionAttributes?.map((attr) => (
        <Typography
          key={attr.value}
          variant={"body2"}
        >
          {attr.label ? `${attr.label}: ` : ""}
          {entity[attr.value]}
        </Typography>
      ))}
    </EntityCardContainer>
  );
};

const SidebarEntityList: SidebarComponent<RenderableEntityListSidebar> = ({ sidebar }) => {
  const { data, config, title } = sidebar;

  const resolvedTitle = title ?? (config?.entity ? titleCase(config.entity) : undefined);

  return (
    <>
      {resolvedTitle ? <Typography variant={"h3"}>{resolvedTitle}</Typography> : null}
      {data.entities.map((entity) => (
        <EntityCard
          key={entity["@id"]}
          entity={entity}
          data={data}
        />
      ))}
    </>
  );
};

export default SidebarEntityList;
