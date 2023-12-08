// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidatorForControl } from '../core';


const tags = ['types', 'generateValidatorForControl2', 'entity', 'DBlNbJTHfy'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidatorForControl({
      type: 'entity',
      id: '',
      entity: '',
      template: [
        { type: 'text', attribute: 'attr1', id: 'text1' },
      ],
    });


    [{}, 123, false, true, ''].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message.startsWith('this must be a `array` type')).toBe(true);
      }
    });

    const correctVals = [[{ attr1: '', '@id': '1' }]];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toStrictEqual(val)
    ));
  });

  test('succeeds (nested 1 level)', () => {
    const validator = generateValidatorForControl({
      type: 'entity',
      entity: 'entity1',
      id: 'entity1Id',
      template: [
        { type: 'text', attribute: 'attrForText', id: 'attrForTextId' },
        {
          type: 'entity',
          entity: 'entity2',
          id: 'entity2Id',
          template: [{ type: 'boolean', attribute: 'attrForBoolean', id: 'attrForBooleanId' }],
        },
      ],
    });


    [
      [{ attrForText: '123' }],
    ].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });


    const correctVals = [
      [
        {
          '@id': '1',
          attrForText: '123',
          entity2: [
            {
              '@id': '1',
              attrForBoolean: false,
            },
          ],
        },
      ],
    ];

    correctVals.forEach(val => (
      expect(validator.validateSync(val)).toBe(val)
    ));
  });
});
