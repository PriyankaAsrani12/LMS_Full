import React, { useState, useEffect } from 'react';
import { Card, Row, CardBody, Button, FormGroup, CardImg } from 'reactstrap';
import Switch from 'rc-switch';

import { Colxx } from '../../components/common/CustomBootstrap';
import '../Customcss.css';
import EmailCommunication from '../EmailCommunication';
import img from '../bebinca-thumb.jpg';
import axiosInstance from '../../helpers/axiosInstance';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

const Email = () => {
  const [mailonSignup, setMailonSignup] = useState(false);
  const [mailonsignuptheme, setMailonsignuptheme] = useState('1');
  const [purchaseEmail, setPurchaseEmail] = useState(false);
  const [purchaseemailtheme, setPurchaseemailtheme] = useState('1');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/communication/mail');
        if (result.data.success) {
          setMailonSignup(result.data.result.communication_email_signup);
          setPurchaseEmail(result.data.result.communication_email_on_purchase);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to fetch data');
          }
        }
      } catch (error) {
        try {
          setError(error.response.data.error);
        } catch (error) {
          setError('Failed to fetch details');
        }
      }
    };
    getData();
  }, []);
  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Communication Error',
        3000,
        3000,
        null,
        ''
      );
  }, [error]);

  const handleMailonSignup = async (value) => {
    try {
      const values = { field: 'communication_email_signup', value };
      const result = await axiosInstance.put('/tutor/communication', {
        values,
      });
      if (result.data.success) {
        setMailonSignup(value);
      } else {
        try {
          setError(result.data.error);
        } catch (error) {
          setError('Unable to update data');
        }
      }
    } catch (error) {
      try {
        setError(error.response.data.error);
      } catch (error) {
        setError('Failed to update details');
      }
    }
  };

  const handlePurchaseEmail = async (value) => {
    try {
      const values = { field: 'communication_email_on_purchase', value };
      const result = await axiosInstance.put('/tutor/communication', {
        values,
      });
      if (result.data.success) {
        setPurchaseEmail(value);
      } else {
        try {
          setError(result.data.error);
        } catch (error) {
          setError('Unable to update data');
        }
      }
    } catch (error) {
      try {
        setError(error.response.data.error);
      } catch (error) {
        setError('Failed to update details');
      }
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Colxx xs="12" sm="6">
          <h1 id="headingMoS">Mail On Signup</h1>
        </Colxx>
        <Colxx xs="12" sm="6">
          <div
            className="d-flex justify-content-around"
            style={{ maxWidth: '400px' }}
          >
            <FormGroup className="error-l-100">
              <Switch
                className="custom-switch custom-switch-secondary custom-switch-small"
                checked={mailonSignup}
                onChange={(secondary) => {
                  handleMailonSignup(secondary);
                  console.log(secondary);
                }}
              />
            </FormGroup>
          </div>
        </Colxx>
      </Row>
      {mailonSignup ? (
        <Row>
          <Colxx xs="12" sm="6">
            <label>
              <input
                type="radio"
                checked={mailonsignuptheme === '1'}
                value="1"
                onChange={(e) => setMailonsignuptheme(e.target.value)}
              />
              <div className="front-end box">
                <Card
                  className="p-4 mb-3 emailcard"
                  style={{ minWidth: '200px', minHeight: '200px' }}
                >
                  <CardImg
                    top
                    width="100%"
                    src={img}
                    alt="Theme1 img"
                    className="emailimg"
                  />
                  <CardBody>
                    <Button>Edit</Button>
                  </CardBody>
                </Card>
              </div>
            </label>
          </Colxx>
          <Colxx xs="12" sm="6">
            <label>
              <input
                type="radio"
                checked={mailonsignuptheme === '2'}
                value="2"
                onChange={(e) => setMailonsignuptheme(e.target.value)}
              />
            </label>
          </Colxx>
        </Row>
      ) : (
        ''
      )}

      <Row className="mb-3 mt-4">
        <Colxx xs="12" sm="6">
          <h1 id="headingPE">Mail on purchase of Course</h1>
        </Colxx>
        <Colxx xs="12" sm="6">
          <div
            className="d-flex justify-content-around"
            style={{ maxWidth: '400px' }}
          >
            <FormGroup className="error-l-100">
              <Switch
                className="custom-switch custom-switch-secondary custom-switch-small"
                checked={purchaseEmail}
                onChange={(secondary) => {
                  handlePurchaseEmail(secondary);
                }}
              />
            </FormGroup>
          </div>
        </Colxx>
      </Row>
      {purchaseEmail ? (
        <Row>
          <Colxx xs="12" sm="6">
            <label>
              <input
                type="radio"
                checked={purchaseemailtheme === '1'}
                value="1"
                onChange={(e) => setPurchaseemailtheme(e.target.value)}
              />
              <div className="front-end box">
                <Card
                  className="p-4 mb-3 emailcard"
                  style={{ minWidth: '200px', minHeight: '200px' }}
                >
                  <CardImg top width="100%" src={img} alt="Theme1 img" />
                  <Row className="emailtext">
                    <Colxx xxs="4">
                      <span className="hiddenbutton">Preview</span>
                    </Colxx>
                  </Row>
                  <CardBody>
                    <Button>Edit</Button>
                  </CardBody>
                </Card>
              </div>
            </label>
          </Colxx>
          <Colxx xs="12" sm="6">
            <label>
              <input
                type="radio"
                checked={purchaseemailtheme === '2'}
                value="2"
                onChange={(e) => setPurchaseemailtheme(e.target.value)}
              />
              <div className="front-end box"></div>
            </label>
          </Colxx>
        </Row>
      ) : (
        ''
      )}

      <EmailCommunication />
      <br />
      <br />
    </>
  );
};

export default Email;
