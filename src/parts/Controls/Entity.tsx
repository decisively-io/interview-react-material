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
} from '../../types/controls';
import type { IRenderControlProps } from './__controlsTypes';


export const classes = {
  '>h': 'heading',

  '>fieldGroups': {
    _: 'fieldGroups',

    '>fieldGroup': {
      _: 'fieldGroup',

      '>fieldControls': 'fieldControls',
      '>fieldActions': 'fieldActions',
    },
  },

  '>add': 'addIconBtn',
};

const fieldGrpsClss = classes[ '>fieldGroups' ];
const fieldGrpClss = classes[ '>fieldGroups' ][ '>fieldGroup' ];


const Wrap = styled.div`
  >.${ classes[ '>h' ] } {
    margin-bottom: 1rem;
  }

  >.${ classes[ '>fieldGroups' ]._ } {
    >.${ fieldGrpClss._ } {
      &:not(:last-child) {
        margin-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;
      }

      >.${ fieldGrpClss[ '>fieldControls' ] } {
        >* { margin-bottom: 1rem; }
      }
    }
  }
`;


export interface IProps extends Pick< IRenderControlProps, 'controlComponents' > {
  c: IEntity;
  RenderControl: React.FC< IRenderControlProps >;
  className?: string;
}

type TemplateControl = NonNestedControl & { attribute: string };

interface ISubControlProps extends Pick< IRenderControlProps, 'controlComponents' > {
  parent: IEntity;
  template: TemplateControl;
  entity: string;
  index: number;
  component: React.FC< IRenderControlProps >;
}


const SubControl: React.FC< ISubControlProps > = ({
  parent,
  template,
  entity,
  index,
  component: RenderControl,
  controlComponents,
}) => {
  const name = [entity, index, template.attribute].join('.');
  const control = {
    ...template,
    attribute: name,
    value: parent.value?.[ index ]?.[ template.attribute ],
  } as Control;

  return <RenderControl c={control} controlComponents={controlComponents} />;
};

// const DebugState = () => {
//   const { watch } = useFormContext();
//   React.useEffect(() => {
//     console.log('watching state changes');
//     const subscription = watch((value, { name, type }) => console.log(value, name, type));
//     return () => subscription.unsubscribe();
//   }, [watch]);
//   return null;
// };

export const _: React.FC<IProps> = React.memo(({ c, RenderControl, controlComponents, className }) => {
  const { entity, template } = c;
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: entity,
  });

  const appendHanler = React.useCallback(() => append({ '@id': uuid() }), [append]);

  return (
    <Wrap className={className}>
      <Typography className={classes[ '>h' ]} variant='h5'>
        {deriveLabel(c)}
      </Typography>

      <Grid className={fieldGrpsClss._} container direction='column'>
        {fields.map((field, index) => (
          <Grid
            item
            container
            key={field.id}
            alignItems='flex-start'
            justifyContent='space-between'
            className={fieldGrpClss._}
          >
            <Grid className={fieldGrpClss[ '>fieldControls' ]} item xs={10}>
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
                      controlComponents={controlComponents}
                    />
                  );
                }

                console.log('Unsupported template control', value);
                return null;
              })}
            </Grid>

            <Grid className={fieldGrpClss[ '>fieldActions' ]} item xs={2}>
              <IconButton onClick={() => remove(index)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <IconButton onClick={appendHanler}>
        <AddIcon />
      </IconButton>
    </Wrap>
  );
});
_.displayName = `${ DISPLAY_NAME_PREFIX }/Entity`;
