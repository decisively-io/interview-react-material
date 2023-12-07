// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidator2, errMsgs } from '../core';


const tags = ['types', 'generateValidator', 'options', 'GVjkwW8Fpu'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidator2({ type: 'options', id: '', attribute: '', enum_id: '', options: [] });


    [{}, [], 123].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message).toBe(errMsgs.options.type);
      }
    });

    const correctVals = [false, true, '', null, undefined, 'test', 'some long value'];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
