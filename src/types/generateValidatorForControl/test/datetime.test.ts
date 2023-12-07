// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidatorForControl2, errMsgs } from '../core';


const tags = ['types', 'generateValidatorForControl2', 'datetime', 'nFWMoSuqgx'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidatorForControl2({ type: 'datetime', attribute: '', id: '' });


    [{}, [], false, true, 2023].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message.startsWith('this must be a `string` type')).toBe(true);
      }
    });


    ['12', 'HH:mm:ss', '25:99:99'].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message).toBe(errMsgs.dateTime.format);
      }
    });


    const correctVals = ['', '2023-01-01 12:29:00', '2020-01-02 19:33:01', undefined, null];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
