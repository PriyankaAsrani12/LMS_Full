import React from 'react';
import {
  Card,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import EmailCommunication from './EmailCommunication';

function Communication() {
  const [activeFirstTab, setActiveFirstTab] = useState('1');

  return (
    <div>
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
                Email
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
                Direct Message
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="#"
                location={{}}
                className={classnames({
                  active: activeFirstTab === '3',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveFirstTab('3');
                }}
              >
                Whatsapp Message
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>
        <TabContent activeTab={activeFirstTab}>
          <TabPane tabId="1">
            <EmailCommunication />
          </TabPane>
          <TabPane tabId="2"></TabPane>
          <TabPane tabId="1"></TabPane>
        </TabContent>
      </Card>
    </div>
  );
}

export default Communication;
