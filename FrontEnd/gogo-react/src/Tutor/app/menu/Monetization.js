import React, { useState, useEffect } from 'react';
import {
  Row,
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
import { Scrollbars } from 'react-custom-scrollbars';

import { FaFilter } from 'react-icons/fa';
import { LineChart } from '../../../components/charts';
import { FaBookOpen } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { AiFillBank } from 'react-icons/ai';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { lineChartData } from '../../../data/charts';

import Monitization_table from '../../../data/Monitization_table';
import Table from './Table';
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
        if (props.value == 'Incompleted') {
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
              color="primary"
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
      <Scrollbars style={{ width: '100%', height: 500 }}>
        <Card className=" line" md="12" id="l1">
          <CardTitle>
            <Row className="ml-4 mt-4">
              <div className="thecard">
                <span id="dott"></span>
                <small className="ml-2">Earning</small>
                <span id="dott2"></span>
                <small id="no" className="ml-2">
                  Courses
                </small>
                <span id="dott3"></span> <small id="no">Rewards</small>
              </div>

              <div className="position-absolute card-top-buttons">
                <UncontrolledDropdown>
                  <DropdownToggle
                    color=""
                    className="btn btn-header-light icon-button mr-4"
                  >
                    <FaFilter className="mb-1" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <Row className="ml-1">Last 7 Days</Row>
                    </DropdownItem>
                    <DropdownItem>
                      <Row className="ml-1">Last one month</Row>
                    </DropdownItem>
                    <DropdownItem>
                      <Row className="ml-1">Last three months</Row>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </Row>
          </CardTitle>
          <CardBody>
            <CardTitle></CardTitle>
            <div className="dashboard-line-chart">
              <LineChart shadow data={lineChartData} />
            </div>
          </CardBody>
        </Card>
      </Scrollbars>
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
      </Row>
    </>
  );
};

export default Monetization;
