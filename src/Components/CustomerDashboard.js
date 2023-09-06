import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import QRCode from 'react-qr-code';
import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import kupan from './img/kupan.svg';

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
        const couponsArray = Object.values(couponsData).filter((coupon) => {
          return coupon.coupon_count > 0 && new Date(coupon.validity) > new Date();
        });
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
      <h1 className="mt-4">Customer Dashboard</h1>
      <Card className="mt-4">
        <Card.Header><h2>Register to Shop</h2></Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="companyEmail">
                  <Form.Label>Enter Company Email Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyEmail}
                    placeholder="eg. xyz_company@gmail.com"
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Button variant="primary" onClick={handleRegister}>
                  Register
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <div>
        <br />
        <br />
        <h2>Available Coupons</h2>
        {coupons.length > 0 ? (
          <div>
            {coupons.map((coupon) => (
              <div className="kupan-container">
                <img src={kupan} alt="kupan" className="svg-image" />
                <QRCode
                  value={`https://kupan-34023.web.app/acceptCoupons/${loggedInUser}C_C${coupon.company_id}C_C${coupon.coupon_id}C_C${coupon.coupon_code}`} className="qr-code"
                />
                <table className="text-overlay">
                  <tr>
                    <th>Coupon Code:&nbsp;</th>
                    <td>{coupon.coupon_code}</td>
                  </tr>
                  <tr>
                    <th>Discount:</th>
                    <td>{coupon.discount}</td>
                  </tr>
                  <tr>
                    <th>Validity:</th>
                    <td>{coupon.validity}</td>
                  </tr>
                  <tr>
                    <th>Count:</th>
                    <td>{coupon.coupon_count}</td>
                  </tr>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <p>No coupons available.</p>
        )}
      </div>
    </Container>
  );
};

export default CustomerDashboard;