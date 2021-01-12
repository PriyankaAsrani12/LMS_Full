import React, { useState, useEffect } from 'react';
import { Card, Input, CardBody, Button } from 'reactstrap';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';

const PaymentDetails = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    customer_payment_full_name: '',
    customer_payment_bank_name: '',
    customer_payment_account_number: '',
    customer_payment_IFSC_code: '',
    customer_payment_bank_address: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(
        error,
        'User Payment Details',
        3000,
        null,
        null,
        ''
      );
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        success,
        'User Payment Details',
        3000,
        null,
        null,
        ''
      );
      setSuccess(null);
    }
  }, [success]);

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getPaymentDetails = async () => {
      try {
        const result = await axiosInstance.get('/tutor/user/payment/details');
        if (result.data.success) setPaymentDetails(result.data.paymentDetails);
        else {
          try {
            setError(result.data.error);
          } catch (e) {
            setError('unable to fetch payment details');
          }
        }
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('unable to fetch payment details');
        }
      }
    };
    getPaymentDetails();
  }, []);
  const handlePaymentDetailsSubmit = async () => {
    try {
      if (
        !paymentDetails.customer_payment_full_name ||
        !paymentDetails.customer_payment_bank_name ||
        !paymentDetails.customer_payment_account_number ||
        !paymentDetails.customer_payment_IFSC_code ||
        !paymentDetails.customer_payment_bank_address
      )
        setError('please fill all fields');
      else if (isNaN(paymentDetails.customer_payment_account_number)) {
        setError('only digits are allowed in account number field');
      } else {
        const values = Object.assign(paymentDetails);
        console.log(values);
        const result = await axiosInstance.post('/tutor/user/payment/details', {
          values,
        });
        if (result.data.success)
          setSuccess('payment details uploaded successfully');
        else setError(result.data.error);
      }
    } catch (err) {
      try {
        setError(err.response.data.error);
      } catch (error) {
        setError('can not upload payment details');
      }
    }
  };
  return (
    <Card className="mx-auto" style={{ width: '50%' }}>
      <CardBody>
        <label>Full name</label>
        <Input
          type="text"
          placeholder="Full name"
          name="customer_payment_full_name"
          value={paymentDetails.customer_payment_full_name}
          onChange={handlePaymentDetailsChange}
        />
        <label className="mt-2">Bank name</label>
        <Input
          type="text"
          placeholder="Bank name"
          name="customer_payment_bank_name"
          value={paymentDetails.customer_payment_bank_name}
          onChange={handlePaymentDetailsChange}
        />
        <label className="mt-2">Account Number</label>
        <Input
          type="text"
          pattern="[0-9]"
          placeholder="Account Number"
          name="customer_payment_account_number"
          value={paymentDetails.customer_payment_account_number}
          onChange={handlePaymentDetailsChange}
        />
        <label className="mt-2">IFSC Code</label>
        <Input
          type="text"
          placeholder="IFSC Code"
          name="customer_payment_IFSC_code"
          value={paymentDetails.customer_payment_IFSC_code}
          onChange={handlePaymentDetailsChange}
        />
        <label className="mt-2">Bank Address</label>
        <Input
          type="text"
          placeholder="Bank Address"
          name="customer_payment_bank_address"
          value={paymentDetails.customer_payment_bank_address}
          onChange={handlePaymentDetailsChange}
        />
        <Button
          type="submit"
          style={{ borderRadius: '0px' }}
          className="mt-4 mx-auto d-flex"
          onClick={handlePaymentDetailsSubmit}
        >
          Submit
        </Button>
      </CardBody>
    </Card>
  );
};

export default PaymentDetails;
