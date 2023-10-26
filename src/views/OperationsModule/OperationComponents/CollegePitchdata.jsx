import React from "react";
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
import AllumuniEdit from "./AllumuniEdit";
import CollepitchesEdit from "./CollegepitchesEdit";
import { deactivate_user_college_pitch } from "./operationsActions";

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
const CollegePitchdata = (props) => {
  let { onHide } = props;
  const [showModal, setShowModal] = useState(false);
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

  const updatevalue = () => {
    setShowModal(true);
  };
  const closeThepopup = async () => {
    deactivate_user_college_pitch(Number(props.id));
    onHide();
  };
  console.log(props);

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
            Pitching
            </h1>
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
                <DetailField label="Phone" value={props.phone} />
                <DetailField label="Whatsapp Number" value={props.whatsapp} />
                <DetailField label="College Name" value={props.college_name} />
                <DetailField label="Course Year" value={props.course_year} />

                

                <DetailField label="Pitch Date" value={props.pitch_date} />
              </div>

              <div className="col-md-6 col-sm-12">
                <DetailField label="SRM Name" value={props.srm_name} />
                <DetailField
                  label="Medha  Area"
                  value={props.area ? props.area : ""}
                />

                <DetailField label="Course Name" value={props.course_name} />
                <DetailField label="Email ID" value={props.email} />
                <DetailField label="Remark" value={props.remarks} />
                {/* <DetailField label="Acad Year" value={props.acad_year} />
                  <DetailField label="Result" value={props.result} /> */}
              </div>
            </div>

            <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
            <h3 className="section-header ">Other Info</h3>
            <div className="row">
                      <div className="col-md-6">
                        <DetailField
                          label="Updated By"
                          value={
                            props.updatedBy?.userName
                              ? props.updatedBy?.userName
                              : props.createdBy?.username
                          }
                        />
                        <DetailField
                          label="Updated At"
                          value={moment(
                            props.updated_at
                              ? props.updated_at
                              : props.created_at
                          ).format("DD MMM YYYY, h:mm a")}
                        />
                      </div>
                      <div className="col-md-6">
                        <DetailField
                          label="Created By"
                          value={
                            props.createdBy?.username
                              ? props.createdBy?.username
                              : ""
                          }
                        />
                        <DetailField
                          label="Created At"
                          value={moment(props.created_at).format(
                            "DD MMM YYYY, h:mm a"
                          )}
                        />
                      </div>
                    </div>
          </Modal.Body>
          {(isSRM() || isAdmin())  && (
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

      {showModal ? (
        <CollepitchesEdit
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
export default CollegePitchdata;
