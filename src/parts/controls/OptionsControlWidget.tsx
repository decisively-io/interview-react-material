import { AttributeData, type Option, type OptionsControl } from "@decisively-io/interview-sdk";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import Autocomplete, { type AutocompleteProps, createFilterOptions } from "@material-ui/lab/Autocomplete";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import ControlError from "./ControlError";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import FormControl from "./FormControl";

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

    const { control: formControl } = useFormContext();
    const { attribute, asRadio, options, allow_other } = control;

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

    const Label = deriveLabel(control);

    const finalClsnm = [asRadio ? asRadioClsnm : autocompleteClsnm, className].filter(Boolean).join(" ");
    const interview = React.useContext(InterviewContext);
    const explanation = interview?.getExplanation(attribute);

    return (
      <Controller
        control={formControl}
        name={attribute}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const typedValue = value as OptionsControl["value"];

          const setValueRadio: NonNullable<React.ComponentProps<typeof RadioGroup>["onChange"]> = ({
            currentTarget: { value },
          }) => {
            const nextValue = isBool ? value === "true" : value;

            if (chOnScreenData) {
              chOnScreenData({ [attribute]: nextValue });
            }

            onChange(nextValue);
          };

          return (
            <FormControl
              explanation={explanation}
              title={control.label}
              disabled={control.disabled}
              className={finalClsnm}
            >
              {({ Explanation }) => (
                <>
                  <Explanation visible={control.showExplanation} />
                  {asRadio ? (
                    <>
                      <FormLabel
                        error={Boolean(error)}
                        component="legend"
                      >
                        {Label}
                      </FormLabel>
                      <RadioGroup
                        value={typedValue === undefined || typedValue === null ? null : typedValue}
                        onChange={setValueRadio}
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
                          if (chOnScreenData) {
                            chOnScreenData({ [attribute]: null } as any);
                          }

                          onChange(null);
                          return;
                        }

                        if (typeof newValue === "string") return;

                        if (chOnScreenData) {
                          chOnScreenData({ [attribute]: newValue.value });
                        }

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
                      options={options || []}
                      // @ts-ignore
                      getOptionLabel={(option) => option.label?.toString()}
                      renderOption={(option) => option.label}
                      freeSolo={allow_other}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={Label}
                          error={Boolean(error)}
                          helperText={error?.message || " "}
                          variant="outlined"
                          {...autocompleteTextFieldProps}
                        />
                      )}
                      disabled={control.disabled}
                      {...autocompleteProps}
                    />
                  )}
                </>
              )}
            </FormControl>
          );
        }}
      />
    );
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
