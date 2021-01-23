import React, { useState, useEffect } from 'react';
import {
  Row,
  CardBody,
  Card,
  Col,
  Badge,
  CardText,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  DropdownMenu,
} from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';

import { FaFilter } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { AiFillBank } from 'react-icons/ai';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

import Table from './Table';
import './style.css';

import axiosInstance from '../../../helpers/axiosInstance';
import NotificationManager from '../../../components/common/react-notifications/NotificationManager';
import NoDataFound from '../../../CustomComponents/NoDataFound';

const Monetization = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [numberOfPayments, setNoofPayments] = useState(0);
  const [paymentVolume, setPaymentVolume] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const [chartstatus, setchartstatus] = useState('Last 7 days');

  const data1 = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Earning',
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
        label: 'Courses',
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
        label: 'Rewards',
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
        label: 'Earning',
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
        label: 'Courses',
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
        label: 'Rewards',
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
        label: 'Earning',
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
        label: 'Courses',
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
        label: 'Rewards',
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

  const cols4 = [
    {
      Header: 'Payment ID',
      accessor: 'payment_id',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Razor Pay ID',
      accessor: 'razor_pay_id',
      cellClass: 'color',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Order ID',
      accessor: 'order_id',
      cellClass: 'text-muted ',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Date',
      accessor: 'date',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Time',
      accessor: 'time',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Status',
      accessor: 'status',
      cellClass: 'text-muted',
      Cell: (props) => {
        if (props.value == 'created') {
          return (
            <Badge
              color="danger"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'red',
              }}
            >
              {props.value}
            </Badge>
          );
        } else {
          return (
            <Badge
              color="success"
              style={{
                fontSize: '10px',
                borderRadius: '10px',
                backgroundColor: 'green',
              }}
            >
              {props.value}
            </Badge>
          );
        }
      },
      sortType: 'basic',
    },

    {
      Header: 'Email',
      accessor: 'email',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Contact',
      accessor: 'contact',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
  ];

  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Monetization Error',
        3000,
        3000,
        null,
        ''
      );
  }, [error]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/monetization');
        console.log(result);
        if (result.data.success) {
          let pVol = 0;
          const data = result.data.result.map((doc) => {
            pVol += parseInt(doc.razorpay_amount);
            return {
              payment_id: doc.payment_id,
              razor_pay_id: doc.razorpay_payment_id,
              order_id: doc.razorpay_order_id,
              amount: doc.razorpay_amount,
              date: doc.date,
              time: doc.time,
              status: doc.razorpay_status,
              email: doc.razorpay_email,
              contact: doc.razorpay_contact,
            };
          });
          setNoofPayments(data.length);
          setPaymentVolume(pVol);
          setTotalCourses(result.data.total_courses);
          setTotalRewards(result.data.total_rewards_given);
          setData(data);
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
            style={{ backgroundColor: '#FFBF69' }}
          >
            <Row>
              <Col md="6" xs="6">
                <FaBookOpen id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {totalCourses}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Courses Created
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
            style={{ backgroundColor: '#E76F51' }}
          >
            <Row>
              <Col md="6" xs="6">
                <FaHandHoldingUsd id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {totalRewards}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Rewards Given
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
            style={{ backgroundColor: '#457B9D' }}
          >
            <Row>
              <Col md="6" xs="6">
                <RiMoneyDollarCircleFill id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  {numberOfPayments}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Number of payments
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
                <AiFillBank id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  {paymentVolume}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Payment volume
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {!data.length ? (
        <NoDataFound />
      ) : (
        <>
          <Card style={{ marginBottom: '3rem' }}>
            <FormGroup className="ml-auto mr-4 mt-3">
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
            </FormGroup>

            <CardBody style={{}}>
              {chartstatus == 'Last 7 days' ? (
                <Line data={data1} height="80%" />
              ) : chartstatus == 'Last One Month' ? (
                <Line data={data2} height="80%" />
              ) : (
                <Line data={data3} height="80%" />
              )}
            </CardBody>
          </Card>
          <Row>
            <Col md="12" xs="12">
              <Card className="h-120  ">
                <Scrollbars style={{ width: '100%', height: 400 }}>
                  <CardBody style={{ width: '120%' }}>
                    <Table columns={cols4} data={data} />
                  </CardBody>
                </Scrollbars>
              </Card>
            </Col>
          </Row>{' '}
        </>
      )}
    </>
  );
};

export default Monetization;
