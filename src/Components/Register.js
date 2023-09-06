import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './style.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase authentication
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      // Create user data in Real-time Database with name and role
      await database.ref(`users/${user.uid}`).set({
        name: name,
        email: user.email,
        role: role,
      });

      // Registration successful
      console.log('Registration successful');
      setRegistrationSuccess(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (registrationSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor:'#2B4060'}}>
      <Card style={{ minWidth: '40vw', padding:'10px', marginTop:'-10vw' }}>
        <Card.Body>
          <h2>Register</h2>
          <br />
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formRole">
              <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="shop">Shop</option>
                <option value="company">Company</option>
                <option value="customer">Customer</option>
              </Form.Control>
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
