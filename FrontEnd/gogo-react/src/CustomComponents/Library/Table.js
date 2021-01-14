import React, { useContext } from 'react';

import { useTable, usePagination, useSortBy } from 'react-table';
import classnames from 'classnames';
import PopoverItem from './PopOverItem';
import { LibraryContext } from '../../context/LibraryContext';

const Table = ({ columns, data, divided = false }) => {
  const [handleReloadTable] = useContext(LibraryContext);
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,

    page,

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
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            // console.log(row);
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
                  <PopoverItem
                    id={row.original.id}
                    type={row.original.type}
                    handleReloadTable={handleReloadTable}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
