import React from 'react';
import { InterviewSession } from './types';

// @ts-ignore
export const SessionContext = React.createContext<InterviewSession>(null);
export const useSession = () => React.useContext(SessionContext);
