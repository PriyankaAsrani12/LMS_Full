import React, { useState, useEffect } from 'react';
import { Row, CardBody, Card, Col, CardText } from 'reactstrap';
import { ImBooks } from 'react-icons/im';
import { MdLocalLibrary } from 'react-icons/md';
import { Scrollbars } from 'react-custom-scrollbars';
import { BiBroadcast } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';

import Table from './Table';
import axiosInstance from '../../../helpers/axiosInstance';
import NotificationManager from '../../../components/common/react-notifications/NotificationManager';
import NoDataFound from '../../../CustomComponents/NoDataFound';

const CourseTab = () => {
  const [error, setError] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [liveCourse, setLiveCourse] = useState(0);
  const [libraryItems, setLibraryItems] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const cols = [
    {
      Header: 'Course',
      accessor: 'title',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p style={{ fontSize: '1rem' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Registrations',
      accessor: 'status',
      cellClass: 'color text-muted w-15',
      Cell: (props) => (
        <p style={{ marginLeft: '30px', fontSize: '1rem' }}>{props.value}</p>
      ),
      sortType: 'basic',
    },
    {
      Header: 'Enrolled',
      accessor: 'fee',
      cellClass: 'text-muted w-15',
      Cell: (props) => <p style={{ fontSize: '1rem' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Revenue',
      accessor: 'sb',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p style={{ fontSize: '1rem' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Library space consumed',
      accessor: 're',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p style={{ marginLeft: '20px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Bandwidth',
      accessor: 'NOC',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p style={{ marginLeft: '10px' }}>{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const [data, setData] = useState([]);

  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Course Details',
        3000,
        null,
        null,
        ''
      );
  }, [error, setError]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/stats');
        console.log(result);
        let live = 0;
        const data = result.data.result.map((doc) => {
          if (doc.session_type == 'Live Session') live++;
          return {
            title: doc.session_name,
            status: doc.session_registration,
            fee: 'Enrolled',
            sb: doc.session_registration * doc.session_fee,
            re: '100 (Static Data)',
            NOC: `1GB (Static Data)`,
          };
        });
        console.log(data);
        setLiveCourse(live);
        setTotalCourses(data.length);
        setLibraryItems(result.data.totalLibraryItems);
        setTotalStudents(result.data.totalStudents);
        setData(data);
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (e) {
          setError('Could not fetch data');
        }
      }
    };
    getData();
  }, []);
  if (!data.length) return <NoDataFound />;
  return (
    <>
      <Row>
        <Col sm="3" xs="12" className="mb-3">
          <Card
            body
            id="crd"
            className="text-center"
            style={{ backgroundColor: '#F4A261' }}
          >
            <Row>
              <Col md="6" xs="6">
                <FaUsers id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {totalStudents}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Students Enrolled
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
                <ImBooks id="myicon" className="text-light" />
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
            style={{ backgroundColor: '#E9C46A' }}
          >
            <Row>
              <Col md="6" xs="6">
                <BiBroadcast id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {liveCourse}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Live Lectures
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
                <MdLocalLibrary id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {libraryItems}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Library Items
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12" xs="12">
          <Card className="h-100  ">
            <Scrollbars style={{ width: '100%', height: 400 }}>
              <CardBody style={{ width: '120%' }}>
                <Table columns={cols} data={data} />
              </CardBody>
            </Scrollbars>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CourseTab;
