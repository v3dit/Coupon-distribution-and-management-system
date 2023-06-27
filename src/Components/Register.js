import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase authentication
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      // Create user document in Firestore with role
      await firestore.collection('users').doc(user.uid).set({
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="company">Company</option>
          <option value="customer">Customer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
