import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { Container, Form, Button, Table, Card } from 'react-bootstrap';

const CompanyDashboard = ({ loggedInUser }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [validity, setValidity] = useState('');
  const [couponCount, setCouponCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [shopEmail, setShopEmail] = useState('');
  const companyId = loggedInUser;

  const handleCustomerCheckboxChange = (customerId) => {
    // Toggle the selected state of the customer based on their ID.
    setSelectedCustomers((prevSelectedCustomers) => {
      if (prevSelectedCustomers.includes(customerId)) {
        return prevSelectedCustomers.filter((id) => id !== customerId);
      } else {
        return [...prevSelectedCustomers, customerId];
      }
    });
  };

  const handleSelectAll = () => {
    // If all customers are selected, unselect all. Otherwise, select all.
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer.customer_id));
    }
  };


  const createCoupon = async () => {
    const newCouponRef = database.ref(`company_coupons/${companyId}`).push();
    const couponId = newCouponRef.key;

    const assignedCustomers = {};
    const couponCounts = {};

    customers.forEach((customer) => {
      const customerId = customer.customer_id;
      assignedCustomers[customerId] = selectedCustomers.includes(customerId);
      couponCounts[customerId] = selectedCustomers.includes(customerId) ? couponCount : 0;

      if (selectedCustomers.includes(customerId)) {
        const customerCouponRef = database.ref(`customer_coupons/${customerId}`).push();
        customerCouponRef.set({
          company_id: companyId,
          coupon_id: couponId,
          coupon_code: couponCode,
          discount: discount,
          coupon_count: couponCount,
          validity: validity,
        });
      }
    });

    newCouponRef.set({
      coupon_code: couponCode,
      discount,
      validity,
      assigned_customers: assignedCustomers,
      coupon_count: couponCounts,
    });
  };

  const fetchCustomers = (companyId) => {
    database.ref(`company_customers/${companyId}`).once('value').then((snapshot) => {
      if (snapshot.exists()) {
        const customerIds = Object.keys(snapshot.val());
        const customerPromises = customerIds.map((customerId) => database.ref(`users/${customerId}`).once('value'));
        Promise.all(customerPromises).then((customerSnapshots) => {
          const customersData = customerSnapshots.map((snapshot) => ({
            customer_id: snapshot.key,
            ...snapshot.val(),
          }));
          setCustomers(customersData);
        });
      } else {
        setCustomers([]);
      }
    });
  };

  const handleEditCustomer = (customerId) => {
    console.log(`Editing customer with ID ${customerId}`);
    alert('We are working on this, please Contact Us to make the necessary changes. Thankyou ;)')
  };

  const handleDeleteCustomer = async (customerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      console.log(`Deleting customer with ID ${customerId}`);
      try {
        const deletingRef = database.ref(`company_customers/${companyId}`);
        const deletingSnapshot = await deletingRef.once('value');
        deletingSnapshot.ref.child(customerId).remove(); // Use .ref.child(customerId).remove() to delete a specific child.
      }
      catch (error) {
        alert(`${error.message}`);
      }
    }
  };
  

  useEffect(() => {
    fetchCustomers(companyId);
  }, [companyId]);

  const handleRegister = async () => {
    try {
      const shopQuerySnapshot = await database
        .ref('users')
        .orderByChild('email')
        .equalTo(shopEmail)
        .once('value');

      if (!shopQuerySnapshot.exists()) {
        console.log('Company not found.');
      } else {
        let shopId = null;

        shopQuerySnapshot.forEach((snapshot) => {
          const userData = snapshot.val();
          if (userData.role === 'shop') {
            shopId = snapshot.key;
            return true;
          }
        });

        if (shopId) {
          const userId = auth.currentUser.uid;
          const lastThreeChars = shopId.substring(0, 3) + shopId.slice(-3);
          await database.ref(`shop_companies/${lastThreeChars}/${userId}`).set(true);
        } else {
          console.log('No Shop found with the provided email.');
        }
      }
    } catch (error) {
      console.log('Error registering to company:', error.message);
    }
  };

  return (
    <Container>
      <h2 className="mt-4">Company Dashboard</h2>

      <Card className="mt-4">
        <Card.Body>
          <h2>Create Coupon</h2>
          <Form>
            <Form.Group controlId="couponCode">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Discount Percentage"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="validity">
              <Form.Label>Validity</Form.Label>
              <Form.Control
                type="date"
                placeholder="Validity"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="couponCount">
              <Form.Label>Coupon Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="No. of Coupons"
                value={couponCount}
                onChange={(e) => setCouponCount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="assignCustomers">
              <Form.Label>Assign Coupons to Customers</Form.Label>
              <Form.Check
                type="checkbox"
                label="Select All"
                checked={selectedCustomers.length === customers.length}
                onChange={handleSelectAll}
              />
            </Form.Group>
            {customers.map((customer) => (
              <Form.Check
                key={customer.customer_id}
                type="checkbox"
                label={customer.name}
                checked={selectedCustomers.includes(customer.customer_id)}
                onChange={() => handleCustomerCheckboxChange(customer.customer_id)}
              />
            ))}
            <Button variant="primary" onClick={createCoupon}>
              Create Coupon
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h3>Customers:</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Button variant="info" onClick={() => handleEditCustomer(customer.customer_id)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteCustomer(customer.customer_id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h1>Register to Shop</h1>
          <Form>
            <Form.Group controlId="shopEmail">
              <Form.Label>Shop Email Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="Shop Email Id"
                value={shopEmail}
                onChange={(e) => setShopEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={handleRegister}>Send Request</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CompanyDashboard;