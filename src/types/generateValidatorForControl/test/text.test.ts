// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidatorForControl2 } from '../core';


const tags = ['types', 'generateValidatorForControl2', 'text', 'ug2XrrQHlR'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidatorForControl2({ type: 'text', id: '', attribute: '' });


    [{}, [], false, true, 123].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message.startsWith('this must be a `string` type')).toBe(true);
      }
    });

    const correctVals = ['', null, undefined, 'test', 'some long value'];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
