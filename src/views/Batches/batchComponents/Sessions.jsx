import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import Table from '../../../components/content/Table';
import { ProgressBarField, TableRowDetailLink } from "../../../components/content/Utils";
import AddBatchSessionForm from "./AddBatchSessionForm";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { createBatchSession } from "../batchActions";
import { MARK_ATTENDANCE, GET_SESSIONS, GET_SESSION_ATTENDANCE_STATS } from "../../../graphql";
import api from "../../../apis";
import { queryBuilder } from "../../../apis";
import { merge, values, keyBy } from "lodash";

const SessionLink = styled.div`
  @media screen and (min-width: 768px) {
    margin-left: 30px;
  }
`

const Sessions = ({ batchID }) => {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [sessions, setSessions] = useState([]);

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

  const getSessions = async () => {
    try {
      let { data } = await queryBuilder({
        query: GET_SESSIONS,
        variables: {
          id: Number(batchID),
        },
      });
      await getAttendanceStats(data.sessions);
    } catch (err) {
      console.log("ERR", err);
    }
  };

  const getAttendanceStats = async (sessionsList) => {
    try {
      let { data } = await queryBuilder({
        query: GET_SESSION_ATTENDANCE_STATS,
        variables: { id: Number(batchID) },
      });

      const totalStudents =
        data.programEnrollmentsConnection.groupBy.batch[0].connection.aggregate
          .studentsEnrolled;

      let attPercentage = data.attendancesConnection.groupBy.session.map(
        (sess) => ({
          id: sess.sessionId,
          present: sess.connection.aggregate.studentsPresent,
          percent:
            (sess.connection.aggregate.studentsPresent / totalStudents) * 100,
        })
      );

      let merged = values(
        merge(keyBy(attPercentage, "id"), keyBy(sessionsList, "id"))
      );
      // Filtering out the records whose attendance is not available
      // merged = await merged.filter((item) => item.percent !== undefined);

      setSessions(merged);
    } catch (err) {
      console.log("ERR, Batch.jsx, 84", err);
    }
  };

  useEffect(() => {
    getSessions();
  }, []);

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

    console.log('data', data);
    console.log('dataToSave', dataToSave);

    createBatchSession(batchID, dataToSave).then(async data => {
      setAlert("Session created successfully.", "success");
      await markAttendance(Number(data.data.data.createSession.session.id), selectedStudents);
    }).catch(err => {
      console.log("CREATE_SESSION_ERR", err);
      setAlert("Unable to create session.", "error");
    }).finally(() => {
      getSessions();
    });
    setModalShow(false);
  };

  const markAttendance = async (sessionId, students) => {
    console.log('students', students);
    await students.forEach(async (student) => {
      console.log('forEach student', student);
      await attendanceApiCaller({
        ...student,
        session: sessionId,
      });
    });
    return;
  };

  const attendanceApiCaller = async (params) => {
    console.log('params', params);
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
      <AddBatchSessionForm
        show={modalShow}
        onHide={hideCreateModal}
        batchId={batchID}
      />
    </div>
  );
};

export default Sessions;
