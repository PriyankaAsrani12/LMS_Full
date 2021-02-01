import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import retry from '../../../retry';

const MenuTypes = React.lazy(() =>
  retry(() => import(/* webpackChunkName: "menu-types" */ './types'))
);

const UI = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/types`} />
      <Route
        path={`${match.url}/types`}
        render={(props) => <MenuTypes {...props} />}
      />

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default UI;
