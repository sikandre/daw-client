import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/AuthProvider';
import { useGlobalError } from '../../hooks/Errors';
import './index.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const { errors, setErrors } = useGlobalError();

  useEffect(() => {
    setErrors([]);
  }, [setErrors]);

  useEffect(() => {
    if (errors) {
      setUsername('');
      setPassword('');
    }
  }, [errors]);

  function handleSubmit(event) {
    event.preventDefault();

    const user = {
      username,
      password,
    };

    signIn(user);
    setErrors([]);
  }

  return (
    <>
      <div className='back' />
      <div className='authForm'>
        {errors.length !== 0 && (
          <p style={{ color: 'red' }}>{errors.map((e) => e)}</p>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              required
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              type='password'
            />
          </Form.Group>
          <Button block type='submit'>
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Login;
