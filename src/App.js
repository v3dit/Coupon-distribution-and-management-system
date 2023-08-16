import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ShopDashboard from './Components/ShopDashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import CompanyDashboard from './Components/CompanyDashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import StartPage from './Components/StartPage';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState('');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<ShopDashboard loggedInUser={loggedInUser} />} />
          <Route path="/company" element={<CompanyDashboard loggedInUser={loggedInUser} />} />
          <Route path="/customer" element={<CustomerDashboard loggedInUser={loggedInUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
