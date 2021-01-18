import React, { useState, useEffect } from 'react';
import { Row, Nav, NavItem, TabContent, TabPane } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import './Customcss.css';
import NotificationManager from '../components/common/react-notifications/NotificationManager';
import PaymentDetails from './settings/paymentDetails';
import TutorProfile from './settings/TutorProfile';
import ManageUsers from './settings/ManageUsers';
import ThirdPartyIntegration from './settings/ThirdPartyIntegration';
import Trainer from './settings/Trainers';
import Certificates from './certificate/Index';
import General from './settings/General';

const Themepage = () => {
  const [activeFirstTab3, setActiveFirstTab3] = useState('30');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'User Profile', 3000, null, null, '');
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        success,
        'User Profile',
        3000,
        null,
        null,
        ''
      );
      setSuccess(null);
    }
  }, [success]);

  return (
    <>
      <Row>
        <Nav tabs className="card-header-tabs mb-3">
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '30',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('30');
              }}
            >
              <h6>General</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '31',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('31');
              }}
            >
              <h6>Profile</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '32',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('32');
              }}
            >
              <h6>Manage Users</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '33',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('33');
              }}
            >
              <h6>Trainers</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '34',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('34');
              }}
            >
              <h6>Payement Details</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '35',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('35');
              }}
            >
              <h6>Manage Subscriptions</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '36',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('36');
              }}
            >
              <h6>Third party integrations</h6>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="#"
              location={{}}
              className={classnames({
                active: activeFirstTab3 === '37',
                'nav-link': true,
              })}
              onClick={() => {
                setActiveFirstTab3('37');
              }}
            >
              <h6>Certificates</h6>
            </NavLink>
          </NavItem>
        </Nav>
      </Row>
      <TabContent activeTab={activeFirstTab3}>
        <TabPane tabId="30">
          <General />
        </TabPane>
        <TabPane tabId="31">
          <TutorProfile />
        </TabPane>
        <TabPane tabId="32">
          <ManageUsers />
        </TabPane>
        <TabPane tabId="33">
          <Trainer />
        </TabPane>
        <TabPane tabId="34">
          <PaymentDetails />
        </TabPane>
        <TabPane tabId="35">Hi, i am manage subscription</TabPane>
        <TabPane tabId="36">
          <ThirdPartyIntegration />
        </TabPane>
        <TabPane tabId="37">
          <Certificates />
        </TabPane>
      </TabContent>
      <br />
    </>
  );
};

export default Themepage;
