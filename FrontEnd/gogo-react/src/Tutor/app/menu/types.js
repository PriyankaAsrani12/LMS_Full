import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  Row,
  NavItem,
  Nav,
  TabContent,
  TabPane,
  NavLink,
  CardTitle,
  CardBody,
  Card,
  Badge,
  Col,
  CardText,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import classnames from 'classnames';
import { setContainerClassnames } from '../../../redux/actions';
import { FaFilter } from 'react-icons/fa';
import { lineChartData } from '../../../data/charts';

import { LineChart } from '../../../components/charts';
import { MdEmail } from 'react-icons/md';
import Communication_table from '../../../data/Communication_table';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { BiTime } from 'react-icons/bi';
import { RiMailSendFill } from 'react-icons/ri';
import './style.css';
import { Scrollbars } from 'react-custom-scrollbars';
import Communication_table2 from '../../../data/Communication_table2';
import Communication_table3 from '../../../data/Communication_table3';

import CourseTab from './CourseTab';
import StudentsTab from './StudentsTab';
import Blog from './Blog';
import LinkTracking from './LinkTracking';
import Affiliates from './Affiliates';
import Monetization from './Monetization';
import Communication from './Communication';

const MenuTypes = ({
  match,
  subHiddenBreakpoint,
  menuHiddenBreakpoint,
  selectedMenuHasSubItems,
  setContainerClassnamesAction,
}) => {
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
            <br />
          </TabPane>
          <TabPane tabId="2">
            <CourseTab />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="3">
            <Communication />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="4">
            <Monetization />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="5">
            <Affiliates />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="6">
            <Blog />
            <br />
            <br />
          </TabPane>
          <TabPane tabId="7">
            <LinkTracking />
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
