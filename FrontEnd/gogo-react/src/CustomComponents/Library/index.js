import React, { useState, useEffect, useContext } from 'react';
import { NavItem, Nav, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import '../Customcss.css';
import Table from './Table';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';
import Loader from '../settings/Loader';

import AllItems from './AllItems';
import Video from './Video';
import Recordings from './Recordings';
import Assignment from './Assignment';
import Quiz from './Quiz';
import NoDataFound from '../NoDataFound';
import { LibraryContextProvider } from '../../context/LibraryContext';

const LibraryIndex = () => {
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

  return (
    <LibraryContextProvider>
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
            <AllItems columns={cols} />
          </TabPane>
          <TabPane tabId="2">
            <Video columns={cols} style={{ fontSize: '16px' }} />
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
    </LibraryContextProvider>
  );
};

export default LibraryIndex;
