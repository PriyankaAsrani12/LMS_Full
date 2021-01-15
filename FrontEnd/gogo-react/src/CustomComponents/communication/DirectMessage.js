import React, { useState, useEffect } from 'react';
import { Card, Row } from 'reactstrap';
import Switch from 'rc-switch';

import '../Customcss.css';
import CourseAlert from './CourseAlert';
import axiosInstance from '../../helpers/axiosInstance';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

const DirectMessage = () => {
  const [emailontext, setemailontext] = useState(false);
  const [emailontext2, setemailontext2] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/communication/message');
        if (result.data.success) {
          setemailontext(result.data.result.communication_message_signup);
          setemailontext2(result.data.result.communication_message_purchase);
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

  const handleEmailOnText = async (value) => {
    try {
      const values = { field: 'communication_message_signup', value };
      const result = await axiosInstance.put('/tutor/communication', {
        values,
      });
      if (result.data.success) {
        setemailontext(value);
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

  const handleEmailOnText2 = async (value) => {
    try {
      const values = { field: 'communication_message_purchase', value };
      const result = await axiosInstance.put('/tutor/communication', {
        values,
      });
      if (result.data.success) {
        setemailontext2(value);
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
      <Row>
        <h4 className="ml-4">Text Message on Signup</h4>
        <Switch
          className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
          style={{ marginRight: '400px' }}
          checked={emailontext}
          onChange={() => {
            handleEmailOnText(!emailontext);
            //   setemailontext(!emailontext)
          }}
        />
      </Row>
      {emailontext ? (
        <>
          {' '}
          <Card
            body
            style={{ width: '60%', marginLeft: '80px', marginTop: '20px' }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Card>{' '}
          <br /> <br />{' '}
        </>
      ) : null}
      <Row className="mt-4">
        <h4 className="ml-4">Text message on Purchase of Course</h4>
        <Switch
          className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
          style={{ marginRight: '400px' }}
          checked={emailontext2}
          onChange={() => handleEmailOnText2(!emailontext2)}
        />
      </Row>
      {emailontext2 ? (
        <>
          {' '}
          <Card
            body
            style={{ width: '60%', marginLeft: '80px', marginTop: '20px' }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Card>{' '}
          <br /> <br />{' '}
        </>
      ) : null}
      <br />
      <br />
      <CourseAlert />
      {/* <Row>
        <Col md={6} xs={12}>
          <Row className="mt-4 ml-4">
            <h4 className="ml-4">Angular 8</h4>
            <Switch
              className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
              style={{ marginRight: '400px' }}
              checked={emailontext3}
              onChange={() => setemailontext3(!emailontext3)}
            />
          </Row>
          {emailontext3 ? (
            <>
              {' '}
              <Card
                body
                style={{
                  width: '60%',
                  marginLeft: '80px',
                  marginTop: '20px',
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Card>{' '}
              <br /> <br />{' '}
            </>
          ) : null}
          <Row className="mt-4 ml-4">
            <h4 className="ml-4">ReactJs</h4>
            <Switch
              className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
              style={{ marginRight: '400px' }}
              checked={emailontext4}
              onChange={() => setemailontext4(!emailontext4)}
            />
          </Row>
          {emailontext4 ? (
            <>
              {' '}
              <Card
                body
                style={{
                  width: '60%',
                  marginLeft: '80px',
                  marginTop: '20px',
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Card>{' '}
              <br /> <br />{' '}
            </>
          ) : null}{' '}
          <br />
          <br />
          <br />
          <br />
          <br />
        </Col>
        <Col md={6} xs={12}>
          {emailontext3 ? (
            <>
              <br />
              <br />
              <label style={{ fontSize: '15px' }}>
                After how many days of inactivity do you want to notify your
                students?
              </label>
              <Input placeholder="" />
              <Button
                className="ml-auto mr-auto d-flex mt-3"
                style={{ borderRadius: '0px' }}
              >
                Submit
              </Button>
            </>
          ) : null}
          {emailontext4 ? (
            <>
              <br />
              <br />
              <br />
              <br />
              <label style={{ fontSize: '15px' }}>
                After how many days of inactivity do you want to notify your
                students?
              </label>
              <Input placeholder="" />
              <Button
                className="ml-auto mr-auto d-flex mt-3"
                style={{ borderRadius: '0px' }}
              >
                Submit
              </Button>
            </>
          ) : null}
        </Col>
      </Row> */}
    </>
  );
};

export default DirectMessage;
