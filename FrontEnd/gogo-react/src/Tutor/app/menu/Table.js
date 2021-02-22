import React from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';

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
    usePagination);
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
{/* <div>
  <button onClick={()=>{canPreviousPage()}}>Previous</button>
  <button onClick={()=>{canNextPage()}} >Next</button>
</div> */}
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
export default Table;
