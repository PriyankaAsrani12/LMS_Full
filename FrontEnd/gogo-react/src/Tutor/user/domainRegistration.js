import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import {
  FormGroup,
  Button,
  Label,
  Card,
  Row,
  CardTitle,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Input,
} from 'reactstrap';
import { NavLink, Redirect } from 'react-router-dom';
import { Colxx } from '../../components/common/CustomBootstrap';
import { connect } from 'react-redux';
import { NotificationManager } from '../../components/common/react-notifications';
import logo from './logo.png';
import { registerUser } from '../../redux/actions';

const initialValues = {
  institutename: '',
  subdomain: '',
  // otp_in_mobile: "",
  // otp_in_email:""
};

const validation = Yup.object().shape({
  institutename: Yup.string()
    .min(2, 'please enter correct insitute')
    .max(50, 'please enter correct institute')
    .required('insitute name is required'),
  subdomain: Yup.string()
    .min(2, 'Subdomain should be min 2 characters')
    .max(50, 'please enter correct subdomian')
    .required('Subdomain is required'),
  // otp_in_mobile: Yup.string()
  // .min(4, "Please Enter valid otp")
  // .max(6, "Please Enter correct otp")
  // .required("OTP is Required"),
  // otp_in_email: Yup.string()
  // .min(4, "Please Enter valid otp")
  // .max(6, "Please Enter correct otp")
  // .required("OTP is Required")
});

function DomainRegistration({
  history,
  loading,
  error,
  registerUserAction,
  ...props
}) {
  const [clicked, setClicked] = useState(false);
  const toggleClick = () => setClicked(false);

  const onSubmit = (values) => {
    setClicked(true);
    console.log(values);
    const data = {
      customer_first_name: props.location.state.data.first_name,
      customer_last_name: props.location.state.data.last_name,
      customer_email: props.location.state.data.email,
      customer_profile_picture: props.location.state.data.imageUrl,
      customer_institute_name: values.institutename,
      customer_subdomain_name: values.subdomain,
      using_google: true,
    };
    values = data;
    registerUserAction({ history, values, toggleClick });
  };
  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, 'Login Error', 3000, null, null, '');
    }
  }, [error]);

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
            <NavLink to="/" className="white">
              {/* <span className="logo-single" /> */}
              <img
                src={logo}
                style={{ height: '30%', width: '40%' }}
                alt="Oyesters Logo"
              />
            </NavLink>
            <CardTitle className="mb-4" style={{ marginTop: '1.5rem' }}>
              Register Your Domain
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
                    <Label>institute Name</Label>
                    <Field className="form-control" name="institutename" />
                    {errors.institutename && touched.institutename ? (
                      <div className="invalid-feedback d-block">
                        {errors.institutename}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <InputGroup>
                      <Label>SubDomain</Label>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                      <Field className="form-control" name="subdomain" />
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>.oyestershowtime.in</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.subdomain && touched.subdomain ? (
                      <div className="invalid-feedback d-block">
                        {errors.subdomain}
                      </div>
                    ) : null}
                  </FormGroup>
                  {/* <FormGroup className="form-group has-float-label">
                    <Label>
                      OTP in Mobile
                    </Label> 
                    <Field
                      className="form-control"
                      name="otp_in_mobile"
                    />
                    {errors.otp_in_mobile && touched.otp_in_mobile ? (
                      <div className="invalid-feedback d-block">
                        {errors.otp_in_mobile}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      OTP in Email
                    </Label> 
                    <Field
                      className="form-control"
                      name="otp_in_email"
                    /> 
                    {errors.otp_in_email && touched.otp_in_email ? (
                      <div className="invalid-feedback d-block">
                        {errors.otp_in_email}
                      </div>
                    ) : null}
                  </FormGroup>  */}
                  {/* <FormGroup className="form-group has-float-label">
                    <Label>
                      SubDomain
                    </Label> 
                    <Field
                      
                    /> 
                    
                      </FormGroup> */}
                  {/* <Button color="primary" type="submit">
                    Complete Registration
                  </Button> */}

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
                    <span className="label"> Complete Registration</span>
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
}

// export default DomainRegistration;

const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  registerUserAction: registerUser,
})(DomainRegistration);
