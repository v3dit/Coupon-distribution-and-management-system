import React from 'react';
import { useLocation } from 'react-router-dom';

function DisDashboard() {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {email}!</p>
      {/* Rest of the Dashboard component */}
    </div>
  );
}

export default DisDashboard;
