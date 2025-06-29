import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";
import api from "../../apis";
import ProgressBar from "../../../src/components/content/ProgressBar";

import Details from "./StudentComponents/Details";
import Address from "./StudentComponents/Address";
import ProgramEnrollments from "./StudentComponents/ProgramEnrollments";
import AlumniServices from "./StudentComponents/AlumniServices";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { deleteStudent, getStudent, getStudentAlumniServices, getStudentEmploymentConnections, getStudentProgramEnrollments, updateStudent,getStudentMedhaviMemberships } from "./StudentComponents/StudentActions";
// import {getAllOperations} from "../Operations/operationsActions";
import EmploymentConnections from "./StudentComponents/EmploymentConnections";
import StudentForm from "./StudentComponents/StudentForm";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import Tooltip from "../../components/content/Tooltip";
import { TitleWithLogo } from "../../components/content/Avatar";
import { UPDATE_STUDENT, GET_STUDENT } from "../../graphql";
import styled from 'styled-components';
import { deleteFile } from "../../common/commonActions";
import { uploadFile } from "../../components/content/Utils";
import { isAdmin, isChapterHead, isSRM } from "../../common/commonFunctions";
import MedhaviMemberships from "./StudentComponents/MedhaviMemberships";
import { createLatestAcivity } from "src/utils/LatestChange/Api";

const Styled = styled.div`

@media screen and (max-width: 360px) {
  .section-badge {
    margin-left: 2px;
    padding: 0px 20px !important;
  }
}
`

