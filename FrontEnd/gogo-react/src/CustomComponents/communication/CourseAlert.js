import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Input,
  CardBody,
  Button,
  FormGroup,
  CardImg,
  Form,
} from 'reactstrap';
import Switch from 'rc-switch';

import { Colxx } from '../../components/common/CustomBootstrap';
import '../Customcss.css';
import img from '../bebinca-thumb.jpg';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';

const CourseAlert = () => {
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);

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

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          '/tutor/communication/directmessage'
        );
        console.log(result);
        if (result.data.success) {
          const data = result.data.result.map((doc) => ({
            name: doc.session_name,
            id: doc.session_id,
            status: doc.communication_message ? true : false,
            notificationperiod:
              doc.communication_message_days === 999
                ? null
                : doc.communication_message
                ? doc.communication_message_days
                : null,
          }));
          setCourses(data);
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

  const changeCourses = async (index, id) => {
    try {
      const values = {
        communication_message: !courses[index].status,
        session_id: id,
      };
      const result = await axiosInstance.put('/tutor/communication/toggle', {
        values,
      });
      if (result.data.success) {
        const newarray = [...courses];
        newarray[index].status = !newarray[index].status;
        setCourses(newarray);
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

  const changeNotification = (props, e) => {
    const newarray = [...courses];
    newarray[props].notificationperiod = e.target.value;
    setCourses(newarray);
  };

  const handleSubmit = async (id, notificationperiod) => {
    try {
      if (isNaN(notificationperiod) || parseInt(notificationperiod) <= 0)
        setError('Only valid numbers are allowed');
      else {
        const values = {
          session_id: id,
          communication_message: 1,
          communication_message_days: notificationperiod,
        };
        const result = await axiosInstance.put(
          '/tutor/communication/mail/changePeriod',
          { values }
        );
        console.log(result);
        if (result.data.success) {
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to fetch data');
          }
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
    <div style={{ marginBottom: '5rem' }}>
      <h1 className="mb-4 headingCA">Course Alert</h1>

      {courses.map((item, index) => {
        return (
          <>
            <Row key={item.id} className="mb-3 ml-4">
              <Colxx xxs="3" className="ml-4">
                {item.name}
              </Colxx>
              <Colxx xxs="3">
                <FormGroup className="error-l-100">
                  <Switch
                    className="custom-switch custom-switch-secondary custom-switch-small"
                    checked={item.status}
                    onChange={() => {
                      changeCourses(index, item.id);
                    }}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            {item.status ? (
              <Row>
                <Colxx sm="6" md="6">
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
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book.
                    </Card>{' '}
                    <br /> <br />{' '}
                  </>
                </Colxx>
                <Colxx sm="6" md="6">
                  <p>
                    After how many days of inactivity do you want to notify your
                    user
                  </p>
                  <Form>
                    <Input
                      type="num"
                      name="notification"
                      onChange={(e) => {
                        changeNotification(index, e);
                      }}
                      className="mb-3"
                      value={item.notificationperiod}
                    >
                      {item.notificationperiod}
                    </Input>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() =>
                          handleSubmit(item.id, item.notificationperiod)
                        }
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Colxx>
              </Row>
            ) : (
              ''
            )}
          </>
        );
      })}
    </div>
  );
};

export default CourseAlert;
