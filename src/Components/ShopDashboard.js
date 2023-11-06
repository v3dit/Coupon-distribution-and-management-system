import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, NavbarText } from 'reactstrap';

import Background from "./img/background.png";

const ShopDashboard = ({ loggedInUser }) => {
  const [companies, setCompanies] = useState([]);
  const shopCode = loggedInUser.substring(0, 3) + loggedInUser.slice(-3);

  const fetchCompanies = (shopCodeW) => {
    database.ref(`shop_companies/${shopCodeW}`).once('value').then((snapshot) => {
      if (snapshot.exists()) {
        const companyIds = Object.keys(snapshot.val());
        const companyPromises = companyIds.map((companyId) => database.ref(`users/${companyId}`).once('value'));
        Promise.all(companyPromises).then((companiesnapshots) => {
          const companiesData = companiesnapshots.map((snapshot) => ({
            company_id: snapshot.key,
            ...snapshot.val(),
          }));
          setCompanies(companiesData);
        });
      } else {
        setCompanies([]);
      }
    });
  };

  const handleEditcompany = async (companyId) => {
    try {
      const dataSnapshot = await database.ref(`shop_companies/${shopCode}/${companyId}`).once('value');
      if (dataSnapshot.exists()) {
        const currentPermission = dataSnapshot.val();
        if(currentPermission){
          database.ref(`shop_companies/${shopCode}/${companyId}`).set(false);
          alert(`Company DISANABLED`);
        }
        else{
          database.ref(`shop_companies/${shopCode}/${companyId}`).set(true);
          alert('Company ENANABLED');
        }
      } else {
        alert('Company with the specified ID does not exist.');
      }
    } catch (error) {
      alert('Error fetching company data:', error);
      alert('An error occurred while fetching company data. Please try again later.');
    }
  };
  

  const handleDeletecompany = async (companyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (confirmDelete) {
      console.log(`Deleting company with ID ${companyId}`);
      try {
        const deletingRef = database.ref(`shop_companies/${shopCode}`);
        const deletingSnapshot = await deletingRef.once('value');
        deletingSnapshot.ref.child(companyId).remove(); // Use .ref.child(companyId).remove() to delete a specific child.
      }
      catch (error) {
        alert(`${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchCompanies(shopCode);
  }, [shopCode]);

  return (
    <div className='bg-dark' data-bs-theme="dark" style={{ width: "100%", padding: '10px', minHeight: "100vh", backgroundImage: `url(${Background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <Navbar className='bg-dark d-flex p-3'>
        <NavbarText>Shop Dashboard</NavbarText>
      </Navbar>
      <br />
      <h3 style={{ color: 'lightgrey' }}>Shop Code:</h3>
      <h1 style={{ color: 'black' }}>{shopCode}</h1>
      <h5 style={{ color: '#bb2124' }}>Don't Share this with Anyone</h5>
      <br />
      <h2 style={{ color: 'lightgrey' }}>Registered Companies:</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.company_id}>
              <td>{company.name}</td>
              <td>{company.email}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditcompany(company.company_id)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeletecompany(company.company_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ShopDashboard;