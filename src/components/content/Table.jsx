// import { Table } from "react-bootstrap";
import React from "react";
import { useTable, usePagination } from 'react-table'
import styled from 'styled-components';
import Pagination from './Pagination';

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

const Table = ({ columns, data, fetchData, paginationPageSize, totalRecords }) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: paginationPageSize },
      manualPagination: true,
      pageCount: Math.ceil(totalRecords/paginationPageSize),
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  return (
    <>
      <Styles>
        <table {...getTableProps()}>
          <thead>
            {// Loop over the header rows
            headerGroups.map(headerGroup => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>#</th>
                {// Loop over the headers in each row
                headerGroup.headers.map(column => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {// Render the header
                    column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
            page.map((row, index) => {
              // Prepare the row for display
              prepareRow(row)
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  <td style={{ color: '#787B96', fontFamily: 'Latto-Bold'}}>
                    {pageIndex * pageSize + index + 1}.
                  </td>
                  {// Loop over the rows cells
                  row.cells.map(cell => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {// Render the cell contents
                        cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Styles>
      <Pagination pageLimit={pageSize} totalPages={pageCount} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} />
    </>
  )
  // return (
  //   <div className="card px-2 pt-2">
  //     <Table striped={striped}>{children}</Table>
  //   </div>
  // );
};

export default Table;
