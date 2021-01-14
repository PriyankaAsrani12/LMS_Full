import React, { useState, useEffect } from 'react';
import {
  Row,
  NavItem,
  Nav,
  TabContent,
  TabPane,
  NavLink,
  CardBody,
  Card,
  Col,
  CardText,
} from 'reactstrap';
import { FaBlog } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { BiCheckDouble } from 'react-icons/bi';
import { AiOutlineExclamation } from 'react-icons/ai';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

import Table from './Table';
import axiosInstance from '../../../helpers/axiosInstance';
import NotificationManager from '../../../components/common/react-notifications/NotificationManager';
import NoDataFound from '../../../CustomComponents/NoDataFound';

const Blog = () => {
  const [activeFirstTab2, setActiveFirstTab2] = useState('13');
  const [error, setError] = useState(null);
  const cols12 = [
    {
      Header: 'Blog Name',
      accessor: 'name',
      cellClass: 'text-muted w-30',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Blogger Name',
      accessor: 'b_name',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p className="ml-4 mr-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Comments',
      accessor: 'comments',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Like',
      accessor: 'like',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const cols13 = [
    {
      Header: 'Blogger Name',
      accessor: 'b_name',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Total number of Blogs',
      accessor: 'tnbp',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p className="ml-4 mr-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Total number of Comments',
      accessor: 'comments',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Total Likes',
      accessor: 'like',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
  ];

  const [tab1Data, setTab1Data] = useState([]);
  const [tab2Data, setTab2Data] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);

  useEffect(() => {
    if (error)
      NotificationManager.warning(error, 'Blog Error', 3000, 3000, null, '');
  }, [error]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/blog');
        console.log(result);
        if (result.data.success) {
          const data1 = result.data.result1.map((doc) => ({
            name: doc.blog_title,
            b_name: doc.blog_writer_name,
            comments: '23 (Static Data)',
            like: '12 (Static Data)',
          }));
          const data2 = result.data.result2.map((doc) => ({
            b_name: doc.blog_writer_name,
            tnbp: doc.total_blogs,
            comments: '23 (Static Data)',
            like: '12 (Static Data)',
          }));
          setTab1Data(data1);
          setTab2Data(data2);
          setTotalBlogs(data1.length);
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

  if (!tab1Data.length) return <NoDataFound />;

  return (
    <>
      <Row>
        <Col sm="3" xs="12" className="mb-3">
          <Card
            body
            id="crd"
            className="text-center"
            style={{ backgroundColor: '#0984e3' }}
          >
            <Row>
              <Col md="6" xs="6">
                <FaBlog id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {totalBlogs}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Blogs
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
            style={{ backgroundColor: '#6c5ce7' }}
          >
            <Row>
              <Col md="6" xs="6">
                <FaComments id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  22
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Comments (Static Data)
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
            style={{ backgroundColor: '#e17055' }}
          >
            <Row>
              <Col md="6" xs="6">
                <BiCheckDouble id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText
                  className="font-weight-bold head text-light" /*  style={{fontSize:'30px', marginTop:'30px'}} */
                >
                  143
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Page Views (Static Data)
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
            style={{ backgroundColor: '#e84393' }}
          >
            <Row>
              <Col md="6" xs="6">
                <AiOutlineExclamation id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  60
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Unique Pageviews (Static Data)
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
              <CardBody>
                <Nav tabs className="card-header-tabs mb-3">
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab2 === '13',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab2('13');
                      }}
                    >
                      <h6>Blogs</h6>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="#"
                      location={{}}
                      className={classnames({
                        active: activeFirstTab2 === '14',
                        'nav-link': true,
                      })}
                      onClick={() => {
                        setActiveFirstTab2('14');
                      }}
                    >
                      <h6>Blogger</h6>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeFirstTab2}>
                  <TabPane tabId="13">
                    <Table columns={cols12} data={tab1Data} />
                  </TabPane>
                  <TabPane tabId="14">
                    <Table columns={cols13} data={tab2Data} />
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

export default Blog;
