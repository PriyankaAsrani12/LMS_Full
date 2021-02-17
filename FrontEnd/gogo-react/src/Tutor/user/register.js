import React, { useState, useEffect } from 'react';
import './auth.css';
import {
  Row,
  Card,
  CardTitle,
  FormGroup,
  Label,
  Button,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
} from 'reactstrap';
import * as Yup from 'yup';
import Logo from './logo.png';
import { NavLink } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { registerUser } from '../../redux/actions';
import { Formik, Form, Field } from 'formik';
import IntlMessages from '../../helpers/IntlMessages';
import Google from './google.png';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NotificationManager } from '../../components/common/react-notifications';
import { useHistory } from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from './utils/refreshTokenSetup';
import { registerUserError } from '../../redux/auth/actions';
import axiosInstance from '../../helpers/axiosInstance';

const queryString = require('query-string');
const initialValues = {
  customer_first_name: '',
  customer_email: '',
  customer_phone_number: '',
  customer_last_name: '',
  customer_password: '',
  customer_password_confirm: '',
  customer_institute_name: '',
  customer_subdomain_name: '',
  acceptTerms: false,
};

const validation = Yup.object().shape({
  customer_institute_name: Yup.string()
    .min(2, 'please enter correct insitute')
    .max(50, 'please enter correct institute')
    .required('insitute name is required'),
  customer_subdomain_name: Yup.string()
    .min(2, 'Subdomain should be min 2 characters')
    .max(50, 'please enter correct subdomian')
    .required('Subdomain is required'),
  customer_first_name: Yup.string()
    .min(2, 'please enter correct name')
    .max(20, 'please enter correct name')
    .required('Name is required'),
  customer_phone_number: Yup.number()
    .typeError('Must specify a number')
    .positive('Please enter correct mobile')
    .required('Required')
    .nullable(),
  customer_email: Yup.string()
    .min(7, 'Email should be min 7 characters')
    .required('Email is required'),
  acceptTerms: Yup.bool().oneOf(
    [true],
    'Accept Terms & Conditions is required'
  ),
  customer_last_name: Yup.string()
    .min(2, 'please enter correct name')
    .max(20, 'please enter correct name')
    .required('Name is required'),
  customer_password: Yup.string()
    .min(8, 'min 8 characters')
    .max(100, 'please enter correct password')
    .required('Password is required'),
  customer_password_confirm: Yup.string()
    .oneOf([Yup.ref('customer_password'), null], 'Passwords must match')
    .required('Please Confirm password'),
  // institutename: Yup.string()
  //  .min(2, "please enter correct insitute")
  //  .max(50, "please enter correct institute")
  //   .required("insitute name is required")
});

