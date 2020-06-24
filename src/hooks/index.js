import React from 'react';
import { AuthProvider } from './AuthProvider';
import { ErrorProvider } from './Errors';

export const AppProvider = ({ children }) => (
  <ErrorProvider>
    <AuthProvider>{children}</AuthProvider>
  </ErrorProvider>
);
