import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserLayout from '../../layout/UserLayout';
import retry from '../../retry';

const Login = React.lazy(() =>
  retry(() => import(/* webpackChunkName: "user-login" */ './login'))
);
const Register = React.lazy(() =>
  retry(() => import(/* webpackChunkName: "user-register" */ './register'))
);
const DomainRegistration = React.lazy(() =>
  retry(() =>
    import(/* webpackChunkName: "user-register" */ './domainRegistration')
  )
);
const ForgotPassword = React.lazy(() =>
  retry(() =>
    import(/* webpackChunkName: "user-forgot-password" */ './forgot-password')
  )
);
const ResetPassword = React.lazy(() =>
  retry(() =>
    import(/* webpackChunkName: "user-reset-password" */ './reset-password')
  )
);

const User = ({ match }) => {
  return (
    <UserLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
          {console.log(match.url)}
          <Route
            path={`${match.url}/login`}
            render={(props) => <Login {...props} />}
          />
          <Route
            path={`${match.url}/register`}
            render={(props) => <Register {...props} />}
          />
          <Route
            path={`${match.url}/forgot-password`}
            render={(props) => <ForgotPassword {...props} />}
          />
          <Route
            path={`${match.url}/domainregistration`}
            render={(props) => <DomainRegistration {...props} />}
          />
          <Route
            path={`${match.url}/reset-password`}
            render={(props) => <ResetPassword {...props} />}
          />
        </Switch>
      </Suspense>
    </UserLayout>
  );
};

export default User;
