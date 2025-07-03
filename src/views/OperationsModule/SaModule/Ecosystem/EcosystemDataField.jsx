import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../../components/content/DetailField";
import { isAdmin, isMedhavi, isSRM } from "../../../../common/commonFunctions";
import styled from "styled-components";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import Deletepopup from "../../OperationComponents/Deletepopup";
import EcosystemEdit from "./EcosystemEdit";
import { deactivateEcosystemEntry } from "../actions";

const Styled = styled.div`
  .icon-box {
    display: flex;
    padding: 5px;
    justify-content: center;
  }
  .cv-icon {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 50%;

    &:hover {
      background-color: #eee;
      box-shadow: 0 0 0 1px #c4c4c4;
    }
  }
  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const EcosystemDataField = (props) => {
  const { onHide, refreshTableOnDataSaving, refreshTableOnDeleting } = props;
  const [showModal, setShowModal] = useState({
    dataAndEdit: false,
    delete: false
  });
  const [ecosystemData, setEcosystemData] = useState(props);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    setEcosystemData(props);
  }, [props]);

  const hideShowModal = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      onHide();
      return;
    }
    onHide();
  };

  const handleDeleteModal = () => {
    setShowModal({
      ...showModal,
      delete: true,
      dataAndEdit: false
    });
  };

  const handleEditModal = () => {
    setShowModal({
      ...showModal,
      dataAndEdit: true
    });
  };

  const closeDeleteModal = () => {
    setShowModal({
      ...showModal,
      delete: false
    });
  };

  const deleteEntry = async () => {
    const data = await deactivateEcosystemEntry(Number(props.id));
    if (data.status === 200) {
      setAlert("Entry Deleted Successfully.", "success");
      refreshTableOnDeleting();
      onHide();
    } else {
      setAlert("Not Able to delete", "danger");
      onHide();
    }
  };

  return (
    <>
      {!showModal.dataAndEdit && (
        <Modal
          centered
          size="lg"
          show={true}
          onHide={onHide}
          animation={false}
          aria-labelledby="contained-modal-title-vcenter"
          className="form-modal"
        >
          <Modal.Header className="bg-white">
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="d-flex align-items-center"
            >
              <h1 className="text--primary bebas-thick mb-0">
                Ecosystem Activity Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header">Activity Info</h4>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Activity Type"
                    value={props?.activity_type}
                  />
                  <DetailField
                    label="Date of Activity"
                    value={
                      moment(props?.date_of_activity).format("DD MMM YYYY") || ""
                    }
                  />
                  <DetailField
                    label="Topic"
                    value={props?.topic}
                  />
                  <DetailField
                    label="Government Department Partner"
                    value={props?.govt_dept_partner_with}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Type of Partner"
                    value={props?.type_of_partner}
                  />
                  <DetailField
                    label="Employer/External Party/NGO Partner"
                    value={props?.employer_name_external_party_ngo_partner_with}
                  />
                  <DetailField
                    label="Total Attended Students"
                    value={props?.attended_students}
                  />
                </div>
              </div>

              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h4 className="section-header">Participants Info</h4>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Male Participants"
                    value={props?.male_participants}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Female Participants"
                    value={props?.female_participants}
                  />
                </div>
              </div>

              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h4 className="section-header">Medha POC</h4>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Primary POC"
                    value={props?.medha_poc_1}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Secondary POC"
                    value={props?.medha_poc_2}
                  />
                </div>
              </div>

              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h4 className="section-header">System Info</h4>
              <div className="row">
                <div className="col-md-6">
                  <DetailField
                    label="Updated At"
                    value={moment(
                      props.updated_at ? props.updated_at : props.created_at
                    ).format("DD MMM YYYY, h:mm a")}
                  />
                </div>
                <div className="col-md-6">
                  <DetailField
                    label="Created At"
                    value={moment(props.created_at).format(
                      "DD MMM YYYY, h:mm a"
                    )}
                  />
                </div>
              </div>
            </Modal.Body>
            {(isSRM() || isMedhavi() || isAdmin()) && (
              <div className="row mt-4 mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                  <button
                    type="button"
                    onClick={handleEditModal}
                    className="btn btn-primary px-4 mx-4"
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteModal}
                    className="btn btn-danger px-4 mx-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Styled>
        </Modal>
      )}
      {showModal.dataAndEdit && (
        <EcosystemEdit 
          {...ecosystemData} 
          show={showModal} 
          onHide={hideShowModal} 
          refreshTableOnDataSaving={refreshTableOnDataSaving}
        />
      )}
      {showModal.delete && (
        <Deletepopup  
          setShowModal={closeDeleteModal} 
          deleteEntry={deleteEntry}
        />
      )}
    </>
  );
};

export default EcosystemDataField;