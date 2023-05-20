import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Layout from './Layout';
import Customer from './Customer';
import Admin from './Admin';
import Cafe from './cafe';
import NoPage from './NoPage';
import CardCompo from './CardCompo';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CardCompo />} />
            <Route path="/Customer" element={<Customer />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Cafe" element={<Cafe />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
