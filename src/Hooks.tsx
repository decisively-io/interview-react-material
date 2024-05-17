import { Control } from "@decisively-io/interview-sdk";
import React from "react";
import styled from "styled-components";
import BaseFormControl from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import { deriveLabel } from "./util";
import { InterviewContext } from "./parts";
import HelpOutline from "@material-ui/icons/HelpOutline";

export interface ExplanationProps {
  style?: React.CSSProperties;
  visible?: boolean;
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

export interface FormControlOptions {
  control: Control;
  wrapperClassName?: string;
}

export interface FormControlResult {
  renderWrapper: (children: React.ReactNode) => React.ReactNode;
  label: string | undefined;
  renderExplanation: (props?: ExplanationProps) => React.ReactNode;
}

export const useFormControl = (options: FormControlOptions): FormControlResult => {
  const { control, wrapperClassName } = options;
  const interview = React.useContext(InterviewContext);
  const explanation = control.attribute ? interview?.getExplanation(control.attribute) : undefined;
  const [focus, setFocus] = React.useState(false);
  const [helpHover, setHelpHover] = React.useState(false);
  const { attribute } = control;

  const renderExplanation = (props?: ExplanationProps) => {
    const {...otherProps } = props;
    // @ts-ignore
    if (!control.showExplanation || !explanation) {
      return null;
    }

    return (
      <ExplanationTooltip
        placement={"bottom-start"}
        open={focus || helpHover}
        title={explanation || "no explanation"}
        {...otherProps}
      >
        {/* biome-ignore lint: it's fine not having onFocus */}
        <div
          onMouseOver={() => setHelpHover(true)}
          onMouseLeave={() => setHelpHover(false)}
        >
          <HelpOutline />
        </div>
      </ExplanationTooltip>
    );
  };

  const renderWrapper = (children: React.ReactNode) => {
    return (
      <FormControlStyled
        onFocus={() => {
          setFocus(true);
        }}
        className={wrapperClassName}
        // @ts-ignore
        title={control.label}
        onBlur={() => setFocus(false)}
        fullWidth
      >
        {children}
      </FormControlStyled>
    );
  };

  return {
    renderWrapper,
    label: deriveLabel(control),
    renderExplanation,
  };
};
