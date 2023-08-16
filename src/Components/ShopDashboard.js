import React, { useState } from 'react';
import { database } from '../firebase';
import { QrReader } from 'react-qr-reader';

const ShopDashboard = () => {
  const [customerId, setCustomerId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);

  const handleScan = (data) => {
  console.log("QR Code Data:", data); // Log the data for debugging
    if (data && !qrScanned) {
      setQrScanned(true);

      const [customerId, companyId, couponId, couponCode] = data.split('_');

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
              setQrScanned(false); // Reset qrScanned state if the coupon is invalid
            }
          })
          .catch((error) => {
            console.log('Error fetching coupon:', error.message);
            setQrScanned(false); // Reset qrScanned state on error
          });
      } else {
        console.log('Invalid QR code format.');
        setQrScanned(false); // Reset qrScanned state if the QR code is in an invalid format
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
      setQrScanned(false); // Reset qrScanned state after order is accepted
    } catch (error) {
      console.log('Error accepting order:', error.message);
    }
  };

  const rejectOrder = () => {
    setCustomerId('');
    setCouponCode('');
    setCouponData(null);
    setQrScanned(false); // Reset qrScanned state to restart scanning process
  };

  return (
    <div>
      <h2>Shop Dashboard</h2>
      {customerId ? (
        <div>
          <p>Customer ID: {customerId}</p>
          <p>Coupon Code: {couponCode}</p>
          <button onClick={acceptOrder}>Accept Order</button>
          <button onClick={rejectOrder}>Reject Order</button>
        </div>
      ) : (
        <div>
          {qrScanned ? (
            <div>
              <p>QR code successfully scanned. Please accept or reject the order.</p>
              <button onClick={acceptOrder}>Accept Order</button>
              <button onClick={rejectOrder}>Reject Order</button>
            </div>
          ) : (
            <div>
              <QrReader onError={handleError} onResult={handleScan} style={{ width: '100%' }} />
              <p>Scan the QR code to accept the coupon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
