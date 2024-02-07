import { AttributeData } from "@decisively-io/types-interview";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Autocomplete, { AutocompleteProps, createFilterOptions } from "@material-ui/lab/Autocomplete";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { IOptions, deriveLabel } from "../../util/controls";
import { InterviewContext } from "../index";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import FormControl from "./FormControl";
import * as ErrorComp from "./__error";

const filter = createFilterOptions<IOptions["options"][0]>();
export const asRadioClsnm = "asRadio_udecnm";
export const autocompleteClsnm = "autocomplete_n5JJ8qT";

export interface OptionsProps {
  c: IOptions;
  autocompleteProps?: AutocompleteProps<IOptions["options"][0], false, false, true>;
  autocompleteTextFieldProps?: TextFieldProps;
  chOnScreenData?: (data: AttributeData) => void;
  className?: string;
}

const StyledAutoComplete = styled(Autocomplete)`
  flex: 1;
` as typeof Autocomplete<IOptions["options"][0], false, false, true>;

const RadioControl = <Radio />;

export const _: React.FC<OptionsProps> = React.memo((p) => {
  const { c, autocompleteProps, autocompleteTextFieldProps, chOnScreenData, className } = p;

  const { control } = useFormContext();
  const { attribute, asRadio, options, allow_other } = c;

  const radioOptionsJSX = React.useMemo(() => options.map((it) => <FormControlLabel key={String(it.value)} value={it.value} control={RadioControl} label={it.label} />), [options]);

  const isBool = React.useMemo(() => options.length === 2 && options.some((it) => it.value === false) && options.some((it) => it.value === true), [options]);

  const Label = deriveLabel(c);

  const finalClsnm = [asRadio ? asRadioClsnm : autocompleteClsnm, className].filter(Boolean).join(" ");
  const interview = React.useContext(InterviewContext);
  const explanation = interview?.getExplanation(attribute);

  return (
    <Controller
      control={control}
      name={attribute}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const typedValue = value as IOptions["value"];

        const setValueRadio: NonNullable<React.ComponentProps<typeof RadioGroup>["onChange"]> = ({ currentTarget: { value } }) => {
          const nextValue = isBool ? value === "true" : value;

          if (chOnScreenData) {
            chOnScreenData({ [attribute]: nextValue });
          }

          onChange(nextValue);
        };

        return (
          <FormControl explanation={explanation} title={c.label} disabled={c.disabled} className={finalClsnm}>
            {({ Explanation }) => (
              <>
                <Explanation visible={c.showExplanation} />
                {asRadio ? (
                  <>
                    <FormLabel error={Boolean(error)} component="legend">
                      {Label}
                    </FormLabel>
                    <RadioGroup value={typedValue === undefined || typedValue === null ? null : typedValue} onChange={setValueRadio}>
                      {radioOptionsJSX}
                    </RadioGroup>
                    <ErrorComp._>{error?.message || " "}</ErrorComp._>
                  </>
                ) : (
                  <StyledAutoComplete
                    value={
                      typedValue === null || typedValue === undefined
                        ? null
                        : options.find((it) => it.value === typedValue) || {
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
                    options={options}
                    getOptionLabel={(option) => option.label?.toString()}
                    renderOption={(option) => option.label}
                    freeSolo={allow_other}
                    renderInput={(params) => <TextField {...params} label={Label} error={Boolean(error)} helperText={error?.message || " "} variant="outlined" {...autocompleteTextFieldProps} />}
                    disabled={c.disabled}
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
});
_.displayName = `${DISPLAY_NAME_PREFIX}/Options`;
