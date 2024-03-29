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
      color: #787B96;
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

  .table-row-link {
    text-decoration: none;
    color: inherit;
    height: 100%;
    display: flex;
    align-items: center;
  }

  @media screen and (min-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`

const Table = ({selectedSearchedValue,selectedSearchField,isSearchEnable,fetchSearchedData, columns, data, fetchData, totalRecords, loading, showPagination = true, onRowClick=null, indexes=true, paginationPageSize = 10, onPageSizeChange = () => {}, paginationPageIndex = 0, onPageIndexChange = () => {} }) => {
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
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance;
 
  const rowClickFunctionExists = typeof onRowClick === 'function';

  const handleRowClick = (row) => {
    if (typeof onRowClick === 'function') {
      onRowClick(row.original);
    }
  }

  React.useEffect(() => {
    if(fetchSearchedData){
      fetchSearchedData(pageIndex, pageSize, sortBy)
    }
    else {
      fetchData(pageIndex, pageSize, sortBy,isSearchEnable,selectedSearchedValue,selectedSearchField);
    }
    
  }, [fetchData, pageIndex, pageSize, sortBy,fetchSearchedData]);

  React.useEffect(() => {
  
    onPageSizeChange(pageSize);
  }, [pageSize]);

  React.useEffect(() => {
    setPageSize(paginationPageSize);
  }, [paginationPageSize]);

  React.useEffect(() => {
    onPageIndexChange(pageIndex);
  }, [pageIndex]);

  React.useEffect(() => {
    gotoPage(paginationPageIndex);
  }, [paginationPageIndex]);

  return (
    <>
      <Styles>
        <div className="d-none d-md-block">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {indexes && <th>#</th>}
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
                  <tr><td colSpan={columns.length}><Skeleton height='100%' /></td></tr>
                  <tr><td colSpan={columns.length}><Skeleton height='100%' /></td></tr>
                  <tr><td colSpan={columns.length}><Skeleton height='100%' /></td></tr>
                </>
              ) : (
                page.length ? (
                  page.map((row, index) => {
                    prepareRow(row)
                    return (<>
                      <tr {...row.getRowProps()} onClick={() => handleRowClick(row)} className={`${row.original.href || rowClickFunctionExists ? 'clickable' : ''}`}>
                        
                        {indexes &&
                        <>
                          
                          <td style={{ color: '#787B96', fontFamily: 'Latto-Bold'}}>
                            {
                              row.original.href && !rowClickFunctionExists ? (
                                <a className="table-row-link" href={row.original.href}>
                                  { pageIndex && pageSize ? pageIndex * pageSize + index + 1 : index + 1 }.
                                </a>
                              ) : (
                                <>{pageIndex && pageSize ? pageIndex * pageSize + index + 1 : index + 1}.</>
                              )
                            }
                          </td>
                        </>
                        }
                        {row.cells.map(cell => {
                          return (
                            <td {...cell.getCellProps()}>
                              {
                                row.original.href
                                ? (<a className="table-row-link" href={row.original.href}>{cell.render('Cell')}</a>)
                                : cell.render('Cell')
                              }
                            </td>
                          )
                        })}
                      </tr>
                      </>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={indexes ? columns.length + 1 : columns.length} style={{ color: '#787B96', fontFamily: 'Latto-Bold', textAlign: 'center'}}>
                      <span style={{fontStyle: 'italic', fontFamily: 'Latto-Regular'}}>No entries found.</span>
                    </td>
                  </tr>
                )
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
                <div key={index} className={`row ${row.original.href || rowClickFunctionExists ? 'clickable' : ''}`} onClick={() => {}}>
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
      {showPagination && <Pagination totalRecords ={totalRecords} totalPages={pageCount} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} pageLimit={pageSize} setPageLimit={setPageSize} />}
    </>
  )
};

export default Table;
