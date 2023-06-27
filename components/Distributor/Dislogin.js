import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase';

const DisLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Login successful, set login status to true
      setLoggedIn(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loggedIn) {
    // Redirect to Dashboard page
    return <Navigate replace to="/Distributor/Dashboard" />;
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/Distributor/register">Register</a>
      </p>
    </div>
  );
};

export default DisLogin;
