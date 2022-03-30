// eslint-disable-next-line import/no-extraneous-dependencies
import produce from 'immer';
import { Control } from './controls';


export interface Step {
  /**  Unique ID of the screen */
  id: string;
  /** Title of the step. The screen may have a different title, so this title is intended for any menu UI */
  title: string;
  /**  See the context page for more info */
  context: {
    entity: string,
    id?: string,
    parent?: string
  },
  /**  Whether the step is the current step of the interview. Only one step is marked current at any time */
  current: boolean,
  /**  Is the screen complete, that is has data been provided for the attributes in this step? A step will also be marked complete only when all of it's sub-steps are complete */
  complete: boolean,
  /**  Has this step been visited by the user. A screen is marked as visited when either data is submitted from it or the user navigates away from it. A screen is not 'visited' until the user leaves it - so the current screen will always be marked as visited: false (unless it had been previously visited) */
  visited: boolean,
  /**  True if the screen was skipped due to relevancy or conditional rules. The user cannot navigate to this screen */
  skipped: boolean,
  /**  Whether a user can navigate to this screen. Some screens only exist as grouping of other screens (eg: just a header and some context info). */
  visitable: boolean
  steps: Step[]
}

/**
 * NOTE, this function mutates parameters because we use it
 * with 'produce' from immer, so everything is still immutable
 */
function innerSetCurrent(s: Step, id: Step[ 'id' ]): typeof s {
  if(s.steps.length !== 0) {
    s.steps.forEach(s => innerSetCurrent(s, id));
  }

  // eslint-disable-next-line no-param-reassign
  s.current = s.id === id;

  return s;
}

export const setCurrentInStep = (s: Step, id: Step[ 'id' ]): typeof s => (
  produce(s, draft => innerSetCurrent(draft, id))
);


export function containsCurrentStep(s: Step): boolean {
  return s.current || s.steps.some(s => containsCurrentStep(s));
}

export function getCurrentStep(s: Step): typeof s | null {
  if(s.current) return s;
  if(s.steps.length === 0) return null;

  return s.steps.reduce< typeof s | null >(
    (a, s) => (a === null ? getCurrentStep(s) : a),
    null,
  );
}

// ===================================================================================


export interface Screen {
  /** The title of the screen. This may differ from the title in the step */
  title: string,
  id: string,
  controls: Control[]
}


// ===================================================================================


export interface Interview {
  status: 'in-progress' |'complete' | 'error';
  // context: {} // see Context page
  // data: {} // See Data page,
  // state: {}, // See State page,
  stages: Step[]
  screen: Screen;
  sessionId: string;
}
