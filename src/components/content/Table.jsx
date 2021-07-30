// import { Table } from "react-bootstrap";
import React from "react";
import { useTable, usePagination, useSortBy } from 'react-table';
import styled from 'styled-components';
import Pagination from './Pagination';
import Skeleton from "react-loading-skeleton";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const Styles = styled.div`
  border: 1.5px solid #D7D7E0;
  background: #FFFFFF;
  border-radius: 5px;
  font-size: 14px;

  .clickable:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  table {
    box-sizing: border-box;
    width: 100%;

    thead {
      th {
        color: #787B96;
      }
    }
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: 1px solid #BFBFBF;
      height: 60px;
    }
  }

  .mobile {
    .row {
      padding-top: 15px;
      padding-bottom: 15px;
      margin: 0;

      &:not(:last-child) {
        border-bottom: 1px solid #BFBFBF;
      }

      .cell:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }

  @media screen and (min-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`

const Table = ({ columns, data, fetchData, paginationPageSize, totalRecords, loading, onRowClick=null }) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: paginationPageSize },
      manualSortBy: true,
      manualPagination: true,
      pageCount: Math.ceil(totalRecords/paginationPageSize),
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance;

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy });
  }, [fetchData, pageIndex, pageSize, sortBy]);

  const isRowClickable = typeof onRowClick === 'function';

  const handleRowClick = (row) => {
    if (typeof onRowClick === 'function') {
      onRowClick(row.original);
    }
  }

  return (
    <>
      <Styles>
        <div className="d-none d-md-block">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  <th>#</th>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <FaLongArrowAltDown />
                            : <FaLongArrowAltUp />
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {loading ? (
                <>
                  <tr><td colSpan="5"><Skeleton height='100%' /></td></tr>
                  <tr><td colSpan="5"><Skeleton height='100%' /></td></tr>
                  <tr><td colSpan="5"><Skeleton height='100%' /></td></tr>
                </>
              ) : (
                page.map((row, index) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} onClick={() => handleRowClick(row)} className={`${isRowClickable ? 'clickable' : ''}`}>
                      <td style={{ color: '#787B96', fontFamily: 'Latto-Bold'}}>
                        {pageIndex * pageSize + index + 1}.
                      </td>
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="d-md-none mobile">
          {loading ? (
            <>
              <Skeleton count={3} height='60px' />
            </>
          ) : (
            page.map((row, index) => {
              prepareRow(row)
              return (
                <div key={index} className={`row ${isRowClickable ? 'clickable' : ''}`} onClick={() => handleRowClick(row)}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <div key={cellIndex} className="cell">
                        {cell.render('Cell')}
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      </Styles>
      <Pagination pageLimit={pageSize} totalPages={pageCount} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} />
    </>
  )
};

export default Table;
