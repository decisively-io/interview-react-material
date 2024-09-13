import type { Option, OptionsControl } from "@decisively-io/interview-sdk";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import Autocomplete, { type AutocompleteProps, createFilterOptions } from "@material-ui/lab/Autocomplete";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import ControlError from "./ControlError";
import type { ControlWidgetProps } from "./ControlWidgetTypes";

const filter = createFilterOptions<Option>();
export const asRadioClsnm = "asRadio_udecnm";
export const autocompleteClsnm = "autocomplete_n5JJ8qT";

export interface OptionsControlWidgetProps extends ControlWidgetProps<OptionsControl> {
  autocompleteProps?: AutocompleteProps<Option, false, false, true>;
  autocompleteTextFieldProps?: TextFieldProps;
  className?: string;
}

const StyledAutoComplete = styled(Autocomplete)`
  flex: 1;
` as typeof Autocomplete<Option, false, false, true>;

const RadioControl = <Radio />;

const OptionsControlWidget = Object.assign(
  React.memo((props: OptionsControlWidgetProps) => {
    const { control, autocompleteProps, autocompleteTextFieldProps, chOnScreenData, className } = props;

    const { asRadio, options, allow_other } = control;

    const radioOptionsJSX = React.useMemo(
      () =>
        options?.map((it) => (
          <FormControlLabel
            key={String(it.value)}
            value={it.value}
            control={RadioControl}
            label={it.label}
          />
        )),
      [options],
    );

    const isBool = React.useMemo(
      () =>
        options?.length === 2 && options.some((it) => it.value === false) && options.some((it) => it.value === true),
      [options],
    );

    const finalClsnm = [asRadio ? asRadioClsnm : autocompleteClsnm, className].filter(Boolean).join(" ");

    return useFormControl({
      control,
      className: finalClsnm,
      onScreenDataChange: chOnScreenData,
      render: ({ onChange, value, forId, error, inlineLabel, renderExplanation, disabled }) => {
        const typedValue = value as OptionsControl["value"];

        const setValueRadio: NonNullable<React.ComponentProps<typeof RadioGroup>["onChange"]> = ({
          currentTarget: { value },
        }) => {
          const nextValue = isBool ? value === "true" : value;
          onChange(nextValue);
        };

        return (
          <>
            {asRadio ? (
              <>
                <FormLabel
                  error={Boolean(error)}
                  htmlFor={forId}
                  component="legend"
                >
                  {inlineLabel}
                </FormLabel>
                <RadioGroup
                  value={typedValue === undefined || typedValue === null ? null : typedValue}
                  onChange={setValueRadio}
                  id={forId}
                >
                  {radioOptionsJSX}
                </RadioGroup>
                <ControlError>{error?.message || " "}</ControlError>
              </>
            ) : (
              <StyledAutoComplete
                value={
                  typedValue === null || typedValue === undefined
                    ? null
                    : options?.find((it) => it.value === typedValue) || {
                        value: typedValue,
                        label: String(typedValue),
                      }
                }
                onChange={(_, newValue) => {
                  if (newValue === null) {
                    onChange(null);
                    return;
                  }

                  if (typeof newValue === "string") return;

                  onChange(newValue.value);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  // Suggest the creation of a new value
                  if (allow_other && !isBool && params.inputValue !== "") {
                    filtered.push({
                      label: `Add "${params.inputValue}"`,
                      value: params.inputValue,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id={forId}
                options={options || []}
                // @ts-ignore
                getOptionLabel={(option) => option.label?.toString()}
                renderOption={(option) => option.label}
                freeSolo={allow_other}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={inlineLabel}
                    error={Boolean(error)}
                    helperText={error?.message || " "}
                    variant="outlined"
                    {...autocompleteTextFieldProps}
                    InputProps={{
                      ...params.InputProps,
                      ...autocompleteTextFieldProps?.InputProps,
                      id: forId,
                    }}
                  />
                )}
                disabled={control.disabled || disabled}
                {...autocompleteProps}
              />
            )}

            {renderExplanation()}
          </>
        );
      },
    });
  }),
  {
    displayName: `${DISPLAY_NAME_PREFIX}/OptionsControlWidget`,
    /*** @deprecated use `OptionsControlWidget` directly */
    _: null as any as React.ComponentType<OptionsControlWidgetProps>,
  },
);
OptionsControlWidget._ = OptionsControlWidget;

/*** @deprecated use `OptionsControlWidget` directly */
export const _ = OptionsControlWidget;

export default OptionsControlWidget;
