import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBody,
  Button,
  Form,
  Col,
} from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Scrollbars } from 'react-custom-scrollbars';

import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';
import NoDataFound from '../NoDataFound';

const ManageUsers = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reload, setRealod] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const handleReload = () => setRealod(!reload);

  const [data, setData] = useState([]);

  const [inviteUser, setInviteUser] = useState({
    invited_user_first_name: '',
    invited_user_last_name: '',
    invited_user_role: '',
    invited_user_email: '',
    invited_user_status: 0,
  });

  const handleInviteUserChange = (e) => {
    const { name, value } = e.target;
    setInviteUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const validateInviteUser = () => {
    if (!inviteUser.invited_user_first_name)
      return { error: 'provide first name', success: 0 };
    if (!inviteUser.invited_user_last_name)
      return { error: 'provide last name', success: 0 };
    if (!inviteUser.invited_user_role)
      return { error: 'provide user role', success: 0 };
    if (!inviteUser.invited_user_email)
      return { error: 'provide user email', success: 0 };
    return { success: 1 };
  };
  const handleInviteUserSubmit = async () => {
    toggle();
    console.log(inviteUser);
    const validate = validateInviteUser();
    console.log(validate);
    if (!validate.success) setError(validate.error);
    else {
      //do a network request
      try {
        const values = Object.assign(inviteUser);
        const result = await axiosInstance.post(
          '/tutor/invite/trainer/invite',
          {
            values,
          }
        );
        console.log(result);
        if (result.data.success) setSuccess('Invitation Sent');
        else setError(result.data.error);
      } catch (err) {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('unable to invite user');
        }
      } finally {
        handleReload();
      }
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'Manage Users', 3000, null, null, '');
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        success,
        'Manage Users',
        3000,
        null,
        null,
        ''
      );
      setSuccess(null);
    }
  }, [success]);

  useEffect(() => {
    const getInvitedUsers = async () => {
      try {
        const result = await axiosInstance.get('/tutor/invite/trainer');
        console.log(result);
        if (result.data.success) setData(result.data.tutors);
        else {
          try {
            setError(result.data.error);
          } catch (e) {
            setError('unable to fetch Tutors');
          }
        }
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('unable to fetch Tutors');
        }
      }
    };
    getInvitedUsers();
  }, [reload]);

  const cols = [
    {
      Header: 'Name',
      accessor: 'name',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Email',
      accessor: 'email',
      cellClass: 'color',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Role',
      accessor: 'role',
      cellClass: 'text-muted w-25',
      Cell: (props) => <p>{props.value}</p>,
      sortType: 'basic',
    },
    {
      Header: 'Invitation',
      accessor: 'invite',
      cellClass: 'text-muted w-25',
      Cell: (props) => (
        <Button
          disabled="true"
          color={props.value === 'Accepted' ? 'success' : 'danger'}
        >
          {props.value}
        </Button>
      ),
      sortType: 'basic',
    },
    {
      Header: 'Action',
      cellClass: 'text-muted w-25',
      Cell: (props) => (
        <Button
          onClick={(e) => handleDelete(props.cell.row.values)}
          color="danger"
        >
          Delete
        </Button>
      ),
      sortType: 'basic',
    },
  ];

  const handleDelete = async (data) => {
    try {
      const values = { invited_user_email: data.email };
      const result = await axiosInstance.post('/tutor/invite/trainer/delete', {
        values,
      });
      console.log(result);
      if (result.data.success) setSuccess('Tutor deleted successfuly');
      else {
        try {
          setError('unable to delete tutor');
        } catch (error) {
          setError('unable to delete tutor');
        }
      }
    } catch (err) {
      try {
        setError(err.response.data.error);
      } catch (error) {
        setError('unable to delete tutor');
      }
    } finally {
      handleReload();
    }
  };
  return (
    <>
      <Button
        onClick={toggle}
        className="mx-auto d-flex mb-4"
        style={{ borderRadius: '0px' }}
      >
        Invite User
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <Form>
          <ModalBody>
            <label>First Name</label>
            <Input
              type="text"
              placeholder="Example: John"
              name="invited_user_first_name"
              value={inviteUser.invited_user_first_name}
              onChange={handleInviteUserChange}
            />
            <label>Last Name</label>
            <Input
              type="text"
              placeholder="Example: Doe"
              name="invited_user_last_name"
              value={inviteUser.invited_user_last_name}
              onChange={handleInviteUserChange}
            />
            <label>Role</label>
            <Input
              type="text"
              placeholder="Example: Tutor"
              name="invited_user_role"
              value={inviteUser.invited_user_role}
              onChange={handleInviteUserChange}
            />
            <label>Email</label>
            <Input
              type="email"
              placeholder="Example: johndoe@gmail.com"
              name="invited_user_email"
              value={inviteUser.invited_user_email}
              onChange={handleInviteUserChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleInviteUserSubmit}>
              Submit
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      {!data.length ? (
        <NoDataFound />
      ) : (
        <>
          <Row>
            <Col md="12" xs="12">
              <Card className="h-100  ">
                <Scrollbars style={{ width: '100%', height: 400 }}>
                  <CardBody>
                    <Table columns={cols} data={data} />
                  </CardBody>
                </Scrollbars>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

const Table = ({ columns, data }) => {
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
};

export default ManageUsers;
