import React from 'react';
import { SessionInstance } from '@decisively-io/interview-sdk';

// @ts-ignore
export const SessionContext = React.createContext<SessionInstance>(null);
export const useSession = () => React.useContext(SessionContext);
