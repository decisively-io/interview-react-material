import type { TypographyControl } from "@decisively-io/interview-sdk";
import MuiTypography, { type TypographyProps as MuiTypographyProps } from "@material-ui/core/Typography";
import React from "react";
import styled from "styled-components";
import { LOADING_ANIMATION_CSS } from "../../Constants";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

export interface TypographyControlWidgetProps extends ControlWidgetProps<TypographyControl & { loading?: boolean }> {
  typographyProps?: MuiTypographyProps;
  className?: string;
}

const DISPLAY_NAME = `${DISPLAY_NAME_PREFIX}/Typography`;

const BannerBase = styled.div`
  border-left: 4px solid rgb(255, 66, 67);
  background-color: rgb(254, 244, 242);
  border-radius: 2px;
  padding: 11px 12px;
  display: flex;

  .emoji {
    min-width: 1.5rem;
  }
`;

const BannerRed = styled(BannerBase)`
  border-left: 4px solid rgb(255, 66, 67);
  background-color: rgb(254, 244, 242);
`;
const BannerGreen = styled(BannerBase)`
  border-left: 4px solid rgb(5, 190, 140);
  background-color: rgb(237, 254, 246);
`;
const BannerYellow = styled(BannerBase)`
  border-left: 4px solid rgb(252, 180, 20);
  background-color: rgb(255, 249, 236);
`;
const StyledTypography = styled(MuiTypography)`
  ${LOADING_ANIMATION_CSS}
`;

interface BannerProps {
  control: TypographyControl & { loading?: boolean };
  text: string;
}

const Banner = React.memo((props: BannerProps) => {
  const { control, text } = props;
  const { style, emoji } = control;
  const Comp = style === "banner-green" ? BannerGreen : style === "banner-red" ? BannerRed : BannerYellow;

  return (
    <Comp>
      <span
        className="emoji"
        dangerouslySetInnerHTML={{ __html: emoji || "" }}
      />
      <StyledTypography
        data-loading={control.loading}
        variant="body1"
      >
        {text}
      </StyledTypography>
    </Comp>
  );
});
Banner.displayName = `${DISPLAY_NAME}/BannerComp`;

export const TypographyControlWidget = Object.assign(
  React.memo((props: TypographyControlWidgetProps) => {
    const { className, control, typographyProps } = props;
    const { style, emoji } = control;
    const text = control.text ?? "Error: missing value 'text'";

    return (
      <div className={className}>
        {(() => {
          if (style === "banner-red" || style === "banner-green" || style === "banner-yellow") {
            return (
              <Banner
                control={control}
                text={text}
              />
            );
          }

          return (
            <StyledTypography
              data-loading={control.loading}
              variant={style}
              {...typographyProps}
            >
              {emoji === undefined ? null : (
                <span className="emoji">
                  {emoji}
                  &nbsp;&nbsp;
                </span>
              )}

              <span className="text">{text}</span>
            </StyledTypography>
          );
        })()}
      </div>
    );
  }),
  {
    displayName: DISPLAY_NAME,
    /*** @deprecated use `TypographyControlWidget` directly instead */
    _: null as any as React.ComponentType<TypographyControlWidgetProps>,
  },
);
TypographyControlWidget._ = TypographyControlWidget;

/*** @deprecated use `TypographyControlWidget` directly instead */
export const _ = TypographyControlWidget;

export default TypographyControlWidget;
