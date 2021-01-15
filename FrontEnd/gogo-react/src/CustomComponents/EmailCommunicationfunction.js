import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Input,
  Col,
  Nav,
  CardBody,
  NavItem,
  TabContent,
  Button,
  FormGroup,
  TabPane,
  CardImg,
} from 'reactstrap';
import { Colxx } from '../components/common/CustomBootstrap';
import Switch from 'rc-switch';
import './Customcss.css';
import EmailCommunication from './EmailCommunication';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import img from './bebinca-thumb.jpg';
import Email from './communication/Email';
import DirectMessage from './communication/DirectMessage';

function Emailcommunicationfunction() {
  const [accountverification, setAccountverification] = useState(false);
  const [accountverificationtheme, setAccountverificationtheme] = useState('1');
  const [activeFirstTab, setActiveFirstTab] = useState('1');

  const [emailontext, setemailontext] = useState(false);
  const [emailontext2, setemailontext2] = useState(false);
  const [emailontext3, setemailontext3] = useState(false);
  const [emailontext4, setemailontext4] = useState(false);
  return (
    <>
      <Nav tabs className="card-header-tabs mb-3 mt-3">
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
            <h6> Email</h6>
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
            <h6>Direct Message</h6>
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
            <h6> Whatsapp</h6>
          </NavLink>
        </NavItem>
        {/* <FormGroup className="mb-4 d-flex float-right ml-auto" id="search">
                    <Input type="email" className="d-flex" id="exampleEmail" placeholder="Search anything" />
                    <Button id="searchbutton" className="d-flex ml-2">Search</Button>
                  </FormGroup> */}
      </Nav>
      <TabContent activeTab={activeFirstTab}>
        <TabPane tabId="1">
          <Email />
        </TabPane>
        <TabPane tabId="2">
          <DirectMessage />
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <h4 className="ml-4">Text Message on Signup</h4>
            <Switch
              className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
              style={{ marginRight: '400px' }}
              checked={emailontext}
              onChange={() => setemailontext(!emailontext)}
            />
          </Row>
          {emailontext ? (
            <>
              {' '}
              <Card
                body
                style={{ width: '60%', marginLeft: '80px', marginTop: '20px' }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Card>{' '}
              <br /> <br />{' '}
            </>
          ) : null}
          <Row className="mt-4">
            <h4 className="ml-4">Text message on Purchase of Course</h4>
            <Switch
              className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
              style={{ marginRight: '400px' }}
              checked={emailontext2}
              onChange={() => setemailontext2(!emailontext2)}
            />
          </Row>
          {emailontext2 ? (
            <>
              {' '}
              <Card
                body
                style={{ width: '60%', marginLeft: '80px', marginTop: '20px' }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Card>{' '}
              <br /> <br />{' '}
            </>
          ) : null}
          <br />
          <br />
          <h4 className="ml-2">Course Alerts</h4>
          <Row>
            <Col md={6} xs={12}>
              <Row className="mt-4 ml-4">
                <h4 className="ml-4">Angular 8</h4>
                <Switch
                  className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
                  style={{ marginRight: '400px' }}
                  checked={emailontext3}
                  onChange={() => setemailontext3(!emailontext3)}
                />
              </Row>
              {emailontext3 ? (
                <>
                  {' '}
                  <Card
                    body
                    style={{
                      width: '60%',
                      marginLeft: '80px',
                      marginTop: '20px',
                    }}
                  >
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </Card>{' '}
                  <br /> <br />{' '}
                </>
              ) : null}
              <Row className="mt-4 ml-4">
                <h4 className="ml-4">ReactJs</h4>
                <Switch
                  className="custom-switch custom-switch-secondary custom-switch-small ml-auto"
                  style={{ marginRight: '400px' }}
                  checked={emailontext4}
                  onChange={() => setemailontext4(!emailontext4)}
                />
              </Row>
              {emailontext4 ? (
                <>
                  {' '}
                  <Card
                    body
                    style={{
                      width: '60%',
                      marginLeft: '80px',
                      marginTop: '20px',
                    }}
                  >
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </Card>{' '}
                  <br /> <br />{' '}
                </>
              ) : null}{' '}
              <br />
              <br />
              <br />
              <br />
              <br />
            </Col>
            <Col md={6} xs={12}>
              {emailontext3 ? (
                <>
                  <br />
                  <br />
                  <label style={{ fontSize: '15px' }}>
                    After how many days of inactivity do you want to notify your
                    students?
                  </label>
                  <Input placeholder="" />
                  <Button
                    className="ml-auto mr-auto d-flex mt-3"
                    style={{ borderRadius: '0px' }}
                  >
                    Submit
                  </Button>
                </>
              ) : null}
              {emailontext4 ? (
                <>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <label style={{ fontSize: '15px' }}>
                    After how many days of inactivity do you want to notify your
                    students?
                  </label>
                  <Input placeholder="" />
                  <Button
                    className="ml-auto mr-auto d-flex mt-3"
                    style={{ borderRadius: '0px' }}
                  >
                    Submit
                  </Button>
                </>
              ) : null}
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  );
}

export default Emailcommunicationfunction;
