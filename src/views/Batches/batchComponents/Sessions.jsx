import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useMemo } from "react";
import styled from "styled-components";

import Table from '../../../components/content/Table';
import { ProgressBarField, TableRowDetailLink } from "../../../components/content/Utils";
import CreateBatchSessionForm from "./BatchSessionForm";
import UpdateBatchSessionForm from "./BatchSessionForm";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { createBatchSession, createSessionAttendance, updateSession } from "../batchActions";
import { MARK_ATTENDANCE } from "../../../graphql";
import api from "../../../apis";

const SessionLink = styled.div`
  @media screen and (min-width: 768px) {
    margin-left: 30px;
  }
`

const Sessions = ({ sessions, batchID, onDataUpdate }) => {
  const history = useHistory();
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
      date: moment(session.date).format('DD MMM YYYY'),
      attendance: <ProgressBarField value={Number.parseInt(session.percent)} />,
      link: <SessionLink><TableRowDetailLink value={session.id} to={'session'} /></SessionLink>
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
    let {show, selectedStudents, ...dataToSave} = data;
    dataToSave['date'] = moment(data.date).format("YYYY-MM-DD");

    createBatchSession(batchID, dataToSave).then(async data => {
      setAlert("Session created successfully.", "success");
      let sessionId = Number(data.data.data.createSession.session.id);
      await selectedStudents.forEach(async (student) => {
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

    // need to remove 'show' and 'students' from the payload
    let {show, selectedStudents} = data;
    let dataToSave = {};
    dataToSave['topics_covered'] = data.topics;
    dataToSave['date'] = moment(data.date).format("YYYY-MM-DD");

    console.log('data', data);
    console.log('dataToSave', dataToSave);

    // console.log('batchSessionAttendanceFormData', batchSessionAttendanceFormData);

    updateSession(batchSessionAttendanceFormData.id, dataToSave).then(async data => {
      setAlert("Session created successfully.", "success");
      // await markAttendance(Number(data.data.data.createSession.session.id), selectedStudents);
    }).catch(err => {
      console.log("CREATE_SESSION_ERR", err);
      setAlert("Unable to create session.", "error");
    }).finally(() => {
      onDataUpdate();
      setUpdateModalShow(false);
    });
  };

  return (
    <div className="py-2 px-3">
      <div className="row">
        <div className="col-md-6 col-sm-12"></div>
        <div className="col-md-6 col-sm-12 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            Add Session & Attendance
          </button>
        </div>
        <div className="col-12 mt-3">
          <Table columns={columns} data={sessionTableData} paginationPageSize={sessionTableData.length} totalRecords={sessionTableData.length} fetchData={() => {}} onRowClick={handleRowClick} />
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

export default Sessions;
