import React, { useEffect } from 'react';
import { Row, Card, CardTitle } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Colxx } from '../components/common/CustomBootstrap';
import IntlMessages from '../helpers/IntlMessages';
import logo from './user/logo.png';

const Error = () => {
  useEffect(() => {
    document.body.classList.add('background');
    document.body.classList.add('no-footer');

    return () => {
      document.body.classList.remove('background');
      document.body.classList.remove('no-footer');
    };
  }, []);

  return (
    <>
      <div className="fixed-background" />
      <main>
        <div className="container">
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="position-relative image-side ">
                  <p className="text-white h2">Oyesters Training</p>
                  <p className="white mb-0">Yes, it is indeed!</p>
                </div>
                <div className="form-side">
                  <NavLink to="/" className="white">
                    <img src={logo} style={{ height: '30%', width: '40%' }} />
                  </NavLink>
                  <CardTitle className="mb-4">
                    <IntlMessages id="pages.error-title" />
                  </CardTitle>
                  <p className="mb-0 text-muted text-small mb-0">
                    <IntlMessages id="pages.error-code" />
                  </p>
                  <p className="display-1 font-weight-bold mb-5">404</p>
                  <NavLink to="/" className="btn btn-primary btn-shadow btn-lg">
                    GO BACK HOME
                  </NavLink>
                </div>
              </Card>
            </Colxx>
          </Row>
        </div>
      </main>
    </>
  );
};

export default Error;
