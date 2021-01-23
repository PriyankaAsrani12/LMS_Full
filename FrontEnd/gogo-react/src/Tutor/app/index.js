import React, { Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Dashboards = React.lazy(() => import('./dashboards'));
const Pages = React.lazy(() => import('../../CustomComponents/Library/index'));
const LiveSession = React.lazy(() =>
  import('../../CustomComponents/Remotelook')
);
const RecordedSession = React.lazy(() =>
  import('../../CustomComponents/SessionMaterial')
);

const Ui = React.lazy(() =>
  import('../../CustomComponents/EmailCommunicationfunction')
);
const Menu = React.lazy(() => import('./menu'));
const Mydash = React.lazy(() => import('./mydashboard'));
const Themepage = React.lazy(() => import('../../CustomComponents/ThemePage'));
const Message = React.lazy(() => import('./message'));

const Support = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ '../../CustomComponents/support')
);
const Privacy = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './privacy')
);
const Cookie = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './cookie')
);
const Terms = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './terms')
);
const IRP = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './irp')
);
const Anti = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './antispam')
);
const Abuse = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './abuse')
);

const Validate = React.lazy(() => import('./Validate'));

const App = ({ match }) => {
  return (
    <AppLayout>
      <Validate />
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={`${match.url}/blankpage`}
            />
            <Route
              path={`${match.url}/dashboard`}
              render={(props) => <Dashboards {...props} />}
            />

            <Route
              path={`${match.url}/mydashboard`}
              render={(props) => <Mydash {...props} />}
            />

            <Route
              path={`${match.url}/support`}
              render={(props) => <Support {...props} />}
            />

            <Route
              path={`${match.url}/library`}
              render={(props) => <Pages {...props} />}
            />
            <Route
              path={`${match.url}/livesession`}
              render={(props) => <LiveSession {...props} />}
            />
            <Route
              path={`${match.url}/recordedsession`}
              render={(props) => <RecordedSession {...props} />}
            />
            <Route
              path={`${match.url}/communication`}
              render={(props) => <Ui {...props} />}
            />
            <Route
              path={`${match.url}/stats`}
              render={(props) => <Menu {...props} />}
            />
            <Route
              path={`${match.url}/themesetting`}
              render={(props) => <Themepage {...props} />}
            />
            <Route
              path={`${match.url}/message`}
              render={(props) => <Message {...props} />}
            />

            <Route
              path={`${match.url}/privacy`}
              render={(props) => <Privacy {...props} />}
            />
            <Route
              path={`${match.url}/cookie`}
              render={(props) => <Cookie {...props} />}
            />
            <Route
              path={`${match.url}/terms`}
              render={(props) => <Terms {...props} />}
            />
            <Route
              path={`${match.url}/irp`}
              render={(props) => <IRP {...props} />}
            />
            <Route
              path={`${match.url}/antispam`}
              render={(props) => <Anti {...props} />}
            />
            <Route
              path={`${match.url}/abuse`}
              render={(props) => <Abuse {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
