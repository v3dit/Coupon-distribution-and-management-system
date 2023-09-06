import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import QRCode from 'react-qr-code';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';

const CustomerDashboard = ({ loggedInUser }) => {
  const [companyEmail, setCompanyEmail] = useState('');
  const [coupons, setCoupons] = useState([]);

  const handleRegister = async () => {
    try {
      // Get the company ID based on the provided company email
      const companyQuerySnapshot = await database
        .ref('users')
        .orderByChild('email')
        .equalTo(companyEmail)
        .once('value');

      if (!companyQuerySnapshot.exists()) {
        console.log('Company not found.');
      } else {
        let companyId = null;

        // Find the first company with the given email as company user
        companyQuerySnapshot.forEach((snapshot) => {
          const userData = snapshot.val();
          if (userData.role === 'company') {
            companyId = snapshot.key;
            return true; // Stop the loop after finding the first company
          }
        });

        if (companyId) {
          // Register the customer to the company in /company_customers
          const userId = auth.currentUser.uid;
          await database.ref(`company_customers/${companyId}/${userId}`).set(true);
        } else {
          console.log('No company found with the provided email.');
        }
      }
    } catch (error) {
      console.log('Error registering to company:', error.message);
    }
  };

  const fetchCoupons = async (userId) => {
    try {
      const customerCouponsRef = database.ref(`customer_coupons/${userId}`);
      const couponsSnapshot = await customerCouponsRef.once('value');

      if (couponsSnapshot.exists()) {
        const couponsData = couponsSnapshot.val();
        const couponsArray = Object.values(couponsData);
        setCoupons(couponsArray);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.log('Error fetching coupons:', error.message);
    }
  };

  useEffect(() => {
    fetchCoupons(loggedInUser);
  }, [loggedInUser]);

  return (
    <Container>
      <h2>Customer Dashboard</h2>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="companyEmail">
              <Form.Label>Shop Company Id</Form.Label>
              <Form.Control
                type="text"
                value={companyEmail}
                placeholder="Shop Company Id"
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Button variant="primary" onClick={handleRegister}>
              Register to Company
            </Button>
          </Col>
        </Row>
      </Form>
      <div>
        <h3>Available Coupons:</h3>
        {coupons.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>QR Code</th>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Validity</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.coupon_id}>
                  <td>
                    <QRCode
                      value={`https://kupan-34023.web.app/acceptCoupons/${loggedInUser}_${coupon.company_id}_${coupon.coupon_id}_${coupon.coupon_code}`}
                    />
                  </td>
                  <td>{coupon.coupon_code}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.validity}</td>
                  <td>{coupon.coupon_count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No coupons available.</p>
        )}
      </div>
    </Container>
  );
};

export default CustomerDashboard;