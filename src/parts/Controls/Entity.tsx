/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import { DISPLAY_NAME_PREFIX } from './__prefix';
import {
  deriveLabel,
  IEntity,
  NonNestedControl,
  Control,
  IRenderControlProps,
} from '../../types/controls';

const FieldGroup = styled(Grid)`
  >:not(:last-child) {
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e5e5;
  }
`;

const FieldControls = styled(Grid)`
  > .MuiFormControl-root {
    margin: 0;
  }
`;

const Actions = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2.5rem;
`;

const Heading = styled(Typography)`
  && { margin-bottom: 1rem; }
`;

export interface IProps {
  c: IEntity;
  RenderControl: React.FC<IRenderControlProps>;
}

type TemplateControl = NonNestedControl & { attribute: string };

interface ISubControlProps {
  parent: IEntity;
  template: TemplateControl;
  entity: string;
  index: number;
  component: React.FC<IRenderControlProps>;
}

const SubControl = ({ parent, template, entity, index, component: RenderControl }: ISubControlProps) => {
  const name = [entity, index, template.attribute].join('.');
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
      <Heading variant='h5'>{deriveLabel(c)}</Heading>
      <FieldGroup container direction='column'>
        {fields.map((field, index) => (
          <Grid container key={field.id} alignItems='flex-start' justifyContent='space-between'>
            <FieldControls item xs={10}>
              {template.map(value => {
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
            </FieldControls>
            <Actions item xs={2}>
              <IconButton onClick={() => remove(index)}><DeleteIcon /></IconButton>
            </Actions>
          </Grid>
        ))}
      </FieldGroup>
      <IconButton onClick={() => append({ '@id': uuid() })}><AddIcon /></IconButton>
    </div>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Entity`;
