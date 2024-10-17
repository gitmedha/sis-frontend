import React, { useMemo, useState } from 'react'
import Collapse from "../../../components/content/CollapsiblePanels";
import Table from '../../../components/content/Table';
import { connect } from "react-redux";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import LatestActivityDetail from './LatestActivityDetail';
import { useHistory } from 'react-router-dom';

const datavalues=[
    {
      activity: 'Edited',
      moduleName: 'Student',
      updatedBy: 'John Doe',
      updatedAt: '2024-10-16',
      changesIn: ["name","startDate","parents/gardian"],
      view: 'View Details',
      id:"42534"
    },
    {
      activity: 'Added',
      moduleName: 'batch',
      updatedBy: 'Jane Smith',
      updatedAt: '2024-10-15',
      changesIn: ["name","state","Medha Area"],
      view: 'View Details',
      id:"1559"
    },
    {
      activity: 'Deleted',
      moduleName: 'institution',
      updatedBy: 'Alice Johnson',
      updatedAt: '2024-10-14',
      changesIn: ["name","state","Medha Area"],
      view: 'View Details',
      id:"650"
    }
  ]
const LatestActivity=(props)=> {

    const [showModal,setShowModal]=useState(false);
    const [dataPoint,setDataPoints]=useState({})
    const history = useHistory();
    const columns = useMemo(
        () => [
          {
            Header: 'Activity',
            accessor: 'activity',
            disableSortBy: true,
          },
          {
            Header: 'Module name ',
            accessor: 'moduleName',
            disableSortBy: true,
          },
          {
            Header: 'Updated by ',
            accessor: 'updatedBy',
            disableSortBy: true,
          },
          {
            Header: 'Updated at',
            accessor: 'updatedAt',
            disableSortBy: true,
          },
          {
            Header: 'Changes in ',
            accessor: 'changesIn',
            disableSortBy: true,
            Cell: ({ value }) => {
              return Array.isArray(value) ? value.join(', ') : value;
            },
          },
          {
            Header: 'View',
            disableSortBy: true,
            Cell: ({ row }) => (
              <button className='btn btn-primary btn-sm' onClick={() => history.push(`/${row.original.moduleName}/${row.original.id}`,)}>View Details</button>
            ),
          }
        ],
        []
      );

      const fetchData=()=>{
        // onHide={() => hideShowModal("mentorship", false)}
      }
      const OpenModal=(data)=>{
        setDataPoints(data)
        setShowModal(true)
      }
      const onHide=()=>{
        setShowModal(false)
      }
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
        <Table columns={columns} data={datavalues} totalRecords={datavalues.length} fetchData={fetchData}  />
      </div>
    </Collapse>
    <LatestActivityDetail data={dataPoint} show={showModal} onHide={onHide}/>
    </>
  )
}


const mapStateToProps = (state) => ({});
const mapActionsToProps = {
    setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(LatestActivity);
// export default LatestActivity