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
import Dtesamarthedit from "./Dtesamarthedit";

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
`;

const Dtesamarthdatafield = (props) => {
  let { onHide } = props;
  const [showModal, setShowModal] = useState(false);
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      return;
    }
  };
  useEffect(() => {
    console.log("props", props);
    // setoperationdata(props)
  }, []);
  const updatevalue = () => {
    console.log("hello");
    setShowModal(true);
  };

  return (
    <>
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
              SDIT Details
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
          <Modal.Body className="bg-white d-flex">
            <div className="col-md-6 col-sm-12">
              <DetailField Bold={'bold'}
                label="Student Name"
                value={props.student_name ? props.student_name : ""}
              />
              <DetailField Bold={'bold'} label="DOB" value={props.dob} />
              <DetailField Bold={'bold'} label="DOJ" value={props.doj} />
              <DetailField Bold={'bold'} label="Email" value={props.email} />
              <DetailField Bold={'bold'} label="Father/Guardian" value={props.father_guardian} />
              <DetailField Bold={'bold'} label="Full Address" value={props.full_address} />
              <DetailField Bold={'bold'} label="Batch" value={props.batch_name} />
              <DetailField Bold={'bold'} label="Institute" value={props.institution_name} />
              <DetailField Bold={'bold'}
                label="Institute Admitted"
                value={props.institute_admitted}
              />
              <DetailField Bold={'bold'}
                label="Higher Studies"
                value={
                  props.higher_studies ? props.higher_studies : "Not found"
                }
              />
              <DetailField Bold={'bold'} label="Company Apprenticed" value={props.company_apprenticed} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField Bold={'bold'}
                label="Area"
                value={props.company_placed ? props.company_placed : ""}
              />
              <DetailField Bold={'bold'} label="Placed" value={props.placed} />
              <DetailField Bold={'bold'} label="Position" value={props.position} />
              <DetailField Bold={'bold'} label="Result" value={props.result} />
              <DetailField Bold={'bold'} label="Self Employee" value={props.self_employed} />
              <DetailField Bold={'bold'} label="Monthly Salary" value={props.monthly_salary} />
              <DetailField Bold={'bold'} label="State" value={props.state} />
              <DetailField Bold={'bold'} label="District" value={props.district} />
              <DetailField Bold={'bold'} label="Data Flag" value={props.data_flag} />

              <DetailField Bold={'bold'}
                label="Start Date"
                value={
                  moment(props.published_at).format("DD MMM YYYY")
                    ? moment(props.published_at).format("DD MMM YYYY")
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
            </div>
            
           
          </Modal.Body>
          {isAdmin() && (
              <div className="row mt-4 mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                  <button type="button" onClick={()=>updatevalue()}  className="btn btn-primary px-4 mx-4">
                    EDIT
                  </button>
                  <button type="button" onClick={onHide} className="btn btn-danger px-4 mx-4">
                    Go Back
                  </button>
                </div>
              </div>
            )}
        </Styled>
       
      </Modal>

      {showModal ?
            <Dtesamarthedit
            {...operationdata}
              show={showModal}
              onHide={hideShowModal1}
            />
          :""}
    </>
  );
};

export default Dtesamarthdatafield;
