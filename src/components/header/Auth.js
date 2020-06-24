import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthProvider';

export const Auth = () => {
  const { user, signOut } = useAuth();
  const history = useHistory();

  return (
    <>
      {user && (
        <button onClick={() => signOut()} className='ui red google button'>
          <i className='ui user circle icon' />
          Sign Out
        </button>
      )}
      {!user && (
        <button
          onClick={() => history.push('/login')}
          className='ui twitter button'
        >
          <i className='ui user circle icon' />
          Sign In
        </button>
      )}
    </>
  );
};
