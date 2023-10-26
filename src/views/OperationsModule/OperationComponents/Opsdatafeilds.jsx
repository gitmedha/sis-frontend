import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import { urlPath } from "../../../constants";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import {
  getEmploymentConnectionsPickList,
  getOpportunitiesPickList,
} from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import { UPDATE_EMPLOYMENT_CONNECTION } from "../../../graphql";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import OperationDataupdateform from "./OperationDataupdateform";
import {deactivate_user_ops} from "./operationsActions";
import Deletepopup from "./Deletepopup";

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

const FileStyled = styled.div`
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
`;

const Opsdatafeilds = (props) => {
  let { onHide } = props;
  const { setAlert } = props;
  const [showModal, setShowModal] = useState({
    dataAndEdit:false,
    delete:false
  });
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      onHide()
      return 0;
    }else{
      onHide()
    }

  };
 
  const updatevalue = () => {
    setShowModal({
      ...showModal,
      dataAndEdit:true
    });
  };
  const closepop =()=>{
    console.log("hello");
    setShowModal({
      ...showModal,
      delete:false,
    });
  }

  const deleteEntry=async()=>{
   const data=await deactivate_user_ops(Number(props.id))
   if(data.status==200){
    setAlert("Entry Deleted Successfully.", "success");
    onHide()
   }else{
    setAlert("Not Able to delete", "Danger");
    onHide()
   }
   
   
  }

  const closeThepopup =async () =>{
    // 
    
    setShowModal({
      ...showModal,
      delete:true,
      dataAndEdit:false 
    });
  }

  useEffect(() => {
    console.log("ghjk",showModal);
  }, [showModal])
  

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
                User Opts Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    Bold={""}
                    label="Activity Type"
                    value={props.activity_type}
                  />
                  <DetailField
                    Bold={""}
                    label="Batch"
                    value={props.batch?.name}
                  />
                  <DetailField
                    Bold={""}
                    label="Start Date"
                    value={
                      moment(props.start_date).format("DD MMM YYYY")
                        ? moment(props.start_date).format("DD MMM YYYY")
                        : ""
                    }
                  />

                  <DetailField
                    Bold={""}
                    label="Donor"
                    value={props.donor ? "Yes" : "No"}
                  />
                  <DetailField Bold={""} label="Guest" value={props.guest} />
                  <DetailField
                    Bold={""}
                    label="Organization"
                    value={props.organization}
                  />
                  <DetailField
                    Bold={""}
                    label="Other Link"
                    value={props.other_links ? props.other_links : "not found"}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Assigned to"
                    value={
                      props.assigned_to?.username
                        ? props.assigned_to?.username
                        : ""
                    }
                    Bold={""}
                  />
                  <DetailField
                    Bold={""}
                    label="Educational Institution"
                    value={props.institution?.name}
                  />
                  <DetailField
                    Bold={""}
                    label="End Date"
                    value={
                      moment(props.end_date).format("DD MMM YYYY")
                        ? moment(props.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField Bold={""} label="Topic" value={props.topic} />
                  <DetailField
                    Bold={""}
                    label="Designation"
                    value={props.designation ? props.designation : "Not found"}
                  />
                  <DetailField
                    Bold={""}
                    label="Student Attended"
                    value={props.students_attended}
                  />
                </div>
              </div>
              <div className="">
                <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
                <h4 className="section-header">Address Info</h4>

                <div className="row  ">
                  <div className="col-md-6 col-sm-12">
                    <DetailField Bold={""} label="State" value={props.state} />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Medha Area"
                      value={props.area}
                    />
                  </div>
                </div>
                <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
                <h3 className="section-header ">Other Info</h3>
                <div className="row  ">
                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Created By"
                      value={
                        props.createdBy
                          ? props.createdBy.username
                          : "not found"
                      }
                    />
                    <DetailField
                      Bold={""}
                      label="Created At"
                      value={props.Created_at ? props.Created_at : "not found"}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Updated By"
                      value={
                        props.updatedBy
                          ? props.updatedBy.username
                          : "not found"
                      }
                    />
                    <DetailField
                      Bold={""}
                      label="Updated At"
                      value={props.Updated_at ? props.Updated_at : "not found"}
                    />
                  </div>
                </div>

                {/* <DetailField label="Assigned to" value={props.institute.name} /> */}
              </div>
            </Modal.Body>
            {(isSRM() || isAdmin()) && (
              <div className="row mt-2 mb-4">
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
                    DELETE
                  </button>
                </div>
              </div>
            )}
          </Styled>
        </Modal>
      )}
      {
        showModal.dataAndEdit &&
        (
          <OperationDataupdateform
            {...operationdata}
            show={showModal}
            onHide={hideShowModal1}
          />
        )
      }
      {

showModal.delete && (
  <Deletepopup  setShowModal={closepop} deleteEntry={deleteEntry}/>
)
      }
    </>
  );
};

// export default Opsdatafeilds;

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Opsdatafeilds);
