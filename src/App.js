import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ShopDashboard from './Components/ShopDashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import CompanyDashboard from './Components/CompanyDashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import StartPage from './Components/StartPage';
import AcceptCoupons from './Components/AcceptCoupons';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState('');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route
            path="/login"
            element={<Login setLoggedInUser={setLoggedInUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/shop"
            element={
              loggedInUser ? (
                <div>
                  <ShopDashboard loggedInUser={(loggedInUser)} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/company"
            element={
              loggedInUser ? (
                <div>
                  <CompanyDashboard loggedInUser={(loggedInUser)} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/customer"
            element={
              loggedInUser ? (
                <div>
                  <CustomerDashboard loggedInUser={(loggedInUser)} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/acceptCoupons/*" element={<AcceptCoupons />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
