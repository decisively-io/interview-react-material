// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidator2 } from '../core';


const tags = ['types', 'generateValidator', 'boolean', 'nvH4MuhZtJ'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidator2({ type: 'boolean', attribute: '', id: '' });

    const invalid = ['', {}, [], 123];

    invalid.forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message.startsWith('this must be a `boolean` type')).toBe(true);
      }
    });

    const valid = [true, false, null, undefined];
    valid.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
