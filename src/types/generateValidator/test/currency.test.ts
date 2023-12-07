// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidator2, errMsgs } from '../core';


const tags = ['types', 'generateValidator', 'currency', 'nYS6T5jjdX'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidator2({ type: 'currency', attribute: '', id: '' });

    const incorrectVals = ['', {}, [], false, true];

    incorrectVals.forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message).toBe(errMsgs.currency);
      }
    });

    const correctVals = [123, 555, undefined, null];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
