import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import { Anchor, Badge } from "../../../components/content/Utils";
import CertificateUpload from "../../../components/content/Certificate";
import Tooltip from "../../../components/content/Tooltip";
import { urlPath } from "../../../constants";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import {
  getEmploymentConnectionsPickList,
  getOpportunitiesPickList,
} from "./StudentActions";
import { UPDATE_EMPLOYMENT_CONNECTION } from "../../../graphql";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import Opsdatafeilds from "./Opsdatafeilds";
import UpskillUpdate from "./UpskillUpdate";

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

const Upskillingdatafield = (props) => {
  let { onHide } = props;
  const [showedit, setshowedit] = useState(false);
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      setshowedit(false);
      return;
    }
  };
  useEffect(() => {
    console.log("props", props);
    setoperationdata(props);
  }, []);
  const updatevalue = () => {
    console.log("hello");
    setshowedit(true);
  };

  return (
    <>
      {!showedit ? (
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
                Student Upskilling Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    
                    label="Certificate received"
                    value={props.certificate_received ? "Yes" : "No"}
                  />
                  <DetailField
                    
                    label="Batch"
                    value={props.batch?.name}
                  />
                  <DetailField
                    
                    label="Start Date"
                    value={
                      moment(props.start_date).format("DD MMM YYYY")
                        ? moment(props.start_date).format("DD MMM YYYY")
                        : ""
                    }
                  />

                  <DetailField
                    
                    label="End Date"
                    value={
                      moment(props.end_date).format("DD MMM YYYY")
                        ? moment(props.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField
                    
                    label="Course Name"
                    value={props.course_name}
                  />
                  <DetailField
                    
                    label="Category"
                    value={props.category}
                  />
                  <DetailField
                    
                    label="Issued Org"
                    value={props.issued_org}
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
                  />
                  <DetailField
                    
                    label="Institute"
                    value={props.institution.name}
                  />
                  <DetailField
                    
                    label="End Date"
                    value={
                      moment(props.end_date).format("DD MMM YYYY")
                        ? moment(props.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                <DetailField
                    label="Published at"
                    value={
                      moment(props.published_at).format("DD MMM YYYY")
                        ? moment(props.published_at).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField label="Sub Category" value={props.sub_category} />
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
                      props.Created_by ? props.Created_by.username : "not found"
                    }
                  />
                  <DetailField
                    Bold={""}
                    label="Created At"
                    value={moment(
                      props.updated_at
                        ? props.created_at
                        : props.created_at
                    ).format("DD MMM YYYY, h:mm a")}
                  />
                 
                </div>

                <div className="col-md-6 col-sm-12">
                  <DetailField
                    Bold={""}
                    label="Updated By"
                    value={
                      props.Updated_by ? props.Updated_by.username : "not found"
                    }
                  />
                  <DetailField
                    Bold={""}
                    label="Updated At"
                    value={moment(
                      props.updated_at
                        ? props.updated_at
                        : props.created_at
                    ).format("DD MMM YYYY, h:mm a")}
                  />
                </div>
              </div>
              {/* <div className="col-md-6 col-sm-12">
                <DetailField Bold={'bold'}
                  label="Student Name "
                  value={
                    props.student_id.full_name ? props.student_id.full_name : ""
                  }
                />
                
                <DetailField Bold={'bold'} label="Sub Category" value={props.sub_category} />
                
                
              </div> */}
              {/* <div className="col-md-6 col-sm-12">
                
                <DetailField Bold={'bold'}
                  label="Published at"
                  value={
                    moment(props.published_at).format("DD MMM YYYY")
                      ? moment(props.published_at).format("DD MMM YYYY")
                      : ""
                  }
                />
                <DetailField Bold={'bold'}
                  label="Start date"
                  value={
                    moment(props.start_date).format("DD MMM YYYY")
                      ? moment(props.start_date).format("DD MMM YYYY")
                      : ""
                  }
                />
                <DetailField Bold={'bold'}
                  label="End date"
                  value={
                    moment(props.end_date).format("DD MMM YYYY")
                      ? moment(props.end_date).format("DD MMM YYYY")
                      : ""
                  }
                />
                <DetailField Bold={'bold'}
                  label="Created At"
                  value={
                    moment(props.Created_at).format("DD MMM YYYY")
                      ? moment(props.Created_at).format("DD MMM YYYY")
                      : ""
                  }
                />
                <DetailField Bold={'bold'}
                  label="Updated At"
                  value={
                    moment(props.Updated_at).format("DD MMM YYYY")
                      ? moment(props.Updated_at).format("DD MMM YYYY")
                      : ""
                  }
                />
              </div> */}
            </Modal.Body>
            {isAdmin() && (
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
                    onClick={() => onHide()}
                    className="btn btn-danger px-4 mx-4"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </Styled>
          {/* {showedit &&
          
        } */}
        </Modal>
      ) : (
        <UpskillUpdate
          {...operationdata}
          show={showedit}
          onHide={hideShowModal1}
        />
      )}
    </>
  );
};

export default Upskillingdatafield;
