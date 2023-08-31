import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const AcceptCoupons = () => {
    const [customerId, setCustomerId] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [couponId, setCouponId] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [barista, setBarista] = useState('');
    const [shopCode, setShopCode] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const urlParams = window.location.pathname.split('/acceptCoupons/')[1];
        if (urlParams) {
            const [customerId, companyId, couponId, couponCode] = urlParams.split('_');
            if (customerId && companyId && couponId && couponCode) {
                // Check if the coupon exists and is valid
                database
                    .ref(`company_coupons/${companyId}/${couponId}`)
                    .once('value')
                    .then((snapshot) => {
                        const couponData = snapshot.val();
                        if (couponData && couponData.coupon_code === couponCode && parseInt(couponData.coupon_count[customerId]) > 0) {
                            setCustomerId(customerId);
                            setCouponCode(couponCode);
                            setCouponId(couponId);
                            setCompanyId(companyId);
                            setCouponData(couponData);
                        } else {
                            setAlertMessage('Invalid coupon.');
                        }
                    })
                    .catch((error) => {
                        console.log('Error fetching coupon:', error.message);
                    });
            } else {
                setAlertMessage('Invalid URL parameter format.');
            }
        }
    }, []);

    const acceptOrder = async (customerId, couponData, companyId, couponId) => {
        try {
            if (!customerId || !couponData) {
                setAlertMessage('Invalid customer ID or coupon data.');
                return;
            }

            const matchRef = database.ref(`shop_companies/${shopCode}/${companyId}`);
            const matchSnapShot = await matchRef.once('value');
            const match = matchSnapShot.val();

            if (match === true) {
                // Decrease coupon_count by 1 every time a customer uses a coupon
                await database.ref(`company_coupons/${companyId}/${couponId}/coupon_count/${customerId}`).transaction((count) => {
                    if (count > 0) {
                        const customerCouponRef = database.ref(`customer_coupons/${customerId}`);
                        // Find the coupon object by coupon_id
                        const couponToUpdateRef = customerCouponRef.orderByChild('coupon_id').equalTo(couponId);
                        couponToUpdateRef.once('value', (snapshot) => {
                            snapshot.forEach((childSnapshot) => {
                                const coupon = childSnapshot.val();
                                // Ensure the coupon count is greater than 0
                                if (coupon.coupon_count > 0) {
                                    // Decrease the coupon count by 1
                                    const updatedCouponCount = coupon.coupon_count - 1;

                                    // Update the coupon count in the database
                                    childSnapshot.ref.update({ coupon_count: updatedCouponCount });
                                }
                            });
                        });
                        setAlertMessage('Thanks For Ordering');
                        return count - 1;
                    } else {
                        return 0;
                    }
                });

                // Save order details to the real-time database
                await database.ref(`orders/${companyId}/`).push({
                    company_id: companyId,
                    customer_id: customerId,
                    coupon_code: couponCode,
                    barista: barista,
                    accepted_at: new Date().toISOString(),
                });
            } else {
                setAlertMessage('INVALID INPUT(s)');
            }

            setCustomerId('');
            setCouponCode('');
            setCompanyId('');
            setCouponId('');
            setCouponData(null);
        } catch (error) {
            console.log('Error accepting order:', error.message);
        }
    };

    const rejectOrder = () => {
        setCustomerId('');
        setCouponCode('');
        setCompanyId('');
        setCouponId('');
        setCouponData(null);
        setAlertMessage('Order Rejected');
    };

    return (
        <Container>
            <h2>Shop Dashboard</h2>
            {customerId ? (
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="shopCode">
                                <Form.Label>Enter Shop Code</Form.Label>
                                <Form.Control type="text" placeholder="Enter Shop Code" value={shopCode} onChange={(e) => setShopCode(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="barista">
                                <Form.Label>Enter Your Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Your Name" value={barista} onChange={(e) => setBarista(e.target.value)} required />
                            </Form.Group>
                        </Form>
                        <Button variant="success" onClick={() => acceptOrder(customerId, couponData, companyId, couponId)}>Accept Order</Button>
                        <Button variant="danger" onClick={rejectOrder}>Reject Order</Button>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col>
                        {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}
                        <p>URL parameters are being processed...</p>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default AcceptCoupons;
