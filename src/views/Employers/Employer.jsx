import NP from "nprogress";
import api from "../../apis";
import { connect } from "react-redux";
import Address from "./EmployerComponents/Address";
import Details from "./EmployerComponents/Details";
import Contacts from "./EmployerComponents/Contacts";
import Location from "./EmployerComponents/Location";
import { useState, useEffect } from "react";
import { TitleWithLogo } from "../../components/content/Avatar";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import Collapsible from "../../components/content/CollapsiblePanels";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { GET_EMPLOYER, UPDATE_EMPLOYER } from "../../graphql";
import { deleteEmployer, updateEmployer } from "./EmployerComponents/employerAction";
import EmployerForm from "./EmployerComponents/EmployerForm";

const Employer = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [employerData, setEmployerData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { address, contacts, location, ...rest } = employerData;
  const {setAlert} = props;
  const history = useHistory();

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }
    let {id, show, ...dataToSave} = data;
    if (typeof data.logo === 'object') {
      dataToSave['logo'] = data.logo?.id;
    }

    NP.start();
    updateEmployer(Number(id), dataToSave).then(data => {
      setAlert("Employer updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_DETAILS_ERR", err);
      setAlert("Unable to update employer.", "error");
    }).finally(() => {
      NP.done();
      getThisEmployer();
    });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteEmployer(employerData.id).then(data => {
      setAlert("Employer deleted successfully.", "success");
    }).catch(err => {
      console.log("Employer_DELETE_ERR", err);
      setAlert("Unable to delete employer.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/employers");
    });
  }

  const getThisEmployer = async () => {
    setLoading(true);
    NP.start();
    try {
      const employerID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_EMPLOYER,
        variables: { id: employerID },
      });
      setEmployerData(data.data.employer);
    } catch (err) {
      console.log("ERR", err);
    }finally {
      setLoading(false);
      NP.done();
    }
  };

  useEffect(() => {
    getThisEmployer();
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
          titleContent={
            <TitleWithLogo
              done={() => getThisEmployer()}
              id={rest.id}
              logo={rest.logo}
              title={rest.name}
              query={UPDATE_EMPLOYER}
            />
          }
        >
          <Details {...employerData} />
        </Collapsible>
        <Collapsible title="Address">
          <Address {...employerData} />
        </Collapsible>
        <Collapsible title="Location">
          <Location location={location} id={rest.id} />
        </Collapsible>
        <Collapsible title="Contacts">
          <Contacts contacts={contacts} id={rest.id} />
        </Collapsible>
        <EmployerForm
          {...employerData}
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
            <span className="text--primary latto-bold">Delete {employerData.name}?</span>
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
          <p>Are you sure, you want to delete this employer?</p>
        </SweetAlert>
      </>
    );
  }
};
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employer);
