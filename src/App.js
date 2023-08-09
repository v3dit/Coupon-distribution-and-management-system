import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import ShopDashboard from './Components/ShopDashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import CompanyDashboard from './Components/CompanyDashboard';
import Login from './Components/Login';
import Register from './Components/Register';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState('');

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
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<ShopDashboard loggedInUser={loggedInUser}/>} />
          <Route path="/company" element={<CompanyDashboard loggedInUser={loggedInUser}/>} />
          <Route path="/customer" element={<CustomerDashboard loggedInUser={loggedInUser}/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
