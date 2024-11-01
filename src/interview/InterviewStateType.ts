import type { ExplSidebarActiveEl } from '../providers/InterviewContext/explanationSidebarActiveElState';

export interface InterviewState {
  backDisabled: boolean;
  isSubmitting: boolean;
  isRequestPending: boolean;
  nextDisabled: boolean;
  explSidebarActiveElValue: ExplSidebarActiveEl['value'];
}
