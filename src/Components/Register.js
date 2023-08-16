import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, database } from '../firebase';

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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="shop">Shop</option>
          <option value="company">Company</option>
          <option value="customer">Customer</option>
        </select>
        <br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