const Student = (props) => {
  const studentId = props.match.params.id;
  const [isLoading, setLoading] = useState(false);
  const [student, setStudent] = useState({});
  const [studentProgramEnrollments, setStudentProgramEnrollments] = useState([]);
  const [programEnrollmentAggregate, setProgramEnrollmentAggregate] = useState([]);
  const [studentEmploymentConnections, setStudentEmploymentConnections] = useState([]);
  const [employmentConnectionsBadge, setEmploymentConnectionsBadge] = useState(<></>);
  const [studentAlumniServices, setStudentAlumniServices] = useState([]);
  const [alumniServiceAggregate, setAlumniServiceAggregate] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [studentMedhaviMemberships, setStudentMedhaviMemberships] = useState([]);
  const [studentMedhaviMembershipsAggregate, setStudentMedhaviMembershipsAggregate] = useState([]);
  const history = useHistory();
  const {setAlert} = props;
  const { address, contacts, ...rest } = student;
  const userId = parseInt(localStorage.getItem("user_id"));

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove some data from payload
    let {id, show, CV, cv_file, created_at, created_by_frontend, updated_by_frontend, updated_at, ...dataToSave} = data;
    dataToSave['date_of_birth'] = data.date_of_birth ? moment(data.date_of_birth).format("YYYY-MM-DD") : '';

    if (typeof data.logo === 'object') {
      dataToSave['logo'] = data.logo?.id;
    }

    if (cv_file) {
      uploadFile(data.cv_file).then(data => {
        dataToSave['CV'] = data.data.data.upload.id;
        updateStudentApi(id, dataToSave);
      }).catch(err => {
        setAlert("Unable to upload CV.", "error");
      });
    } else {
      updateStudentApi(id, dataToSave);
    }
  };

  const updateStudentApi = (id, dataToSave) => {
    NP.start();
    updateStudent(Number(id), dataToSave).then(data => {
      setAlert("Student updated successfully.", "success");
    }).catch(err => {
      
      setAlert("Unable to update student.", "error");
    }).finally(() => {
      NP.done();
      getStudent();
    });
    setModalShow(false);
  }

  const handleDelete = async () => {
    NP.start();
    deleteStudent(student.id).then(data => {
      setAlert("Student deleted successfully.", "success");
    }).catch(err => {
   
      setAlert("Unable to delete student.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/students");
    });
  };

  const fileDelete = async () => {
    NP.start();
    deleteFile(student.CV.id).then(data => {
      setAlert("CV deleted successfully.", "success");
    }).catch(err => {
      
      setAlert("Unable to delete CV.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/student/".id);
      getStudent()
    });
  }

  const getStudent = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_STUDENT,
        variables: { id: studentId },
      });
      let values=data.data.student;
      
      values.name_of_parent_or_guardian = values.name_of_parent_or_guardian.toLowerCase()
      values.full_name=values.full_name.toLowerCase()
      setStudent(values);
    } catch (err) {
      
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const getProgramEnrollments = async () => {
    getStudentProgramEnrollments(studentId).then(data => {
      setStudentProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
      setProgramEnrollmentAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate);
    }).catch(err => {
      
    });
  }

  const getEmploymentConnections = async () => {
    getStudentEmploymentConnections(studentId).then(data => {
      let employmentConnections = data.data.data.employmentConnectionsConnection.values;
      setStudentEmploymentConnections(employmentConnections);
      updateEmploymentConnectionsBadge(employmentConnections);
    }).catch(err => {
      
    });
  }

  const getAlumniServices = async () => {
    getStudentAlumniServices(studentId).then(data => {
      setStudentAlumniServices(data.data.data.alumniServicesConnection.values);
      setAlumniServiceAggregate(data?.data?.data?.alumniServicesConnection?.aggregate);
    }).catch(err => {
      
    });
  }
  const getMemberships = async ()=>{
    try{
const memberships = await getStudentMedhaviMemberships(studentId);
console.log("memberships", memberships);
      if(memberships.data.data.medhaviMembershipsConnection.values.length > 0){
        setStudentMedhaviMemberships(memberships.data.data.medhaviMembershipsConnection.values);  
        setStudentMedhaviMembershipsAggregate(memberships.data.data.medhaviMembershipsConnection.aggregate);
      }else{
        setStudentMedhaviMemberships([]);
        setStudentMedhaviMembershipsAggregate({count: 0});
      }
    }catch(err){
      setAlert("Unable to fetch memberships.", "error");
    }

  }

  const updateEmploymentConnectionsBadge = (employmentConnections) => {
    let jobEmploymentConnections = employmentConnections.filter(employmentConnection => employmentConnection.opportunity && employmentConnection.opportunity.type === 'Job');
    let internshipEmploymentConnections = employmentConnections.filter(employmentConnection => employmentConnection.opportunity && employmentConnection.opportunity.type === 'Internship');
    setEmploymentConnectionsBadge(
      <>
        <Tooltip  placement="top" title="Internships">
          <FaBlackTie width="15" color="#D7D7E0" className="ml-2" />
        </Tooltip>
        <span style={{margin: '0 20px 0 10px', color: "#FFFFFF", fontSize: '16px'}}>{internshipEmploymentConnections.length}</span>
        <Tooltip placement="top" title="Jobs">
          <FaBriefcase width="15" color="#D7D7E0" />
        </Tooltip>
        <span style={{margin: '0 0 0 10px', color: "#FFFFFF", fontSize: '16px'}}>{jobEmploymentConnections.length}</span>
      </>
    );
  }

  let activestep = 0;
  switch(student.status){
    case "Certified":
      activestep = 1
      break;
    case "Internship Complete":
      activestep=2
      break;
    case "Placement Complete":
      activestep =3
      break;
  }

  useEffect(() => {
    async function componentMount (){
    await getStudent();
    await getProgramEnrollments();
    await getEmploymentConnections();
    await getAlumniServices();
    await getMemberships();

    }
    componentMount();
    
  }, []);

   const deleteStudentProfile=async()=>{
    let studentData = {
      module_name: "students",
      activity: "Student Data Deleted",
      event_id: student.id,
      updatedby: userId,
      changes_in: {name:`${student.full_name }- ${student.student_id}`},
    };
    await createLatestAcivity(studentData);
    setShowDeleteAlert(true)
  }

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
          <div className="col-12 d-flex">
            <button
              onClick={() => setModalShow(true)}
              style={{ marginLeft: "0px" }}
              className="btn--primary action_button_sec"
            >
              EDIT
            </button>
            {(isSRM() || isAdmin()) && <button onClick={() =>deleteStudentProfile()} className="btn--primary action_button_sec">
              DELETE
            </button>}
          </div>
          <div style={{margin:"0px 0px 20px 0px"}}>
           <ProgressBar steps={['Registered', 'Certified','Internship Complete','Placement Complete']} activeStep={activestep} />
          </div>
        </div>
        <Collapsible
          opened={true}
          titleContent={
            <TitleWithLogo
              done={() => getStudent()}
              id={rest.id}
              logo={rest.logo}
              title={rest.full_name}
              query={UPDATE_STUDENT}
              icon="student"
            />
          }
        >
          <Details {...student} onUpdate={getStudent} onDelete={fileDelete}/>
        </Collapsible>
        <Collapsible title="Address">
          <Address {...student} />
        </Collapsible>
        <Collapsible title="Program Enrollments" badge={programEnrollmentAggregate.count}>
          <ProgramEnrollments programEnrollments={studentProgramEnrollments} student={student} onDataUpdate={getProgramEnrollments} id={studentId}/>
        </Collapsible>
        <Collapsible title="Employment Connections" badge={studentEmploymentConnections.length}>
          <EmploymentConnections employmentConnections={studentEmploymentConnections} student={student} onDataUpdate={getEmploymentConnections} />
        </Collapsible>
        <Collapsible title="Alumni Engagements" badge={alumniServiceAggregate.count}>
          <AlumniServices student={student} onDataUpdate={getAlumniServices} id={studentId}/>
        </Collapsible>
        <Collapsible title="Medhavi Membership" badge={studentMedhaviMembershipsAggregate.count}>
          <MedhaviMemberships membershipsStudent = {studentMedhaviMemberships} student={student}  onDataUpdate={getMemberships} id={studentId}/>
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
            <span className="text--primary latto-bold">Delete {student.full_name}?</span>
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
      </Styled>
    );
  }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Student);
