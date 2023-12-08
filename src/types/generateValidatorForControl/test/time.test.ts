// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidatorForControl, errMsgs } from '../core';


const tags = ['types', 'generateValidatorForControl2', 'time', 'twXm2OGvzh'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidatorForControl({ type: 'time', attribute: '', id: '' });


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

        expect(e.message).toBe(errMsgs.time.format);
      }
    });


    const correctVals = ['', '12:33:00', '23:11:19', undefined, null];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
