import { useState, useEffect, useMemo } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Anchor, Badge, ProgressBarField } from "../../../components/content/Utils";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import DetailField from "../../../components/content/DetailField";
import { getBatchesPickList } from "../batchActions";
import Table from '../../../components/content/Table';
import moment from "moment";

const Details = ({ batch, sessions=[] }) => {
  const [pickList, setPickList] = useState([]);
  useEffect(() => {
    getBatchesPickList().then(data => {
      setPickList(data);
    });
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'Sessions planned',
        accessor: 'sessions_planned',
        disableSortBy: true,
      },
      {
        Header: 'Per-student fees',
        accessor: 'per_student_fees',
        disableSortBy: true,
      },
      {
        Header: 'Seats Available',
        accessor: 'seats_available',
        disableSortBy: true,
      },
    ],
    []
  );

  const batchTableData = [
    {
      sessions_planned: batch.number_of_sessions_planned,
      per_student_fees: batch.per_student_fees,
      seats_available: batch.seats_available || 0,
    }
  ];

  let totalSessionAttendancePercentages = 0;
  sessions.map(session => {
    return totalSessionAttendancePercentages += session.percent || 0;
  });
  const averageAttendancePercent = Math.floor(totalSessionAttendancePercentages / sessions.length);

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Name" value={batch.name} />
          <DetailField label="Program Name" value={batch.program.name} />
          <DetailField label="Status" value={<Badge value={batch.status} pickList={pickList.status} />} />
          <DetailField label="Enrollment Type" value={<Badge value={batch.enrollment_type} pickList={pickList.enrollment_type} />} />
          <DetailField label="Institution" value={<Anchor text={batch?.institution?.name} href={`/institution/${batch?.institution?.id}`} />} />
          <DetailField label="Assigned To" value={batch.assigned_to.username} />
          {/* <DetailField label="Name in Current SIS" value={batch.name_in_current_sis} /> */}
          <DetailField label="Grant" value={batch.grant.name} />
          <DetailField label="Donor" value={batch.grant.donor} />
          <DetailField label="Assigned To" value={batch.assigned_to.username} />
          <div className="mt-2">
            <div style={{color: '#787B96', fontFamily: 'Latto-Regular', fontSize: '14px', lineHeight: 1.2, marginBottom: '10px'}}>
              Average Attendance Across All Sessions
            </div>
            <ProgressBarField value={averageAttendancePercent} />
          </div>
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="State" value={batch.state} />
          <DetailField label="Area" value={batch.medha_area} />
          <DetailField label="Start Date" value={<Moment date={batch.start_date} format={"DD MMM YYYY"} />} />
          <DetailField label="End Date" value={<Moment date={batch.end_date} format={"DD MMM YYYY"} />} />
          <DetailField label="Created Date" value={moment(batch.created_at).format("DD MMM YYYY")} />
          <DetailField label="Updated Date" value={moment(batch.updated_at).format("DD MMM YYYY")} />
          <Table columns={columns} data={batchTableData} paginationPageSize={1} totalRecords={1} fetchData={() => {}} indexes={false} showPagination={false} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Details);
