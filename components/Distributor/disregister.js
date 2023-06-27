import React, { useState } from 'react';
import { auth, firestore } from '../../firebase';

const DisRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase authentication
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      
      // Create user document in Firestore
      await firestore.collection('users').doc(user.uid).set({
        email: user.email,
      });

      // Registration successful, redirect to login page or other page
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/Distributor/login">Login</a>
      </p>
    </div>
  );
};

export default DisRegister;
