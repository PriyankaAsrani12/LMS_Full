import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  Row,
  Button,
  NavItem,
  Nav,
  TabContent,
  TabPane,
  NavLink,
  Table,
  CardTitle,
  CardBody,
  Card,
  Badge,
  Col,
  CardText,
  UncontrolledDropdown,
  Modal,
  FormGroup,
  Input,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import classnames from 'classnames';
import { setContainerClassnames } from '../../../redux/actions';
import my_table from '../../../data/my_table';
import affiliate from '../../../data/affiliate';
import { FaShoePrints, FaUsers } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
import { LineChart } from '../../../components/charts';
import { lineChartData } from '../../../data/charts';
import { MdEmail } from 'react-icons/md';
import { FaBookOpen } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { AiFillBank } from 'react-icons/ai';
import { FaHandHoldingUsd } from 'react-icons/fa';
import Communication_table from '../../../data/Communication_table';
import Monitization_table from '../../../data/Monitization_table';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { BiTime } from 'react-icons/bi';
import { RiMailSendFill } from 'react-icons/ri';
import { IoIosPeople } from 'react-icons/io';
import { FaUserCheck } from 'react-icons/fa';
import { FaBlog } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa';
import { BiCheckDouble } from 'react-icons/bi';
import { AiOutlineExclamation } from 'react-icons/ai';
import { MdVisibility } from 'react-icons/md';
import { FaGlobeAsia } from 'react-icons/fa';
import './style.css';
import { Scrollbars } from 'react-custom-scrollbars';
import my_table_courses from '../../../data/my_table_courses';
import Communication_table2 from '../../../data/Communication_table2';
import Communication_table3 from '../../../data/Communication_table3';

import affiliate2 from '../../../data/affiliate2';
import { Line } from 'react-chartjs-2';
import linkTraking from '../../../data/linkTraking';
import countries from '../../../data/countries';
import cities from '../../../data/cities';
import d_countries from '../../../data/d_countries';
import device from '../../../data/device';
import ShowForm from './ShowForm';
import { NotificationManager } from '../../../components/common/react-notifications';
import { BsTypeStrikethrough } from 'react-icons/bs';
import CourseTab from './CourseTab';
import StudentsTab from './StudentsTab';
import Blog from './Blog';

