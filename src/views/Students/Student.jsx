import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

import api from "../../apis";
import Details from "./StudentComponents/Details";
import ProgramEnrollments from "./StudentComponents/ProgramEnrollments";
// import { GET_STUDENT } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { getStudent, getStudentProgramEnrollments } from "./StudentComponents/StudentActions";
import EmploymentConnections from "./StudentComponents/EmploymentConnections";
// import { deleteInstitution, updateInstitution } from "./InstitutionComponents/instituteActions";
// import InstitutionForm from "./InstitutionComponents/InstitutionForm";

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
    // if (!data || data.isTrusted) {
    //   setModalShow(false);
    //   return;
    // }

    // // need to remove id and show from the payload
    // let {id, show, ...dataToSave} = data;
    // if (typeof data.logo === 'object') {
    //   dataToSave['logo'] = data.logo?.id;
    // }

    // NP.start();
    // updateInstitution(Number(id), dataToSave).then(data => {
    //   setAlert("Institution updated successfully.", "success");
    // }).catch(err => {
    //   console.log("UPDATE_DETAILS_ERR", err);
    //   setAlert("Unable to update institution.", "error");
    // }).finally(() => {
    //   NP.done();
    //   getThisStudent();
    // });
    // setModalShow(false);
  };

  const handleDelete = async () => {
    // NP.start();
    // deleteInstitution(student.id).then(data => {
    //   setAlert("Institution deleted successfully.", "success");
    // }).catch(err => {
    //   console.log("INSTITUTION_DELETE_ERR", err);
    //   setAlert("Unable to delete institution.", "error");
    // }).finally(() => {
    //   setShowDeleteAlert(false);
    //   NP.done();
    //   history.push("/institutions");
    // });
  };

  useEffect(() => {
    // get student details
    getStudent(studentId).then(data => {
      setStudent(data.data.data.student);
    }).catch(err => {
      console.log("getStudent Error", err);
    });

    getStudentProgramEnrollments(studentId).then(data => {
      console.log('setStudentProgramEnrollments', data);
      setStudentProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
    }).catch(err => {
      console.log("getStudentProgramEnrollments Error", err);
    });
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
        <Collapsible title="Program Enrollments">
          <ProgramEnrollments programEnrollments={studentProgramEnrollments} student={student} />
        </Collapsible>
        <Collapsible title="Employment Connections">
          <EmploymentConnections employmentConnections={[]} student={student} />
        </Collapsible>
        {/* <InstitutionForm
          {...student}
          show={modalShow}
          onHide={hideUpdateModal}
        /> */}
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
          <p>Are you sure, you want to delete this institution?</p>
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
