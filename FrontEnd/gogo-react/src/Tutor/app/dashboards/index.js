import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './index.css';
import retry from '../../../retry';

const DashboardDefault = React.lazy(() => retry(() => import('./default')));

const Dashboards = ({ match }) => (
  <>
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/default`} />

        <Route
          path={`${match.url}/default`}
          render={(props) => <DashboardDefault {...props} />}
        />

        <Redirect to="/error" />
      </Switch>
    </Suspense>
  </>
);
export default Dashboards;
