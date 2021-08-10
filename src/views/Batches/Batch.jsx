import {
  GET_BATCH,
  GET_SESSIONS,
  UPDATE_BATCH,
  GET_BATCH_STUDENTS,
  GET_SESSION_ATTENDANCE_STATS,
} from "../../graphql";
import NP from "nprogress";
import { queryBuilder } from "../../apis";
import { useState, useEffect } from "react";
import { merge, values, keyBy } from "lodash";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import Students from "./batchComponents/Students";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import BatchForm from "./batchComponents/BatchForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { updateBatch } from "./batchActions";

const Batch = (props) => {
  const [batch, setBatch] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const batchID = Number(props.match.params.id);
  const [isLoading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const init = async () => {
    setLoading(true);
    NP.start();
    await getSessions();
    await getThisBatch();
    await getStudents();
    NP.done();
    setLoading(false);
  };

  const getThisBatch = async () => {
    try {
      const batchID = props.match.params.id;
      let { data } = await queryBuilder({
        query: GET_BATCH,
        variables: { id: Number(batchID) },
      });
      // console.log("GET_BATCH", data);
      setBatch(data.batch);
    } catch (err) {
      console.log("ERR", err);
    }
  };

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

  const getStudents = async () => {
    try {
      const batchID = props.match.params.id;
      let { data } = await queryBuilder({
        query: GET_BATCH_STUDENTS,
        variables: {
          id: Number(batchID),
        },
      });
      // console.log("GET_STUDENTS", data);
      setStudents(data.programEnrollments);
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

  const done = () => getThisBatch();

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // // need to remove id and show from the payload
    let {id, show, logo, created_at, updated_at, ...dataToSave} = data;
    if (typeof data.institution === 'object') {
      dataToSave['institution'] = Number(data.institution?.id);
    }
    if (typeof data.program === 'object') {
      dataToSave['program'] = Number(data.program?.id);
    }
    if (typeof data.grant === 'object') {
      dataToSave['grant'] = Number(data.grant?.id);
    }
    if (typeof data.assigned_to === 'object') {
      dataToSave['assigned_to'] = Number(data.assigned_to?.id);
    }

    NP.start();
    updateBatch(Number(id), dataToSave).then(data => {
      setAlert("Institution updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_DETAILS_ERR", err);
      setAlert("Unable to update institution.", "error");
    }).finally(() => {
      NP.done();
      getThisBatch();
    });
    setModalShow(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <div>
        <div className="row" style={{padding: '0 15px', marginTop: '30px'}}>
          <div className="col-12">
            <button
              onClick={() => setModalShow(true)}
              style={{ marginLeft: "0px" }}
              className="btn--primary"
            >
              EDIT
            </button>
            <button onClick={() => setShowDeleteAlert(true)} className="btn--primary">
              DELETE
            </button>
          </div>
        </div>
        {batch && (
          <Collapsible
            titleContent={
              <TitleWithLogo
                done={done}
                id={batch.id}
                logo={batch.logo}
                title={batch.name}
                query={UPDATE_BATCH}
              />
            }
            opened={true}
          >
            <Details batch={batch} done={done} />
          </Collapsible>
        )}
        <Collapsible title="Sessions" badge={sessions.length.toString()}>
          <Sessions sessions={sessions} batchID={props.match.params.id} />
        </Collapsible>
        <Collapsible title="Students" badge={students.length.toString()}>
          <Students students={students} />
        </Collapsible>
        {batch && <BatchForm
          {...batch}
          show={modalShow}
          onHide={hideUpdateModal}
        />}
      </div>
    );
  }
};

export default Batch;
