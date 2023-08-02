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
import OperationDataupdateform from "./OperationDataupdateform";

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

const Opsdatafeilds = (props) => {
  let { onHide } = props;
  const [showModal, setShowModal] = useState(false);
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      return 0;
    }
  //  onHide()
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
      {!showModal? <Modal
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
          <Modal.Body className="bg-white d-flex">
            <div className="col-md-6 col-sm-12">
              <DetailField
                label="Assigned to"
                value={
                  props.assigned_to?.username ? props.assigned_to?.username : ""
                }
                Bold={'bold'}
              />
              {/* <DetailField label="Assigned to" value={props.institute.name} /> */}
              <DetailField Bold={'bold'} label="Batch" value={props.batch?.name} />
              <DetailField Bold={'bold'} label="Institute" value={props.institution?.name} />
              <DetailField Bold={'bold'} label="organization" value={props.organization} />
              <DetailField
                Bold={'bold'}
                label="other_links"
                value={props.other_links ? props.other_links : "Not found"}
              />
              <DetailField Bold={'bold'} label="State" value={props.state} />
              <DetailField Bold={'bold'} label="Area" value={props.area} />
              <DetailField Bold={'bold'} label="Topic" value={props.topic} />
            </div>
            <div className="col-md-6 col-sm-12">
              
              {/* <DetailField label="Assigned to" value={props.institute.name} /> */}
              <DetailField
                Bold={'bold'}
                label="Student Attended"
                value={props.students_attended}
              />
              <DetailField
                Bold={'bold'}
                label="start_date"
                value={
                  moment(props.start_date).format("DD MMM YYYY")
                    ? moment(props.start_date).format("DD MMM YYYY")
                    : ""
                }
              />
              <DetailField 
                Bold={'bold'}
                label="end_date"
                value={
                  moment(props.end_date).format("DD MMM YYYY")
                    ? moment(props.end_date).format("DD MMM YYYY")
                    : ""
                }
              />
              <DetailField 
                Bold={'bold'}
                label="designation"
                value={props.designation ? props.designation : "Not found"}
              />
              <DetailField 
                Bold={'bold'} label="Activity Type" value={props.activity_type} />
              <DetailField 
                Bold={'bold'}
                label="Created By"
                value={props.Created_by ? props.Created_by.username : ""}
              />
              <DetailField 
                Bold={'bold'}
                label="Updated By"
                value={props.Updated_by ? props.Updated_by.username : ""}
              />
            </div>
           
          </Modal.Body>
          {isAdmin() && (
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
                    onClick={onHide}
                    className="btn btn-danger px-4 mx-4"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
        </Styled>
      </Modal>:
      <OperationDataupdateform
          {...operationdata}
          show={showModal}
          onHide={hideShowModal1}
          closeopsedit={()=>console.log("helllo")}
        />}

      {/* {showModal && 
        <Opsdatafeilds
          {...operationdata}
          show={showModal}
          // onHide={hideShowModal1}
        />
      } */}
    </>
  );
};

export default Opsdatafeilds;
