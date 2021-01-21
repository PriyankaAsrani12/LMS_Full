import React, { useState, useEffect } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Col,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { FaUsers } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa';
import { FaDatabase } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { FaWifi } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
import { Scrollbars } from 'react-custom-scrollbars';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import './dash.css';
import './menu/style.css';
import axiosInstance from '../../helpers/axiosInstance';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

const BlankPage = ({ intl, match }) => {
  const Enroll_percentage = 66;
  const course_percentage = 9;
  const data_percentage = '14';
  const bandwidth_percentage = 20;
  const number = 43;
  const [enrollments, setEnrollments] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [storage, setStorage] = useState('14GB');
  const [error, setError] = useState(false);
  const [chartstatus, setchartstatus] = useState('Last 7 days');

  const [data1, setData1] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Registrations',
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
        label: 'Enrollments',
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
        label: 'Revenue',
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
  });
  const [data2, setData2] = useState({
    labels: ['Week1', 'Week2', 'Week3', 'Week4'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Registrations',
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
        label: 'Enrollments',
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
        label: 'Revenue',
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
  });
  const [data3, setData3] = useState({
    labels: ['Jan', 'Feb', 'March'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Registrations',
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
        label: 'Enrollments',
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
        label: 'Revenue',
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
  });
  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'User Profile', 3000, null, null, '');
    }
  }, [error]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/dashboard');
        console.log(result);
        if (result.data.success) {
          setTotalCourses(result.data.totalCourses[0].totalCourses);
          setEnrollments(result.data.enrollments[0].enrollments);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to fetch data');
          }
        }
      } catch (error) {
        try {
          setError(error.response.data.error);
        } catch (error) {
          setError('Unable to fetch data');
        }
      }
    };
    getData();
  }, []);

  return (
    <>
      <Row>
        <Col md="3" xs="12">
          <Card id="card121">
            <CardBody>
              <Row>
                <Col md="12">
                  <FaUsers id="users" />
                  <h1 id="number">{enrollments}</h1>
                  <CardText id="small">Enrollments till now</CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xs="12">
          <Card id="card122">
            <CardBody>
              <Row>
                <Col md="12">
                  <FaCode id="users" />
                  <h1 id="number">{totalCourses}</h1>
                  <CardText id="small">Sessions taken till now</CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xs="12">
          <Card id="card123">
            <CardBody>
              <Row>
                <Col md="7" xs="7">
                  <FaDatabase id="users" />
                  <h1 id="number">{storage}</h1>
                  <CardText id="small">Storage Used(Static)</CardText>
                </Col>
                <Col md="5" xs="5">
                  <CircularProgressbar
                    value={data_percentage}
                    text={`${data_percentage}%`}
                    styles={buildStyles({
                      textColor: 'red',
                      pathColor: '#228B22',
                    })}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xs="12">
          <Card id="card124">
            <CardBody>
              <Row>
                <Col md="7" xs="7">
                  <FaWifi id="users" />
                  <h1 id="number">10GB</h1>
                  <CardText id="small">Bandwidth used(Static)</CardText>
                </Col>
                <Col md="5" xs="5">
                  <CircularProgressbar
                    value={bandwidth_percentage}
                    text={`${bandwidth_percentage}%`}
                    styles={buildStyles({
                      textColor: '#46b5d1',
                      pathColor: '#E4495A',
                    })}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12" xs="12">
          <Scrollbars style={{ width: '100%', height: 500 }}>
            <Card className="mt-4 ccc mb-4" id="cb">
              <CardTitle>
                <Row className="ml-4 mt-4">
                  <div className="position-absolute card-top-buttons">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        color=""
                        className="btn btn-header-light icon-button mr-4"
                      >
                        <FaFilter className="mb-1" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          onClick={() => setchartstatus('Last 7 days')}
                        >
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
        </Col>
      </Row>
    </>
  );
};

export default BlankPage;
