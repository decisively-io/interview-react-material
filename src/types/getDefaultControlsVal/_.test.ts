// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags } from '../../__jest';
import { deriveDefaultControlsValue } from './core';


const tags = ['types', 'deriveDefaultControlsValue', 'pnRfLxZikJ'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds', () => {
    const value = deriveDefaultControlsValue([
      { type: 'text', attribute: 'textAttr', id: 'textAttrId', value: '123' },
      { type: 'boolean', attribute: 'boolAttr', id: 'boolAttrId', default: false },
      {
        type: 'entity',
        entity: 'entity1',
        id: 'entity1Id',
        min: 1,
        template: [
          { type: 'text', attribute: 'textAttr2', id: 'textAttr2Id', default: '5555' },
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
    ]);

    expect(value.textAttr).toBe('123');
    expect(value.boolAttr).toBe(false);
    expect(Array.isArray(value.entity1)).toBe(true);
    expect(value.entity1.length).toBe(1);

    const { '@id': id, textAttr2, entity2 } = value.entity1[ 0 ];
    expect(typeof id === 'string').toBe(true);
    expect(textAttr2).toBe('5555');
    expect(entity2).toStrictEqual([]);
  });
});