const MenuTypes = ({
  match,
  subHiddenBreakpoint,
  menuHiddenBreakpoint,
  selectedMenuHasSubItems,
  setContainerClassnamesAction,
}) => {
  const [modal, setModal] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState(null);

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

  const getMenuClassesForResize = (classes) => {
    let nextClasses = classes.split(' ').filter((x) => x !== '');
    const windowWidth = window.innerWidth;
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter((x) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter((x) => x !== 'menu-sub-hidden');
      }
    }
    return nextClasses;
  };

  const changeDefaultMenuType = (e, classes) => {
    e.preventDefault();
    const nextClasses = getMenuClassesForResize(classes);

    setContainerClassnamesAction(
      0,
      nextClasses.join(' '),
      selectedMenuHasSubItems
    );
  };
  const name = ['Peter', 'Bruce', 'Kent', 'Tony', 'Joker'];
  const cols2 = [
    {
      Header: 'Course',
      accessor: 'title',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Registrations',
      accessor: 'status',
      cellClass: 'color',
      Cell: (props) => <p style={{ marginLeft: '30px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Enrolled',
      accessor: 'fee',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p style={{ marginLeft: '30px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Revenue',
      accessor: 'sb',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Library space consumed',
      accessor: 're',
      cellClass: 'text-muted w-30',
      Cell: (props) => <p style={{ marginLeft: '90px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Bandwidth',
      accessor: 'NOC',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p style={{ marginLeft: '30px' }}>{props.value}</p>,
      sortType: 'basic',
    },
  ];

  const cols16 = [
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

  const cols15 = [
    {
      Header: 'Course Name',
      accessor: 'Course_n',
      cellClass: 'text-muted ',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Total Enrollments',
      accessor: 'te',
      cellClass: 'text-muted ',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Enrollments by Affiliate',
      accessor: 'Revenue',
      cellClass: 'text-muted ',
      Cell: (props) => <p style={{ marginLeft: '50px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Revenue Generated by Affiliate',
      accessor: 'rge',
      cellClass: 'text-muted ',
      Cell: (props) => <p style={{ marginLeft: '90px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Rewards Given',
      accessor: 'Rewards_g',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p style={{ marginLeft: '50px' }}>{props.value}</p>,
      sortType: 'basic',
    },
  ];

  const cols11 = [
    {
      Header: 'Affiliate Name',
      accessor: 'affiliate_name',
      cellClass: 'text-muted ',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Number of Enrollments',
      accessor: 'noe',
      cellClass: 'text-muted ',
      Cell: (props) => <p className="text-center">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Revenue Generated',
      accessor: 'Revenue',
      cellClass: 'text-muted ',
      Cell: (props) => <p style={{ marginLeft: '70px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Rewards Given',
      accessor: 'Rewards',
      cellClass: 'text-muted ',
      Cell: (props) => <p style={{ marginLeft: '50px' }}>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Course Name',
      accessor: 'Course',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const cols21 = [
    {
      Header: 'Country',
      accessor: 'country',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Visitor%',
      accessor: 'visited',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="text-center">{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const cols23 = [
    {
      Header: 'Visitors from countries',
      accessor: 'Country',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const cols24 = [
    {
      Header: 'Visitors according devices',
      accessor: 'device',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: '%',
      accessor: 'Percentage',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
  ];
  const cols22 = [
    {
      Header: 'Cities',
      accessor: 'city',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-2">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Visitor %',
      accessor: 'visited',
      cellClass: 'text-muted w-15',
      Cell: (props) => <p className="text-center">{props.value}</p>,
      sortType: 'basic',
    },
  ];
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

  const cols = [
    {
      Header: 'Name',
      accessor: 'title',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Contact No.',
      accessor: 'ph',
      cellClass: 'text-muted',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Email',
      accessor: 'email',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Total Courses',
      accessor: 'NOC',
      cellClass: 'text-muted w-15 ',
      Cell: (props) => <p className="text-center">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Fee Paid',
      accessor: 'fee',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p className="text-center">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Referrals',
      accessor: 'sb',
      cellClass: 'text-muted w-10',
      Cell: (props) => <p className="text-center">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Reward Earned',
      accessor: 're',
      cellClass: 'text-muted w-20',
      Cell: (props) => <p className="ml-4">{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Status',
      accessor: 'status',
      cellClass: 'color w-10',
      Cell: (props) => {
        if (props.value == 'Registered') {
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
  ];
  function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      prepareRow,
      headerGroups,
      page,
      canPreviousPage,
      canNextPage,
      pageCount,
      gotoPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 6 },
      },
      useSortBy,
      usePagination
    );

    return (
      <>
        <table {...getTableProps()} className="r-table table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    key={`th_${columnIndex}`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? 'sorted-desc'
                          : 'sorted-asc'
                        : ''
                    }
                  >
                    {column.render('Header')}
                    <span />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      key={`td_${cellIndex}`}
                      {...cell.getCellProps({
                        className: cell.column.cellClass,
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* <DatatablePagination
            page={pageIndex}
            pages={pageCount}
            canPrevious={canPreviousPage}
            canNext={canNextPage}
            pageSizeOptions={[4, 10, 20, 30, 40, 50]}
            showPageSizeOptions={false}
            showPageJump={false}
            defaultPageSize={pageSize}
            onPageChange={(p) => gotoPage(p)}
            onPageSizeChange={(s) => setPageSize(s)}
            paginationMaxSize={pageCount}
          /> */}
      </>
    );
  }
  const [activeFirstTab, setActiveFirstTab] = useState('1');
  const [activeFirstTab1, setActiveFirstTab1] = useState('8');
  const [activeFirstTab2, setActiveFirstTab2] = useState('13');
  const [activeFirstTab6, setActiveFirstTab6] = useState('20');
  const [chartstatus, setchartstatus] = useState(false);

  const changechart = () => {
    setchartstatus(!chartstatus);
    console.log(chartstatus);
  };
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

  return (
    <>
      <Row>
        <Colxx xxs="12"></Colxx>
      </Row>

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
            <h6>Students</h6>
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
            <h6>Courses</h6>
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
            <h6>Communication</h6>
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
            <h6>Monetization</h6>
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
            <h6>Affiliate</h6>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to="#"
            location={{}}
            className={classnames({
              active: activeFirstTab === '6',
              'nav-link': true,
            })}
            onClick={() => {
              setActiveFirstTab('6');
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
              active: activeFirstTab === '7',
              'nav-link': true,
            })}
            onClick={() => {
              setActiveFirstTab('7');
            }}
          >
            <h6>Link Traking</h6>
          </NavLink>
        </NavItem>
        {/* <FormGroup className="mb-4 d-flex float-right ml-auto" id="search">
                    <Input type="email" className="d-flex" id="exampleEmail" placeholder="Search anything" />
                    <Button id="searchbutton" className="d-flex ml-2">Search</Button>
                  </FormGroup> */}
      </Nav>
      <div className="mb-4">
        <TabContent activeTab={activeFirstTab}>
          <TabPane tabId="1">
            <StudentsTab />
            {/* <Card className="h-120 ">
              <Scrollbars style={{ width: '100%', height: 400 }}>
                <CardBody>
                  <Table columns={cols} data={my_table} />
                </CardBody>
              </Scrollbars>
            </Card> */}
            <br />
          </TabPane>
          <TabPane tabId="2">
            <CourseTab />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="3">
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
                        76
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
                        43
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
                      <BiMessageRoundedDots
                        id="myicon"
                        className="text-light"
                      />
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
                        60
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
                    <div className="thecard">
                      <span id="dott"></span>
                      <small className="ml-2">Text Messages</small>
                      <span id="dott2"></span>
                      <small id="no" className="ml-2">
                        Whattsapp
                      </small>
                      <span id="dott3"></span> <small id="no">Spendings</small>
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
                  <div className="dashboard-line-chart">
                    <LineChart shadow data={lineChartData} />
                  </div>
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
                          <Table columns={cols3} data={Communication_table} />
                        </TabPane>
                        <TabPane tabId="9">
                          <Table columns={cols8} data={Communication_table2} />
                        </TabPane>
                        <TabPane tabId="10">
                          <Table columns={cols9} data={Communication_table3} />
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <br />
            <br />
          </TabPane>
          <TabPane tabId="4">
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
                        42
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
                        22
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
                      <RiMoneyDollarCircleFill
                        id="myicon"
                        className="text-light"
                      />
                    </Col>
                    <Col md="6" xs="6" className="mb-3">
                      <CardText className="font-weight-bold head text-light">
                        31
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
                        60
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
                      <Table columns={cols4} data={Monitization_table} />
                    </CardBody>
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <br />
            <br />
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <Col sm="3" xs="12" className="mb-3">
                <Card
                  body
                  id="crd"
                  className="text-center"
                  style={{ backgroundColor: '#FFA07A' }}
                >
                  <Row>
                    <Col md="6" xs="6">
                      <IoIosPeople id="myicon" className="text-light" />
                    </Col>
                    <Col md="6" xs="6">
                      <CardText className="font-weight-bold head text-light">
                        42
                      </CardText>
                      <CardText className="font-weight-bold para text-light">
                        Total Affiliates
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
                  style={{ backgroundColor: '#AF7AC5' }}
                >
                  <Row>
                    <Col md="6" xs="6">
                      <FaUserCheck id="myicon" className="text-light" />
                    </Col>
                    <Col md="6" xs="6">
                      <CardText className="font-weight-bold head text-light">
                        22
                      </CardText>
                      <CardText className="font-weight-bold para text-light">
                        Total Enrollments
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
                  style={{ backgroundColor: '#52BE80' }}
                >
                  <Row>
                    <Col md="6" xs="6">
                      <RiMoneyDollarCircleFill
                        id="myicon"
                        className="text-light"
                      />
                    </Col>
                    <Col md="6" xs="6" className="mb-3">
                      <CardText
                        className="font-weight-bold head text-light" /*  style={{fontSize:'30px', marginTop:'30px'}} */
                      >
                        $11
                      </CardText>
                      <CardText className="font-weight-bold para text-light">
                        Total Revenue
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
                  style={{ backgroundColor: '#5499C7' }}
                >
                  <Row>
                    <Col md="6" xs="6">
                      <FaHandHoldingUsd id="myicon" className="text-light" />
                    </Col>
                    <Col md="6" xs="6" className="mb-3">
                      <CardText className="font-weight-bold head text-light">
                        60
                      </CardText>
                      <CardText className="font-weight-bold para text-light">
                        Total Rewards given
                      </CardText>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12" xs="12">
                <Card className="h-100 pl-4  ">
                  <Nav tabs className="card-header-tabs ">
                    <NavItem style={{ marginTop: '40px', MarginLeft: '40px' }}>
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: activeFirstTab6 === '20',
                          'nav-link': true,
                        })}
                        onClick={() => {
                          setActiveFirstTab6('20');
                        }}
                      >
                        <h6>Affiliate Name</h6>
                      </NavLink>
                    </NavItem>
                    <NavItem style={{ marginTop: '40px', MarginLeft: '40px' }}>
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: activeFirstTab6 === '21',
                          'nav-link': true,
                        })}
                        onClick={() => {
                          setActiveFirstTab6('21');
                        }}
                      >
                        <h6>Course Name</h6>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <Scrollbars style={{ width: '100%', height: 400 }}>
                    <CardBody style={{ width: '120%' }}>
                      <TabContent activeTab={activeFirstTab6}>
                        <TabPane tabId="20">
                          <Table columns={cols11} data={affiliate} />{' '}
                        </TabPane>
                        <TabPane tabId="21">
                          <Table columns={cols15} data={affiliate2} />{' '}
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <br />
            <br />
          </TabPane>
          <TabPane tabId="6">
            <Blog />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="7">
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
                        16
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
                        43
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
                        12
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
                        Total Distinct Countries
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
            {/* <Button>
              Create
              <ShowForm />
            </Button> */}
            {/* <ShowForm /> */}
            <Card /* style={{height: '500px'}} */>
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
                  <Table columns={cols20} data={linkTraking} />
                </CardBody>
              </Scrollbars>
            </Card>
            <br />
            <br />
            <br />
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};
const mapStateToProps = ({ menu }) => {
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems,
  } = menu;
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems,
  };
};

export default connect(mapStateToProps, {
  setContainerClassnamesAction: setContainerClassnames,
})(MenuTypes);
