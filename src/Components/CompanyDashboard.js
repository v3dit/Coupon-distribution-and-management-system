import React, { useState, useEffect } from 'react';
import { database } from '../firebase';

const CompanyDashboard = ({ loggedInUser }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [validity, setValidity] = useState('');
  const [couponCount, setCouponCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const companyId = loggedInUser;

  const createCoupon = () => {
    const newCouponRef = database.ref(`company_coupons/${companyId}`).push();
    const couponId = newCouponRef.key;
  
    // Get an array of customer IDs under the company from company_customers node
    database.ref(`company_customers/${companyId}`).once('value').then((snapshot) => {
      if (snapshot.exists()) {
        const customerIds = Object.keys(snapshot.val());
  
        // Create an object to store assigned customers with coupon details
        const assignedCustomers = {};
        customerIds.forEach((customerId) => {
          assignedCustomers[customerId] = true;
        // Add the coupon to customer_coupons
        const customerCouponRef = database.ref(`customer_coupons/${customerId}`).push();
        customerCouponRef.set({
          company_id: companyId,
          coupon_id: couponId,
          coupon_code: couponCode,
          discount,
          validity,
        });
      });
  
        // Save the coupon with the assigned_customers object
        newCouponRef.set({
          coupon_code: couponCode,
          discount,
          validity,
          assigned_customers: assignedCustomers,
          coupon_count: couponCount,
        });
      }
    });
  };
  

const fetchCustomers = () => {
  database.ref(`company_customers/${companyId}`).once('value').then((snapshot) => {
    if (snapshot.exists()) {
      const customerIds = Object.keys(snapshot.val());
      const customerPromises = customerIds.map((customerId) => database.ref(`users/${customerId}`).once('value'));
      Promise.all(customerPromises).then((customerSnapshots) => {
        const customersData = customerSnapshots.map((snapshot) => ({
          customer_id: snapshot.key, // Assuming customer_id is available in the fetched data
          ...snapshot.val(), // Include other customer properties from the fetched data
        }));
        setCustomers(customersData);
      });
    } else {
      setCustomers([]);
    }
  });
};


  useEffect(() => {
    fetchCustomers();
  }, [companyId]);

  return (
    <div>
      <h2>Company Dashboard</h2>
      CODE
      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
      Discount
      <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      Validity
      <input type="date" value={validity} onChange={(e) => setValidity(e.target.value)} />
      Coupon Count
      <input type="number" value={couponCount} onChange={(e) => setCouponCount(e.target.value)} />
      <button onClick={createCoupon}>Create Coupon</button>
      <div>
        <h3>Customers:</h3>
        {customers.map((customer) => (
          <div key={customer.customer_id}>
            <p>Name: {customer.name}</p>
            <p>Email: {customer.email}</p>
            {/* Add other customer details if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDashboard;
