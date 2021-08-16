// import { Table } from "react-bootstrap";
import React from "react";
import styled from 'styled-components';
import Pagination from './Pagination';
import Skeleton from "react-loading-skeleton";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { urlPath } from "../../constants";

const Styles = styled.div`
  display: flex;
  flex-wrap: wrap;

  .box {
    width: 135px;
    height: 180px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 30px;
    position: relative;
    display: flex;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-bottom: 8px solid #31B89D;
    cursor: pointer;

    .title-box {
      position: absolute;
      background: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 50%);
      height: 100%;
      width: 100%;
      display: flex;
      align-items: flex-end;


      .title {
        padding: 8px;
        color: white;
        font-family: 'Latto-Bold';
        font-size: 14px;
        line-height: 1.25;
      }
    }
  }

  @media screen and (min-width: 768px) {
    //
  }
`

const Grid = ({ columns, data, fetchData, paginationPageSize, totalRecords, loading, onRowClick=null, indexes=true }) => {
  paginationPageSize = paginationPageSize || 1;
  // const tableInstance = useTable(
  //   {
  //     columns,
  //     data,
  //     initialState: { pageIndex: 0, pageSize: paginationPageSize },
  //     manualSortBy: true,
  //     manualPagination: true,
  //     pageCount: Math.ceil(totalRecords/paginationPageSize),
  //   },
  //   useSortBy,
  //   usePagination
  // );

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   prepareRow,
  //   page,
  //   pageCount,
  //   gotoPage,
  //   nextPage,
  //   previousPage,
  //   state: { pageIndex, pageSize, sortBy },
  // } = tableInstance;

  // React.useEffect(() => {
  //   fetchData({ pageIndex, pageSize, sortBy });
  // }, [fetchData, pageIndex, pageSize, sortBy]);

  // const isRowClickable = typeof onRowClick === 'function';

  // const handleRowClick = (row) => {
  //   if (typeof onRowClick === 'function') {
  //     onRowClick(row.original);
  //   }
  // }

  return (
    <>
      <Styles>
        {data.map(item => (
          <div className="box" style={{backgroundImage: `url(${urlPath(item.logo?.url)})`}}>
            <div className="title-box">
              <div className="title">{item.title}</div>
            </div>
          </div>
        ))}
        {data.map(item => (
          <div className="box" style={{backgroundImage: `url(${urlPath(item.logo?.url)})`}}>
            <div className="title-box">
              <div className="title">{item.title}</div>
            </div>
          </div>
        ))}
        {data.map(item => (
          <div className="box" style={{backgroundImage: `url(${urlPath(item.logo?.url)})`}}>
            <div className="title-box">
              <div className="title">{item.title}</div>
            </div>
          </div>
        ))}
      </Styles>
      {/*<Pagination pageLimit={pageSize} totalPages={pageCount} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} />*/}
    </>
  )
};

export default Grid;
