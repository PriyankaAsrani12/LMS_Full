import React, { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { simplelineicons } from '../../data/icons';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import axiosInstance from '../../helpers/axiosInstance';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

const PopoverItem = ({ id, type, handleReloadTable }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Library Items Error',
        3000,
        3000,
        null,
        ''
      );
  }, [error, setError]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleDelete = async () => {
    try {
      toggle();
      const result = await axiosInstance.delete(`/tutor/library/${id}`);
      console.log(result);
      if (!result.data.success) {
        try {
          setError(result.data.error);
        } catch (error) {
          setError('Unable to delete library item');
        }
      }
    } catch (error) {
      try {
        setError(error.response.data.error);
      } catch (error) {
        setError('Can not delete library item');
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
          {type == 'quiz' ? (
            <DropdownItem
              onClick={toggle}
              className={`glyph-icon ${simplelineicons[114]} mr-2`}
              style={{ fontSize: '1.1rem' }}
            >
              <a href="" className="ml-4">
                Edit
              </a>
            </DropdownItem>
          ) : (
            ''
          )}

          {/* <DropdownItem
            onClick={toggle}
            className={`glyph-icon ${simplelineicons[146]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Preview</span>
          </DropdownItem> */}

          <DropdownItem
            onClick={handleDelete}
            className={`glyph-icon ${simplelineicons[35]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Delete</span>
          </DropdownItem>
          {/* <DropdownItem
            onClick={toggle}
            className={`glyph-icon ${simplelineicons[143]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Download</span>
          </DropdownItem> */}
        </DropdownMenu>
      </Dropdown>
    </span>
  );
};
export default PopoverItem;
