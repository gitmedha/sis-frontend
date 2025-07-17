import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../../components/content/DetailField";
import styled from "styled-components";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import Deletepopup from "../Ecosystem/Deletepopup";
import PMusEdit from "./PMusEdit";

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

const PMusDataField = (props) => {
  const { onHide, refreshTableOnDataSaving, refreshTableOnDeleting } = props;
  const [showModal, setShowModal] = useState({ dataAndEdit: false, delete: false });
  const [pmusData, setPmusData] = useState(props);

  useEffect(() => {
    setPmusData(props);
  }, [props]);

  const hideShowModal = async () => {
    setShowModal({ dataAndEdit: false, delete: false });
    if (typeof refreshTableOnDataSaving === "function") {
      await refreshTableOnDataSaving();
    }
    if (typeof onHide === "function") {
      onHide();
    }
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

  // TODO: Implement deleteEntry using deactivate or delete API
  const deleteEntry = async () => {
    // await deactivatePMusEntry(Number(props.id));
    setAlert("Entry Deleted Successfully.", "success");
    if (refreshTableOnDeleting) refreshTableOnDeleting();
    onHide();
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
              <h1 className="text--primary bebas-thick mb-0">PMus Details</h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header">PMus Info</h4>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <DetailField label="Year" value={pmusData?.year ? moment(pmusData?.year).format("YYYY") : ""} />
                  <DetailField label="PMU" value={pmusData?.pmu} />
                  <DetailField label="State" value={pmusData?.State} />
                </div>
                <div className="col-md-6 col-sm-12">
                  <DetailField label="Medha POC" value={pmusData?.medha_poc?.username} />
                  <DetailField label="Created At" value={pmusData?.created_at ? moment(pmusData?.created_at).format("DD MMM YYYY") : ""} />
                  <DetailField label="Updated At" value={pmusData?.updated_at ? moment(pmusData?.updated_at).format("DD MMM YYYY") : ""} />
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
        <PMusEdit
          {...pmusData}
          show={showModal.dataAndEdit}
          onHide={hideShowModal}
          refreshTableOnDataSaving={refreshTableOnDataSaving}
        />
      )}
      {showModal.delete && (
        <Deletepopup setShowModal={closeDeleteModal} deleteEntry={deleteEntry} />
      )}
    </>
  );
};

export default PMusDataField; 