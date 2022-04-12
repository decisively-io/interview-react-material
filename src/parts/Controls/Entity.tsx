/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { IEntityInstance } from '@decisively-io/types-interview';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { v4 as uuid } from 'uuid';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import {
  deriveLabel,
  IEntity,
  NonNestedControl,
  Control,
  IRenderControlProps,
} from '../../types/controls';


export interface IProps {
  c: IEntity;
  RenderControl: React.FC<IRenderControlProps>;
}

// function prepareControl(c: IEntity['template'][0], id: string, value: NonNullable<IEntity['value']>[0][0]): typeof c {
//   if (c.type === 'image' || c.type === 'typography' || c.type === 'file') {
//     return c;
//   }

//   if (c.type === 'number_of_instances') {
//     return {
//       ...c,
//       value,
//       entity: id,
//     };
//   }

//   return {
//     ...c,
//     value,
//     attribute: id,
//   };
// }

type TemplateControl = NonNestedControl & { attribute: string };

interface ISubControlProps {
  parent: IEntity;
  template: TemplateControl;
  entity: string;
  index: number;
  component: React.FC<IRenderControlProps>;
}

const SubControl = ({ parent, template, entity, index, component: RenderControl }: ISubControlProps) => {
  // prepareControl(control, deriveEntityChildId(entity, index, i), value)
  // household_members/0/12312-asd921341
  const name = [entity, index, template.attribute].join('.');
  // control.value might exist, need to
  // const value = ;
  const control = {
    ...template,
    attribute: name,
    value: parent.value?.[ index ]?.[ template.attribute ],
  } as Control;

  return <RenderControl c={control} />;
};

const DebugState = () => {
  const { watch } = useFormContext();
  React.useEffect(() => {
    console.log('watching state changes');
    const subscription = watch((value, { name, type }) => console.log(value, name, type));
    return () => subscription.unsubscribe();
  }, [watch]);
  return null;
};

export const _: React.FC<IProps> = React.memo(({ c, RenderControl }) => {
  const { entity, template } = c;
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: entity,
  });

  return (
    <div>
      <Typography variant='h5'>{deriveLabel(c)}</Typography>
      <DebugState />
      <Grid item>{JSON.stringify(fields)}</Grid>
      <Grid container direction='column'>
        <Grid item>
          {fields.map((field, index) => (
            <Grid container key={((field as unknown) as IEntityInstance)[ '@id' ]}>
              <Grid item xs={10}>
                {template.map((value, i) => {
                  if('attribute' in value) {
                    const key = [entity, index, value.attribute].join('.');
                    return (
                      <SubControl
                        key={key}
                        parent={c}
                        template={value}
                        entity={entity}
                        index={index}
                        component={RenderControl}
                      />
                    );
                  }

                  console.log('Unsupported template control', value);
                  return null;
                })}
              </Grid>
              <Grid item>
                <Button variant='outlined' color='secondary' data-id={field.id} onClick={() => remove(index)}>
                  &times;
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item>
          <Button variant='outlined' onClick={() => append({ '@id': uuid() })}>
            +
          </Button>
        </Grid>
      </Grid>
    </div>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Entity`;
