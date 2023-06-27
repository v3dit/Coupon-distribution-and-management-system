import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { auth, firestore } from './firebase';

import AdminDashboard from './Components/AdminDashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import CompanyDashboard from './Components/CompanyDashboard';
import Login from './Components/Login';
import Register from './Components/Register';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const userRef = firestore.collection('users').doc(userId);

        userRef.get().then((snapshot) => {
          const userData = snapshot.data();
          const role = userData.role;
          setUserRole(role);
        });
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

const App = () => {
  return (
    <Router>
      <div>
        <h1>Role-Based Access Control</h1>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<PrivateRoute component={AdminDashboard} roles={['admin']} />} />
          <Route path="/company" element={<PrivateRoute component={CompanyDashboard} roles={['company']} />} />
          <Route path="/customer" element={<PrivateRoute component={CustomerDashboard} roles={['customer']} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
