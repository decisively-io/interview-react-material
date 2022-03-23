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

export interface Interview {
  status: 'in-progress' |'complete' | 'error';
  // context: {} // see Context page
  // data: {} // See Data page,
  // state: {}, // See State page,
  stages: Step[]
  // screen: {} // See screen page
  sessionId: string;
}
