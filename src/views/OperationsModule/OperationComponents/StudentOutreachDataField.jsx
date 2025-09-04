import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import styled from "styled-components";
import { isAdmin, isMedhavi, isSRM } from "../../../common/commonFunctions";
import {
  deactivate_student_outreach,
} from "./operationsActions";
import Deletepopup from "./Deletepopup";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import StudentOutreachEdit from "./StudentOutreachEdit";

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
  
  .detail-field{
  word-wrap: break-word; /* Allow long text to wrap */
  overflow-wrap: break-word; /* Ensure long words break and wrap */
  max-width: 100%; /* Prevent the value from overflowing */
}
`;

const StudentOutreachDataField = (props) => {
  let { onHide, refreshTableOnDataSaving, refreshTableOnDeleting } = props;
  const [showModal, setShowModal] = useState({
    dataAndEdit: false,
    delete: false,
  });
  const userId = localStorage.getItem("user_id");
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      onHide();
      return 0;
    } else {
      onHide();
    }
  };
  useEffect(() => {
    setoperationdata(props);
  }, [props]);

  const closeThepopup = async () => {
    setShowModal({
      ...showModal,
      delete: true,
      dataAndEdit: false,
    });
  };

  const updatevalue = () => {
    setShowModal({
      ...showModal,
      dataAndEdit: true,
    });
  };
  const closepop = () => {
    setShowModal({
      ...showModal,
      delete: false,
    });
  };

  const deleteEntry = async () => {
    const data = await deactivate_student_outreach(Number(props.id));
    console.log(data, "data");
    if (data.status == 200) {
      setAlert("Entry Deleted Successfully.", "success");
      refreshTableOnDeleting();
      onHide();
    } else {
      setAlert("Not Able to delete", "Danger");
      onHide();
    }
  };
  useEffect(() => {
    // GET_STUDENT_OUTREACHES()
  }, []);
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
                Student Outreach Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div style={{ height: '45px' }}><DetailField label="Finacial year" value={props?.year_fy} /></div>
                  <div style={{ height: '45px' }}><DetailField label="Quarter" value={props?.quarter} /></div>
                  <div style={{ height: '45px' }}><DetailField label="Month" value={props?.month} /></div>
                  <div style={{ height: '45px' }}><DetailField label="Category" value={props?.category} /></div>
                  <div style={{ height: '45px' }}><DetailField label="State" value={props?.state} /></div>
                  {props?.faculty > 0 && <div style={{ height: '45px' }}><DetailField label="Faculty" value={props?.faculty} /></div>}
                </div>

                <div className="col-md-6 col-sm-12">
                  <div style={{ height: '45px' }}><DetailField label="Department" value={props?.department} /></div>
                  <div style={{ height: '45px' }}><DetailField label="Institution Type" value={props.institution_type} /></div>
                  <div style={{ height: '45px' }}><DetailField label="Male" value={props?.male} /></div>
                  <div style={{ height: '45px' }}><DetailField label="Female" value={props?.female} /></div>
                  <div style={{ height: '45px' }}>
                    <DetailField 
                      label="Students" 
                      value={props?.students === 0 ? "NA" : props?.students} 
                    />
                  </div>
                </div>
              </div>
              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h3 className="section-header ">Other Info</h3>
              <div className="row">
                <div className="col-md-6 detail-field">
                  <div style={{ height: '45px' }}>
                    <DetailField
                      label="Updated By"
                      value={
                        props.updated_by_frontend?.username ? props.updated_by_frontend?.username : ""
                      }
                    />
                  </div>
                  <div style={{ height: '45px' }}>
                    <DetailField
                      label="Updated At"
                      value={moment(
                        props.updated_at
                          ? props.updated_at
                          : props.created_at
                      ).format("DD MMM YYYY, h:mm a")}
                    />
                  </div>
                </div>
                <div className="col-md-6 detail-field">
                  <div style={{ height: '45px' }}>
                    <DetailField
                      label="Created By"
                      value={
                        props.created_by_frontend?.username
                          ? props.created_by_frontend?.username
                          : ""
                      }
                    />
                  </div>
                  <div style={{ height: '45px' }}>
                    <DetailField
                      label="Created At"
                      value={moment(props.created_at).format(
                        "DD MMM YYYY, h:mm a"
                      )}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            {(isSRM() || isMedhavi() || isAdmin()) && (
              <div className="row mt-4 mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                  <button
                    type="button"
                    onClick={() => updatevalue()}
                    className="btn btn-primary px-4 mx-4"
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => closeThepopup()}
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
        <StudentOutreachEdit
          {...operationdata}
          show={showModal}
          onHide={hideShowModal1}
          refreshTableOnDataSaving={refreshTableOnDataSaving}
        />
      )}
      {showModal.delete && (
        <Deletepopup setShowModal={closepop} deleteEntry={deleteEntry} />
      )}
    </>
  );
};

export default StudentOutreachDataField;
