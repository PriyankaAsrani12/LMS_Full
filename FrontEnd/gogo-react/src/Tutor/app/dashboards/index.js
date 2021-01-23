import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './index.css';
// import { ProtectedRoute, UserRole } from '../../../helpers/authHelper';
import Breadcrumb from '../../../containers/navs/Breadcrumb';

const DashboardDefault = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './default')
);

const MyDash = React.lazy(() => import('../mydashboard'));
const Dashboards = ({ match }) => (
  <>
    {console.log(match)}

    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/default`} />

        <Route
          path={`${match.url}/default`}
          render={(props) => <DashboardDefault {...props} />}
        />

        {/* 
      <ProtectedRoute
        path={`${match.url}/default`}
        component={DashboardDefault}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/content`}
        component={ContentDefault}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/ecommerce`}
        component={EcommerceDefault}
        roles={[UserRole.Editor]}
      />
      <ProtectedRoute
        path={`${match.url}/analytics`}
        component={AnalyticsDefault}
        roles={[UserRole.Editor]}
      />
      */}

        <Redirect to="/error" />
      </Switch>
    </Suspense>
  </>
);
export default Dashboards;
