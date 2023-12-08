// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags } from '../../__jest';
import { normalizeControlsValue } from './core';


const tags = ['types', 'normalizeControlsValue', '5d8aUQxXkX'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds', () => {
    const value = {
      textAttr: '111',
      boolAttr: false,
      entity1: [
        {
          '@id': 'id1',
          textAttr2: '4444',
          entity2: [
            {
              '@id': '2',
              dateAttr1: '2023-01-01',
            },
          ],
        },
      ],
    };

    const result = normalizeControlsValue(
      value,
      [
        { type: 'text', attribute: 'textAttr', id: 'textAttrId' },
        { type: 'boolean', attribute: 'boolAttr', id: 'boolAttrId' },
        {
          type: 'entity',
          entity: 'entity1',
          id: 'entity1Id',
          min: 1,
          template: [
            { type: 'text', attribute: 'textAttr2', id: 'textAttr2Id' },
            {
              type: 'entity',
              entity: 'entity2',
              id: 'entity2Id',
              template: [
                { type: 'date', attribute: 'dateAttr1', id: 'dateAttr1Id' },
              ],
            },
          ],
        },
      ],
    );

    expect(result).toStrictEqual(value);
  });
});
