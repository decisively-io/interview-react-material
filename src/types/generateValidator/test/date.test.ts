// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidator2, errMsgs } from '../core';


const tags = ['types', 'generateValidator', 'date', 'NjrTIx1pF1'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidator2({ type: 'date', attribute: '', id: '' });


    [{}, [], false, true, 2023].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message.startsWith('this must be a `string` type')).toBe(true);
      }
    });


    ['2023', '12-10-2023'].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message).toBe(errMsgs.date.format);
      }
    });


    const correctVals = ['', '2023-12-07', '2023-10-11', undefined, null];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
