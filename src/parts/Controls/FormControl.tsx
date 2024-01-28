import BaseFormControl, { FormControlProps as BaseFormControlProps } from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutline from "@material-ui/icons/HelpOutline";
import React from "react";
import styled from "styled-components";
import { DISPLAY_NAME_PREFIX } from "./__prefix";

export interface FormControlProps extends BaseFormControlProps {
  explanation?: string;
  children: React.ReactNode | ((options: FormControlRenderOptions) => React.ReactNode);
}

export interface ExplanationProps {
  style?: React.CSSProperties;
  visible?: boolean;
}

export interface FormControlRenderOptions {
  Explanation: React.ComponentType<ExplanationProps>;
}

const ExplanationTooltip = styled(Tooltip)`
  cursor: help;
  margin-top: -1rem;
  color: rgba(0, 0, 0, 0.54);
`;

const FormControlStyled = styled(BaseFormControl)`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
`;

const FormControl = React.memo((props: FormControlProps) => {
  const { children, explanation, ...otherProps } = props;
  const [focus, setFocus] = React.useState(false);
  const [helpHover, setHelpHover] = React.useState(false);

  const Explanation = (props: ExplanationProps) => {
    const { visible, ...otherProps } = props;
    if (!visible || !explanation) {
      return null;
    }

    return (
      <ExplanationTooltip placement={"bottom-start"} open={focus || helpHover} title={explanation || "no explanation"} {...otherProps}>
        {/* biome-ignore lint: it's fine not having onFocus */}
        <div onMouseOver={() => setHelpHover(true)} onMouseLeave={() => setHelpHover(false)}>
          <HelpOutline />
        </div>
      </ExplanationTooltip>
    );
  };

  return (
    <FormControlStyled
      onFocus={() => {
        setFocus(true);
      }}
      onBlur={() => setFocus(false)}
      fullWidth
      {...otherProps}
    >
      {typeof children === "function" ? children({ Explanation }) : children}
    </FormControlStyled>
  );
});
FormControl.displayName = `${DISPLAY_NAME_PREFIX}/FormControl`;
export default FormControl;
