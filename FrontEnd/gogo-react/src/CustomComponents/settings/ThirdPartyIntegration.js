import React, { useState, useEffect } from 'react';
import { Input, Button } from 'reactstrap';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';

const ThirdPartyIntegration = () => {
  const [customer_zoom_jwt_token, setCustomer_zoom_jwt_token] = useState('');
  const [customer_zoom_email, setCustomer_zoom_email] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'Manage Users', 3000, null, null, '');
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        success,
        'Manage Users',
        3000,
        null,
        null,
        ''
      );
      setSuccess(null);
    }
  }, [success]);

  useEffect(() => {
    const getThirdPartyDetails = async () => {
      try {
        const result = await axiosInstance.get('/tutor/user/zoom/token');
        console.log(result);
        if (result.data.success) {
          setCustomer_zoom_email(result.data.customer_zoom_email);
          setCustomer_zoom_jwt_token(result.data.customer_zoom_jwt_token);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('unable to fetch zoom details');
          }
        }
      } catch (err) {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('unable to fetch zoom details');
        }
      }
    };
    // setTimeout(() => {
    getThirdPartyDetails();
    // }, 1500);
  }, [success, error]);

  const handleSubmit = async () => {
    const values = { customer_zoom_email, customer_zoom_jwt_token };
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        customer_zoom_email
      )
    )
      setError('Invalid Email');
    else {
      try {
        const result = await axiosInstance.put('/tutor/user/zoom/token', {
          values,
        });
        if (result.data.success) setSuccess('Details updated successfully');
        else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('unable to update details');
          }
        }
      } catch (err) {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('unable to update zoom details');
        }
      }
    }
  };

  return (
    <>
      <label>Registered Email With Zoom</label>
      <Input
        type="email"
        style={{ width: '30%' }}
        value={customer_zoom_email}
        onChange={(e) => setCustomer_zoom_email(e.target.value)}
      />

      <label>Zoom JWT Token</label>
      <Input
        style={{ width: '30%' }}
        value={customer_zoom_jwt_token}
        onChange={(e) => setCustomer_zoom_jwt_token(e.target.value)}
      />

      <Button className="mt-4" onClick={handleSubmit}>
        Submit
      </Button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};
export default ThirdPartyIntegration;
