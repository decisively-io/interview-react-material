/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import { IRenderControlProps } from '../../types/controls';
import * as Boolean from './Boolean';
import * as Currency from './Currency';
import * as Date from './Date';
import * as Time from './Time';
import * as DateTime from './DateTime';
import * as Options from './Options';
import * as Text from './Text';
import * as Image from './Image';
import * as NumberOfInstances from './NumberOfInstances';
import * as Typography from './Typography';
import * as Entity from './Entity';


export const RenderControl: React.FC< IRenderControlProps > = React.memo(({ c }) => {
  switch(c.type) {
    case 'boolean': return <Boolean._ {...{ c }} />;
    case 'currency': return <Currency._ {...{ c }} />;
    case 'date': return <Date._ {...{ c }} />;
    case 'time': return <Time._ {...{ c }} />;
    case 'datetime': return <DateTime._ {...{ c }} />;
    case 'options': return <Options._ {...{ c }} />;
    case 'text': return <Text._ {...{ c }} />;
    case 'image': return <Image._ {...{ c }} />;
    case 'number_of_instances': return <NumberOfInstances._ {...{ c }} />;
    case 'typography': return <Typography._ {...{ c }} />;
    case 'entity': return <Entity._ {...{ c, RenderControl }} />;
    default: return null;
  }
});
RenderControl.displayName = `${ DISPLAY_NAME_PREFIX }/__RenderControl`;
