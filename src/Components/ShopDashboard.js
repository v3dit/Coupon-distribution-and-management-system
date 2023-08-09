import React, { useState } from 'react';
import { database } from '../firebase';
import {QrReader,useQrReader} from 'react-qr-reader';

const ShopDashboard = () => {
  const [customerId, setCustomerId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);

  const handleScan = (data) => {
    console.log(data);
    if (data) {
      const [customerId, companyId, couponId, couponCode] = data.split('_');
      console.log(customerId);
      if (customerId && companyId && couponId && couponCode) {
        // Check if the coupon exists and is valid
        database
          .ref(`company_coupons/${companyId}/${couponId}`)
          .once('value')
          .then((snapshot) => {
            const couponData = snapshot.val();
            if (couponData && couponData.coupon_code === couponCode && parseInt(couponData.coupon_count) > 0) {
              setCustomerId(customerId);
              setCouponCode(couponCode);
              setCouponData(couponData);
            } else {
              console.log('Invalid coupon.');
            }
          })
          .catch((error) => {
            console.log('Error fetching coupon:', error.message);
          });
      } else {
        console.log('Invalid QR code format.');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const acceptOrder = async () => {
    try {
      // Decrease coupon_count by 1 every time a customer uses a coupon
      await database.ref(`company_coupons/${couponData.company_id}/${couponData.coupon_id}/coupon_count`).transaction((count) => {
        if (count > 0) {
          return count - 1;
        } else {
          return 0;
        }
      });

      // Save order details to the real-time database
      await database.ref(`orders`).push({
        customer_id: customerId,
        coupon_code: couponCode,
        accepted_at: new Date().toISOString(),
      });
      setCouponData(null); // Reset coupon data after accepting the order
    } catch (error) {
      console.log('Error accepting order:', error.message);
    }
  };

  return (
    <div>
      <h2>Shop Dashboard</h2>
      {customerId ? (
        <div>
          <p>Customer ID: {customerId}</p>
          <p>Coupon Code: {couponCode}</p>
          <button onClick={acceptOrder}>Accept Order</button>
        </div>
      ) : (
        <div>
          <QrReader onError={handleError} onResult={handleScan} style={{ width: '0%' }} />
          <p>Scan the QR code to accept the coupon.</p>
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
