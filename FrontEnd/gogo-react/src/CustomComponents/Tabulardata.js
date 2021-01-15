import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import classnames from 'classnames';
import CreateSession from './CreateSessions';
import './Customcss.css';
import PopoverItem from './SessionPopOverItem';
import { Link } from 'react-router-dom';
import { adminRoot } from '../constants/defaultValues';
import axiosInstance from '../helpers/axiosInstance';
import { DropDownContext } from '../context/DropdownContext';

function Table({ columns, data, handleReloadTable, divided = false }) {
  let {
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
      initialState: { pageIndex: 0, pageSize: data.length },
    },
    useSortBy,
    usePagination
  );
  let [name, setName] = useState('Launch');

  useEffect(() => {
    console.log(data.length, page, page.length);
  });

  let clickHandlerTable = (e) => {
    for (let i = 0; i < data.length; i++) {
      if (e == page[i].cells[0].row.id) {
        page[i].cells[0].row.original.launched = !page[i].cells[0].row.original
          .launched;
        setName(page[i].cells[0].row.original.launched ? 'Launched' : 'Launch');
      }
    }
  };
  const info = {
    name: 'Launched',
  };
  return (
    <>
      <table
        style={{ margin: '0 auto', paddingBottom: '10rem' }}
        {...getTableProps()}
        className={`r-table table ${classnames({ 'table-divided': divided })}`}
      >
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            console.log(row);
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
                    {cellIndex === 0 ? (
                      <Link
                        to={{
                          pathname:
                            row.original.type == 'Recorded Session'
                              ? `${adminRoot}/recordedsession`
                              : `${adminRoot}/livesession`,
                          state: {
                            uniquesessionid: row.original.id,
                            trainer_id: row.original.trainer_id,
                          },
                        }}
                        id="link"
                      >
                        {cell.render('Cell')}
                      </Link>
                    ) : (
                      cell.render('Cell')
                    )}

                    {row.original.type === 'Recorded Session' &&
                      console.log('true it is')}
                    {cellIndex === 4 ? '  registrants' : ''}
                    {cellIndex === 1 ? '  INR' : ''}
                    {cellIndex === 0 ? (
                      <p style={{ fontSize: '.8rem' }}>{row.original.type}</p>
                    ) : (
                      ''
                    )}
                  </td>
                ))}
                {/* {console.log(page[0].cells[0].row.original.id)} */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row.original.launched ? (
                      <Button
                        color="secondary"
                        className="text-center"
                        onClick={() => {
                          clickHandlerTable(row.id); /* change(row.id); */
                        }}
                        id={row.id}
                        className="mr-3"
                        style={{
                          fontSize: '1rem',
                          marginRight: '10px',
                          width: '110px',
                        }}
                      >
                        {/* row.original.launched ?  */}
                        {/* 'Launched' */} {/* : 'Launch' */} Launched
                      </Button>
                    ) : (
                      <Button
                        color="secondary"
                        className="text-center"
                        onClick={() => {
                          clickHandlerTable(row.id); /* change(row.id); */
                        }}
                        id={row.id}
                        className="mr-3"
                        style={{
                          fontSize: '1rem',
                          marginRight: '10px',
                          width: '110px',
                        }}
                      >
                        {/* row.original.launched ?  */}
                        {/* 'Launched' */} {/* : 'Launch' */} Launch
                      </Button>
                    )}
                    <PopoverItem
                      id={row.original.id}
                      type={row.original.type == 'Recorded Session' ? 1 : 0}
                      handleReloadTable={handleReloadTable}
                    />
                  </div>
                </td>
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

export const TabularData = () => {
  const cols = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        cellClass: 'w-20 ',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Fee',
        accessor: 'fee',
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Published Date',
        accessor: 'date',
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Registrations',
        accessor: 'registrations',
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );
  const [data, setData] = useState([]);
  const [
    selectedFilter,
    setSelectedFilter,
    selectedSort,
    setSelectedSort,
    search,
    setSearch,
    handleReloadTable,
  ] = useContext(DropDownContext);

  // console.log(handleReloadTable);

  useEffect(() => {
    const route = selectedFilter.value || 'findall';
    const sortFilter = selectedSort.value || 'session_start_date';
    const searchSession = search || '';

    // console.log(route, sortFilter, search);
    axiosInstance
      .get(
        `/tutor/sessions/FindAllSession?route=${route}&sort=${sortFilter}&search=${searchSession}`
      )
      .then((response) => {
        console.log(response, response.data.sessions.length);
        const sessions = [];
        response.data.sessions.forEach((doc) => {
          const session = {
            id: doc.session_id,
            // description: doc.session_description,
            type: doc.session_type,
            title: doc.session_name,
            date: doc.session_start_date,
            tags: doc.session_trainer_name,
            fee: doc.session_fee,
            registrations: doc.session_registration,
            trainer_id: doc.session_trainer_id,
          };
          try {
            session.tags = JSON.parse(session.tags)[0].label;
          } catch (err) {
            session.tags = session.tags;
          }
          sessions.push(session);
        });
        console.log('final length: ', sessions.length);
        setData(sessions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    selectedFilter,
    setSelectedFilter,
    selectedSort,
    setSelectedSort,
    search,
    setSearch,
    handleReloadTable,
    // reloadTable,
    // setReloadTable,
  ]);
  return (
    <div className="mb-4">
      {data.length > 0 ? (
        <Table
          columns={cols}
          data={data}
          handleReloadTable={handleReloadTable}
          divided
        />
      ) : (
        <CreateSession />
      )}
    </div>
  );
};
