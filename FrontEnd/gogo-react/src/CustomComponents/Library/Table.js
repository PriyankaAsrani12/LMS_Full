import React from 'react';

import { useTable, usePagination, useSortBy } from 'react-table';
import classnames from 'classnames';
import PopoverItem from '../../components/common/PopoverItem';

const Table = ({ columns, data, divided = false }) => {
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
      initialState: { pageIndex: 0, pageSize: data.length },
    },
    useSortBy,
    usePagination
  );

  return (
    <div style={{ marginBottom: '25rem' }}>
      <table
        style={{ maxWidth: '1100px', margin: '0 auto' }}
        {...getTableProps()}
        className={`r-table table ${classnames({ 'table-divided': divided })}`}
      >
        {/* <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    key={`th_${columnIndex}`}
                    
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={(
                      column.isSorted
                        ? column.isSortedDesc
                          ? 'sorted-desc'
                          : 'sorted-asc'
                        : '') + columnIndex===3?'text-right':'text-left'
                    }
                  >
                    
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? '' : '') : ''}
                    <span />
                  </th>
                ))}
              </tr>
            ))}
          </thead> */}

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    style={{ fontSize: '1.3rem' }}
                    key={`td_${cellIndex}`}
                    {...cell.getCellProps({
                      className: cell.column.cellClass,
                    })}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
                <td>
                  <PopoverItem id={`1${row.id}`} />
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
    </div>
  );
};
export default Table;
