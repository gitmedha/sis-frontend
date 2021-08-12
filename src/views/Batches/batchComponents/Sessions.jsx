import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useMemo } from "react";
import styled from "styled-components";

import Table from '../../../components/content/Table';
import { ProgressBarField, TableRowDetailLink } from "../../../components/content/Utils";
import BatchSessionForm from "./BatchSessionForm";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { createBatchSession } from "../batchActions";
import { MARK_ATTENDANCE } from "../../../graphql";
import api from "../../../apis";

const SessionLink = styled.div`
  @media screen and (min-width: 768px) {
    margin-left: 30px;
  }
`

const Sessions = ({ sessions, batchID, onDataUpdate }) => {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);

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
    history.push(`/session/${session.id}`)
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove 'show' and 'students' from the payload
    let {show, selectedStudents, ...dataToSave} = data;
    dataToSave['date'] = moment(data.date).format("YYYY-MM-DD");

    createBatchSession(batchID, dataToSave).then(async data => {
      setAlert("Session created successfully.", "success");
      await markAttendance(Number(data.data.data.createSession.session.id), selectedStudents);
    }).catch(err => {
      console.log("CREATE_SESSION_ERR", err);
      setAlert("Unable to create session.", "error");
    }).finally(() => {
      onDataUpdate();
      setModalShow(false);
    });
  };

  const markAttendance = async (sessionId, students) => {
    await students.forEach(async (student) => {
      await attendanceApiCaller({
        ...student,
        session: sessionId,
      });
    });
    return;
  };

  const attendanceApiCaller = async (params) => {
    try {
      await api.post("/graphql", {
        variables: params,
        query: MARK_ATTENDANCE,
      });
    } catch (err) {
      console.log("MARK_ATTENDANCE_ERR", err);
    }
  };

  return (
    <div className="py-2 px-3">
      <div className="row">
        <div className="col-md-6 col-sm-12"></div>
        <div className="col-md-6 col-sm-12 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => setModalShow(true)}
          >
            Add Session & Attendance
          </button>
        </div>
        <div className="col-12 mt-3">
          <Table columns={columns} data={sessionTableData} paginationPageSize={sessionTableData.length} totalRecords={sessionTableData.length} fetchData={() => {}} onRowClick={handleRowClick} />
        </div>
      </div>
      <BatchSessionForm
        show={modalShow}
        onHide={hideCreateModal}
        batchId={batchID}
      />
    </div>
  );
};

export default Sessions;
