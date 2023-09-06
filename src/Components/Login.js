import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { Card, Form, Button } from 'react-bootstrap';
import './style.css';


const Login = ({ setLoggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      const userId = auth.currentUser.uid;

      // Fetch user data from Real-time Database
      database.ref(`users/${userId}`).once('value').then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const role = userData.role;
          setUserRole(role);
          setLoginSuccess(true);
          // Pass the userId to the parent component (App.js)
          setLoggedInUser(userId);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loginSuccess && userRole === 'shop') {
    return <Navigate to="/shop" />;
  }

  if (loginSuccess && userRole === 'company') {
    return <Navigate to="/company" />;
  }

  if (loginSuccess && userRole === 'customer') {
    return <Navigate to="/customer" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{backgroundColor:'#2B4060', height: '100vh' }}>
      <Card style={{ minWidth: '40vw', padding:'10px', marginTop:'-10vw' }}>
        <Card.Body>
          <h2>Login</h2>
          <br />
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br />

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <br />
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