const Register = ({ loading, error, registerUserAction, ...props }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isTrainer, setIsTrainer] = useState(false);
  const [registerTrainerError, setRegisterTrainerError] = useState(null);
  const [registerTrainerSuccess, setRegistertrainerSuccess] = useState(null);
  const [clicked, setIsClicked] = useState(false);

  const toggleClick = () => {
    console.log('in toggle click');
    setIsClicked(!clicked);
  };
  const onSubmit = async (values) => {
    console.log(values);
    setIsClicked(true);
    if (!isTrainer) registerUserAction({ history, values, toggleClick });
    else {
      console.log(values);
      try {
        values.invited_user_role = queryString.parse(
          props.location.search
        ).user_role;
        values.customer_id = queryString.parse(
          props.location.search
        ).customer_id;
        const result = await axiosInstance.post('/tutor/invite/trainer', {
          values,
        });
        console.log(result);
        if (result.data.success) history.push('/app/dashboard');
        else {
          setIsClicked(!clicked);
          try {
            setRegisterTrainerError(result.data.error);
          } catch (error) {
            setRegisterTrainerError('Unable to Register');
          }
        }
      } catch (err) {
        setIsClicked(!clicked);
        console.log(err);
        try {
          setRegisterTrainerError(err.response.data.error);
        } catch (err) {
          setRegisterTrainerError('Unable to Register');
        }
      }
    }
  };

  const onSuccess = (res) => {
    // console.log('login success', res.profileObj);
    refreshTokenSetup(res);
    console.log(
      res.profileObj.name,
      res.profileObj.email,
      res.profileObj.imageUrl
    );
    const data = {
      first_name: res.profileObj.name,
      last_name: res.profileObj.name.substr(
        res.profileObj.name.indexOf(' ') + 1
      ),
      email: res.profileObj.email,
      imageUrl: res.profileObj.imageUrl,
    };
    history.push({
      pathname: '/Tutor/user/domainregistration',
      state: { data },
    });
  };
  const onFailure = (err) => {
    dispatch(registerUserError(err.error || 'unable to register'));
    console.log(err);
  };
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId: process.env.REACT_APP_CLIENT_ID,
    isSignedIn: false,
    accessType: 'offline',
  });

  useEffect(() => {
    if (error) {
      NotificationManager.warning(
        error,
        'Registeration Error',
        3000,
        null,
        null,
        ''
      );
      setIsClicked(false);
    }
  }, [error]);

  useEffect(() => {
    if (registerTrainerError)
      NotificationManager.warning(
        registerTrainerError,
        'Register Trainer Error',
        3000,
        null,
        null,
        ''
      );
  }, [registerTrainerError]);

  useEffect(() => {
    if (registerTrainerSuccess)
      NotificationManager.success(
        registerTrainerSuccess,
        'Register Trainer success',
        3000,
        null,
        null,
        ''
      );
  }, [registerTrainerSuccess]);

  useEffect(() => {
    const string = props.location.search;
    console.log(props.location.search, '\n\n', props.location.query);
    var parsed = queryString.parse(props.location.search);
    // console.log(parsed.email, parsed.first_name);
    try {
      initialValues.customer_first_name = parsed.first_name;
      initialValues.customer_email = parsed.email;
      initialValues.customer_last_name = parsed.last_name;

      if (
        initialValues.customer_first_name &&
        initialValues.customer_email &&
        initialValues.customer_last_name
      ) {
        initialValues.customer_institute_name = 'No need to specify';
        initialValues.customer_subdomain_name = 'No need to specify';
      }

      if (
        initialValues.customer_first_name &&
        initialValues.customer_email &&
        initialValues.customer_last_name &&
        initialValues.customer_institute_name &&
        initialValues.customer_subdomain_name
      )
        setIsTrainer(true);
    } catch (err) {
      console.log(err);
      history.push('/Tutor/user/register');
    }
  }, []);

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2"> Oyesters Training</p>
            <p className="white mb-0">
              Please use this form to register. <br />
              If you are a member, please
              <NavLink to="/Tutor/user/login" className="black">
                <b> login </b>
              </NavLink>
            </p>
          </div>
          <div className="form-side">
            <NavLink to="" className="white">
              <img src={Logo} className="image" alt="1111" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="user.register" />
            </CardTitle>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validation}
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
                <Form
                  className="av-tooltip tooltip-label-bottom"
                  autoComplete="true"
                >
                  <FormGroup className="form-group has-float-label">
                    <Label>Firstname</Label>
                    <Field
                      className="form-control"
                      name="customer_first_name" /*  value="firstname" onChange={(e) => setFirstname(e.target.value)} */
                    />
                    {errors.customer_first_name &&
                    touched.customer_first_name ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_first_name}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Lastname</Label>
                    <Field
                      className="form-control"
                      name="customer_last_name" /* value="lastname" onChange={(e) => setLastname(e.target.value)} */
                    />
                    {errors.customer_last_name && touched.customer_last_name ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_last_name}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Email</Label>
                    <Field
                      className="form-control"
                      name="customer_email" /* value="email" onChange={(e) => setEmail(e.target.value)} */
                    />
                    {errors.customer_email && touched.customer_email ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_email}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Mobile</Label>
                    <Field
                      className="form-control"
                      name="customer_phone_number" /* value="mobile" onChange={(e) => setMobile(e.target.value)} */
                    />
                    {errors.customer_phone_number &&
                    touched.customer_phone_number ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_phone_number}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Password</Label>
                    <Field
                      className="form-control"
                      name="customer_password"
                      type="password" /*  value="password" onChange={(e) => setPassword(e.target.value)} */
                    />
                    {errors.customer_password && touched.customer_password ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_password}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Confirm Password</Label>
                    <Field
                      className="form-control"
                      name="customer_password_confirm"
                      type="password"
                    />
                    {errors.customer_password_confirm &&
                    touched.customer_password_confirm ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_password_confirm}
                      </div>
                    ) : null}
                  </FormGroup>
                  {/* {!isTrainer ? ( */}
                  <FormGroup className="form-group has-float-label">
                    <Label>Institute Name</Label>
                    <Field
                      className="form-control"
                      name="customer_institute_name"
                      disabled={isTrainer === true ? true : false}
                    />
                    {!isTrainer &&
                    errors.customer_institute_name &&
                    touched.customer_institute_name ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_institute_name}
                      </div>
                    ) : null}
                  </FormGroup>
                  {/* ) : (
                    ''
                  )} */}
                  {/* {!isTrainer ? ( */}
                  <FormGroup className="form-group has-float-label">
                    <InputGroup>
                      <Label>SubDomain</Label>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                      <Field
                        className="form-control"
                        name="customer_subdomain_name"
                        disabled={isTrainer === true ? true : false}
                      />
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>.oyestershowtime.in</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {!isTrainer &&
                    errors.customer_subdomain_name &&
                    touched.customer_subdomain_name ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_subdomain_name}
                      </div>
                    ) : null}
                  </FormGroup>
                  {/* ) : (
                    ''
                  )} */}
                  <FormGroup check>
                    <Label check>
                      <Field
                        type="checkbox"
                        name="acceptTerms"
                        className={
                          'form-check-input ' +
                          (errors.acceptTerms && touched.acceptTerms
                            ? ' is-invalid'
                            : '')
                        }
                      />{' '}
                      I accept the terms & conditions
                    </Label>
                    {errors.acceptTerms && touched.acceptTerms ? (
                      <div className="invalid-feedback d-block">
                        {errors.acceptTerms}
                      </div>
                    ) : null}
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/Tutor/user/login">
                      Already Registered?
                    </NavLink>
                    {/* <Button color="primary" type="submit" className="register">
                      Register
                    </Button> */}{' '}
                    {console.log(isSubmitting)}
                    <Button
                      color="primary"
                      type="submit"
                      // onClick={onUserLogin}
                      className={`btn-shadow btn-multiple-state ${
                        clicked ? 'show-spinner' : ''
                      }`}
                      size="lg"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">Register</span>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>

            <Row className="mt-4 d-flex justify-content-center">
              <div style={{ width: '90%' }}>
                <Button
                  outline
                  color="secondary"
                  onClick={signIn}
                  className="mb-2 d-flex align-items-center p-3 registerug"
                >
                  {/*<div className={`glyph-icon ${simplelineicons[176]} mr-2 `} />*/}
                  <img src={Google} className="logo" />
                  <span>Continue with Google</span>
                </Button>
                {/* <Button
                  outline
                  color="secondary"
                  className="mb-2 d-flex align-items-center p-3 registerug"
                >
                  <img src={Apple} className="logo2" />
                  <span>Continue with Apple</span>
                </Button> */}
              </div>{' '}
            </Row>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
// const mapStateToProps = () => {};

const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  registerUserAction: registerUser,
})(Register);
