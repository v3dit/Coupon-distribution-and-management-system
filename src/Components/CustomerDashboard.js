import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import QRCode from 'react-qr-code';
import { Button, Col, Form, Row, Card, Navbar, NavItem } from 'react-bootstrap';
import { NavbarText } from 'reactstrap';

import kupan from './img/kupan.svg';
import Background from "./img/background.png";


const CustomerDashboard = ({ loggedInUser }) => {
  const [companyEmail, setCompanyEmail] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [Tab, SetTab] = useState('Available Coupons');

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
          await database.ref(`company_customers/${companyId}/${userId}`).set(false);
          alert("Your Registration Request Is Sent To Your Company")
        } else {
          alert('No company found with the provided email.');
        }
      }
    } catch (error) {
      console.log('Error registering to company:', error.message);
    }
  };

  // const fetchCoupons = async (userId) => {
  //   try {
  //     const customerCouponsRef = database.ref(`customer_coupons/${userId}`);
  //     const couponsSnapshot = await customerCouponsRef.once('value');

  //     if (couponsSnapshot.exists()) {
  //       const couponsData = couponsSnapshot.val();
  //       const couponsArray = Object.values(couponsData).filter((coupon) => {
  //         return coupon.coupon_count > 0 && new Date(coupon.validity) > new Date();
  //       });
  //       setCoupons(couponsArray);
  //     } else {
  //       setCoupons([]);
  //     }
  //   } catch (error) {
  //     console.log('Error fetching coupons:', error.message);
  //   }
  // };

  useEffect(() => {
    try {
      const customerCouponsRef = database.ref(`customer_coupons/${loggedInUser}`);
      customerCouponsRef.on('value', (snapshot) => {
        const couponsData = snapshot.val();
        if (couponsData) {
          const couponsArray = Object.values(couponsData).filter((coupon) => {
            return coupon.coupon_count > 0 && new Date(coupon.validity) > new Date();
          });
          setCoupons(couponsArray);
        } else {
          setCoupons([]);
        }
      });

      return () => customerCouponsRef.off('value');
    }
    catch (error) {
      console.log('Error fetching coupons:', error.message);
    }
  }, [loggedInUser]);

  const ChangeTab = (selectedTab) => {
    SetTab(selectedTab)
  }

  return (
    <div className='bg-dark' data-bs-theme="dark" style={{ width: "100%", minHeight: "100vh", backgroundImage: `url(${Background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <Navbar className='bg-dark d-flex p-3'>
        <NavbarText>Customer Dashboard</NavbarText>
        <NavItem className='m-1'><Button onClick={() => ChangeTab("Available Coupons")} variant='dark'>Available Coupons</Button></NavItem>
        <NavItem className='m-1'><Button onClick={() => ChangeTab("Register")} variant='dark'>Register</Button></NavItem>
      </Navbar>

      {Tab === "Available Coupons" ? (
        <div>
          {coupons.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {coupons.map((coupon, index) => (
                <div className="kupan-container" key={index}>
                  <img src={kupan} alt="kupan" className="svg-image" />
                  <QRCode
                    value={`https://kupan-34023.web.app/acceptCoupons/${loggedInUser}C_C${coupon.company_id}C_C${coupon.coupon_id}C_C${coupon.coupon_code}`} className="qr-code"
                  />
                  <table className="text-overlay">
                    <tbody>
                      <tr>
                        <th>Coupon Code:&nbsp;</th>
                        <td><p style={{width: '125px', overflow: 'auto', padding: '0px', margin: '0px'}}>{coupon.coupon_code}</p></td>
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
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p>No coupons available.</p>
          )}
        </div>
      ) : (
        <Card className="m-4">
          <Card.Header><h2>Register</h2></Card.Header>
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
      )
      }
    </div>
  );
};

export default CustomerDashboard;