// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import { describeWithTags, validateOpts } from '../../../__jest';
import { generateValidatorForControl, errMsgs } from '../core';


const tags = ['types', 'generateValidatorForControl2', 'numberOfInstances', 'VOIfRZLY0p'];


describeWithTags(tags, tags.join(', '), () => {
  test('succeeds (simple)', () => {
    const validator = generateValidatorForControl({ type: 'number_of_instances', entity: '', id: '', min: 0 });


    [{}, [], false, true, ''].forEach(val => {
      try {
        validator.validateSync(val, validateOpts);

        expect(null).toBeTruthy();
      } catch (e) {
        if(!(e instanceof Error)) throw e;

        expect(e.message).toBe(errMsgs.numberOfInstances.type);
      }
    });

    const correctVals = [0, 1, 10];
    correctVals.forEach(val => (
      expect(validator.validateSync(val, validateOpts)).toBe(val)
    ));
  });
});
