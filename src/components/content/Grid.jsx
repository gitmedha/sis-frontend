// import { Table } from "react-bootstrap";
import React from "react";
import styled from 'styled-components';
import Pagination from './Pagination';
import Skeleton from "react-loading-skeleton";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { urlPath } from "../../constants";
import DetailField from "../../components/content/DetailField";
import { FaAngleDoubleDown } from "react-icons/fa";

const Styles = styled.div`
  display: flex;
  flex-wrap: wrap;

  .box {
    width: 100%;
    height: 180px;
    position: relative;
    display: flex;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
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

  .box-line-active {
    height: 25px;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .box-line {
    width: 100%;

    .box-line-upper {
      width: 100%;
      height: 8px;
      background-color: #31B89D;
    }
    .box-line-lower {
      height: calc(35px - 8px);
      background-color: white;
    }
  }

  .box-line-active {
    height: 35px;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #31B89D;
  }

  .box-wrapper {
    margin-left: 10px;
    margin-right: 10px;
    width: 135px;

    &.active {
      .box-line {
        display: none;
      }
      .box-line-active {
        display: flex;
      }
    }
  }

  .box-details {
    border-top: 4px solid #31B89D;
    border-bottom: 4px solid #31B89D;
    padding: 15px 30px 0;
    width: 100%;
    margin-bottom: 30px;
  }

  @media screen and (min-width: 768px) {
    //
  }
`

const Grid = ({ columns, data, fetchData, paginationPageSize, totalRecords, loading, onRowClick=null, indexes=true }) => {
  paginationPageSize = paginationPageSize || 1;
  const [activeBoxRow, setActiveBoxRow] = React.useState(0);
  const [activeItem, setActiveItem] = React.useState({});
  const [activeBox, setActiveBox] = React.useState(0);
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

  const boxesInRow = 8;

  const handleBoxClick = boxNumber => {
    if (boxNumber > Math.floor(data.length/boxesInRow)*boxesInRow) {
      // box is in last row
      // set active box row to the last box index
      setActiveBoxRow(data.length);
    } else {
      // set active box row to the last box index in that row
      setActiveBoxRow(Math.ceil(boxNumber/boxesInRow) * boxesInRow);
    }
    setActiveItem(data[boxNumber-1]);
    setActiveBox(boxNumber);
  }

  return (
    <>
      <Styles>
        {data.map((item, index) => (
          <>
            <div className={`box-wrapper ${activeBox === index + 1 ? 'active' : ''}`} onClick={() => handleBoxClick(index+1)}>
              <div className={`box`} style={{backgroundImage: item.logo ? `url(${urlPath(item.logo?.url)})` : `url(https://sis-api.medha.org.in/uploads/student_image_1fa52148c6.png)`}}>
                <div className="title-box">
                  <div className="title">{item.title}</div>
                </div>
              </div>
              <div className="box-line">
                <div className="box-line-upper"></div>
                <div className="box-line-lower"></div>
              </div>
              <div className="box-line-active">
                <FaAngleDoubleDown size="20" />
              </div>
            </div>
            {activeBoxRow === index + 1 &&
            <div className="box-details row">
              <div className="col-md-3">
                <DetailField label="Full Name" value={activeItem.title} />
                <DetailField label="Parents Name" value={activeItem.name_of_parent_or_guardian} />
                <DetailField label="Status" value={activeItem.status} />
                <DetailField label="Gender" value={activeItem.gender} />
                {/* <DetailField label="CV" value={activeItem.CV?.url} /> */}
              </div>
              <div className="offset-md-2 col-md-3">
                <DetailField label="Date of Birth" value={activeItem.date_of_birth} />
                <DetailField label="Email" value={activeItem.email} />
                <DetailField label="Phone No." value={activeItem.phone} />
                <DetailField label="Category" value={activeItem.category} />
                <DetailField label="Institute Name" value={activeItem.phone} />
              </div>
              <div className="col-md-4 d-flex justify-content-end">

              </div>
            </div>}
          </>
        ))}
      </Styles>
      {/*<Pagination pageLimit={pageSize} totalPages={pageCount} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} />*/}
    </>
  )
};

export default Grid;
