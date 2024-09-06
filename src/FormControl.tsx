import type { Control, LabelDisplay } from "@decisively-io/interview-sdk";
import Box from "@material-ui/core/Box";
import BaseFormControl from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import HelpOutline from "@material-ui/icons/HelpOutline";
import React, { useState } from "react";
import { Controller, type FieldError, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { InterviewContext } from "./parts";
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

const ReadOnlyContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

export interface FormControlOptions {
  control: Control;
  className?: string;
  onScreenDataChange?: (data: Record<string, any>) => void;
  render: (state: FormControlRenderState) => React.ReactNode;
  renderValue?: (value: string) => React.ReactNode;
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

type ReadOnlyBasedMeta = (
  | { type: 'hasNoEffect' }
  | { type: 'markControlDisabled' }
  | { type: 'overrideRender'; node: JSX.Element; }
);
export const useFormControl = (options: FormControlOptions): React.ReactElement => {
  const { control, render, onScreenDataChange, className } = options;
  const interview = React.useContext(InterviewContext);
  const explanation = control.attribute ? interview?.getExplanation(control.attribute) : undefined;
  const [focus, setFocus] = React.useState(false);
  const [helpHover, setHelpHover] = React.useState(false);
  const { attribute } = control;
  const { control: formControl } = useFormContext();
  const [forId] = useState(() => Math.random().toString(36).substring(7));

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

  const readOnlyBasedMeta = React.useMemo< ReadOnlyBasedMeta >(() => {
    // if control type is not expected to have "readOnly" -> return
    if(
      control.type !== 'boolean'
      && control.type !== 'currency'
      && control.type !== 'date'
      && control.type !== 'time'
      && control.type !== 'datetime'
      && control.type !== 'options'
      && control.type !== 'number_of_instances'
      && control.type !== 'text'
    ) return { type: 'hasNoEffect' };

    // if readOnly is falsy -> return
    if(!control.readOnly) return { type: 'hasNoEffect' };

    // if label display is not "automatic" -> control should be marked "disabled"
    if(control.labelDisplay !== 'automatic') return { type: 'markControlDisabled' };

    // at this point we are sure that we want to override render
    const label = `${control.label}:`;
    const renderValue = options.renderValue ?? ((value: string) => value);

    return {
      type: 'overrideRender',
      node: (
        <ReadOnlyContainer>
          <Typography>{label}</Typography>
          <Typography>{renderValue(String(control.value))}</Typography>
          {renderExplanation()}
        </ReadOnlyContainer>
      ),
    };
  }, [control]);

  if(readOnlyBasedMeta.type === 'overrideRender') {
    return readOnlyBasedMeta.node;
  }

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
              disabled={readOnlyBasedMeta.type === 'markControlDisabled' || ('disabled' in control && control.disabled)}
              onBlur={() => setFocus(false)}
              fullWidth
            >
              {render({
                onChange: handleChange,
                value,
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
