import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Button, Input } from 'reactstrap';
import { Colxx } from '../components/common/CustomBootstrap';
import 'rc-switch/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import axiosInstance from '../helpers/axiosInstance';
import NotificationManager from '../components/common/react-notifications/NotificationManager';
import Loader from './settings/Loader';

const RemoteSession = ({ closeModal, propHandle }) => {
  const [startDateRange, setStartDateRange] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [check, setcheck] = useState(false);
  let [state, setstate] = useState(
    'Paid for new Registrants + Free for Course Enrolled Students.'
  );
  let [fees, setfees] = useState('Paid for Course Enrolled Students');
  let [course, setCourse] = useState([]);
  let [defval] = useState(false);
  let [occurance, setOccurance] = useState('Once');
  let [session_name, setSession_name] = useState('');
  let [description, setDescription] = useState('');
  let [trainer, setTrainer] = useState('');
  let [session_fee, setSession_fee] = useState('');
  const [trainerData, setTrainerData] = useState([
    { value: 'You', label: 'customer_id' },
  ]);
  const [loaded, setLoaded] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(
        error,
        'Create Ondemand Session',
        3000,
        null,
        null,
        ''
      );
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        'Session Created Successfully',
        'Create Live Session',
        3000,
        null,
        null,
        ''
      );
    }
  }, [success]);

  const checkinp = () => setcheck(!check);
  const selectcheck = (e) => setstate((state = e.target.value));
  const selectcheck2 = (e) => setfees((fees = e.target.value));

  useEffect(() => {
    const getTrainerData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/trainer/specific');
        console.log(result);
        if (result.data.success) {
          const trainers = result.data.result.map((doc) => ({
            value: doc.trainer_full_name,
            label: doc.trainer_id,
          }));
          trainers.push({
            value: 'You',
            label: 'customer_id',
          });
          const s = result.data.sessions.map((doc) => ({
            value: doc.session_id,
            label: doc.session_name,
            id: doc.session_id,
            color: '#00B8D9',
          }));
          setSessions(s);
          setTrainerData(trainers);
          setTrainer(trainers[0].value);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to find trainer data');
          }
        }
      } catch (e) {
        console.log(e);
        try {
          setError(e.response.data.error);
        } catch (err) {
          setError('Unable to find trainer data');
        }
      } finally {
        setLoaded(true);
      }
    };
    getTrainerData();
  }, []);

  const validateInput = (values) => {
    if ((check && state == 'Choose Something') || fees === 'Choose Something')
      return { success: 0, error: 'Please provide all information' };
    if (
      check &&
      state !==
        'Free for new Registrants + Free for Course Enrolled Students.' &&
      session_fee <= 0
    )
      return { success: 0, error: 'please provide valid fees' };

    if (!values.session_name)
      return { success: 0, error: 'Please provide a session name' };
    if (!values.description)
      return { success: 0, error: 'Please provide a description' };
    if (!values.startDateRange)
      return { success: 0, error: 'Please provide a start date range' };
    if (!values.duration)
      return { success: 0, error: 'Please provide a duration' };
    if (/\D/.test(values.duration))
      return { success: 0, error: 'Duration must be a number' };
    if (!values.time) return { success: 0, error: 'Please provide time' };
    if (
      !check &&
      fees !== 'Free for Course Enrolled Students' &&
      fees !==
        'Free for new Registrants + Free for Course Enrolled Students.' &&
      session_fee <= 0
    )
      return { success: 0, error: 'Please provide fees' };
    return { success: 1, error: null };
  };

  const onSubmit = () => {
    let session_associated_course_id;
    if (course) {
      session_associated_course_id = course.map((doc) => doc.value);
      session_associated_course_id = session_associated_course_id.toString();
    }

    const values = {
      session_associated_course_id,
      session_name,
      description,
      occurance,
      startDateRange,
      duration,
      time,
      session_fee,
    };
    values.session_fee_type = check ? state : fees;
    values.session_tags = course.map((doc) => doc.label).toString();
    values.session_enable_registration = check ? 1 : 0;
    values.session_trainer_name = trainer;
    trainerData.forEach((doc) => {
      if (doc.value === trainer) values.session_trainer_id = doc.label;
    });
    console.log(values);

    if (
      (!check && fees === 'Free for Course Enrolled Students') ||
      (check &&
        state ===
          'Free for new Registrants + Free for Course Enrolled Students.')
    )
      values.session_fee = 0;

    console.log(state, values, fees);

    const isValid = validateInput(values);
    console.log(values);
    if (!isValid.success) setError(isValid.error);
    else {
      axiosInstance
        .post('/tutor/sessions/createLiveSession', { values })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setError(null);
            setSuccess(true);
            closeModal();
          } else setError(response.data.error);
        })
        .catch((err) => {
          console.log(err);
          try {
            setError(err.response.data.error);
          } catch (error) {
            setError('Create Session Error');
          }
        })
        .then(() => propHandle());
    }
  };
  if (!loaded) return <Loader />;
  return (
    <>
      <FormGroup className="error-l-75">
        <Label>Session Name</Label>
        <Input
          className="form-control"
          name="session_name"
          onChange={(e) => setSession_name(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>

        <Input
          type="textarea"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="error-l-100">
        <Label>Trainer </Label>
        <Input
          type="select"
          name="occurance"
          onChange={(e) => setTrainer(e.target.value)}
          id="exampleSelect"
        >
          {trainerData.map((doc) => (
            <option> {doc.value} </option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup className="error-l-100">
        <Label>Occurance </Label>

        <Input
          type="select"
          name="occurance"
          onChange={(e) => setOccurance(e.target.value)}
          id="exampleSelect"
        >
          <option>Once</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </Input>
      </FormGroup>

      <Row>
        <Colxx xxs="6">
          <FormGroup className="error-l-100">
            <Label>Start Date </Label>

            <Input
              type="date"
              name="date"
              id="exampleDate"
              onChange={(e) => setStartDateRange(e.target.value)}
              placeholder="date"
            />
          </FormGroup>
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="6">
          <FormGroup className="error-l-100">
            <Label for="duration">Duration(in minutes)</Label>

            <Input
              type="number"
              className="form-control"
              name="session_duration"
              onChange={(e) => setDuration(e.target.value)}
            />
          </FormGroup>
        </Colxx>
        <Colxx xxs="6">
          <FormGroup className="error-l-100">
            <Label>Time </Label>
            <Input
              type="time"
              name="time"
              id="time"
              value={time}
              placeholder="Time to start from"
              onChange={(e) => setTime(e.target.value)}
            />
          </FormGroup>
        </Colxx>
      </Row>
      <Row>
        <FormGroup check>
          <Label check>
            Enable Registration for this Session
            <Input
              type="checkbox"
              style={{ marginLeft: '90px' }}
              onChange={checkinp}
            />{' '}
          </Label>
        </FormGroup>
      </Row>
      <br />
      <FormGroup className="error-l-100">
        <Label>Associated with any Course </Label>

        <Select
          isMulti
          name="session_associated_course"
          options={sessions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => setCourse(e)}
        />

        {defval ? (
          <>
            {' '}
            <div
              className="invalid-feedback d-block"
              style={{ marginTop: '45px', marginLeft: '345px', width: '250px' }}
            >
              please Dont leave this field empty
            </div>{' '}
          </>
        ) : null}
      </FormGroup>
      {check ? (
        <>
          <Row>
            <Col md={6}>
              <FormGroup className="error-l-100">
                <Label>Select fees </Label>

                <Input
                  type="select"
                  name="select"
                  onChange={(e) => selectcheck(e)}
                  id="exampleSelect"
                  placeholder="Choose Something"
                  required
                >
                  <option>
                    Paid for new Registrants + Free for Course Enrolled
                    Students.
                  </option>
                  <option>
                    Paid for new Registrants + Paid for Course Enrolled
                    Students.
                  </option>
                  <option>
                    Free for new Registrants + Free for Course Enrolled
                    Students.
                  </option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="error-l-75">
                <Label>Fees</Label>
                {state ==
                'Free for new Registrants + Free for Course Enrolled Students.' ? (
                  <>
                    <Input disabled />{' '}
                  </>
                ) : (
                  <>
                    <Input
                      type="number"
                      className="form-control"
                      name="session_fee"
                      value={session_fee}
                      onChange={(e) => setSession_fee(e.target.value)}
                    />
                  </>
                )}
              </FormGroup>
            </Col>
          </Row>{' '}
        </>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <FormGroup className="error-l-100">
                <Label>Select fees </Label>

                <Input
                  type="select"
                  name="select"
                  onChange={(e) => selectcheck2(e)}
                  id="exampleSelect"
                  placeholder="Choose Something"
                  required
                >
                  <option>Paid for Course Enrolled Students</option>
                  <option>Free for Course Enrolled Students</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="error-l-75">
                <Label>Fees</Label>
                {fees == 'Free for Course Enrolled Students' ? (
                  <Input disabled />
                ) : (
                  <Input
                    type="number"
                    className="form-control"
                    name="session_fee"
                    value={session_fee}
                    onChange={(e) => setSession_fee(e.target.value)}
                  />
                )}
              </FormGroup>
            </Col>
          </Row>
        </>
      )}

      <Button color="primary" type="submit" onClick={onSubmit}>
        Submit
      </Button>
      <Button
        color="primary"
        type="cancel"
        style={{ marginLeft: '30px' }}
        onClick={closeModal}
      >
        Cancel
      </Button>
    </>
  );
};

export default RemoteSession;
