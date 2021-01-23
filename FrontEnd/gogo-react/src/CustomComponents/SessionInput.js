import React, { useState } from 'react';
import {
  Row,
  Card,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import { Colxx } from '../components/common/CustomBootstrap';
import OndemandSession from './OndemandSession';
import RemoteSession from './RemoteSession';
import classnames from 'classnames';

function SessionInput({ closeModal, propHandle }) {
  const [activeFirstTab, setActiveFirstTab] = useState('1');

  return (
    <section className="p-4">
      <div style={{ margin: '0 auto', maxWidth: '450px' }}>
        <Row>
          <Colxx xxs="8">
            <h3>Create Sessions</h3>
          </Colxx>
        </Row>

        <Row>
          <Colxx xxs="12">
            <Card className="mb-4 pl-4 pr-4 pb-4 pt-4">
              <CardHeader className="mb-4">
                <Nav tabs className="card-header-tabs ">
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab === '1',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab('1');
                      }}
                    >
                      Live Session
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab === '2',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab('2');
                      }}
                    >
                      Recorded Session
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>
              <TabContent activeTab={activeFirstTab}>
                <TabPane tabId="1">
                  <RemoteSession
                    closeModal={closeModal}
                    propHandle={propHandle}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <OndemandSession
                    closeModal={closeModal}
                    propHandle={propHandle}
                  />
                </TabPane>
              </TabContent>
            </Card>
          </Colxx>
        </Row>
      </div>
    </section>
  );
}

export default SessionInput;
