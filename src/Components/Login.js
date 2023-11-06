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
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    }
    catch (error) {
      setErrorMessage(error.message);
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

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center loginPage" style={{ height: '100vh' }}>
      <Card className='bg-dark' data-bs-theme="dark" style={{ minWidth: '40vw', padding: '10px', marginTop: '-10vw' }}>
        <Card.Body>
          <h2>Login</h2>
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <button
              className='col-2'
              onClick={toggleShowPassword}
              style={{ fontSize: '65%', width: '50px', height: '20px', margin: '5px 5px', background: 'none', color: '#EFEFEF', border: '0px' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errorMessage ? <p className="text-danger" style={{ maxWidth: '30vw', fontSize: "100%", marginBottom: "-1%", cursor: 'pointer' }}>
              {errorMessage.split(":")[1]}</p> : ''}
            <br />
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <br />
          <small>
            Don't have an account? <Link to="/register">Register</Link>
          </small>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
