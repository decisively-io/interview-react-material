/* eslint-disable import/no-extraneous-dependencies, react/jsx-pascal-case */
import React from 'react';
import { DISPLAY_NAME_PREFIX } from './__prefix';
import type { IRenderControlProps } from './__controlsTypes';
import * as BooleanNS from './Boolean';
import * as CurrencyNS from './Currency';
import * as DateNS from './Date';
import * as TimeNS from './Time';
import * as DateTimeNS from './DateTime';
import * as OptionsNS from './Options';
import * as TextNS from './Text';
import * as ImageNS from './Image';
import * as NumberOfInstancesNS from './NumberOfInstances';
import * as TypographyNS from './Typography';
import * as EntityNS from './Entity';


export const RenderControl: React.FC< IRenderControlProps > = React.memo(({ c, controlComponents, chOnScreenData }) => {
  const {
    Boolean = BooleanNS._,
    Currency = CurrencyNS._,
    Date = DateNS._,
    Time = TimeNS._,
    DateTime = DateTimeNS._,
    Options = OptionsNS._,
    Text = TextNS._,
    Image = ImageNS._,
    NumberOfInstances = NumberOfInstancesNS._,
    Typography = TypographyNS._,
    Entity = EntityNS._,
  } = controlComponents || {};

  switch(c.type) {
    case 'boolean': return <Boolean {...{ c, chOnScreenData }} />;
    case 'currency': return <Currency {...{ c, chOnScreenData }} />;
    case 'date': return <Date {...{ c, chOnScreenData }} />;
    case 'time': return <Time {...{ c, chOnScreenData }} />;
    case 'datetime': return <DateTime {...{ c, chOnScreenData }} />;
    case 'options': return <Options {...{ c, chOnScreenData }} />;
    case 'text': return <Text {...{ c, chOnScreenData }} />;
    case 'image': return <Image {...{ c }} />;
    case 'number_of_instances': return <NumberOfInstances {...{ c }} />;
    case 'typography': return <Typography {...{ c }} />;
    case 'entity': return <Entity {...{ c, RenderControl, controlComponents }} />;
    default: return <>{JSON.stringify(c)}</>;
  }
});
RenderControl.displayName = `${ DISPLAY_NAME_PREFIX }/__RenderControl`;
