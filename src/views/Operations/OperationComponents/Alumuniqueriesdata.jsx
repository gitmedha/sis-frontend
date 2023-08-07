import React from 'react';
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
import AllumuniEdit from './AllumuniEdit';
import { deactivate_user_alumni_query } from './operationsActions';

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
const Alumuniqueriesdata = (props) => {
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
    const closeThepopup =async () =>{
      deactivate_user_alumni_query(Number(props.id))
      onHide()
    }
  
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
              <h1 className="text--primary bebas-thick mb-0">Allumuni Query Details</h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Student Name"
                    value={props.student_name ? props.student_name : ""}
                  />
                  <DetailField label="DOB" value={props.query_desc} />
                  <DetailField label="Query Start" value={props.query_start} />
  
                  {/* <DetailField label="Batch" value={props.batch_name} /> */}
                  <DetailField
                    label="Phone"
                    value={props.phone}
                  />
                  <DetailField label="Father Name" value={props.father_name} />
                </div>
  
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Status"
                    value={props.status}
                  />
                  <DetailField
                    label="Query Type"
                    value={props.query_type ? props.query_type : ""}
                  />
  
                  <DetailField label="Query end" value={props.query_end} />
                  <DetailField label="Email" value={props.email} />
                  <DetailField
                    label="Self Employed"
                    value={props.conclusion}
                  />
                  {/* <DetailField label="Acad Year" value={props.acad_year} />
                  <DetailField label="Result" value={props.result} /> */}
                </div>
              </div>
              
              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h3 className="section-header ">Other Info</h3>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  
                  <DetailField
                    Bold={""}
                    label="Created At"
                    value={moment(
                      props.created_at
                        ? props.created_at
                        : props.created_at
                    ).format("DD MMM YYYY, h:mm a")}
                  />
                </div>
  
                <div className="col-md-6 col-sm-12">
                 
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
                    onClick={()=>closeThepopup()}
                    className="btn btn-danger px-4 mx-4"
                  >
                   Delete 
                  </button>
                </div>
              </div>
            )}
          </Styled>
        </Modal>
  
            {showModal ? (
            <AllumuniEdit
                {...operationdata}
                show={showModal}
                onHide={hideShowModal1}
            />
            ) : (
            ""
            )}
      </>
    );
  };
export default Alumuniqueriesdata
