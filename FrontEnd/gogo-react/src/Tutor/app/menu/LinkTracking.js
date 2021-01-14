import React, { useEffect, useState } from 'react';
import {
  Row,
  Button,
  CardBody,
  Card,
  Col,
  CardText,
  Modal,
  FormGroup,
  Input,
} from 'reactstrap';
import { FaUsers } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa';
import { MdVisibility } from 'react-icons/md';
import { FaGlobeAsia } from 'react-icons/fa';
import { Scrollbars } from 'react-custom-scrollbars';
import { Line } from 'react-chartjs-2';

import linkTraking from '../../../data/linkTraking';
import ShowForm from './ShowForm';
import Table from './Table';
import NotificationManager from '../../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../../helpers/axiosInstance';
import NoDataFound from '../../../CustomComponents/NoDataFound';

const LinkTracking = () => {
  const [chartstatus, setchartstatus] = useState(false);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalUniqueVisits, setTotalUniqueVisits] = useState(0);
  const [totalDistinctCountries, setTotalDistinctCountries] = useState(0);

  const [modal, setModal] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);

  const cols20 = [
    {
      Header: 'Link Name',
      accessor: 'link_name',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Link',
      accessor: 'link',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p className="">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Visits',
      accessor: 'visits',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Unique visits',
      accessor: 'u_visits',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Average Session Duration',
      accessor: 'av_ses_dur',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p style={{ marginLeft: '70px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Bouce Rates',
      accessor: 'bounce_rate',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p style={{ marginLeft: '50px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Realtime(Last 30min)',
      accessor: 'real_time_30',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p style={{ marginLeft: '40px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Realtime(Last 24hrs)',
      accessor: 'real_time_24',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p style={{ marginLeft: '50px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Country Name',
      accessor: 'lcwp',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'City Name',
      accessor: 'lcwv',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p style={{ marginLeft: '0px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Distinct Countries',
      accessor: 'dc',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p style={{ marginLeft: '50px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Device Type',
      accessor: 'device_type',
      cellClass: 'text-muted w-5',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Views in one week for #link1',
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
        label: 'Views in one week for #link2',
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
    ],
  };
  const data2 = {
    labels: ['Thu', 'Fri', 'Sat', 'Sun'],
    /* scaleShowLabels: false, */
    datasets: [
      {
        label: 'Views in one week for #link1',
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
        label: 'Views in one week for #link2',
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
    ],
  };

  const changechart = () => {
    setchartstatus(!chartstatus);
    console.log(chartstatus);
  };
  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (error) {
      NotificationManager.warning(
        error,
        'Get Url Track Error',
        3000,
        null,
        null,
        ''
      );
    }
  }, [error]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/shorturl');
        console.log(result);
        if (result.data.success) {
          let unique = 0;
          const data = result.data.result.map((doc) => {
            unique += doc.link_unique_visits;
            return {
              id: doc.link_id,
              link_name: doc.link_name,
              link: `https://tracking.oyesters.in/new.html?${doc.link_short_url}`,
              visits: 56,
              u_visits: doc.link_unique_visits,
              av_ses_dur: doc.link_average_session_duration,
              color: 'danger',
              Rewards_g: '$44 (Static)',
              bounce_rate: doc.link_bounce_rates,
              real_time_30: doc.link_last_30_min_visitors,
              real_time_24: doc.link_last_24_hr_visitors,
              lcwp: doc.link_country_name,
              lcwv: doc.link_city_name,
              dc: doc.link_distinct_country_visitors,
              device_type: doc.link_device_type_visitors,
            };
          });
          setTableData(data);
          setTotalLinks(data.length);
          // setTotalVisits();
          setTotalUniqueVisits(unique);
          // setTotalDistinctCountries();
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Failed to fetch link tracking details');
          }
        }
      } catch (error) {
        console.log(error);
        try {
          setError(error.response.data.error);
        } catch (error) {
          setError('Failed to fetch link tracking details');
        }
      }
    };
    getData();
  }, []);

  if (!tableData.length) return <NoDataFound />;
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
                <FaLink id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {totalLinks}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total links
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
                <MdVisibility id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6">
                <CardText className="font-weight-bold head text-light">
                  {totalVisits}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total visits
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
                <FaUsers id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  {totalUniqueVisits}
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Unique visits
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
                <FaGlobeAsia id="myicon" className="text-light" />
              </Col>
              <Col md="6" xs="6" className="mb-3">
                <CardText className="font-weight-bold head text-light">
                  6
                </CardText>
                <CardText className="font-weight-bold para text-light">
                  Total Distinct Countries (static)
                </CardText>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <br />
      <h1 style={{ marginLeft: '40%', marginRight: 'auto' }}>
        Tracking Url{' '}
      </h1>{' '}
      <br />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '10px',
        }}
      >
        <Button color="danger" onClick={toggle}>
          Create Shortened Url
        </Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ShowForm
            toggle={toggle}
            setShortUrl={setShortUrl}
            setError={setError}
          />
        </Modal>
        <p>
          {' '}
          {shortUrl
            ? `https://tracking.oyesters.in/new.html?${shortUrl}`
            : ''}{' '}
        </p>
      </div>
      <Card>
        <FormGroup className="ml-auto mr-4 mt-4">
          <Input
            type="select"
            name="select"
            id="exampleSelect"
            style={{ width: '150px' }}
            onChange={changechart}
          >
            <option>Select filter</option>
            <option>Last 7 days</option>
            <option>Last 4 days</option>
          </Input>
        </FormGroup>

        <CardBody style={{}}>
          {chartstatus ? (
            <Line data={data} style={{ marginTop: '-100px' }} />
          ) : (
            <Line data={data2} style={{ marginTop: '-100px' }} />
          )}
        </CardBody>
      </Card>
      <br />
      <Card className="h-100 ">
        <Scrollbars style={{ width: '100%', height: 400 }}>
          <CardBody style={{ width: '260%' }}>
            <Table columns={cols20} data={tableData} />
          </CardBody>
        </Scrollbars>
      </Card>
    </>
  );
};

export default LinkTracking;
