import moment from "moment";
import NP from "nprogress";
import { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import {
  GET_BATCH,
  UPDATE_BATCH,
  GET_BATCH_STUDENTS,
} from "../../graphql";
import { queryBuilder } from "../../apis";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import Students from "./batchComponents/Students";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import BatchForm from "./batchComponents/BatchForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { getBatchProgramEnrollments, deleteBatch, updateBatch, getBatchSessions, getBatchSessionAttendanceStats, getBatchStudentAttendances } from "./batchActions";
import { groupBy } from "lodash";
import ProgramEnrollments from "./batchComponents/ProgramEnrollments";

const Batch = (props) => {
  const [batchProgramEnrollments, setBatchProgramEnrollments] = useState([]);
  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const batchID = Number(props.match.params.id);
  const [isLoading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [sessions, setSessions] = useState([]);
  const history = useHistory();
  const {setAlert} = props;

  const getThisBatch = async () => {
    try {
      const batchID = props.match.params.id;
      let { data } = await queryBuilder({
        query: GET_BATCH,
        variables: { id: Number(batchID) },
      });
      setBatch(data.batch);
    } catch (err) {
      console.log("ERR", err);
    }
  };

  const getSessions = async (sortBy = 'created_at', sortOrder = 'desc') => {
    getBatchSessions(batchID, sortBy, sortOrder).then(async data => {
      await getAttendanceStats(data.data.data.sessionsConnection.values);
    }).catch(err => {
      console.log("GET_SESSIONS_ERR", err);
    });
  };

  const getAttendanceStats = async (sessionsList) => {
    getBatchSessionAttendanceStats(Number(batchID)).then(async data => {
      let groupByBatch = data.data.data.programEnrollmentsConnection.groupBy.batch;
      if (!groupByBatch.length) {
        return;
      }
      const totalStudents = groupByBatch[0].connection.aggregate.studentsEnrolled;

      let attPercentage = data.data.data.attendancesConnection.groupBy.session.map(
        (sess) => ({
          id: sess.sessionId,
          present: sess.connection.aggregate.studentsPresent,
          percent: (sess.connection.aggregate.studentsPresent / totalStudents) * 100,
        })
      );

      sessionsList = sessionsList.map(session => {
        let matchedAttPercentage = attPercentage.find(att => att.id === session.id);
        return {
          ...session,
          present: matchedAttPercentage?.present,
          percent: matchedAttPercentage?.percent,
        };
      })

      await setSessions(sessionsList);
    }).catch(err => {
      console.log("ERR getBatchSessionAttendanceStats", err);
    });
  };

  const getStudents = async (sortBy = 'student.full_name', sortOrder = 'desc') => {
    try {
      const batchID = props.match.params.id;
      let { data } = await queryBuilder({
        query: GET_BATCH_STUDENTS,
        variables: {
          id: Number(batchID),
          sort: `${sortBy}:${sortOrder}`
        },
      });
      let studentsData = data.programEnrollmentsConnection.values;
      getBatchStudentAttendances(batchID).then(data => {
        let programEnrollmentAttendances = data.data.data.attendancesConnection.groupBy.program_enrollment;
        let studentsWithAttendance = studentsData.map(student => {
          let studentAttendancePercent = programEnrollmentAttendances.find(programEnrollment => programEnrollment.key === student.id);
          return {
            ...student,
            attendancePercent: studentAttendancePercent && batch ? Math.floor((studentAttendancePercent.connection.aggregate.count/batch.number_of_sessions_planned) * 100) : 0,
          }
        });
        setStudents(studentsWithAttendance);
      });
    } catch (err) {
      console.log("ERR", err);
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
    dataToSave['start_date'] = moment(data.start_date).format("YYYY-MM-DD");
    dataToSave['end_date'] = moment(data.end_date).format("YYYY-MM-DD");

    NP.start();
    updateBatch(Number(id), dataToSave).then(data => {
      setAlert("Batch updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_DETAILS_ERR", err);
      setAlert("Unable to update batch.", "error");
    }).finally(async () => {
      NP.done();
      getThisBatch();
    });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteBatch(batch.id).then(data => {
      setAlert("Batch deleted successfully.", "success");
    }).catch(err => {
      console.log("BATCH_DELETE_ERR", err);
      setAlert("Unable to delete batch.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/batches");
    });
  };

  useEffect(async () => {
    setLoading(true);
    NP.start();
    await getThisBatch();
    await getProgramEnrollments();
    NP.done();
    setLoading(false);
  }, [batchID]);

  useEffect(async () => {
    await getSessions();
    await getStudents();
  }, [batch]);

  const handleSessionDataUpdate = async () => {
    await getSessions();
    await getStudents();
  }

  const getProgramEnrollments = async () => {
    getBatchProgramEnrollments(batchID).then(data => {
      setBatchProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
    }).catch(err => {
      console.log("getInstitutionProgramEnrollments Error", err);
    });
  }

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
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
            {/* <button className="btn--secondary">MARK AS COMPLETE</button> */}
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
                icon="batch"
              />
            }
            opened={true}
          >
            <Details batch={batch} sessions={sessions} />
          </Collapsible>
        )}
        <Collapsible title="Program Enrollments" badge={batchProgramEnrollments.length.toString()}>
          <ProgramEnrollments programEnrollments={batchProgramEnrollments} onDataUpdate={getProgramEnrollments} batch={batch} fetchData={getStudents} batch={batch} />
        </Collapsible>
        <Collapsible title="Sessions" badge={sessions.length.toString()}>
          <Sessions sessions={sessions} batchID={props.match.params.id} onDataUpdate={handleSessionDataUpdate} fetchData={getSessions} />
        </Collapsible>
        {batch && <BatchForm
          {...batch}
          show={modalShow}
          onHide={hideUpdateModal}
        />}
        {batch &&
        <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete {batch.name}?</span>
          }
          customButtons={
            <>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete()} className="btn btn-danger mx-2 px-4">
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure, you want to delete this batch?</p>
        </SweetAlert>
        }
      </>
    );
  }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Batch);
