import type { RenderableDataContainerControl } from "@decisively-io/interview-sdk";
import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import type { ControlComponents } from "./index";

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 4.5rem;
  padding: 1rem;
`;
/**
 * it seems that each column with data is a perfect candidate for a table\
 * display:
 * - labels can have different lengths
 * - they should all be constrainted by the width f the longest one
 * - values (potentially) can be multiline (e.g. multiple files in file\
 * control), but still should align with the label
 */
const Col = styled.table`
  display: flex;
  gap: 2rem;
  flex-grow: 1;

  td {
    vertical-align: top;
  }
`;

const Label = styled(Typography)`
  font-size: 1rem;
  line-height: 1.2;
  color: #A3A3A3;
  white-space: nowrap;
`;
const ValueLabel = styled(Label)`
  color: #000000;
  margin-left: 2rem;
  white-space: initial;
`;

type LabelValue = {
  label: string;
  /**
   * generally most controls only have one string value, but\
   * file control could potentially have multiple, which then\
   * should be displayed one under another
   */
  value: string[];
};

export interface DataContainerControlWidgetProps extends ControlWidgetProps<RenderableDataContainerControl> {
  controlComponents: ControlComponents;
}

const DataContainerControlWidget = (props: DataContainerControlWidgetProps) => {
  const { control } = props;
  const { columns: colNr = 1, controls } = control;

  const labelsAndValues = React.useMemo(
    () =>
      (controls || []).reduce<LabelValue[]>((a, it) => {
        if (
          it.type !== "boolean" &&
          it.type !== "currency" &&
          it.type !== "date" &&
          it.type !== "time" &&
          it.type !== "datetime" &&
          it.type !== "options" &&
          it.type !== "file" &&
          it.type !== "image" &&
          it.type !== "number_of_instances" &&
          it.type !== "text" &&
          it.type !== "document"
        )
          return a;

        // TODO design proper display for these
        if (it.type === "document" || it.type === "image") return a;

        const labelStr = `${it.label}:`;

        const value = ((): string[] => {
          if (it.type === "file") {
            // TODO finalize this when file control branch is merged in
            return [];
          }

          if (it.type === "currency") {
            return [`${it.symbol || "$"} ${it.value === null || it.value === undefined ? "" : String(it.value)}`];
          }

          if (it.type === "options") {
            const maybeMatchingOption = (it.options || []).find((option) => option.value === it.value);

            return [
              it.value === null || it.value === undefined
                ? ""
                : String(maybeMatchingOption === undefined ? it.value : maybeMatchingOption.label),
            ];
          }

          if (it.type === "number_of_instances") {
            return [it.value === null || it.value === undefined ? "" : String(it.value.length)];
          }

          return [it.value === null || it.value === undefined ? "" : String(it.value)];
        })();

        return a.concat({ label: labelStr, value });
      }, []),
    [controls],
  );

  const labelsAndValuesInColumns = React.useMemo<LabelValue[][]>(() => {
    if (colNr <= 0) return [];

    const columns: LabelValue[][] = new Array(colNr).fill(0).map((it) => []);
    const maxRowsPerCol = Math.ceil(labelsAndValues.length / colNr);

    return labelsAndValues.reduce((a, it, i) => {
      const column = a[Math.floor(i / maxRowsPerCol)];
      if (column !== undefined) column.push(it);

      return a;
    }, columns);
  }, [colNr, labelsAndValues]);

  return (
    <>
      {control.label ? <Typography variant="h5">{control.label}</Typography> : null}
      <Wrap>
        {labelsAndValuesInColumns.map((col, i) => (
          <Col key={i}>
            <tbody>
              {col.map(({ label, value }, i) => (
                <tr key={i}>
                  <td>
                    <Label>{label}</Label>
                  </td>

                  <td>
                    <ValueLabel>{String(value)}</ValueLabel>
                  </td>
                </tr>
              ))}
            </tbody>
          </Col>
        ))}
      </Wrap>
    </>
  );
};

export default DataContainerControlWidget;
