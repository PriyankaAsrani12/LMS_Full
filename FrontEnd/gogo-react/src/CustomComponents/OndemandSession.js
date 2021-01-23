import React, { useState, useEffect } from 'react';
import { Row, FormGroup, Label, Button, Input, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'rc-switch/assets/index.css';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import axiosInstance from '../helpers/axiosInstance';
import NotificationManager from '../components/common/react-notifications/NotificationManager';
import Loader from './settings/Loader';

const CreatesessionSchema = Yup.object().shape({
  // trainer: Yup.object().shape({
  //   label: Yup.string().required(),
  //   value: Yup.string().required(),
  // }),
  session_duration: Yup.number().required('Duration of course is required!'),
  session_name: Yup.string().required('Name of course is required!'),
  session_description: Yup.string().required('Description is required!'),
  session_fee: Yup.number().required('Fees is required'),
});

const OndemandSession = ({ closeModal, propHandle }) => {
  const [checkedSecondarySmall, setCheckedSecondarySmall] = useState(true);
  const [tagsLO, setTagsLO] = useState([]);
  let [select, setselect] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [trainerSelect, setTrainerSelect] = useState([
    { value: 'You', label: 'customer_id' },
  ]);
  const [loaded, setLoaded] = useState(false);
  const [trainerData, setTrainerData] = useState([]);
  const [sessions, setSessions] = useState([]);

  const initialValues = {
    trainer: [],
    session_name: '',
    session_description: '',
    session_fee: 0,
    timeline: '',
  };

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
  }, [error, setError]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        'Session Created Successfully',
        'Create Ondemand Session',
        3000,
        null,
        null,
        ''
      );
    }
  }, [success, setSuccess]);

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
          initialValues.trainer = trainers;
          const s = result.data.sessions.map((doc) => ({
            value: doc.session_id,
            label: doc.session_name,
            id: doc.session_id,
            color: '#00B8D9',
          }));
          setSessions(s);
          setTrainerData(trainers);
          setTrainerSelect(trainers[0].value);
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

  const takeinput = (e) => {
    setselect((select = e.target.value));
  };

  const onSubmit = (values, { setSubmitting }) => {
    values.session_tags = tagsLO.toString();
    values.session_trainer_name = trainerSelect;
    values.session_fee_type = select;

    trainerData.forEach((doc) => {
      if (doc.value === trainerSelect) values.session_trainer_id = doc.label;
    });

    console.log(values);
    if (select == 'Free for Course Enrolled Students') values.session_fee = 0;
    console.log(values);
    if (!select || select === 'Choose Something')
      setError('Select Valid Option From Dropdown');
    else if (
      select === 'Paid for Course Enrolled Students' &&
      (!values.session_fee || values.session_fee <= 0)
    )
      setError('Provide Valid Fees');
    else {
      // setTimeout(() => {
      //here makerequest fr your session creation
      axiosInstance
        .post('/tutor/sessions/createRecordedSession', { values })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setSuccess(true);
            closeModal();
          } else {
            try {
              setError(response.data.error);
            } catch (err) {
              setError('Could not create session');
            }
          }
        })
        .catch((err) => {
          console.log(err);
          try {
            setError(err.response.data.error);
          } catch (error) {
            setError('Could not create session');
          }
        })
        .then(() => propHandle());
      setSubmitting(false);
      // }, 1000);
    }
  };

  if (!loaded) return <Loader />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreatesessionSchema}
      onSubmit={onSubmit}
    >
      {({
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <Form className="av-tooltip tooltip-label-right">
          <FormGroup className="error-l-75">
            <Label>Session Name</Label>
            <Field className="form-control" name="session_name" />
            {errors.session_name && touched.session_name ? (
              <div className="invalid-feedback d-block">
                {errors.session_name}
              </div>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <Field
              className="form-control"
              name="session_description"
              component="textarea"
            />
            {errors.session_description && touched.session_description ? (
              <div className="invalid-feedback d-block">
                {errors.session_description}
              </div>
            ) : null}
          </FormGroup>

          <FormGroup className="error-l-100">
            <Label>Trainer </Label> <br />
            {/* <FormikReactSelect
              name="trainer"
              id="trainer"
              value={values.trainer}
              options={options}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              style={{ fontSize: '20rem' }}
            />
            {errors.trainer && touched.trainer ? (
              <div className="invalid-feedback d-block">{errors.trainer}</div>
            ) : null} */}
            <Input
              type="select"
              name="trainerSelect"
              id="exampleSelect2"
              value={trainerSelect}
              onChange={(e) => {
                console.log(e.target.value);
                setTrainerSelect(e.target.value);
              }}
            >
              {trainerData.map((doc) => (
                <option> {doc.value} </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup className="error-l-100">
            <Label>Seo Tags:</Label>
            <TagsInput
              value={tagsLO}
              onChange={(val) => setTagsLO(val)}
              inputProps={{ placeholder: '' }}
              name="session_tags"
            />
          </FormGroup>

          <FormGroup className="error-l-75">
            <Label>Duration of Course(in days)</Label>
            <Field
              className="form-control"
              name="session_duration"
              disabled={!checkedSecondarySmall}
            />
            {errors.session_duration && touched.session_duration ? (
              <div className="invalid-feedback d-block">
                {errors.session_duration}
              </div>
            ) : null}
          </FormGroup>
          <Row>
            <Col md={6}>
              <Label for="exampleSelect">Select</Label>
              <Input
                type="select"
                name="select"
                onChange={(e) => takeinput(e)}
                id="exampleSelect"
              >
                <option>Choose Something</option>
                <option>Free for Course Enrolled Students</option>
                <option>Paid for Course Enrolled Students</option>
              </Input>
            </Col>
            <Col md={6}>
              <FormGroup className="error-l-75">
                <Label>Fees</Label>
                {select == 'Free for Course Enrolled Students' ? (
                  <Input disabled />
                ) : (
                  <Field className="form-control" name="session_fee" />
                )}
                {errors.session_fee && touched.session_fee ? (
                  <div className="invalid-feedback d-block">
                    {errors.session_fee}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>

          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button
            color="primary"
            style={{ marginLeft: '30px' }}
            type="cancel"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default OndemandSession;
