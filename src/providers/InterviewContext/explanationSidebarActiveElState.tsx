import debounce from 'lodash.debounce';


export type ExplSidebarActiveElValue = (
  | { active: false }
  | {
    active: true;
    attributeId: string;
    label?: string;
  }
);


export type ExplSidebarActiveElSetNextValue = (nextValue: ExplSidebarActiveElValue) => unknown;

/**
 * to work with active element in explanation sidebar we need several\
 * utilities such as:
 * - "set next value" (just changes state and does nothing else)
 * - "debounced set next value" (tries to set value but in a debounced\
 * way, useful when we want to delay "activating" certain attributeId)
 * - "reset next value immediately and clear any scheduled set next \
 * value calls", which is generally expected to be used when we blur\
 *
 * Ideally this should be handled using a single statefull singleton \
 * instance, but because we are in React-world, and "active" state is used \
 * drive render of the component tree we can't combine those in a single \
 * instance as we would then lose the identity influenced rerenders.\
 * So the next best thing is to have a separation in two: state object \
 * stays isolated and all helper methods to manipulte it are groupped in\
 * a singleton instance, with setNextState function enclosed using constructor\
 * argument.
 *
 * IMPORTANT: I don't use "private" modifier here, because this package is\
 * expected to be installed in other projects and I have had experienced\
 * troubles before because of "private" fields in npm packages with conflicting \
 * versions. So instead an older "__" approach is used to show that properties\
 * should not be used from outside
 *
 * IMPORTANT 2: the general expectation  is to be able to "activate" \
 * certain attribute either on focus or on mouse over (with some delay),\
 * but in reality addition of mouse related interactions make the task\
 * considerably harder, e.g.:
 * - if we have an input focused and then move mouse out of it, while\
 * no blur happens - explanation should stay unchanged
 * - if input is not focused - mouseOut should hide explanation
 * - if one input is focused and mouse enters another one - do we change \
 * disaplyed explanation or leave it as is
 *
 * Because of these for the first iteration of development will focus on \
 * focus/blur related component lifecycle
 */
export class ExplSidebarActiveElMethods {
  __setNextValue: ExplSidebarActiveElSetNextValue;

  debouncedSetNextValue: ReturnType<typeof debounce< ExplSidebarActiveElSetNextValue > >;

  constructor(setNextState: ExplSidebarActiveElMethods['__setNextValue']) {
    this.__setNextValue = setNextState;
    this.debouncedSetNextValue = debounce(nextValue => {
      this.__setNextValue(nextValue);
    }, 700);
  }

  resetNextValueImmediateAndCancelDebounced = () => {
    this.debouncedSetNextValue.cancel();
    this.__setNextValue({ active: false });
  }
}

export type ExplSidebarActiveEl = {
  value: ExplSidebarActiveElValue;
  methods: ExplSidebarActiveElMethods;
};
