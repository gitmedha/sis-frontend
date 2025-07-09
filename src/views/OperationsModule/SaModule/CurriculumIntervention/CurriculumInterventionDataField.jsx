import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../../components/content/DetailField";
import styled from "styled-components";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import Deletepopup from "./Deletepopup";
import CurriculumInterventionEdit from "./CurriculumInterventionEdit";
import { deactivateCurriculumInterventionEntry, updateCurriculumInterventionEntry } from "../actions";

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

const CurriculumInterventionDataField = (props) => {
  const { onHide, refreshTableOnDataSaving, refreshTableOnDeleting, dropdownOptions } = props;
  const [showModal, setShowModal] = useState({ dataAndEdit: false, delete: false });
  const [curriculumData, setCurriculumData] = useState(props);

  useEffect(() => {
    setCurriculumData(props);
  }, [props]);

  const hideShowModal = async (data) => {
    setShowModal(false);
    onHide();
  };

  const handleDeleteModal = () => {
    setShowModal({ ...showModal, delete: true, dataAndEdit: false });
  };

  const handleEditModal = () => {
    setShowModal({ ...showModal, dataAndEdit: true });
  };

  const closeDeleteModal = () => {
    setShowModal({ ...showModal, delete: false });
  };

  // Delete logic
  const deleteEntry = async () => {
    try {
      await deactivateCurriculumInterventionEntry(Number(props.id));
      setAlert("Entry Deleted Successfully.", "success");
      if (refreshTableOnDeleting) refreshTableOnDeleting();
      onHide();
    } catch (error) {
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
            <Modal.Title id="contained-modal-title-vcenter" className="d-flex align-items-center">
              <h1 className="text--primary bebas-thick mb-0">Curriculum Intervention Details</h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header">Module Info</h4>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <DetailField label="Module Created For" value={props?.module_created_for} />
                  <DetailField label="Module Developed / Revised" value={props?.module_developed_revised} />
                  <DetailField label="Start Date" value={props?.start_date ? moment(props?.start_date).format("DD MMM YYYY") : ""} />
                  <DetailField label="End Date" value={props?.end_date ? moment(props?.end_date).format("DD MMM YYYY") : ""} />
                  <DetailField label="Name of the Module" value={props?.module_name} />
                </div>
                <div className="col-md-6 col-sm-12">
                  <DetailField label="Govt. Department Partnered With" value={props?.govt_dept_partnered_with} />
                  <DetailField label="Medha POC" value={props?.medha_poc?.username} />
                  <DetailField label="Assigned To" value={props?.assigned_to} />
                  <DetailField label="Created At" value={props?.created_at ? moment(props?.created_at).format("DD MMM YYYY") : ""} />
                  <DetailField label="Updated At" value={props?.updated_at ? moment(props?.updated_at).format("DD MMM YYYY") : ""} />
                  <DetailField label="Created By" value={props?.created_by?.username} />
                  <DetailField label="Updated By" value={props?.updated_by?.username} />
                </div>
              </div>
            </Modal.Body>
            <div className="row mt-4 mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                <button type="button" onClick={handleEditModal} className="btn btn-primary px-4 mx-4">EDIT</button>
                <button type="button" onClick={handleDeleteModal} className="btn btn-danger px-4 mx-4">Delete</button>
              </div>
            </div>
          </Styled>
        </Modal>
      )}
      {showModal.dataAndEdit && (
        <CurriculumInterventionEdit
          {...curriculumData}
          show={showModal}
          onHide={hideShowModal}
          refreshTableOnDataSaving={refreshTableOnDataSaving}
          dropdownOptions={dropdownOptions}
        />
      )}
      {showModal.delete && (
        <Deletepopup setShowModal={closeDeleteModal} deleteEntry={deleteEntry} />
      )}
    </>
  );
};

export default CurriculumInterventionDataField; 