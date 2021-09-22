import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import api from "../../apis";
import Details from "./OpportunityComponents/Details";
import { GET_OPPORTUNITY } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import { setAlert } from "../../store/reducers/Notifications/actions";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import OpportunityForm from "./OpportunityComponents/OpportunityForm";
import SweetAlert from "react-bootstrap-sweetalert";
import { deleteOpportunity, updateOpportunity } from "./OpportunityComponents/opportunityAction";

const Opportunity = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [opportunityData, setOpportunityData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const {setAlert} = props;
    const history = useHistory();

    const hideUpdateModal = async (data) => {
      if (!data || data.isTrusted) {
        setModalShow(false);
        return;
      }
      let {id, show, created_at,  ...dataToSave} = data;

      NP.start();
      updateOpportunity(Number(id), dataToSave).then(data => {
        setAlert("Opportunity updated successfully.", "success");
      }).catch(err => {
        console.log("UPDATE_DETAILS_ERR", err);
        setAlert("Unable to update opportunity.", "error");
      }).finally(() => {
        NP.done();
        getThisOpportunity();
      });
      setModalShow(false);
    };

    const handleDelete = async () => {
      NP.start();
      deleteOpportunity(opportunityData.id).then(data => {
        setAlert("Opportunity deleted successfully.", "success");
      }).catch(err => {
        console.log("OPPORTUNITY_DELETE_ERR", err);
        setAlert("Unable to delete opportunity.", "error");
      }).finally(() => {
        setShowDeleteAlert(false);
        NP.done();
        history.push("/opportunities");
      });
    }

    const getThisOpportunity = async () => {
        setLoading(true);
        NP.start();
        try {
          const opportunityID = props.match.params.id;
          let { data } = await api.post("/graphql", {
            query: GET_OPPORTUNITY,
            variables: { id: opportunityID },
          });
          setOpportunityData(data.data.opportunity);
        }catch (err) {
            console.log("ERR", err);
        } finally {
          setLoading(false);
          NP.done();
        }
    };

    useEffect(() => {
        getThisOpportunity();
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
                      done={() => getThisOpportunity()}
                      id={opportunityData.id}
                      logo={opportunityData.logo}
                      title={opportunityData.name}
                  />
              }
          >
              <Details {...opportunityData}  id={opportunityData.id} />
          </Collapsible>
          <OpportunityForm
            {...opportunityData}
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
              <span className="text--primary latto-bold">Delete {opportunityData.role_or_designation}?</span>
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

export default connect(mapStateToProps, mapActionsToProps)(Opportunity);
