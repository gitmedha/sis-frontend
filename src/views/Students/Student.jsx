import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";

import Details from "./StudentComponents/Details";
import ProgramEnrollments from "./StudentComponents/ProgramEnrollments";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { deleteStudent, getStudent, getStudentProgramEnrollments, updateStudent } from "./StudentComponents/StudentActions";
import EmploymentConnections from "./StudentComponents/EmploymentConnections";
import StudentForm from "./StudentComponents/StudentForm";

const Student = (props) => {
  const studentId = props.match.params.id;
  const [isLoading, setLoading] = useState(false);
  const [student, setStudent] = useState({});
  const [studentProgramEnrollments, setStudentProgramEnrollments] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const {setAlert} = props;
  const { address, contacts, ...rest } = student;

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove some data from payload
    let {id, show, CV, logo, ...dataToSave} = data;
    dataToSave['date_of_birth'] = data.date_of_birth ? moment(data.date_of_birth).format("YYYY-MM-DD") : '';

    NP.start();
    updateStudent(Number(id), dataToSave).then(data => {
      setAlert("Student updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_STUDENT_ERR", err);
      setAlert("Unable to update student.", "error");
    }).finally(() => {
      NP.done();
      fetchStudent();
    });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteStudent(student.id).then(data => {
      setAlert("Student deleted successfully.", "success");
    }).catch(err => {
      console.log("STUDENT_DELETE_ERR", err);
      setAlert("Unable to delete student.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/students");
    });
  };

  const fetchStudent = async () => {
    getStudent(studentId).then(data => {
      setStudent(data.data.data.student);
    }).catch(err => {
      console.log("getStudent Error", err);
    });
  }

  const getProgramEnrollments = async () => {
    getStudentProgramEnrollments(studentId).then(data => {
      setStudentProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
    }).catch(err => {
      console.log("getStudentProgramEnrollments Error", err);
    });
  }

  useEffect(async () => {
    await fetchStudent();
    await getProgramEnrollments();
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <>
        <div className="row" style={{margin: '30px 15px 0 15px'}}>
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
        <Details {...student} />
        <Collapsible title="Program Enrollments" badge={studentProgramEnrollments.length.toString()}>
          <ProgramEnrollments programEnrollments={studentProgramEnrollments} student={student} onDataUpdate={getProgramEnrollments} />
        </Collapsible>
        <Collapsible title="Employment Connections" badge={[].length.toString()}>
          <EmploymentConnections employmentConnections={[]} student={student} />
        </Collapsible>
        <StudentForm
          {...student}
          show={modalShow}
          onHide={hideUpdateModal}
        />
        <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete {`${student.first_name} ${student.last_name}`}?</span>
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
          <p>Are you sure, you want to delete this student?</p>
        </SweetAlert>
      </>
    );
  }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Student);
