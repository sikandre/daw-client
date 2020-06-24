import React from 'react';
import { Route as ReactDOMRoute, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/AuthProvider';

export const Route = ({ isPrivate = false, component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={() => {
        return isPrivate === !!user ? (
          <Component {...rest} />
        ) : (
          <Redirect to={{ pathname: isPrivate ? '/login' : '/projects' }} />
        );
      }}
    />
  );
};
