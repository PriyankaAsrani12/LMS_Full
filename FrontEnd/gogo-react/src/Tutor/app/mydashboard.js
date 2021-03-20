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

  const [data1, setData1] = useState({});
  const [data2, setData2] = useState({});
  const [data3, setData3] = useState({});

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'User Profile', 3000, null, null, '');
    }
  }, [error]);

  const formatDate = (date, rev = false) => {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (rev) date = yyyy + '-' + mm + '-' + dd;
    else date = dd + '/' + mm + '/' + yyyy;
    return date;
  };

  const Last7Days = (rev = false) => {
    var result = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push(formatDate(d, rev));
    }
    return result.reverse();
  };

  const findIndex = (labels, label) => {
    for (let i = 0; i < labels.length; i++) if (labels[i] == label) return i;
  };
  const getLast3MonthLabels = () => {
    const ret = [];
    var today = new Date();
    var d;
    var month;
    var year;
    for (var i = 2; i > 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      month = d.getMonth() + 1;
      year = d.getFullYear();
      let str = `${month}/${year}`;
      ret.push(str);
      console.log(month);
      console.log(year);
    }
    ret.push(`${today.getMonth() + 1}/${today.getFullYear()}`);
    console.log(today.getMonth(), today.getFullYear());
    return ret;
  };
  function getStartDateOfWeek(w, y) {
    var d = 1 + (w - 1) * 7; // 1st of January + 7 days for each week
    const date = new Date(y, 0, d);

    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  function getEndDateOfWeek(w, y) {
    var d = 1 + (w - 1) * 7 + 7; // 1st of January + 7 days for each week
    const date = new Date(y, 0, d);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/dashboard');
        console.log(result.data.success);
        if (result.data.success) {
          setTotalCourses(result.data.totalCourses[0].totalCourses);
          setEnrollments(result.data.enrollments[0].enrollments);
          const GraphData = result.data.GraphData;

          // d1 mai GraphData[0][0] ,GraphData[1][0], GraphData[2][0]

          let d1 = { labels: Last7Days(), datasets: [] };
          const checkLabels = Last7Days(true);
          const a = [0, 0, 0, 0, 0, 0, 0];

          //registration  weekwise
          GraphData[0][0].forEach((doc) => {
            console.log(doc.label,"label");
            const idx = findIndex(checkLabels, doc.label);
            a[idx] = doc.totalCount;
          });

          const b = {
            label: 'Registrations',
            data: a,
            radius: 3,
            tension: 0,
            fill: false,
            borderColor: '#5CCB00',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d1.datasets.push(b);

          const a1 = [0, 0, 0, 0, 0, 0, 0];

          //enrollments  weekwise
          GraphData[1][0].forEach((doc) => {
            const idx = findIndex(checkLabels, doc.label);
            a1[idx] = doc.totalCount;
          });

          const b1 = {
            label: 'Enrollments',
            data: a1,
            tension: 0,
            radius: 3,
            fill: false,
            borderColor: '#EC7600',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d1.datasets.push(b1);

          //revenue  weekwise
          const a2 = [0, 0, 0, 0, 0, 0, 0];

          GraphData[2][0].forEach((doc) => {
            const idx = findIndex(checkLabels, doc.label);
            a2[idx] = doc.totalCount;
          });

          const b2 = {
            label: 'Revenue',
            data: a2,
            radius: 3,
            tension: 0,
            fill: false,
            borderColor: '#00FFFF',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d1.datasets.push(b2);
          console.log(d1);
          setData1(d1);

          //for Week Wise
          function getCurrentWeek() {
            const today = new Date();
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
            return Math.ceil(
              (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
            );
          }
          let currentWeekNo = getCurrentWeek();
          let currentYear = new Date().getFullYear();
          const weekLabels = [];
          weekLabels.push(
            `${getStartDateOfWeek(
              currentWeekNo,
              currentYear
            )} to ${getEndDateOfWeek(currentWeekNo, currentYear)}`
          );

          for (let i = 1; i < 4; i++) {
            if (currentWeekNo - i <= 0) {
              currentWeekNo = 54;
              currentYear--;
              weekLabels.push(
                `${getStartDateOfWeek(
                  currentWeekNo,
                  currentYear
                )} to ${getEndDateOfWeek(currentWeekNo, currentYear)}`
              );
            } else
              weekLabels.push(
                `${getStartDateOfWeek(
                  currentWeekNo - i,
                  currentYear
                )} to ${getEndDateOfWeek(currentWeekNo - i, currentYear)}`
              );
          }

          let d2 = {
            labels: weekLabels.reverse(),
            datasets: [],
          };

          const p1 = [0, 0, 0, 0];
          GraphData[0][1].forEach((doc) => {
            p1[doc.weekNo] = doc.totalCount1;
          });

          const q1 = {
            label: 'Registrations',
            data: p1,
            radius: 3,
            tension: 0,
            fill: false,
            borderColor: '#5CCB00',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d2.datasets.push(q1);

          const p2 = [0, 0, 0, 0];
          GraphData[1][1].forEach((doc) => {
            p2[doc.weekNo] = doc.totalCount1;
          });

          const q2 = {
            label: 'Enrollments',
            data: p2,
            tension: 0,
            radius: 3,
            fill: false,
            borderColor: '#EC7600',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d2.datasets.push(q2);

          const p3 = [0, 0, 0, 0];
          GraphData[2][1].forEach((doc) => {
            p3[doc.weekNo] = doc.totalCount1;
          });

          const q3 = {
            label: 'Revenue',
            data: p3,
            radius: 3,
            tension: 0,
            fill: false,
            borderColor: '#00FFFF',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d2.datasets.push(q3);
          setData2(d2);

          // last 3 months
          const findMonthIndex = (monthLabels, y, m) => {
            for (let i = 0; i < monthLabels.length; i++)
              if (monthLabels[i] == `${m}/${y}`) return i;
          };

          const monthLabels = getLast3MonthLabels();
          console.log(monthLabels);
          let d3 = {
            labels: monthLabels,
            datasets: [],
          };

          const z1 = [0, 0, 0];
          GraphData[0][2].forEach((doc) => {
            const idx = findMonthIndex(monthLabels, doc.y, doc.m);
            z1[idx] = doc.totalCount2;
          });

          const v1 = {
            label: 'Registrations',
            data: z1,
            radius: 3,
            tension: 0,
            fill: false,
            borderColor: '#5CCB00',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d3.datasets.push(v1);

          const z2 = [0, 0, 0];
          GraphData[1][2].forEach((doc) => {
            const idx = findMonthIndex(monthLabels, doc.y, doc.m);
            z2[idx] = doc.totalCount2;
          });

          const v2 = {
            label: 'Enrollments',
            data: z2,
            tension: 0,
            radius: 3,
            fill: false,
            borderColor: '#EC7600',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d3.datasets.push(v2);

          const z3 = [0, 0, 0];
          GraphData[2][2].forEach((doc) => {
            const idx = findMonthIndex(monthLabels, doc.y, doc.m);
            z3[idx] = doc.totalCount2;
          });

          const v3 = {
            label: 'Revenue',
            data: z3,
            radius: 3,
            tension: 0,
            fill: false,
            borderColor: '#00FFFF',
            pointRadius: 6,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: ' #FFFFFF',
          };
          d3.datasets.push(v3);
          setData3(d3);

          // const c = GraphData[1][0].map(doc => doc.totalCount);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to fetch data');
          }
        }
      } catch (error) {
        console.log(error);
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
                  <CardText id="small">Registrations till now</CardText>
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
