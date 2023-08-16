import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, database } from '../firebase';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
