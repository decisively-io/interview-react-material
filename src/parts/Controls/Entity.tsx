/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Controller, useFormContext } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { v4 as uuid } from 'uuid';
import * as FormControl from './__formControl';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { deriveEntityChildId, deriveEntityDefaultsForRow, deriveLabel, IEntity, IEntityData } from '../../types/controls';
import type { RenderControl } from './__renderControl';


export interface IProps {
  c: IEntity;
  RenderControl: typeof RenderControl;
}

function prepareControl(
  c: IEntity[ 'template' ][ 0 ],
  id: string,
  value: NonNullable< IEntity[ 'value' ] >[ 0 ][ 0 ],
): typeof c {
  if(c.type === 'image' || c.type === 'typography' || c.type === 'file') {
    return c;
  }

  if(c.type === 'number_of_instances') {
    return {
      ...c,
      value,
      entity: id,
    };
  }


  return {
    ...c,
    value,
    attribute: id,
  };
}


export const _: React.FC< IProps > = React.memo(({ c, RenderControl }) => {
  const { entity } = c;
  const { control } = useFormContext();


  return (
    <Controller
      control={control}
      name={entity}
      render={({ field: { value, onChange } }) => {
        const typedValue = value as IEntityData;
        const addRow = () => {
          const nextValue: typeof typedValue = {
            rowIds: typedValue.rowIds.concat(uuid()),
            valueRows: typedValue.valueRows.concat([deriveEntityDefaultsForRow(c.template)]),
          };
          onChange(nextValue);
        };

        const removeRow = (e: React.MouseEvent< HTMLButtonElement >) => {
          const { id } = e.currentTarget.dataset;
          if(id === undefined) return;

          const indexToRemove = typedValue.rowIds.indexOf(id);
          if(indexToRemove === -1) return;

          const nextValue: typeof typedValue = {
            rowIds: typedValue.rowIds.filter((_, i) => i !== indexToRemove),
            valueRows: typedValue.valueRows.filter((_, i) => i !== indexToRemove),
          };
          onChange(nextValue);
        };


        return (
          <FormControl._>
            <Typography variant='h5'>{deriveLabel(c)}</Typography>

            <Grid container direction='column'>
              <Grid item>
                {
                  typedValue.valueRows.map((row, rowI) => (
                    <Grid container key={typedValue.rowIds[ rowI ]}>
                      <Grid item xs={10}>
                        { row.map((value, i) => (
                          <RenderControl
                            key={c.template[ i ].id}
                            c={prepareControl(
                              c.template[ i ],
                              deriveEntityChildId(entity, rowI, i),
                              value,
                            )}
                          />
                        )) }
                      </Grid>
                      <Grid item>
                        <Button variant='outlined' color='secondary' data-id={typedValue.rowIds[ rowI ]} onClick={removeRow}>
                          &times;
                        </Button>
                      </Grid>
                    </Grid>
                  ))
                }
              </Grid>
              <Grid item>
                <Button variant='outlined' onClick={addRow}>+</Button>
              </Grid>
            </Grid>
          </FormControl._>
        );
      }}
    />
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Entity`;
