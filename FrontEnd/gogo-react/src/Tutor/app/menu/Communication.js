import React, { useState, useEffect, useDebugValue } from 'react';
import {
  Row,
  NavItem,
  Nav,
  TabContent,
  TabPane,
  NavLink,
  CardTitle,
  CardBody,
  Card,
  Col,
  Badge,
  CardText,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import classnames from 'classnames';
import { Line } from 'react-chartjs-2';

import { FaFilter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { BiTime } from 'react-icons/bi';
import { RiMailSendFill } from 'react-icons/ri';
import { Scrollbars } from 'react-custom-scrollbars';

import Communication_table from '../../../data/Communication_table';
import { lineChartData } from '../../../data/charts';
import { LineChart } from '../../../components/charts';
import './style.css';
import Table from './Table';
import Communication_table2 from '../../../data/Communication_table2';
import Communication_table3 from '../../../data/Communication_table3';

import axiosInstance from '../../../helpers/axiosInstance';
import NotificationManager from '../../../components/common/react-notifications/NotificationManager';
import NoDataFound from '../../../CustomComponents/NoDataFound';

const Communication = () => {
  const [activeFirstTab1, setActiveFirstTab1] = useState('8');
  const [chartstatus, setchartstatus] = useState('Last 7 days');

  const [emailsSent, setEmailsSent] = useState(0);
  const [smsSent, setSmsSent] = useState(0);
  const [error, setError] = useState(null);

  const [emailData, setEmailData] = useState([]);
  const [TextSMSData, setTextSMSData] = useState([]);

  const cols3 = [
    {
      Header: 'Send to',
      accessor: 'Send_to',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Date',
      accessor: 'date',
      cellClass: 'color',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Time',
      accessor: 'time',
      cellClass: 'text-muted ',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'message_id',
      accessor: 'message_id',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Opened',
      accessor: 'opened',
      cellClass: 'text-muted',
      Cell: (props) => {
        if (props.value === 'Yes') {
          return (
            <Badge
              color="primary"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'green',
                marginLeft: '20px',
              }}
            >
              {props.value}
            </Badge>
          );
        } else {
          return (
            <Badge
              color="danger"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'red',
                marginLeft: '20px',
              }}
            >
              {props.value}
            </Badge>
          );
        }
      },
      sortType: 'basic',
    },
  ];
  const cols8 = [
    {
      Header: 'Send to',
      accessor: 'Send_to',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Date',
      accessor: 'date',
      cellClass: 'color',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Time',
      accessor: 'time',
      cellClass: 'text-muted ',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'message_id',
      accessor: 'message_id',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Opened',
      accessor: 'opened',
      cellClass: 'text-muted',
      Cell: (props) => {
        if (props.value === 'Yes') {
          return (
            <Badge
              color="primary"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'green',
                marginLeft: '20px',
              }}
            >
              {props.value}
            </Badge>
          );
        } else {
          return (
            <Badge
              color="danger"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'red',
                marginLeft: '20px',
              }}
            >
              {props.value}
            </Badge>
          );
        }
      },
      sortType: 'basic',
    },
  ];
  const cols9 = [
    {
      Header: 'Send to',
      accessor: 'Send_to',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Date',
      accessor: 'date',
      cellClass: 'color',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Time',
      accessor: 'time',
      cellClass: 'text-muted ',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'message_id',
      accessor: 'message_id',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Opened',
      accessor: 'opened',
      cellClass: 'text-muted',
      Cell: (props) => {
        if (props.value === 'Yes') {
          return (
            <Badge
              color="primary"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'green',
                marginLeft: '20px',
              }}
            >
              {props.value}
            </Badge>
          );
        } else {
          return (
            <Badge
              color="danger"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'red',
                marginLeft: '20px',
              }}
            >
              {props.value}
            </Badge>
          );
        }
      },
      sortType: 'basic',
    },
  ];
  const data1 = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Text Messages',
        data: [32, 36, 29, 35, 32, 39, 28, 39, 44],
        radius: 3,
        tension: 0,
        fill: false,
        borderColor: '#5CCB00',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },

      {
        label: 'Whattsapp',
        data: [35, 26, 27, 23, 32, 30, 28, 39, 34],
        tension: 0,
        radius: 3,
        fill: false,
        borderColor: '#EC7600',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },
      {
        label: 'Spendings',
        data: [39, 28, 39, 44, 78, 65, 34],
        radius: 3,
        tension: 0,
        fill: false,
        borderColor: '#00FFFF',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },
    ],
  };

  const data2 = {
    labels: ['Week1', 'Week2', 'Week3', 'Week4'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Text Messages',
        data: [39, 28, 39, 44],
        radius: 3,
        tension: 0,
        fill: false,
        borderColor: '#5CCB00',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },

      {
        label: 'Whattsapp',
        data: [30, 28, 39, 34],
        tension: 0,
        radius: 3,
        fill: false,
        borderColor: '#EC7600',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },
      {
        label: 'Spendings',
        data: [56, 67, 32, 12],
        radius: 3,
        tension: 0,
        fill: false,
        borderColor: '#00FFFF',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },
    ],
  };
  const data3 = {
    labels: ['Jan', 'Feb', 'March'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Text Messages',
        data: [49, 54, 12],
        radius: 3,
        tension: 0,
        fill: false,
        borderColor: '#5CCB00',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },

      {
        label: 'Whattsapp',
        data: [71, 65, 45],
        tension: 0,
        radius: 3,
        fill: false,
        borderColor: '#EC7600',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },
      {
        label: 'Spendings',
        data: [65, 54, 12],
        radius: 3,
        tension: 0,
        fill: false,
        borderColor: '#00FFFF',
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: ' #FFFFFF',
      },
    ],
  };

  useEffect(() => {
    if (error)
      NotificationManager.warning(error, 'Blog Error', 3000, 3000, null, '');
  }, [error]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/stats/communication');
        console.log(result.data);
        if (result.data.success) {
          const data1 = result.data.emailData.map((doc) => ({
            Send_to: doc.send_email_to,
            date: doc.send_email_date,
            time: doc.send_email_time,
            message_id: doc.send_email_id,
            opened: 'Yes',
          }));

          const data2 = result.data.smsData.map((doc) => ({
            Send_to: doc.send_sms_to,
            date: doc.send_sms_date,
            time: doc.send_sms_time,
            message_id: doc.send_sms_id,
            opened: 'No',
          }));
          console.log(data1, data2);
          setEmailsSent(data1.length);
          setSmsSent(data2.length);
          setEmailData(data1);
          setTextSMSData(data2);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to find blogs');
          }
        }
      } catch (error) {
        try {
          setError(error.response.data.error);
        } catch (error) {
          setError('Unable to find blogs');
        }
      }
    };
    getData();
  }, []);

  return (
    <>
      <Row>
        <Col sm="3" xs="12" className="mb-3">
          <Card
            body
            id="crd"
            className="text-center"
            style={{ backgroundColor: '#ec407a' }}
          >
            <Row>
              <Col md="6" xs="6">
                <MdEmail id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {emailsSent}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Email Send
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col sm="3" xs="12" className="mb-3">
          <Card
            body
            id="crd"
            className="text-center"
            style={{ backgroundColor: '#ab47bc' }}
          >
            <Row>
              <Col md="6" xs="6">
                <RiMailSendFill id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {smsSent}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Text Message Send
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col sm="3" xs="12" className="mb-3">
          <Card
            body
            id="crd"
            className="text-center"
            style={{ backgroundColor: '#64b5f6' }}
          >
            <Row>
              <Col md="6" xs="6">
                <BiMessageRoundedDots id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  33
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Whattsapp Message Send
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col sm="3" xs="12" className="mb-3">
          <Card
            body
            id="crd"
            className="text-center"
            style={{ backgroundColor: '#4db6ac' }}
          >
            <Row>
              <Col md="6" xs="6">
                <BiTime id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  {smsSent + emailsSent}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Spendings
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Scrollbars style={{ width: '100%', height: 500 }}>
        <Card className="mt-4 line" md="12" id="l1">
          <CardTitle>
            <Row className="ml-4 mt-4">
              {/* <div className="thecard">
                <span id="dott"></span>
                <small className="ml-2">Text Messages</small>
                <span id="dott2"></span>
                <small id="no" className="ml-2">
                  Whattsapp
                </small>
                <span id="dott3"></span> <small id="no">Spendings</small>
              </div> */}

              <div className="position-absolute card-top-buttons">
                <UncontrolledDropdown>
                  <DropdownToggle
                    color=""
                    className="btn btn-header-light icon-button mr-4"
                  >
                    <FaFilter className="mb-1" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setchartstatus('Last 7 days')}>
                      <Row className="ml-1">Last 7 Days</Row>
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setchartstatus('Last One Month')}
                    >
                      <Row className="ml-1">Last One Month</Row>
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setchartstatus('Last Three Months')}
                    >
                      <Row className="ml-1">Last Three Months</Row>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </Row>
          </CardTitle>
          <CardBody>
            {chartstatus == 'Last 7 days' ? (
              <Line data={data1} height="80%" />
            ) : chartstatus == 'Last One Month' ? (
              <Line data={data2} height="80%" />
            ) : (
              <Line data={data3} height="80%" />
            )}
          </CardBody>
        </Card>
      </Scrollbars>
      <Row>
        <Col md="12" xs="12">
          <Card className="h-100  ">
            <Scrollbars style={{ width: '100%', height: 400 }}>
              <CardBody>
                <Nav tabs className="card-header-tabs mb-3">
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab1 === '8',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab1('8');
                      }}
                    >
                      <h6>Email</h6>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab1 === '9',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab1('9');
                      }}
                    >
                      <h6>Whatsapp Message</h6>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab1 === '10',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab1('10');
                      }}
                    >
                      <h6>Text Messages</h6>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeFirstTab1}>
                  <TabPane tabId="8">
                    <Table columns={cols3} data={emailData} />
                  </TabPane>
                  <TabPane tabId="9">
                    <Table columns={cols8} data={Communication_table2} />
                  </TabPane>
                  <TabPane tabId="10">
                    <Table columns={cols9} data={TextSMSData} />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Scrollbars>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Communication;
