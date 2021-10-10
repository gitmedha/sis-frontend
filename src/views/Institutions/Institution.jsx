import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

import api from "../../apis";
import Address from "./InstitutionComponents/Address";
import Contacts from "./InstitutionComponents/Contacts";
import Details from "./InstitutionComponents/Details";
import Students from "./InstitutionComponents/Students";
import ProgramEnrollments from "./InstitutionComponents/ProgramEnrollments";
import { GET_INSTITUTE, UPDATE_INSTITUTION } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { deleteInstitution, updateInstitution, getInstitutionProgramEnrollments } from "./InstitutionComponents/instituteActions";
import InstitutionForm from "./InstitutionComponents/InstitutionForm";

const Institute = (props) => {
  const [institutionProgramEnrollments, setInstitutionProgramEnrollments] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [instituteData, setInstituteData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const {setAlert} = props;
  const { address, contacts, ...rest } = instituteData;
  const instituteID = props.match.params.id;

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove id and show from the payload
    let {id, show, ...dataToSave} = data;
    if (typeof data.logo === 'object') {
      dataToSave['logo'] = data.logo?.id;
    }

    NP.start();
    updateInstitution(Number(id), dataToSave).then(data => {
      setAlert("Institution updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_DETAILS_ERR", err);
      setAlert("Unable to update institution.", "error");
    }).finally(() => {
      NP.done();
      getThisInstitution();
    });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteInstitution(instituteData.id).then(data => {
      setAlert("Institution deleted successfully.", "success");
    }).catch(err => {
      console.log("INSTITUTION_DELETE_ERR", err);
      setAlert("Unable to delete institution.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/institutions");
    });
  };

  const getThisInstitution = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_INSTITUTE,
        variables: { id: instituteID },
      });
      setInstituteData(data.data.institution);
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const getProgramEnrollments = async () => {
    getInstitutionProgramEnrollments(instituteID).then(data => {
      setInstitutionProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
    }).catch(err => {
      console.log("getInstitutionProgramEnrollments Error", err);
    });
  }

  useEffect(async() => {
    getThisInstitution();
    await getProgramEnrollments();
  }, [instituteID]);

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
          titleContent={
            <TitleWithLogo
              done={() => getThisInstitution()}
              id={rest.id}
              logo={rest.logo}
              title={rest.name}
              query={UPDATE_INSTITUTION}
            />
          }
        >
          <Details {...instituteData} />
        </Collapsible>
        <Collapsible title="Address">
          <Address {...instituteData}  id={rest.id} />
        </Collapsible>
        <Collapsible title="Contacts">
          <Contacts contacts={contacts} id={rest.id} />
        </Collapsible>
        <Collapsible title="Program Enrollments"  badge={institutionProgramEnrollments.length.toString()}>
          <ProgramEnrollments programEnrollments={institutionProgramEnrollments} onDataUpdate={getProgramEnrollments} institution={instituteData} />
        </Collapsible>
        <InstitutionForm
          {...instituteData}
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
            <span className="text--primary latto-bold">Delete {instituteData.name}?</span>
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

export default connect(mapStateToProps, mapActionsToProps)(Institute);
