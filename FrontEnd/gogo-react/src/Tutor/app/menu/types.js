import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, NavItem, Nav, TabContent, TabPane, NavLink } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import classnames from 'classnames';
import { setContainerClassnames } from '../../../redux/actions';

import './style.css';
import CourseTab from './CourseTab';
import StudentsTab from './StudentsTab';
import Blog from './Blog';
import LinkTracking from './LinkTracking';
import Affiliates from './Affiliates';
import Monetization from './Monetization';
import Communication from './Communication';

const MenuTypes = ({
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
