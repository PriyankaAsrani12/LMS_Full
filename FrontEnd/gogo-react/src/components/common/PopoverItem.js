import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { simplelineicons } from '../../data/icons';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

const PopoverItem = ({ id, item }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

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
            className={`glyph-icon ${simplelineicons[114]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <a href="" className="ml-4">
              Edit
            </a>
          </DropdownItem>
          <DropdownItem
            onClick={toggle}
            className={`glyph-icon ${simplelineicons[146]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Preview</span>
          </DropdownItem>
          <DropdownItem
            onClick={toggle}
            className={`glyph-icon ${simplelineicons[35]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Delete</span>
          </DropdownItem>
          <DropdownItem
            onClick={toggle}
            className={`glyph-icon ${simplelineicons[143]} mr-2`}
            style={{ fontSize: '1.1rem' }}
          >
            <span className="ml-4">Download</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </span>
  );
};
export default PopoverItem;
