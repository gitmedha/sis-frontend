import moment from "moment";
import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";

import Table from '../../../components/content/Table';
import { ProgressBarField } from "../../../components/content/Utils";
import CreateBatchSessionForm from "./BatchSessionForm";
import UpdateBatchSessionForm from "./BatchSessionForm";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { createBatchSession, createSessionAttendance, updateAttendance, updateSession } from "../batchActions";
import { FaRegEdit } from "react-icons/fa";
import { connect } from "react-redux";

const SessionLink = styled.div`
  @media screen and (min-width: 768px) {
    margin-left: 30px;
  }
`

const Sessions = (props) => {
  let {sessions, batch, batchID, fetchData, onDataUpdate } = props;
  const {setAlert} = props;
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [batchSessionAttendanceFormData, setBatchSessionAttendanceFormData] = useState({});

  const columns = useMemo(
    () => [
      {
        Header: 'Topics covered',
        accessor: 'topics_covered',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Attendance',
        accessor: 'attendance',
        disableSortBy: true,
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
        disableSortBy: true,
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const sessionTableData = sessions.map(session => {
    return {
      id: session.id,
      topics_covered: session.topics_covered,
      date: moment(session.date).format('DD MMM YYYY, hh:mm a'),
      updated_at: moment(session.updated_at).format('DD MMM YYYY'),
      attendance: <ProgressBarField value={Number.parseInt(session.percent)} />,
      link: <SessionLink><FaRegEdit size="20" color="#31B89D" /></SessionLink>
    }
  });

  const handleRowClick = session => {
    setBatchSessionAttendanceFormData(session);
    setUpdateModalShow(true);
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove 'show' and 'students' from the payload
    let {show, students, ...dataToSave} = data;
    dataToSave['date'] = new Date(data.date).toISOString();

    createBatchSession(batchID, dataToSave).then(async data => {
      setAlert("Session created successfully.", "success");
      let sessionId = Number(data.data.data.createSession.session.id);
      await students.forEach(async (student) => {
        createSessionAttendance(sessionId, student);
      });
    }).catch(err => {
      console.log("CREATE_SESSION_ERR", err);
      setAlert("Unable to create session.", "error");
    }).finally(() => {
      onDataUpdate();
      setCreateModalShow(false);
    });
  };

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setUpdateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {show, students, sessionAttendance} = data;
    let dataToSave = {};
    dataToSave['topics_covered'] = data.topics;
    dataToSave['date'] = new Date(data.date).toISOString();

    updateSession(batchSessionAttendanceFormData.id, dataToSave).then(async data => {
      setAlert("Session updated successfully.", "success");

      // map session attendance id to program enrollment id to connect student with their attendance
      let sessionAttendanceIds = {};
      sessionAttendance.map(attendance => {
        if (attendance.program_enrollment) {
          return sessionAttendanceIds[Number(attendance.program_enrollment.id)] = Number(attendance.id);
        }
        return attendance;
      });

      // update attendance corresponding to the student in the session/batch
      await students.forEach(async (student) => {
        // if session attendance id is present for that student, then update
        // otherwise create new attendance for that student
        if (sessionAttendanceIds[student.program_enrollment_id] !== undefined) {
          updateAttendance(sessionAttendanceIds[student.program_enrollment_id], {present: student.present});
        } else {
          createSessionAttendance(batchSessionAttendanceFormData.id, {
            present: student.present,
            program_enrollment_id: student.program_enrollment_id,
          });
        }
      });
    }).catch(err => {
      console.log("UPDATE_SESSION_ERR", err);
      setAlert("Unable to update session.", "error");
    }).finally(() => {
      onDataUpdate();
      setUpdateModalShow(false);
    });
  };

  const refetchSessions = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'topics_covered';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'topics_covered':
        case 'date':
          sortByField = sortBy[0].id;
          break;

        case 'attendance':
          sortByField = 'percent'
          break;

        default:
          sortByField = 'topics_covered';
          break;
      }
      fetchData(sortByField, sortOrder);
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="py-2 px-3">
      <div className="row">
      {props.batch.status == 'In Progress' && 
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            Add Session & Attendance
          </button>
        </div>
      }
        <div className="col-12 mt-3">
          <Table columns={columns} data={sessionTableData} paginationPageSize={sessionTableData.length} totalRecords={sessionTableData.length} fetchData={refetchSessions} onRowClick={handleRowClick} showPagination={false} />
        </div>
      </div>
      <CreateBatchSessionForm
        show={createModalShow}
        onHide={hideCreateModal}
        batchId={batchID}
      />
      <UpdateBatchSessionForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        batchId={batchID}
        session={batchSessionAttendanceFormData}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Sessions);
