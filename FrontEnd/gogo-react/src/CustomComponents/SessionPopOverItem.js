import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import { simplelineicons } from '../data/icons';
import axiosInstance from '../helpers/axiosInstance';
import NotificationManager from '../components/common/react-notifications/NotificationManager';

const SessionPopoverItem = ({ id, type, handleReloadTable }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (error)
      NotificationManager.warning(error, 'Session Error', 3000, 3000, null, '');
  }, [error, setError]);

  const handleDelete = async () => {
    toggle();
    try {
      const result = await axiosInstance.delete(
        `/tutor/sessions/deleteSession/${id}/${type}`
      );
      if (!result.data.success) {
        try {
          setError(result.data.error);
        } catch (e) {
          setError('Unable to delete session');
        }
      }
    } catch (err) {
      try {
        setError(err.response.data.error);
      } catch (err) {
        setError('Unable to delete session');
      }
    } finally {
      handleReloadTable();
    }
  };

  return (
    <span>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
          <HiOutlineDotsHorizontal style={{ cursor: 'pointer' }} />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            onClick={toggle}
            className={`glyph-icon ${simplelineicons[146]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Preview</span>
          </DropdownItem>
          <DropdownItem
            onClick={handleDelete}
            className={`glyph-icon ${simplelineicons[35]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </span>
  );
};
export default SessionPopoverItem;
