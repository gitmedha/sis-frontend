import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

import api from "../../apis";
import Details from "./StudentComponents/Details";
// import { GET_STUDENT } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { getStudent } from "./StudentComponents/StudentActions";
// import { deleteInstitution, updateInstitution } from "./InstitutionComponents/instituteActions";
// import InstitutionForm from "./InstitutionComponents/InstitutionForm";

const Student = (props) => {
  const studentId = props.match.params.id;
  const [isLoading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const {setAlert} = props;
  const { address, contacts, ...rest } = studentData;

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
    //   getThisInstitution();
    // });
    // setModalShow(false);
  };

  const handleDelete = async () => {
    // NP.start();
    // deleteInstitution(studentData.id).then(data => {
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

  const getThisInstitution = async () => {
    getStudent(studentId).then(data => {
      console.log('data', data);
      setStudentData(data.data.data.student);
    }).catch(err => {
      console.log("getStudent Error", err);
    })
    // setLoading(true);
    // NP.start();
    // try {
    //   const studentId = props.match.params.id;
    //   let { data } = await api.post("/graphql", {
    //     query: GET_STUDENT,
    //     variables: { id: studentId },
    //   });
    //   setStudentData(data.data.student);
    // } catch (err) {
    //   console.log("ERR", err);
    // } finally {
    //   setLoading(false);
    //   NP.done();
    // }
  };

  useEffect(() => {
    getThisInstitution();
  }, []);

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
          </div>
        </div>
        <Collapsible
          opened={true}
          // titleContent={
          //   <TitleWithLogo
          //     done={() => getThisInstitution()}
          //     id={rest.id}
          //     logo={rest.logo}
          //     title={rest.name}
          //     query={UPDATE_STUDENT}
          //   />
          // }
        >
          <Details {...studentData} />
        </Collapsible>
        {/* <InstitutionForm
          {...studentData}
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
            <span className="text--primary latto-bold">Delete {`${studentData.first_name} ${studentData.last_name}`}?</span>
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
