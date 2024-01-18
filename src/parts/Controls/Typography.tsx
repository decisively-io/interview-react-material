import Typography, { TypographyProps as MaterialTypographyProps } from "@material-ui/core/Typography";
import React from "react";
import styled from "styled-components";
import { ITypography } from "../../types/controls";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface TypographyProps {
  c: ITypography;
  typographyProps?: MaterialTypographyProps;
  className?: string;
}

const DISPLAY_NAME = `${DISPLAY_NAME_PREFIX}/Typography`;

const Banner = styled.div`
  border-left: 4px solid rgb(255, 66, 67);
  background-color: rgb(254, 244, 242);
  border-radius: 2px;
  padding: 11px 12px;
  display: flex;

  .emoji {
    min-width: 1.5rem;
  }
`;

const BannerRed = styled(Banner)`
  border-left: 4px solid rgb(255, 66, 67);
  background-color: rgb(254, 244, 242);
`;
const BannerGreen = styled(Banner)`
  border-left: 4px solid rgb(5, 190, 140);
  background-color: rgb(237, 254, 246);
`;
const BannerYellow = styled(Banner)`
  border-left: 4px solid rgb(252, 180, 20);
  background-color: rgb(255, 249, 236);
`;

type BannerStyle = Extract<ITypography["style"], "banner-yellow" | "banner-green" | "banner-red">;

const BannerComp: React.FC<{ text: string; style: BannerStyle; emoji?: ITypography["emoji"] }> = React.memo(({ style, text, emoji }) => {
  const Comp = style === "banner-green" ? BannerGreen : style === "banner-red" ? BannerRed : BannerYellow;

  return (
    <Comp>
      <span className="emoji" dangerouslySetInnerHTML={{ __html: emoji || "" }} />
      <Typography variant="body1">{text}</Typography>
    </Comp>
  );
});
BannerComp.displayName = `${DISPLAY_NAME}/BannerComp`;

export const _: React.FC<TypographyProps> = React.memo(({ c, typographyProps, className }) => {
  const { style, emoji } = c;
  const text = c.text ?? "Error: missing value 'text'";

  return (
    <div className={className}>
      {(() => {
        if (style === "banner-red" || style === "banner-green" || style === "banner-yellow") {
          return <BannerComp {...{ style, text, emoji }} />;
        }

        return (
          <Typography variant={style} {...typographyProps}>
            {emoji === undefined ? null : (
              <span className="emoji">
                {emoji}
                &nbsp;&nbsp;
              </span>
            )}

            <span className="text">{text}</span>
          </Typography>
        );
      })()}
    </div>
  );
});
_.displayName = DISPLAY_NAME;
