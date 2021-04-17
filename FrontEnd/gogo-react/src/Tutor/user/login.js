import React, { useState, useEffect } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import './auth.css';
import { Formik, Form, Field } from 'formik';
import { NotificationManager } from '../../components/common/react-notifications';
import * as Yup from 'yup';
import { loginUser } from '../../redux/actions';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import Logo from './logo.png';
import Google from './google.png';
import { useHistory } from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from './utils/refreshTokenSetup';
import { loginUserError } from '../../redux/auth/actions';


// initalising the user state
const initialvalue = {
  customer_email: '',
  customer_password: '',
};

// creating a validation oject
const validation = Yup.object().shape({
  customer_password: Yup.string()
    .min(8, 'Password should have min 8 characters')
    .required('Password is required'),
  customer_email: Yup.string()
    .min(6, 'Email should have min 7 characters')
    .required('Email is required'),
});


const Login = ({ loading, error, loginUserAction }) => {
  // const [email] = useState('demo@gogo.com');
  // const [password] = useState('gogo123');
  const history = useHistory();
  const dispatch = useDispatch();
  const [clicked, setIsClicked] = useState(false);

  const toggleClick = () => setIsClicked(false);

  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, 'Login Error', 3000, null, null, '');
    }
  }, [error]);

  //put your network request here
  const onUserLogin = (values, { setSubmitting }) => {
    console.log(setSubmitting);
    if (!loading) {
      console.log(values);
      setIsClicked(true);

      loginUserAction({ history, values, toggleClick });
    }
  };

  // fetching user object
  const onSuccess = (res) => {
    console.log('login success', res.profileObj);
    refreshTokenSetup(res);
    console.log(
      res.profileObj.name,
      res.profileObj.email,
      res.profileObj.imageUrl
    );

    // setting the username and email of fetched user
    const values = {
      customer_name: res.profileObj.name,
      customer_email: res.profileObj.email,
      using_google: true,
    };
    loginUserAction({ history, values, toggleClick });
  };
  // dispatching a failed to login action
  const onFailure = (err) => {
    dispatch(loginUserError(err.error || 'unable to register'));
    console.log(err);
  };

  // Signing it with Google
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId: process.env.REACT_APP_CLIENT_ID,
    isSignedIn: false,
    accessType: 'offline',
  });

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">Oyesters Training</p>
            <p className="white mb-0">
              Please use your credentials to login.
              <br />
              If you are not a member, please{' '}
              <NavLink to="/Tutor/user/register" className="black">
                <b>register</b>
              </NavLink>
              .
            </p>
          </div>
          <div className="form-side">
            <NavLink to="/" className="white">
              <img src={Logo} className="image" alt="1111" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="user.login-title" />
            </CardTitle>

            <Formik
              initialValues={initialvalue}
              onSubmit={onUserLogin}
              validationSchema={validation}
            >
              {({
                errors,
                touched
              }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>Email</Label>
                    <Field className="form-control" name="customer_email" />
                    {errors.customer_email && touched.customer_email ? (
                      <div className="invalid-feedback d-block">
                        {errors.customer_email}
                      </div>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Password</Label>
                    <Field
                      className="form-control"
                      type="password"
                      name="customer_password"
                    />
                    {errors.customer_password && touched.customer_password && (
                      <div className="invalid-feedback d-block">
                        {errors.customer_password}
                      </div>
                    )}
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/Tutor/user/forgot-password">
                      <IntlMessages id="user.forgot-password-question" />
                    </NavLink>
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
                      <span className="label">Login</span>
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
                  <img src={Google} className="logo" />
                  <span id="text">Continue with Google</span>
                </Button>
              </div>{' '}
            </Row>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};



const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser,
})(Login);
