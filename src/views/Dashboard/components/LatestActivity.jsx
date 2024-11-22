import React, { useEffect, useMemo, useState,useCallback } from 'react'
import Collapse from "../../../components/content/CollapsiblePanels";
import Table from '../../../components/content/Table';
import { connect } from "react-redux";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import LatestActivityDetail from './LatestActivityDetail';
import { useHistory } from 'react-router-dom';
import { getActivity } from 'src/utils/LatestChange/Api';
import moment from 'moment';

// const datavalues=[
//     {
//       activity: 'Edited',
//       moduleName: 'Student',
//       updatedBy: 'John Doe',
//       updatedAt: '2024-10-16',
//       changesIn: ["name","startDate","parents/gardian"],
//       view: 'View Details',
//       id:"42534"
//     },
//     {
//       activity: 'Added',
//       moduleName: 'batch',
//       updatedBy: 'Jane Smith',
//       updatedAt: '2024-10-15',
//       changesIn: ["name","state","Medha Area"],
//       view: 'View Details',
//       id:"1229"
//     },
//     {
//       activity: 'Deleted',
//       moduleName: 'institution',
//       updatedBy: 'Alice Johnson',
//       updatedAt: '2024-10-14',
//       changesIn: ["name","state","Medha Area"],
//       view: 'View Details',
//       id:"634"
//     }
//   ]
const LatestActivity=(props)=> {

    const [showModal,setShowModal]=useState(false);
    const [dataPoint,setDataPoints]=useState({})
    const [dataValues,setDataValues]=useState([])
    const [pageIndex,setPageIndex] = useState(0);
    const [pageSize,setPageSize] = useState(25);
    const [totalCount,setTotalCount] = useState(0)
    const history = useHistory();
    const columns = useMemo(
      () => [
        {
          Header: 'Activity',
          accessor: 'activity',
          disableSortBy: true,
        },
        {
          Header: 'Module name',
          accessor: 'module_name',
          disableSortBy: true,
        },
        {
          Header: 'Updated by',
          accessor: 'updatedby.username',
          disableSortBy: true,
        },
        {
          Header: 'Updated at',
          accessor: 'updated_at',
          disableSortBy: true,
          Cell: ({ value }) => {
            if (!value) return ''; // Handle null/undefined values
            return moment(value).format('YYYY-MM-DD HH:mm'); // Customize format as needed
          }
        },
        // {
        //   Header: 'Changes in',
        //   accessor: 'changes_in',
        //   disableSortBy: true,
        //   Cell: ({ value }) => {
        //     if (!value) return '';
    
        //     return (
        //       <ul>
        //         {Object.entries(value).map(([key, changes]) => (
        //           <li key={key}>
        //             {key}: 
        //             {changes?.previous_value !== undefined && (
        //               <span> {changes ? `From ${changes?.previous_value ? changes?.previous_value :""}` :" "} </span>
        //             )}
        //             {` to ${changes.new_value}`}
        //           </li>
        //         ))}
        //       </ul>
        //     );
        //   },
        // },
        {
          Header: 'View',
          disableSortBy: true,
          Cell: ({ row }) => (
            <button
              className="btn btn-primary btn-sm"
              // onClick={() => history.push(`/${row.original.module_name}/${row.original.event_id}`)}
              onClick={()=>OpenModal(row.original)}
            >
              View Details
            </button>
          ),
        },
      ],
      [history]
    );
    useEffect(() => {
      fetchData(pageIndex,pageSize);
    }, []);
    
      const fetchData=async (page,limit)=>{
        // onHide={() => hideShowModal("mentorship", false)}
        // OpenModal()
        let data=await getActivity(page,limit);
        setDataValues(data?.data?.data);
        setTotalCount(data?.data?.totalCount);
      }
      const OpenModal=(data)=>{
        setDataPoints(data)
        setShowModal(true)
      }
      const onHide=()=>{
        setShowModal(false)
      }
      
      const fetchCallback = useCallback(async()=>{
        let data=await getActivity(pageIndex,pageSize);
        setDataValues(data?.data?.data)
      }, [pageIndex,pageSize])

      console.log(props);
  return (
    <>
    <Collapse title="Latest Activity" type="plain" opened={true} id="keyMetrics" >
      <div className="row m-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          {/* <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} /> */}
          <div className="d-flex justify-content-center align-items-center">
            {/* <WidgetUtilTab /> */}
          </div>
        </div>
        <Table 
          columns={columns} 
          data={dataValues} 
          totalRecords={totalCount}  
          fetchData={fetchCallback}
          paginationPageIndex={pageIndex}
          onPageIndexChange={setPageIndex}
          paginationPageSize={pageSize}
          onPageSizeChange={setPageSize}
          />
      </div>
    </Collapse>
    {showModal ? <LatestActivityDetail data={dataPoint} show={showModal} onHide={onHide}/>:""}
   
    </>
  )
}


const mapStateToProps = (state) => ({});
const mapActionsToProps = {
    setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(LatestActivity);
// export default LatestActivity