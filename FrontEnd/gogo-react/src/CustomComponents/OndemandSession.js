import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  Row,
  Card,
  CardBody,
  FormGroup,
  Label,
  Button,
  Input,
  Col,
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { FormikReactSelect } from '../containers/form-validations/FormikFields';
import { Colxx } from '../components/common/CustomBootstrap';
import * as Yup from 'yup';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import RemoteSession from './RemoteSession';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Select from 'react-select';
import axiosInstance from '../helpers/axiosInstance';
import NotificationManager from '../components/common/react-notifications/NotificationManager';
import { DropDownContext } from '../context/DropdownContext';

const initialValues = {
  trainer: [{ value: 'you', label: 'you' }],
  session_name: '',
  session_description: '',
  session_fee: 0,
  timeline: '',
};

const CreatesessionSchema = Yup.object().shape({
  trainer: Yup.array()
    .min(1, 'select this')
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
  session_duration: Yup.number().required('Duration of course is required!'),
  session_name: Yup.string().required('Name of course is required!'),
  session_description: Yup.string().required('Description is required!'),
  session_fee: Yup.number().required('Fees is required'),
});

const options = [{ value: 'you', label: 'You' }];

const OndemandSession = ({ closeModal, propHandle }) => {
  const [checkedSecondarySmall, setCheckedSecondarySmall] = useState(true);
  const [tagsLO, setTagsLO] = useState([]);
  let [select, setselect] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [handleReloadTable] = useContext(DropDownContext);

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
    } else if (success) {
      NotificationManager.success(
        'Session Created Successfully',
        'Create Ondemand Session',
        3000,
        null,
        null,
        ''
      );
    }
  }, [success, error, setError, setSuccess]);

  const takeinput = (e) => {
    setselect((select = e.target.value));
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log(handleReloadTable);
    values.session_tags = tagsLO.toString();
    values.session_trainer_name = JSON.stringify(values.trainer);
    values.session_fee_type = select;

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
      setTimeout(() => {
        //here makerequest fr your session creation
        axiosInstance
          .post('/tutor/sessions/createRecordedSession', { values })
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              setError(null);
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
      }, 1000);
    }
  };

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
            <Label>Trainer </Label>
            <FormikReactSelect
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
            ) : null}
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
