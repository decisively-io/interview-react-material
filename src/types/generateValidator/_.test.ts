// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../__jest';
import { generateValidator } from './core';


const tags = ['types', 'generateValidator', 'ysMI5vkwlv'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds', () => {
    const validator = generateValidator([
      { type: 'text', attribute: 'textAttr', id: 'textAttrId' },
      { type: 'boolean', attribute: 'boolAttr', id: 'boolAttrId' },
      {
        type: 'entity',
        entity: 'entity1',
        id: 'entity1Id',
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
    ]);

    const incorrectVals = [
      {},
      { textAttr: false },
      { textAttr: '', boolAttr: 123 },
      { textAttr: '', boolAttr: false, entity1: [{}] },
      { textAttr: '', boolAttr: true, entity1: [{ textAttr2: '' }] },
      { textAttr: '', boolAttr: true, entity1: [{ textAttr2: '', '@id': '1' }] },
      {
        textAttr: '',
        boolAttr: true,
        entity1: [
          {
            '@id': '1',
            textAttr2: '',
            entity2: [{ dateAttr1: '' }],
          },
        ],
      },
    ];
    incorrectVals.forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });


    const correctVals = [
      {
        textAttr: '',
        boolAttr: true,
        entity1: [
          {
            '@id': '1',
            textAttr2: '',
            entity2: [{ dateAttr1: '2023-01-01', '@id': '1' }],
          },
        ],
      },
    ];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toStrictEqual(val)
    ));
  });
});
