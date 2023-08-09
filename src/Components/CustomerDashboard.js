import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import QRCode from 'react-qr-code';

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
    <div>
      <h2>Customer Dashboard</h2>
      <input type="text" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
      <button onClick={handleRegister}>Register to Company</button>
      <div>
        <h3>Available Coupons:</h3>
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div key={coupon.coupon_id}> {/* Add the unique "key" prop */}
              <QRCode value={`${loggedInUser}_${coupon.company_id}_${coupon.coupon_id}_${coupon.coupon_code}`} />
              <p>Coupon Code: {coupon.coupon_code}</p>
              <p>Discount: {coupon.discount}</p>
              <p>Validity: {coupon.validity}</p>
            </div>
          ))
        ) : (
          <p>No coupons available.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
