// import { Table } from "react-bootstrap";
// import React from "react";
import { useTable } from 'react-table'
import styled from 'styled-components';

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
      height: 60px;

      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      border-bottom: 1px solid #BFBFBF;
    }
  }
`

const Table = ({ columns, data }) => {
  const tableInstance = useTable({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    // apply the table props
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {// Loop over the header rows
          headerGroups.map(headerGroup => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
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
          rows.map(row => {
            // Prepare the row for display
            prepareRow(row)
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
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
  )
  // return (
  //   <div className="card px-2 pt-2">
  //     <Table striped={striped}>{children}</Table>
  //   </div>
  // );
};

export default Table;
