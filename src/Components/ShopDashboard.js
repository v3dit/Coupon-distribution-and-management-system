import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { Button, Table, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const handleEditcompany = (companyId) => {
    console.log(`Editing company with ID ${companyId}`);
    alert('We are working on this, please Contact Us to make the necessary changes. Thankyou ;)')
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
    <Container>
      <h1 className="mt-4">Shop Dashboard</h1>
      <h3>Shop Code:{shopCode}</h3>
      <h6>Don't Share this with Anyone</h6>
      <h2>Registered Companies:</h2>
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
                <Button variant="primary" onClick={() => handleEditcompany(company.company_id)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeletecompany(company.company_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ShopDashboard;