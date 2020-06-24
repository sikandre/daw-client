import React, { createContext, useState, useContext } from 'react';

const ErroContext = createContext();

export function useGlobalError() {
  const context = useContext(ErroContext);
  if (!context) {
    throw new Error('useDisplayError should be inside a provider');
  }
  return context;
}

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  return (
    <ErroContext.Provider value={{ setErrors, errors }}>
      {children}
    </ErroContext.Provider>
  );
};
