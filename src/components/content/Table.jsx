// import { Table } from "react-bootstrap";
import React from "react";
import { useTable, usePagination, useSortBy } from 'react-table'
import styled from 'styled-components';
import Pagination from './Pagination';
import Skeleton from "react-loading-skeleton";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const Styles = styled.div`
  border: 1.5px solid #D7D7E0;
  background: #FFFFFF;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
  font-size: 14px;

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
`

const Table = ({ columns, data, fetchData, changeSort, paginationPageSize, totalRecords, loading }) => {
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
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  React.useEffect(() => {
    changeSort(sortBy);
  }, [changeSort, sortBy]);

  return (
    <>
      <Styles>
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
                  <tr {...row.getRowProps()}>
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
      </Styles>
      <Pagination pageLimit={pageSize} totalPages={pageCount} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} />
    </>
  )
};

export default Table;
