import type { Control, LabelDisplay } from "@decisively-io/interview-sdk";
import Box from "@material-ui/core/Box";
import BaseFormControl from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import HelpOutline from "@material-ui/icons/HelpOutline";
import React, { useState } from "react";
import { Controller, type FieldError, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { InterviewContext } from "./parts/InterviewContext";
import { MAX_INLINE_LABEL_LENGTH } from "./util";

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
  className?: string;
  onScreenDataChange?: (data: Record<string, any>) => void;
  render: (state: FormControlRenderState) => React.ReactNode;
}

export interface FormControlRenderState {
  onChange: (value: any) => void;
  value: any;
  forId: string;
  error: FieldError | undefined;
  inlineLabel: string | undefined;
  renderExplanation: (props?: ExplanationProps) => React.ReactNode;
}

const isLabelTooLong = (label: string | undefined): label is string => {
  if (typeof label === "string") {
    if (label.length > MAX_INLINE_LABEL_LENGTH) {
      return true;
    }
  }
  return false;
};

export const useFormControl = (options: FormControlOptions): React.ReactElement => {
  const { control, render, onScreenDataChange, className } = options;
  const interview = React.useContext(InterviewContext);
  const explanation = control.attribute ? interview?.getExplanation(control.attribute) : undefined;
  const [focus, setFocus] = React.useState(false);
  const [helpHover, setHelpHover] = React.useState(false);
  const { attribute } = control;
  const { control: formControl } = useFormContext();

  const renderExplanation = (props?: ExplanationProps) => {
    const otherProps = props;
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

  const sxForSeparateLabel =
    "sxForSeparateLabel" in control &&
    typeof control.sxForSeparateLabel === "object" &&
    control.sxForSeparateLabel !== null
      ? control.sxForSeparateLabel
      : undefined;

  let label: string | undefined = (control as any).label;
  let shouldInlineLabel = false;
  if (control.type === "boolean") {
    shouldInlineLabel = true;
  } else {
    const labelDisplay = ((control as any).labelDisplay as LabelDisplay | undefined) ?? "automatic";
    if (labelDisplay === "inline") {
      shouldInlineLabel = true;
      // if we are forcing inline, we need to truncate the label if it is too long
      if (isLabelTooLong(label)) {
        label = `${label.slice(0, MAX_INLINE_LABEL_LENGTH).trimEnd()}...`;
      }
    } else if (labelDisplay === "automatic") {
      shouldInlineLabel = !isLabelTooLong(label);
    }
    if (typeof label === "string" && (control as any).required) {
      label = `${label}*`;
    }
  }

  const inlineLabel = shouldInlineLabel ? label : undefined;
  const [forId] = useState(() => Math.random().toString(36).substring(7));

  // @ts-ignore
  const name: string = attribute ?? control.entity;

  return (
    <Controller
      control={formControl}
      name={name}
      // @ts-ignore
      defaultValue={control.value ?? control.default}
      render={({ field: { name, value, onChange }, fieldState: { error } }) => {
        const handleChange = (value: any) => {
          if (name) {
            onScreenDataChange?.({ [name]: value });

            onChange(value);
          }
        };

        return (
          <>
            {label && !shouldInlineLabel ? (
              <Box sx={sxForSeparateLabel}>
                <Typography
                  color={error ? "error" : "initial"}
                  htmlFor={forId}
                  component="label"
                >
                  {label}
                </Typography>
              </Box>
            ) : null}
            <FormControlStyled
              data-control={control.type}
              data-id={control.id}
              data-name={name}
              onFocus={() => {
                setFocus(true);
              }}
              className={className}
              // @ts-ignore
              title={control.label}
              // @ts-ignore
              disabled={control.disabled}
              onBlur={() => setFocus(false)}
              fullWidth
            >
              {render({
                onChange: handleChange,
                // @ts-ignore
                value: value ?? control.value ?? control.default,
                forId,
                error,
                inlineLabel,
                renderExplanation,
              })}
            </FormControlStyled>
          </>
        );
      }}
    />
  );
};
