import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import './navs.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
} from 'reactstrap';

import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
} from '../../redux/actions';

import { searchPath, adminRoot } from '../../constants/defaultValues';
import message from '../../data/message';
import { MobileMenuIcon, MenuIcon } from '../../components/svg';
import TopnavNotifications from './Topnav.Notifications';

const Messages = ({ img, title, date }) => {
  return (
    <div>
      <div
        className="border-bottom-3 d-flex"
        style={{ marginLeft: '-15px', marginRight: '-15px' }}
      >
        <Row className="ml-2">
          <Col md={2}>
            <img
              src={img}
              style={{ width: '300%', borderRadius: '50%', display: 'flex' }}
            />
          </Col>
          <Col md={10}>
            <p className="font-weight-medium mb-1 ml-3 d-flex">{title}</p>
          </Col>
          <p
            className="text-muted mt-1 mb-0  text-small d-flex"
            style={{ marginLeft: '70px' }}
          >
            {date}
          </p>
        </Row>
      </div>
      <DropdownItem
        divider
        style={{ width: '200px', backgroundColor: '#F1F1F1', color: '#F1F1F1' }}
      />
    </div>
  );
};

const TopNav = ({
  intl,
  history,
  containerClassnames,
  menuClickCount,
  selectedMenuHasSubItems,
  setContainerClassnamesAction,
  clickOnMobileMenuAction,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [status, setstatus] = useState(true);

  const search = () => {
    history.push(`${searchPath}?key=${searchKeyword}`);
    setSearchKeyword('');
  };

  const handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('navbar') ||
        e.target.classList.contains('simple-icon-magnifier'))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains('simple-icon-magnifier')) {
        search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains('search')
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) input.classList.remove('mobile-view');
      removeEventsSearch();
      setSearchKeyword('');
    }
  };

  const removeEventsSearch = () => {
    document.removeEventListener('click', handleDocumentClickSearch, true);
  };

  const menuButtonClick = (e, _clickCount, _conClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);
    setContainerClassnamesAction(
      _clickCount + 1,
      _conClassnames,
      selectedMenuHasSubItems
    );
  };

  const mobileMenuButtonClick = (e, _containerClassnames) => {
    e.preventDefault();
    clickOnMobileMenuAction(_containerClassnames);
  };

  const { messages } = intl;
  return (
    <Row>
      <Col xs="12">
        <nav className="navbar fixed-top navj">
          <div className="d-flex align-items-center navbar-left">
            <NavLink
              to="#"
              location={{}}
              className="menu-button d-none d-md-block"
              onClick={(e) =>
                menuButtonClick(e, menuClickCount, containerClassnames)
              }
            >
              <MenuIcon className="menuicon" />
            </NavLink>
            <NavLink
              to="#"
              location={{}}
              className="menu-button-mobile d-xs-block d-sm-block d-md-none mr-4"
              onClick={(e) => mobileMenuButtonClick(e, containerClassnames)}
            >
              <MobileMenuIcon />
            </NavLink>

            <NavLink className="navbar-logo" id="logolink" to={adminRoot}>
              {!status ? (
                <img src={require(`./white.png`)} className="Logo" />
              ) : (
                <img src={require(`./black.png`)} className="Logo" />
              )}
              {console.log(status)}
            </NavLink>
          </div>

          <div className="navbar-right">
            <i className=" text-muted mt-3" />

            <TopnavNotifications
              className="noti mr-4"
              style={{ fontSize: '25px' }}
            />

            <div className="header-icons d-inline-block align-middle">
              <UncontrolledDropdown className="ml-auto">
                <DropdownToggle
                  className="header-icon notificationButton"
                  color="empty"
                >
                  <i
                    className="simple-icon-speech"
                    style={{ fontSize: '20px' }}
                  />
                  <span className="count">2</span>
                </DropdownToggle>
                <DropdownMenu
                  className="position-absolute mt-3 scroll"
                  right
                  id="notificationDropdown"
                >
                  <PerfectScrollbar
                    options={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {message.map((mess, index) => {
                      return (
                        <NavLink to="/app/message">
                          <Messages key={index} {...mess} />
                        </NavLink>
                      );
                    })}
                  </PerfectScrollbar>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            <div className="user d-inline-block">
              <UncontrolledDropdown className="dropdown-menu-right">
                <DropdownToggle className="p-0" color="empty">
                  <span className="img">
                    <img alt="Profile" src="/assets/img/profiles/l-1.jpg" />
                  </span>
                </DropdownToggle>
              </UncontrolledDropdown>
            </div>
          </div>
        </nav>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ menu, settings }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnamesAction: setContainerClassnames,
    clickOnMobileMenuAction: clickOnMobileMenu,
    logoutUserAction: logoutUser,
    changeLocaleAction: changeLocale,
  })(TopNav)
);
