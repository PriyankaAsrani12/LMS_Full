import React, { useState, useEffect } from 'react';
import { NavItem, Nav, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import '../Customcss.css';
import Table from './Table';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';
import Loader from '../settings/Loader';

import Video from './Video';
import Recordings from './Recordings';
import Assignment from './Assignment';
import Quiz from './Quiz';

const Library = () => {
  const [data, setData] = useState([
    {
      name: 'quiz-1',
      size: '---',
      type: 'Quiz',
      uploaded: '28-10-2020',
    },
    {
      name: 'Notes-1',
      size: '20Mb',
      type: 'Handouts',
      uploaded: '28-10-2020',
    },
    {
      name: 'Notes-2',
      size: '30Mb',
      type: 'Handouts',
      uploaded: '28-10-2020',
    },
    {
      name: 'Introduction to Arduino IDE',
      size: '300Mb',
      type: 'Video',
      uploaded: '27-10-2020',
    },
    {
      name: 'Projects on Arduino IDE',
      size: '30Mb',
      type: 'Zip',
      uploaded: '27-10-2020',
    },
  ]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (error)
      NotificationManager.warning(error, 'Library Items', 3000, null, null, '');
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/library');
        console.log(result);
        if (result.data.success) {
          const data = result.data.result.map((doc) => {
            if (doc.item_type == 'quiz') doc.item_size = '---';
            else if (doc.item_size / 1024 <= 1024)
              doc.item_size = `${(doc.item_size / 1024).toFixed(2)}Kb`;
            else if (doc.item_size / 1048576 <= 1024)
              doc.item_size = `${(doc.item_size / 1048576).toFixed(2)}Mb`;
            else doc.item_size = `${(doc.item_size / 1073741824).toFixed(2)}Gb`;
            return {
              name: doc.item_name,
              size: doc.item_size,
              type: doc.item_type,
              uploaded: doc.updatedAt.substr(0, 10),
            };
          });
          setData(data);
        } else {
          try {
            setError(result.data.error);
          } catch (e) {
            setError('Unable to fetch data');
          }
        }
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (e) {
          setError('Unable to fetch data');
        }
      } finally {
        setIsLoaded(true);
      }
    };
    getData();
  }, []);

  const [activeFirstTab, setActiveFirstTab] = useState('1');
  const cols = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        cellClass: 'list-item-heading w-40 n',
        Cell: (props) => <p>{props.value}</p>,
      },
      {
        Header: 'Uploaded At',
        accessor: 'uploaded',
        cellClass: 'text-muted  w-20 n',
        Cell: (props) => <p>{props.value}</p>,
      },
      {
        Header: 'Type',
        accessor: 'type',
        cellClass: 'text-muted  w-20 n',
        Cell: (props) => <p>{props.value}</p>,
      },
      {
        Header: 'Size',
        accessor: 'size',
        cellClass: 'text-muted  w-20 n',
        Cell: (props) => <p>{props.value}</p>,
      },
    ],
    []
  );

  //backend team find a way to sort or filter data via this feature and show in tabs
  if (!isLoaded) return <Loader />;

  if (!data.length)
    return <div style={{ marginBottom: '25rem' }}>No Data Found</div>;
  return (
    <>
      <br />
      <Nav tabs className="card-header-tabs mb-3">
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
            <h6>All</h6>
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
            <h6>Video</h6>
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
            <h6>Recordings</h6>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to="#"
            location={{}}
            className={classnames({
              active: activeFirstTab === '4',
              'nav-link': true,
            })}
            onClick={() => {
              setActiveFirstTab('4');
            }}
          >
            <h6>Assignment</h6>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to="#"
            location={{}}
            className={classnames({
              active: activeFirstTab === '5',
              'nav-link': true,
            })}
            onClick={() => {
              setActiveFirstTab('5');
            }}
          >
            <h6>Quiz</h6>
          </NavLink>
        </NavItem>
      </Nav>
      <div className="mb-4">
        <TabContent activeTab={activeFirstTab}>
          <TabPane tabId="1">
            <Table columns={cols} data={data} divided />
          </TabPane>
          <TabPane tabId="2">
            <Video
              columns={cols}
              data={data}
              divided
              style={{ fontSize: '16px' }}
            />
          </TabPane>
          <TabPane tabId="3">
            <Recordings columns={cols} />
          </TabPane>
          <TabPane tabId="4">
            <Assignment columns={cols} />
          </TabPane>
          <TabPane tabId="5">
            <Quiz columns={cols} />
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default Library;
