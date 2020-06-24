import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

import { useAuth } from '../../hooks/AuthProvider';
import { useGlobalError } from '../../hooks/Errors';
import '../login/index.scss';

const SignUp = () => {
  const [firstName, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signup } = useAuth();
  const { errors, setErrors } = useGlobalError();

  useEffect(() => {
    setErrors([]);
  }, [setErrors]);

  function validateForm() {
    return true;
    // return user.username.length > 0 && user.password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const user = {
      firstName,
      username,
      lastName,
      email,
      password,
    };

    signup(user);
  }

  return (
    <>
      <div className='back' />
      <div className='authForm'>
        <h2>Create account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              autoFocus
              required
              type='text'
              value={firstName}
              placeholder='Andre'
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='lastName'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              autoFocus
              type='text'
              value={lastName}
              placeholder='Mendes'
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              required
              type='text'
              value={username}
              placeholder='nickName'
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              required
              type='email'
              value={email}
              placeholder='example@example.com'
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              autoFocus
              required
              type='password'
              value={password}
              placeholder='*********'
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button block disabled={!validateForm()} type='submit'>
            Submit
          </Button>
          {errors.length !== 0 && (
            <p style={{ color: 'red' }}>{errors.map((e) => e)}</p>
          )}
        </Form>
      </div>
    </>
  );
};

export default SignUp;
